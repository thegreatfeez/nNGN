import { Router } from "express";
import { parseUnits } from "viem";
import { pool } from "../../db/client.js";

const router = Router();

// All events including inactive
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *, (tickets_sold >= capacity) AS sold_out
       FROM events ORDER BY date ASC`
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *, (tickets_sold >= capacity) AS sold_out FROM events WHERE id = $1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Event not found" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

router.post("/", async (req, res) => {
  const { title, description, date, venue, city, image_url, capacity, price_ngn } =
    req.body ?? {};

  if (!title || !date || !venue || !city || !capacity || !price_ngn) {
    return res.status(400).json({ error: "title, date, venue, city, capacity, price_ngn are required" });
  }

  const price_raw = parseUnits(String(price_ngn), 18).toString();
  const price_display = `₦${Number(price_ngn).toLocaleString("en-NG")}`;

  try {
    const { rows } = await pool.query(
      `INSERT INTO events
         (title, description, date, venue, city, image_url, capacity, price_raw, price_display)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [title, description ?? null, date, venue, city, image_url ?? null, capacity, price_raw, price_display]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.put("/:id", async (req, res) => {
  const { title, description, date, venue, city, image_url, capacity, price_ngn, is_active } =
    req.body ?? {};

  const price_raw = price_ngn ? parseUnits(String(price_ngn), 18).toString() : undefined;
  const price_display = price_ngn
    ? `₦${Number(price_ngn).toLocaleString("en-NG")}`
    : undefined;

  try {
    const { rows } = await pool.query(
      `UPDATE events SET
         title         = COALESCE($1,  title),
         description   = COALESCE($2,  description),
         date          = COALESCE($3,  date),
         venue         = COALESCE($4,  venue),
         city          = COALESCE($5,  city),
         image_url     = COALESCE($6,  image_url),
         capacity      = COALESCE($7,  capacity),
         price_raw     = COALESCE($8,  price_raw),
         price_display = COALESCE($9,  price_display),
         is_active     = COALESCE($10, is_active),
         updated_at    = NOW()
       WHERE id = $11
       RETURNING *`,
      [title, description, date, venue, city, image_url, capacity, price_raw, price_display, is_active, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Event not found" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Soft delete
router.delete("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE events SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deactivated" });
  } catch {
    res.status(500).json({ error: "Failed to deactivate event" });
  }
});

// Tickets for a specific event
router.get("/:id/tickets", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM tickets WHERE event_id = $1 ORDER BY purchased_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

export default router;
