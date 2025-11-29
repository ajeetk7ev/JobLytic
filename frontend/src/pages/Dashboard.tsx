import { useNavigate } from "react-router-dom";
import {
  FileSearch,
  Search,
  PenTool,
  ClipboardList,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const userName = "Ajeet";

  const cardData = [
    {
      id: 1,
      title: "JD Matcher",
      description: "Match your resume with job descriptions using AI.",
      icon: FileSearch,
      path: "/resume-jd-matcher",
    },
    {
      id: 2,
      title: "Find Jobs",
      description: "Get AI-recommended jobs tailored to your skills.",
      icon: Search,
      path: "/jobs",
    },
    {
      id: 3,
      title: "Resume Builder",
      description: "Create stunning resumes using AI and ready templates.",
      icon: PenTool,
      path: "/resume-builder",
    },
    {
      id: 4,
      title: "Job Tracker",
      description: "Track all applied jobs & interview progress.",
      icon: ClipboardList,
      path: "/tracker",
    },
  ];

  return (
    <div className="ml-20 sm:ml-0 w-full h-full text-white  min-h-screen p-4 overflow-y-hidden">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">Welcome, {userName}!</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cardData.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate(card.path)}
            className="cursor-pointer w-[calc(100%-5rem)] sm:w-full  bg-gray-800 shadow-md hover:shadow-lg border border-gray-700 rounded-xl p-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <card.icon className="w-8 h-8 text-gray-200" />
              <h2 className="text-lg font-semibold">{card.title}</h2>
            </div>

            <p className="text-gray-300 text-sm mt-3 leading-relaxed">
              {card.description}
            </p>

            <div className="mt-4 text-sm text-blue-400 font-medium">
              Explore →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
