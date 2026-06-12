import { pool } from "./client.js";

const sql = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS events (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  description   TEXT,
  date          TIMESTAMPTZ NOT NULL,
  venue         TEXT        NOT NULL,
  city          TEXT        NOT NULL,
  image_url     TEXT,
  capacity      INTEGER     NOT NULL,
  tickets_sold  INTEGER     NOT NULL DEFAULT 0,
  price_raw     TEXT        NOT NULL,
  price_display TEXT        NOT NULL,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       UUID        NOT NULL REFERENCES events(id),
  wallet_address TEXT        NOT NULL,
  tx_hash        TEXT        NOT NULL UNIQUE,
  ticket_code    TEXT        NOT NULL UNIQUE,
  status         TEXT        NOT NULL DEFAULT 'active',
  purchased_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS tickets_wallet_idx ON tickets(wallet_address);
CREATE INDEX IF NOT EXISTS tickets_event_idx  ON tickets(event_id);
`;

async function runSchema() {
  await pool.query(sql);
  console.log("✅ Schema applied");
  await pool.end();
}

runSchema().catch((err) => {
  console.error("Schema failed:", err);
  process.exit(1);
});
