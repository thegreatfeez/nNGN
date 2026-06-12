import { Router } from "express";
import { pool } from "../db/client.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *, (tickets_sold >= capacity) AS sold_out
       FROM events
       WHERE is_active = true
       ORDER BY date ASC`
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *, (tickets_sold >= capacity) AS sold_out
       FROM events
       WHERE id = $1 AND is_active = true`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Event not found" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

export default router;
