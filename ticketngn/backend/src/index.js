import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import eventsRouter from "./routes/events.js";
import purchaseRouter from "./routes/purchase.js";
import ticketsRouter from "./routes/tickets.js";
import adminAuthRouter from "./routes/admin/auth.js";
import adminEventsRouter from "./routes/admin/events.js";
import adminTicketsRouter from "./routes/admin/tickets.js";
import adminStatsRouter from "./routes/admin/stats.js";
import { adminAuth } from "./middleware/adminAuth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

const corsOptions = {
  origin: process.env.CLIENT_URL ?? "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Public
app.use("/api/events", eventsRouter);
app.use("/api/events", purchaseRouter);
app.use("/api/tickets", ticketsRouter);

// Admin — all routes require valid JWT
app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin/stats", adminAuth, adminStatsRouter);
app.use("/api/admin/events", adminAuth, adminEventsRouter);
app.use("/api/admin/tickets", adminAuth, adminTicketsRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Local dev
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`TicketNGN backend running on http://localhost:${PORT}`);
  });
}

export default app;
