import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ title: "Settings", path: "/settings", noIndex: true });

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">App settings coming soon.</p>
    </div>
  );
}
