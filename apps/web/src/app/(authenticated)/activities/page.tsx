import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ title: "Activities", path: "/activities", noIndex: true });

export default function ActivitiesPage() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold">Activities</h2>
      <p className="mt-1 text-sm text-muted-foreground">Activity log coming soon.</p>
    </div>
  );
}
