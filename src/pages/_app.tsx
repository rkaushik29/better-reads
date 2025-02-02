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
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

const App: AppType = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trpcClient, setTrpcClient] = useState<ReturnType<typeof api.createClient> | undefined>(undefined);

  useEffect(() => {
    setTrpcClient(
      api.createClient({
        links: [
          httpBatchLink({
            url: `/api/trpc`,
          }),
        ],
      })
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsDialogOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!trpcClient) return null;
  
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider>
          <main className={`${quicksand.variable} font-sans`}>
            <SidebarProvider>
              <SidebarNav />
              <SidebarInset>
                <div className="flex justify-between items-center">
                  <SidebarTrigger className="p-1 m-1">Menu</SidebarTrigger>
                  <div className="p-3">
                    <BookSearchDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
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