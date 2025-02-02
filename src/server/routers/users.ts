import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { getAllBooksService, getOrCreateUserService, getUserByAuthIdService } from "../resources/users/users-service";

export const usersRouter = router({
  getOrCreateUser: publicProcedure
    .input(
      z.object({
        authId: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await getOrCreateUserService(input);
      return user;
    }),
  getUserByAuthId: publicProcedure
    .input(z.object({ authId: z.string() }))
    .query(async ({ input }) => {
      const user = await getUserByAuthIdService(input.authId);
      return user;
    }),
  getAllBooks: publicProcedure.query(async () => {
    const books = await getAllBooksService();
    return books;
  }),
});
