import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().optional() }))
    .query(({ input }) => {
        console.log(input);
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
