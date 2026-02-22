import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">App settings coming soon.</p>
    </div>
  );
}
