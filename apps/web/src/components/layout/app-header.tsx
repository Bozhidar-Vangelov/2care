"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

function usePageTitle(): string {
  const pathname = usePathname();
  const match = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );
  return match?.title ?? "2Care";
}

export function AppHeader() {
  const title = usePageTitle();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:hidden">
      <h1 className="flex-1 text-base font-semibold">{title}</h1>
    </header>
  );
}

export function DesktopHeader({ title }: { title?: string }) {
  const derivedTitle = usePageTitle();

  return (
    <header className="hidden h-14 shrink-0 items-center gap-3 border-b bg-background px-6 md:flex">
      <h1 className="flex-1 text-sm font-semibold text-foreground">{title ?? derivedTitle}</h1>
    </header>
  );
}
