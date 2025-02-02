import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '@/server/routers/_app';
import { createTRPCContext } from '@/server/trpc';

const handler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});

export default handler;