import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloudIcon } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
}

export default function FileDropZone({ onFileSelect }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-500 rounded-xl p-8 cursor-pointer"
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded-lg">
        
        {/* Upload Icon (Centered + Yellow) */}
        <UploadCloudIcon 
          className="w-14 h-14 text-yellow-400 mb-4"
        />

        <p className="text-lg font-semibold text-gray-200">
          {isDragActive ? "Drop your resume here" : "Drag & drop your resume (PDF)"}
        </p>

        <p className="text-sm text-gray-400 mt-1">or click to browse</p>
      </div>
    </div>
  );
}
