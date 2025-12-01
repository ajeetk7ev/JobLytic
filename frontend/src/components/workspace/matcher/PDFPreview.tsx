import { X } from "lucide-react";

interface Props {
  file: File;
  onClear: () => void;
}

export default function PDFPreview({ file, onClear }: Props) {
  const url = URL.createObjectURL(file);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-gray-200 font-semibold">{file.name}</p>
        <button
          className="text-red-400 hover:text-red-500"
          onClick={onClear}
        >
          <X size={20} />
        </button>
      </div>

      <iframe
        src={url}
        className="w-full h-64 rounded-lg border border-gray-800"
      />
    </div>
  );
}
