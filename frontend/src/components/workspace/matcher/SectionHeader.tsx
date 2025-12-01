import { Star } from "lucide-react";

export default function SectionHeader({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-4">
      <h2 className="text-lg font-semibold text-gray-200">
        {step}: {title}
      </h2>

      <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 transition">
        <Star size={16} /> Saved Resumes
      </button>
    </div>
  );
}
