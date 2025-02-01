import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { z } from 'zod'
const envSchema = z.object({
  DATABASE_URL: z.string().min(10),
})
// Validate `process.env` against our schema
// To make sure the database connection string is provided in environment variables
const env = envSchema.parse(process.env)
export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  casing: "snake_case",
});
