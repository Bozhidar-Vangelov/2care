import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ title: "Family", path: "/families", noIndex: true });

export default function FamiliesPage() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold">Family</h2>
      <p className="mt-1 text-sm text-muted-foreground">Family management coming soon.</p>
    </div>
  );
}
