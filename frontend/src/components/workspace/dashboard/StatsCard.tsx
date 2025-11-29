import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="w-[calc(100%-5rem)] sm:w-full bg-gray-800 border  border-gray-700 rounded-xl p-4 flex  items-center gap-4">
      <Icon className={`w-8 h-8 ${color}`} />
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
