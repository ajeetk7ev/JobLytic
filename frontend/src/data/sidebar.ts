import {
  Home,
  Briefcase,
  FileText,
  FileCheck,
  Settings,
  PenTool,
  LayoutDashboard,
  ClipboardList,
  Sparkles,
  ListChecks,
} from "lucide-react";

export const sidebarLinks = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    id: 2,
    name: "Job Tracker",
    path: "/tracker",
    icon: ClipboardList,
  },
  {
    id: 3,
    name: "Find Jobs",
    path: "/jobs",
    icon: Briefcase,
  },
  {
    id: 4,
    name: "Resume Builder",
    path: "/resume-builder",
    icon: PenTool,
  },
  {
    id: 5,
    name: "Resume–JD Matcher",
    path: "/resume-jd-matcher",
    icon: FileCheck,
  },
  {
    id: 6,
    name: "Resume Upload",
    path: "/resume-upload",
    icon: FileText,
  },
  {
    id: 7,
    name: "AI Recommendations",
    path: "/ai-recommendations",
    icon: Sparkles,
  },
  {
    id: 8,
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
