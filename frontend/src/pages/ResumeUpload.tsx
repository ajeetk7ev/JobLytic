import { useState } from "react";
import FileDropZone from "../components/resume-upload/FileDropZone";
import PDFPreview from "../components/resume-upload/PDFPreview";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X, Loader2, CloudUpload } from "lucide-react";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Resume analyzed successfully!");
      navigate("/resume-jd-result", { state: { resumeData: res.data.resume.data } });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to analyze resume");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center pb-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        <header className="text-center mb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] mb-6 uppercase"
            >
                <Sparkles size={14} className="animate-pulse" /> AI Extraction 2.0
            </motion.div>
            
            <h1 className="text-5xl font-black text-foreground tracking-tighter leading-tight mb-4 text-gradient">
                Elevate Your Identity.
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
                Our AI will dissect your career history to highlight your <span className="text-foreground font-black">true potential</span>.
            </p>
        </header>

        <AnimatePresence mode="wait">
          {!file && !isUploading ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
               <FileDropZone onFileSelect={(f) => setFile(f)} />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-10 rounded-[3rem] border border-white/10"
            >
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary font-black">
                       <CloudUpload size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-foreground">{file?.name}</h3>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Selected Component</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setFile(null)}
                  disabled={isUploading}
                  className="p-3 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-2xl transition-all disabled:opacity-50"
                 >
                    <X size={20} />
                 </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto rounded-3xl border border-white/5 bg-black/20 p-4 mb-10 custom-scrollbar">
                <PDFPreview file={file!} />
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full py-5 px-8 bg-primary text-primary-foreground rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Analyzing your career...
                  </>
                ) : (
                  <>
                    Analyze Resume <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
