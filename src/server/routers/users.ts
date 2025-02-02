import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { getOrCreateUserService } from "../resources/users/users-service";

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
});
