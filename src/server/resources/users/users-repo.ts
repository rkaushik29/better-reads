import { db } from "@/drizzle/config";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import type { UsersSelect, UsersInsert } from "@/drizzle/schema";

/**
 * Get a user from the database by Clerk authId.
 */
export const getUserByAuthId = async (authId: string): Promise<UsersSelect | null> => {
  const result = await db.select().from(users).where(eq(users.authId, authId));
  return result[0] ?? null;
};

/**
 * Create a new user record in the database.
 */
export const createUser = async (data: UsersInsert): Promise<UsersSelect> => {
  const result = await db.insert(users).values(data).returning();
  return result[0];
};

/**
 * Get the user by authId, or create the record if it doesn't exist.
 */
export const getOrCreateUser = async (userData: UsersInsert): Promise<UsersSelect> => {
  let user = await getUserByAuthId(userData.authId);
  if (!user) {
    user = await createUser({
      authId: userData.authId,
      name: userData.name ?? "",
      email: userData.email ?? "",
    });
  }
  return user;
};
