import { user_books, UserBooksInsert } from "@/drizzle/schema";
import { drizzle } from "drizzle-orm/neon-http";

const db = drizzle(process.env.DATABASE_URL!);
async function create(data: UserBooksInsert) {
  await db
    .insert(user_books)
    .values({ ...data, createdAt: new Date(), updatedAt: new Date() });
}

export const bookRepo = {
  create,
};
