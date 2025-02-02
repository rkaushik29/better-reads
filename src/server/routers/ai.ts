import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getBookSnippet } from "../resources/ai/ai-service";

export const aiRouter = router({
  getBookSnippet: publicProcedure
    .input(
      z.object({
        title: z.string(),
        author: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const snippet = await getBookSnippet(input.title, input.author);
        return { snippet };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch book snippet",
          cause: error,
        });
      }
    }),
});