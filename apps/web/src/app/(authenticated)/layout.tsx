import { SidebarNav } from "@/components/layout/sidebar-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col pb-16 md:pb-0">{children}</div>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
