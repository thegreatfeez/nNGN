import { Router } from "express";
import { pool } from "../db/client.js";
import { verifyPayment } from "../lib/verifyPayment.js";
import { generateTicketCode } from "../lib/ticketCode.js";

const router = Router();

router.post("/:id/purchase", async (req, res) => {
  const { txHash, walletAddress } = req.body ?? {};

  if (!txHash || !walletAddress) {
    return res.status(400).json({ error: "txHash and walletAddress are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock the event row to prevent overselling
    const { rows: eventRows } = await client.query(
      `SELECT * FROM events WHERE id = $1 AND is_active = true FOR UPDATE`,
      [req.params.id]
    );

    const event = eventRows[0];
    if (!event) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.tickets_sold >= event.capacity) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Event is sold out" });
    }

    // Replay protection — reject if txHash already used
    const { rows: dupeRows } = await client.query(
      "SELECT id FROM tickets WHERE tx_hash = $1",
      [txHash]
    );
    if (dupeRows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Payment already used" });
    }

    // Verify on-chain
    const valid = await verifyPayment({
      txHash,
      expectedRecipient: process.env.RECIPIENT_WALLET,
      expectedAmountRaw: event.price_raw,
    });

    if (!valid) {
      await client.query("ROLLBACK");
      return res.status(402).json({ error: "Payment not found or amount insufficient" });
    }

    // Issue ticket
    const ticketCode = generateTicketCode();
    const { rows: ticketRows } = await client.query(
      `INSERT INTO tickets (event_id, wallet_address, tx_hash, ticket_code)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.params.id, walletAddress.toLowerCase(), txHash, ticketCode]
    );

    await client.query(
      `UPDATE events SET tickets_sold = tickets_sold + 1, updated_at = NOW() WHERE id = $1`,
      [req.params.id]
    );

    await client.query("COMMIT");

    res.status(201).json({
      ticket: ticketRows[0],
      event: {
        title: event.title,
        date: event.date,
        venue: event.venue,
        city: event.city,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Purchase error:", err);
    res.status(500).json({ error: "Purchase failed. Please try again." });
  } finally {
    client.release();
  }
});

export default router;
