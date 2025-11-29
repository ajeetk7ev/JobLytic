import StatsGrid from "@/components/workspace/dashboard/StatsGrid";
import UpcomingInterviewCard from "@/components/workspace/dashboard/UpcomingInterviewCard";
import FeatureGrid from "@/components/workspace/dashboard/FeatureGrid";

import {
  FileSearch,
  Search,
  PenTool,
  ClipboardList,
  Briefcase,
  CheckCircle2,
  Calendar,
  UserCheck,
} from "lucide-react";

export default function Dashboard() {
  const userName = "Ajeet";

  const stats = [
    { id: 1, label: "Jobs Applied", value: 12, icon: Briefcase, color: "text-blue-400" },
    { id: 2, label: "Shortlisted", value: 4, icon: CheckCircle2, color: "text-green-400" },
    { id: 3, label: "Interviews Scheduled", value: 1, icon: Calendar, color: "text-purple-400" },
    { id: 4, label: "Profile Score", value: "78%", icon: UserCheck, color: "text-yellow-400" },
  ];

  const nextInterview = {
    role: "Frontend Developer",
    company: "TechNova Pvt Ltd",
    date: "Dec 18, 2025",
    time: "3:00 PM",
    location: "Google Meet",
  };

  const cardData = [
    { id: 1, title: "JD Matcher", description: "Match resume with job descriptions using AI.", icon: FileSearch, path: "/resume-jd-matcher" },
    { id: 2, title: "Find Jobs", description: "AI-recommended jobs tailored to your skills.", icon: Search, path: "/jobs" },
    { id: 3, title: "Resume Builder", description: "Create stunning resumes using templates.", icon: PenTool, path: "/resume-builder" },
    { id: 4, title: "Job Tracker", description: "Track all applied jobs & progress.", icon: ClipboardList, path: "/tracker" },
  ];

  return (
    <div className="ml-20 sm:ml-0 w-full h-full text-white min-h-screen p-4 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8">Welcome, {userName}!</h1>

      <StatsGrid stats={stats} />

      <UpcomingInterviewCard interview={nextInterview} />

      <FeatureGrid cards={cardData} />
    </div>
  );
}
