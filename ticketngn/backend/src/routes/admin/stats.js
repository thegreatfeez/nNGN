import { Router } from "express";
import { formatUnits } from "viem";
import { pool } from "../../db/client.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [totalEvents, totalTickets, revenue, activeEvents] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM events"),
      pool.query("SELECT COUNT(*) FROM tickets"),
      pool.query(
        `SELECT COALESCE(SUM(e.price_raw::numeric), 0) AS total_raw
         FROM tickets t JOIN events e ON e.id = t.event_id`
      ),
      pool.query("SELECT COUNT(*) FROM events WHERE is_active = true"),
    ]);

    const rawSum = BigInt(Math.round(Number(revenue.rows[0].total_raw)));
    const totalNgn = Math.round(Number(formatUnits(rawSum, 18)));

    res.json({
      totalEvents: Number(totalEvents.rows[0].count),
      totalTickets: Number(totalTickets.rows[0].count),
      totalNgn,
      activeEvents: Number(activeEvents.rows[0].count),
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
