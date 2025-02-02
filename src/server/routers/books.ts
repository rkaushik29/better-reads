import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { bookService } from "../resources/books/books-service";
import { userBooksInsertSchema } from "@/drizzle/schema";

export const booksRouter = router({
  create: publicProcedure
    .input(
      z.object({
        data: userBooksInsertSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { data: formData } = input;

      const parseResult = userBooksInsertSchema.safeParse(formData);

      if (!parseResult.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: parseResult.error.message,
        });
      }

      const data = parseResult.data;

      await bookService.create(data);
    }),

  find: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await bookService.find(input);
  }),

  remove: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    await bookService.remove(input);
  }),

  getTopCovers: publicProcedure.input(z.string()).query(async ({ input }) => {
    const covers = await bookService.scrapeBookCovers(input);
    return covers;
  }),
});
