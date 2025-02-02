import { bookService } from "../resources/books-service";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const booksRouter = router({
  getTopCovers: publicProcedure.input(z.string()).query(async ({ input }) => {
    const covers = await bookService.scrapeBookCovers(input);
    return covers;
  }),
});
