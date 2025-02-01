import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@/server/routers/_app";

const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    };
  },
});

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default trpc.withTRPC(App);
