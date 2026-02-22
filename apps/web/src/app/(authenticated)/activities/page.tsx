import type { Metadata } from "next";

export const metadata: Metadata = { title: "Activities" };

export default function ActivitiesPage() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold">Activities</h2>
      <p className="mt-1 text-sm text-muted-foreground">Activity log coming soon.</p>
    </div>
  );
}
