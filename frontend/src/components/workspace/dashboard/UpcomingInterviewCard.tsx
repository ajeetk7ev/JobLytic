import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InterviewProps {
  role: string;
  company: string;
  date: string;
  time: string;
  location: string;
}

export default function UpcomingInterviewCard({ interview }: { interview: InterviewProps | null }) {
  const navigate = useNavigate();

  return (
    <div className="w-[calc(100%-5rem)] sm:w-full bg-gray-800 border border-gray-700 rounded-xl p-6 mb-10 shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-sm sm:text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Upcoming Interview
        </h2>

        <button
          onClick={() => navigate("/tracker")}
          className="text-sm text-blue-400 hover:underline"
        >
          View All →
        </button>
      </div>

      {interview ? (
        <div className="mt-4">
          <p className="text-gray-200 font-medium">{interview.role}</p>
          <p className="text-gray-400 text-sm mb-3">{interview.company}</p>

          <div className="flex gap-3 sm:gap-6 text-gray-300 text-sm">
            <p>📅 {interview.date}</p>
            <p>⏰ {interview.time}</p>
            <p>🌍 {interview.location}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 mt-3">
          No interview scheduled. Add one in Job Tracker.
        </p>
      )}
    </div>
  );
}
