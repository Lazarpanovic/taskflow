import { BarChart3, CheckSquare, FolderKanban, Settings } from "lucide-react";

export const navigationItems = [
  {
    label: "Board",
    icon: FolderKanban,
    isActive: true,
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    isActive: false,
  },
  {
    label: "Reports",
    icon: BarChart3,
    isActive: false,
  },
  {
    label: "Settings",
    icon: Settings,
    isActive: false,
  },
];
