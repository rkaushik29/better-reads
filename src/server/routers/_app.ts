import { router } from "../trpc";
import { booksRouter } from "./books";
import { usersRouter } from "./users";

export const appRouter = router({
  books: booksRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
