import { useState } from "react";
import FileDropZone from "@/components/workspace/matcher/FileDropZone";
import PDFPreview from "@/components/workspace/matcher/PDFPreview";
import ResumeInput from "@/components/workspace/matcher/ResumeInput";
import JDInput from "@/components/workspace/matcher/JDInput";
import SectionHeader from "@/components/workspace/matcher/SectionHeader";

export default function ResumeJDMatcherPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="p-6 text-white ml-20 sm:ml-0">
      <h1 className="text-3xl font-bold mb-8">New Scan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <SectionHeader step="Step 1" title="Upload a resume" />

          {!uploadedFile ? (
            <>
              <ResumeInput
                value={resumeText}
                onChange={setResumeText}
                onClear={() => setResumeText("")}
              />

              <FileDropZone onFileSelect={setUploadedFile} />
            </>
          ) : (
            <PDFPreview
              file={uploadedFile}
              onClear={() => setUploadedFile(null)}
            />
          )}
        </div>

        {/* JD Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-gray-200 border-b pb-3 mb-4 border-gray-700">
            Step 2: Paste a job description
          </h2>

          <JDInput
            value={jobText}
            onChange={setJobText}
            onClear={() => setJobText("")}
          />
        </div>
      </div>
    </div>
  );
}
