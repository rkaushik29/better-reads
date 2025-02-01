import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@/server/routers/_app";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import "@/styles/globals.css";
import { Quicksand } from "next/font/google";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/SidebarNav";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

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
  return (
    <ClerkProvider>
      <main className={`${quicksand.variable} font-sans`}>
        <SidebarProvider>
          <SidebarNav />
          <SidebarInset>
            <SidebarTrigger className="p-1 m-1" />
            <Component {...pageProps} />
          </SidebarInset>
        </SidebarProvider>
      </main>
    </ClerkProvider>
  );
}

export default trpc.withTRPC(App);
