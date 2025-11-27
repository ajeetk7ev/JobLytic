import { useState } from "react";
import FileDropZone from "../components/resume-upload/FileDropZone";
import PDFPreview from "../components/resume-upload/PDFPreview";
import UploadProgress from "../components/resume-upload/UploadProgress";
import { useNavigate } from "react-router-dom";


export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async () => {
    
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div
        className="w-full max-w-xl bg-gray-800 shadow-xl rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-gray-100 text-center mb-2">
          Upload Your Resume
        </h1>
        <p className="text-center text-gray-300 mb-8">
          We’ll automatically extract your skills, experience, and projects.
        </p>

        {!file && !isUploading && (
          <FileDropZone onFileSelect={(f) => setFile(f)} />
        )}

        {file && !isUploading && (
          <div className="space-y-6">
            <PDFPreview file={file} />

          </div>
        )}

        {isUploading && <UploadProgress />}
      </div>
    </div>
  );
}
