import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import FileDropZone from "@/components/workspace/matcher/FileDropZone";
import PDFPreview from "@/components/workspace/matcher/PDFPreview";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

export default function ResumeJDMatcherPage() {
  const [activeResume, setActiveResume] = useState<any | null>(null); // From DB
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzeLoading, setIsAnalyzeLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [mode, setMode] = useState<"upload" | "select">("upload");

  // Fetch latest resume on mount
  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        // We can create an endpoint for getting resumes list, but for now let's assume 
        // the user might have uploaded one recently or we use the upload flow.
        // If we want to "Select Recent", we'd need that endpoint. 
        // For simpler UX, let's stick to "Upload New" or "Use Profile Resume".
        // Let's implement "Use Profile Resume" if available? 
        // Actually, the backend `matchResumeWithJD` defaults to latest if no ID provided.
        // So we can just have a toggle "Use My Profile Resume".
      } catch (err) {
        console.error(err);
      }
    };
    fetchLatestResume();
  }, []);

  const handleMatch = async () => {
    if (!jobDescription) {
      toast.error("Please paste the Job Description");
      return;
    }

    setIsAnalyzeLoading(true);
    setAnalysisResult(null);

    try {
      // If file uploaded, upload it first? 
      // Or if using profile resume, just call match.
      
      let resumeId = undefined;

      if (mode === "upload" && uploadedFile) {
         // Upload first
         const formData = new FormData();
         formData.append("resume", uploadedFile);
         const uploadRes = await api.post("/resume/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
         });
         resumeId = uploadRes.data.resume.id;
      } 
      // else if mode === "select" (or default), resumeId is undefined -> backend matches latest.

      const res = await api.post("/resume/match", {
        jobDescription,
        resumeId: resumeId
      });

      setAnalysisResult(res.data.data);
      toast.success("Analysis Complete!");

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Analysis failed");
    } finally {
      setIsAnalyzeLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen pb-20 relative">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <header className="mb-10 relative z-10">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] mb-4 uppercase"
        >
            <Sparkles size={14} className="animate-pulse" /> ATS Simulator
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
          Beat the <span className="text-gradient">Algorithm.</span>
        </h1>
        <p className="text-muted-foreground mt-4 font-medium max-w-xl">
           Analyze your resume against any job description to get a compatibility score and actionable keyword optimization tips.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
         {/* LEFT: Resume Input */}
         <div className="space-y-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
               <span className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-sm border border-white/10">1</span>
               Resume Source
            </h2>
            
            <div className="glass p-1 rounded-[2rem] border border-white/10 flex mb-4">
               <button 
                 onClick={() => setMode("upload")}
                 className={`flex-1 py-3rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${mode === "upload" ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 Upload New
               </button>
               <button 
                 onClick={() => setMode("select")}
                 className={`flex-1 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${mode === "select" ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 Use Profile Resume
               </button>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-white/10 min-h-[300px] flex flex-col justify-center">
               {mode === "upload" ? (
                  uploadedFile ? (
                     <div className="relative">
                         <PDFPreview file={uploadedFile} onClear={() => setUploadedFile(null)} />
                        <button 
                          onClick={() => setUploadedFile(null)}
                          className="mt-4 w-full py-3 bg-secondary/50 hover:bg-destructive/10 hover:text-destructive rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        >
                           Change File
                        </button>
                     </div>
                  ) : (
                     <FileDropZone onFileSelect={setUploadedFile} />
                  )
               ) : (
                  <div className="text-center space-y-4">
                     <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                        <FileText size={40} />
                     </div>
                     <div>
                        <h3 className="text-lg font-black text-foreground">Using Profile Resume</h3>
                        <p className="text-sm text-muted-foreground font-medium">We'll analyze the latest resume you uploaded to your dashboard.</p>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* RIGHT: JD Input */}
         <div className="space-y-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
               <span className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-sm border border-white/10">2</span>
               Job Description
            </h2>
            
            <div className="glass p-1 rounded-[2.5rem] border border-white/10 h-full min-h-[300px] relative group overflow-hidden">
               <textarea
                 value={jobDescription}
                 onChange={(e) => setJobDescription(e.target.value)}
                 className="w-full h-full min-h-[350px] bg-transparent border-none outline-none p-8 resize-none text-sm font-medium text-foreground placeholder-muted-foreground/50 leading-relaxed custom-scrollbar"
                 placeholder="Paste the full job description here..."
               />
               <div className="absolute bottom-6 right-6">
                  <button 
                    onClick={() => setJobDescription("")}
                    className="p-3 bg-secondary/50 hover:bg-secondary text-muted-foreground rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Clear Text"
                  >
                     <RefreshCw size={16} />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Action Bar */}
      <div className="mt-12 flex justify-center sticky bottom-10 z-20">
         <motion.button
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={handleMatch}
           disabled={isAnalyzeLoading || (mode === "upload" && !uploadedFile) || !jobDescription}
           className="px-12 py-5 bg-foreground text-background rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-black/20 hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
         >
            {isAnalyzeLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {isAnalyzeLoading ? "Analyzing Compatibility..." : "Run Compatibility Check"}
         </motion.button>
      </div>

      {/* Analysis Result */}
      <AnimatePresence>
         {analysisResult && (
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 50 }}
               className="mt-20 glass p-10 md:p-14 rounded-[3.5rem] border border-white/10 relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-red-500 via-yellow-500 to-green-500" />
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Score Column */}
                  <div className="flex flex-col items-center justify-center text-center space-y-6">
                     <div className="relative w-48 h-48">
                        <svg className="w-full h-full -rotate-90">
                           <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-secondary/30" />
                           <motion.circle 
                              initial={{ strokeDasharray: 553, strokeDashoffset: 553 }}
                              animate={{ strokeDashoffset: 553 - (553 * analysisResult.score) / 100 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                              className={`${analysisResult.score >= 80 ? 'text-emerald-500' : analysisResult.score >= 50 ? 'text-amber-500' : 'text-red-500'}`} 
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-6xl font-black tracking-tighter text-foreground">{analysisResult.score}%</span>
                           <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Match Score</span>
                        </div>
                     </div>
                     <p className="text-lg font-medium text-foreground max-w-xs">{analysisResult.recommendation}</p>
                  </div>

                  {/* Details Column */}
                  <div className="lg:col-span-2 space-y-10">
                     <div>
                        <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
                           <AlertCircle className="text-red-500" /> Missing Keywords
                        </h3>
                        {analysisResult.missingKeywords?.length > 0 ? (
                           <div className="flex flex-wrap gap-3">
                              {analysisResult.missingKeywords.map((kw: string) => (
                                 <span key={kw} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-sm">
                                    {kw}
                                 </span>
                              ))}
                           </div>
                        ) : (
                           <p className="text-emerald-500 font-bold">Great job! No critical keywords missing.</p>
                        )}
                     </div>

                     <div className="grid md:grid-cols-2 gap-8">
                        <div>
                           <h3 className="text-lg font-black tracking-tight mb-4 text-emerald-500">Strengths</h3>
                           <ul className="space-y-3">
                              {analysisResult.strengths?.map((s: string, i: number) => (
                                 <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    {s}
                                 </li>
                              ))}
                           </ul>
                        </div>
                        <div>
                           <h3 className="text-lg font-black tracking-tight mb-4 text-amber-500">Improvements</h3>
                           <ul className="space-y-3">
                              {analysisResult.weaknesses?.map((w: string, i: number) => (
                                 <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground">
                                    <ArrowRight size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                    {w}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
