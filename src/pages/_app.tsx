import "@/styles/globals.css";
import type { AppType } from "next/app";
import { httpBatchLink } from "@trpc/client";
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
import { BookSearchDialog } from "@/components/BookSearchDialog";
import { api } from "@/utils/trpc";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

const App: AppType = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => 
    api.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc',
        }),
      ],
    })
  );
  
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider>
          <main className={`${quicksand.variable} font-sans`}>
            <SidebarProvider>
          <SidebarNav />
          <SidebarInset>
            <div className="flex justify-between items-center">
              <SidebarTrigger className="p-1 m-1" />
              <div className="p-3">
                <BookSearchDialog />
              </div>
            </div>
            <Component {...pageProps} />
          </SidebarInset>
        </SidebarProvider>
      </main>
    </ClerkProvider>
    </QueryClientProvider>
    </api.Provider>
  );
}

export default App;