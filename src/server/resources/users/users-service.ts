import { getOrCreateUser } from "@/server/resources/users/users-repo";
import type { UsersInsert, UsersSelect } from "@/drizzle/schema";
/**
 * Service method to get or create a user.
 */
export const getOrCreateUserService = async (userData: UsersInsert): Promise<UsersSelect> => {
  return await getOrCreateUser(userData);
};
