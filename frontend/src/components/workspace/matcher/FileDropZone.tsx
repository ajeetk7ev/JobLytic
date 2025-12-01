import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
}

export default function FileDropZone({ onFileSelect }: Props) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFileSelect(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-4 border border-gray-700 rounded-xl p-4 flex items-center justify-center cursor-pointer 
        ${isDragActive ? "bg-gray-700" : "bg-gray-900"} 
        transition-all`}
    >
      <input {...getInputProps()} />
      <div className="flex items-center gap-2 text-gray-300">
        <Upload className="w-5 h-5" />
        <span>Drag & Drop or Upload Your Resume</span>
      </div>
    </div>
  );
}
