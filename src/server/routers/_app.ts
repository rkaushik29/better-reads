import { router } from "../trpc";
import { aiRouter } from "./ai";
import { booksRouter } from "./books";
import { usersRouter } from "./users";

export const appRouter = router({
  books: booksRouter,
  users: usersRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
