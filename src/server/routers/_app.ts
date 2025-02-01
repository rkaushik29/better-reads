import { router } from '../trpc';

export const appRouter = router({
  // Define your procedures here
});

export type AppRouter = typeof appRouter;
