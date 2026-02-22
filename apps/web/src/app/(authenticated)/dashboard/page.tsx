import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ title: "Dashboard", path: "/dashboard", noIndex: true });

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <p className="mt-1 text-sm text-muted-foreground">Overview coming soon.</p>
    </div>
  );
}
