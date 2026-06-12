import { Router } from "express";
import { pool } from "../db/client.js";

const router = Router();

// Public ticket lookup — used by QR scan and ticket view page
router.get("/:code", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, e.title AS event_title, e.date AS event_date,
              e.venue, e.city, e.image_url
       FROM tickets t
       JOIN events e ON e.id = t.event_id
       WHERE t.ticket_code = $1`,
      [req.params.code]
    );
    if (!rows[0]) return res.status(404).json({ error: "Ticket not found" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

// Tickets for a connected wallet
router.get("/", async (req, res) => {
  const { wallet } = req.query;
  if (!wallet) return res.status(400).json({ error: "wallet query param required" });

  try {
    const { rows } = await pool.query(
      `SELECT t.*, e.title AS event_title, e.date AS event_date,
              e.venue, e.city, e.image_url
       FROM tickets t
       JOIN events e ON e.id = t.event_id
       WHERE t.wallet_address = $1
       ORDER BY t.purchased_at DESC`,
      [String(wallet).toLowerCase()]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

export default router;
