import { getAllUsers, getOrCreateUser, getUserByAuthId } from "@/server/resources/users/users-repo";
import type { UserBooksSelect, UsersInsert, UsersSelect } from "@/drizzle/schema";
import { getAllBooks } from "../books/books-repo";
/**
 * Service method to get or create a user.
 */
export const getOrCreateUserService = async (userData: UsersInsert): Promise<UsersSelect> => {
  return await getOrCreateUser(userData);
};

export const getUserByAuthIdService = async (authId: string): Promise<UsersSelect | null> => {
  return await getUserByAuthId(authId);
};

export const getAllBooksService = async (): Promise<(UserBooksSelect & { userName: string })[]> => {
  const books = await getAllBooks();
  const users = await getAllUsers();
  
  return books.map(book => {
    const user = users.find(u => String(u.authId) === String(book.userId));
    return {
      ...book,
      userName: user?.name ?? 'Unknown User'
    };
  });
};
