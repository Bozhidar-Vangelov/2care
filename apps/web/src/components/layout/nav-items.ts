export type NavItem = {
  href: string;
  label: string;
  icon: string;
  iconActive: string;
  title: string;
};

export const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Home",
    icon: "LayoutDashboard",
    iconActive: "LayoutDashboard",
    title: "Dashboard",
  },
  {
    href: "/babies",
    label: "Babies",
    icon: "Baby",
    iconActive: "Baby",
    title: "Babies",
  },
  {
    href: "/activities",
    label: "Activities",
    icon: "Activity",
    iconActive: "Activity",
    title: "Activities",
  },
  {
    href: "/families",
    label: "Family",
    icon: "Users",
    iconActive: "Users",
    title: "Family",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "Settings",
    iconActive: "Settings",
    title: "Settings",
  },
] as const satisfies NavItem[];

export type NavHref = (typeof NAV_ITEMS)[number]["href"];
