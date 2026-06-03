import { BarChart3, CheckSquare, FolderKanban, Settings } from "lucide-react";

export const navigationItems = [
  {
    label: "Board",
    href: "/",
    icon: FolderKanban,
  },
  {
    label: "Tickets",
    href: "/tickets",
    icon: CheckSquare,
  },
  {
    label: "Reports",
    href: "#",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "#",
    icon: Settings,
  },
];
