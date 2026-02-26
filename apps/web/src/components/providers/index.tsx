import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ServiceWorkerRegistration } from "./service-worker";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}

        <Toaster richColors position="top-center" />
        <ServiceWorkerRegistration />
      </ThemeProvider>
    </QueryProvider>
  );
}
