import { parseUnits } from "viem";
import { pool } from "./client.js";

const events = [
  {
    title: "Lagos Dev Summit 2026",
    description:
      "The biggest developer conference in West Africa. Join 500+ engineers for talks on Web3, AI, and the future of Nigerian tech. Featuring keynotes from top founders, live demos, and networking sessions.",
    date: "2026-08-15T09:00:00Z",
    venue: "Landmark Event Centre",
    city: "Lagos",
    image_url:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    capacity: 500,
    price_ngn: "2000",
  },
  {
    title: "Blockchain Africa Conference",
    description:
      "Africa's premier blockchain conference covering DeFi, NFTs, stablecoins, and on-chain finance. Hear from founders, regulators, and builders shaping the continent's Web3 future.",
    date: "2026-09-20T10:00:00Z",
    venue: "International Conference Centre",
    city: "Abuja",
    image_url:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&auto=format&fit=crop",
    capacity: 300,
    price_ngn: "5000",
  },
  {
    title: "Web3 Lagos Hackathon",
    description:
      "48-hour hackathon building the next generation of Nigerian DApps. Teams compete for prizes in nNGN. Open to developers, designers, and product thinkers. Mentors from top Web3 startups on-site.",
    date: "2026-07-05T08:00:00Z",
    venue: "Co-Creation Hub (CcHUB)",
    city: "Lagos",
    image_url:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
    capacity: 200,
    price_ngn: "500",
  },
  {
    title: "Fintech Nigeria Forum",
    description:
      "Where Nigerian fintech meets DeFi. Keynotes from CBN, leading payment startups, and Web3 founders. Sessions on stablecoins, cross-border payments, and the future of naira-denominated digital assets.",
    date: "2026-10-10T09:00:00Z",
    venue: "Eko Hotels & Suites",
    city: "Lagos",
    image_url:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop",
    capacity: 400,
    price_ngn: "10000",
  },
  {
    title: "AI & Tech Naija Meetup",
    description:
      "A community meetup exploring AI tools, automation, and machine learning for African developers. Lightning talks, live demos, and open networking. All skill levels welcome.",
    date: "2026-07-25T14:00:00Z",
    venue: "Tech Hub Port Harcourt",
    city: "Port Harcourt",
    image_url:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop",
    capacity: 150,
    price_ngn: "1000",
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM tickets");
    await client.query("DELETE FROM events");

    for (const e of events) {
      const price_raw = parseUnits(e.price_ngn, 18).toString();
      const price_display = `₦${Number(e.price_ngn).toLocaleString("en-NG")}`;
      await client.query(
        `INSERT INTO events
           (title, description, date, venue, city, image_url, capacity, price_raw, price_display)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          e.title,
          e.description,
          e.date,
          e.venue,
          e.city,
          e.image_url,
          e.capacity,
          price_raw,
          price_display,
        ]
      );
    }

    await client.query("COMMIT");
    console.log(`✅ Seeded ${events.length} events`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
