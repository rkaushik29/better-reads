import { SidebarNav } from "@/components/SidebarNav";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TipTapInput } from "@/components/TipTapInput";

export default function Home() {
  return (
    <>
      <SidebarProvider>
        <SidebarNav />
        <SidebarInset>
          <SidebarTrigger className="p-1 m-1" />
          <TipTapInput />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
