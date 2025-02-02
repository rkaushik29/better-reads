import { initTRPC } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getAuth } from '@clerk/nextjs/server';

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;
  const auth = getAuth(req);

  return {
    auth,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
