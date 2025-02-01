import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./config";

async function runMigrate() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "drizzle/migrations" });
  console.log("Migrations complete.");
  process.exit(0);
}

runMigrate();
