import type { Metadata } from "next";

export const metadata: Metadata = { title: "Babies" };

export default function BabiesPage() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold">Babies</h2>
      <p className="mt-1 text-sm text-muted-foreground">Baby profiles coming soon.</p>
    </div>
  );
}
