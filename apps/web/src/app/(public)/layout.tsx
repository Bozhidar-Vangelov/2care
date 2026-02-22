import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | 2Care",
    default: "2Care",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <span className="text-3xl font-bold tracking-tight text-primary">2Care</span>
        <p className="text-sm text-muted-foreground">Baby tracking, made simple</p>
      </div>

      <main className="w-full max-w-sm">{children}</main>
    </div>
  );
}
