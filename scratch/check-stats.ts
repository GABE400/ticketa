
import "dotenv/config";
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './lib/db/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function checkStats() {
  const allEvents = await db.query.events.findMany({
    with: {
      ticketTypes: true,
    },
  });

  console.log("--- Stat Breakdown ---");
  let totalRevenue = 0;
  let totalSold = 0;

  allEvents.forEach(event => {
    console.log(`\nEvent: ${event.title}`);
    event.ticketTypes.forEach(tt => {
      const revenue = Number(tt.price) * (tt.sold || 0);
      totalRevenue += revenue;
      totalSold += (tt.sold || 0);
      if (tt.sold > 0) {
        console.log(`  - Ticket: ${tt.name} | Sold: ${tt.sold} | Price: $${tt.price} | Subtotal: $${revenue}`);
      }
    });
  });

  console.log("\n--- Finals ---");
  console.log(`Total Revenue: $${totalRevenue}`);
  console.log(`Total Tickets Sold: ${totalSold}`);
  process.exit(0);
}

checkStats().catch(err => {
  console.error(err);
  process.exit(1);
});
