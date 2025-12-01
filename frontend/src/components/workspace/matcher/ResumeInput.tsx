import { X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}

export default function ResumeInput({ value, onChange, onClear }: Props) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-72 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200
          focus:border-blue-500 outline-none resize-none"
        placeholder="Copy and paste resume here."
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute top-3 right-3 text-red-400 hover:text-red-500"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
