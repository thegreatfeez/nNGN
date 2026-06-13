import { Router } from "express";
import { pool } from "../../db/client.js";

const router = Router();

router.post("/:code/use", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE tickets
       SET status = 'used', used_at = NOW()
       WHERE ticket_code = $1 AND status = 'active'
       RETURNING *`,
      [req.params.code]
    );

    if (rows[0]) {
      return res.json({ success: true, ticket: rows[0] });
    }

    // Check if it already exists but was already used
    const { rows: existing } = await pool.query(
      `SELECT * FROM tickets WHERE ticket_code = $1`,
      [req.params.code]
    );

    if (existing[0]?.status === "used") {
      return res.status(409).json({ error: "Ticket already used", ticket: existing[0] });
    }

    res.status(404).json({ error: "Ticket not found" });
  } catch {
    res.status(500).json({ error: "Failed to mark ticket as used" });
  }
});

export default router;
