"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Baby, Activity, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavHref } from "./nav-items";

const ICON_MAP = {
  LayoutDashboard,
  Baby,
  Activity,
  Users,
  Settings,
} as const;

type IconName = keyof typeof ICON_MAP;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-stretch border-t bg-background md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = ICON_MAP[item.icon as IconName];

        return (
          <Link
            key={item.href}
            href={item.href as NavHref}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("size-5 shrink-0", isActive && "stroke-[2.5px]")} aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
