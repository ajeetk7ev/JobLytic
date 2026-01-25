import { useState } from "react";
import FileDropZone from "../components/resume-upload/FileDropZone";
import PDFPreview from "../components/resume-upload/PDFPreview";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X, Loader2, CloudUpload, Rocket, ChevronRight } from "lucide-react";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

export default function OnboardingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Profile setup complete!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to analyze resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        <header className="text-center mb-16">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-black tracking-widest mb-8 uppercase"
            >
                <Rocket size={18} className="animate-bounce" /> Setup Your Command Center
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-tight mb-6">
                One Last Step, <br />
                <span className="text-gradient">Captain.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                Upload your resume now to instantly unlock AI-powered recommendations and deep career insights.
            </p>
        </header>

        <AnimatePresence mode="wait">
          {!file && !isUploading ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
               <FileDropZone onFileSelect={(f) => setFile(f)} />
               
               <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4 w-full">
                     <div className="h-px flex-1 bg-border/50" />
                     <span className="text-xs font-black text-muted-foreground/50 uppercase tracking-widest">or</span>
                     <div className="h-px flex-1 bg-border/50" />
                  </div>
                  
                  <button 
                    onClick={handleSkip}
                    className="group flex items-center gap-2 text-muted-foreground hover:text-foreground font-black text-sm uppercase tracking-widest transition-all"
                  >
                    Setup Later <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary font-black shadow-inner">
                       <CloudUpload size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-foreground max-w-[200px] truncate">{file?.name}</h3>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic flex items-center gap-1.5">
                          <Sparkles size={12} /> Ready for analysis
                       </p>
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

              <div className="max-h-[300px] overflow-y-auto rounded-[2rem] border border-white/5 bg-black/20 p-6 mb-10 custom-scrollbar shadow-inner">
                <PDFPreview file={file!} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleSkip}
                    disabled={isUploading}
                    className="flex-1 py-5 px-8 glass border border-white/10 text-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/50 transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-[2] py-5 px-8 bg-primary text-primary-foreground rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {isUploading ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" /> Analyzing...
                    </>
                    ) : (
                    <>
                        Extract & Setup <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                    )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-20 text-center">
            <p className="text-xs font-bold text-muted-foreground/30 uppercase tracking-[0.3em]">JoblyTics Intelligence Matrix v2.0</p>
        </footer>
      </div>
    </div>
  );
}
