import type{ LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

export default function FeatureCard({ title, description, path, icon: Icon }: FeatureCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer w-[calc(100%-5rem)] sm:w-full bg-gray-800 shadow-md hover:shadow-lg 
      border border-gray-700 rounded-xl p-6 transition-all 
      hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-gray-200" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <p className="text-gray-300 text-sm mt-3 leading-relaxed">
        {description}
      </p>

      <div className="mt-4 text-sm text-blue-400 font-medium">Explore →</div>
    </div>
  );
}
