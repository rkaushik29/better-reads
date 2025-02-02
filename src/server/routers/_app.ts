import { router } from "../trpc";
import { booksRouter } from "./books";

export const appRouter = router({
  books: booksRouter,
});

export type AppRouter = typeof appRouter;
