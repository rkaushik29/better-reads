import { user_books, UserBooksInsert, UserBooksUpdate } from "@/drizzle/schema";
import { db } from "@/drizzle/config";
import { eq } from "drizzle-orm";

async function create(data: UserBooksInsert) {
  await db
    .insert(user_books)
    .values({ ...data, createdAt: new Date(), updatedAt: new Date() });
}

export const getAllBooks = async () => {
  return await db.select().from(user_books);
};

async function find(userId: string) {
  const result = await db
    .select()
    .from(user_books)
    .where(eq(user_books.userId, userId));
  return result;
}

async function update(id: number, data: UserBooksUpdate) {
  await db.update(user_books).set({...data, updatedAt: new Date()}).where(eq(user_books.id, id));
}

async function remove(id: number) {
  await db.delete(user_books).where(eq(user_books.id, id));
}

export const bookRepo = {
  create,
  getAllBooks,
  update,
  find,
  remove,
};
