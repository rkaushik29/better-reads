import { user_books, UserBooksInsert } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const db = drizzle(process.env.DATABASE_URL!);
async function create(data: UserBooksInsert) {
  await db
    .insert(user_books)
    .values({ ...data, createdAt: new Date(), updatedAt: new Date() });
}

export const getAllBooks = async () => {
  return await db.select().from(user_books)
};

async function find(userId: string) {
  const result = await db
    .select()
    .from(user_books)
    .where(eq(user_books.userId, userId));
  return result;
}

async function remove(id: number) {
  await db.delete(user_books).where(eq(user_books.id, id));
}

export const bookRepo = {
  create,
  getAllBooks,
  find,
  remove,
};
