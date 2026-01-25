
import { useState } from "react";
import { initialResumeState, type ResumeData } from "../components/resume-builder/types";
import { EditorSection } from "../components/resume-builder/EditorSection";
import { ResumePreview } from "../components/resume-builder/ResumePreview";
import { TemplateSelector } from "../components/resume-builder/TemplateSelector";
import { Printer, Download, Save } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ResumeBuilderPage() {
  const [data, setData] = useState<ResumeData>(initialResumeState);
  const [templateId, setTemplateId] = useState("modern");
  
  const handlePrint = () => {
    // Basic print - in a real app would use a print stylesheet or pdf generation lib
    const content = document.getElementById("resume-preview");
    if (!content) return;
    
    // For now, simple window print
    window.print();
  };

  const handleSave = () => {
      // Stub for backend save
      toast.success("Resume saved to profile!");
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col md:flex-row bg-background">
      {/* Editor Panel (Left) */}
      <div className="w-full md:w-[45%] lg:w-[40%] h-full flex flex-col border-r border-border/50 bg-background relative z-10">
        <header className="px-8 py-6 border-b border-border/50 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-background/50 backdrop-blur-md sticky top-0 z-20">
            <div>
                 <h1 className="text-2xl font-black tracking-tighter">Resume Builder</h1>
                 <p className="text-xs text-muted-foreground font-medium">Craft your professional story</p>
            </div>
            <div className="flex items-center gap-4">
                <TemplateSelector selectedId={templateId} onSelect={setTemplateId} />
                <div className="h-8 w-px bg-border" />
                <button onClick={handleSave} className="p-2 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors text-foreground" title="Save Draft">
                    <Save size={18} />
                </button>
            </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <EditorSection data={data} updateData={setData} />
        </div>
      </div>

      {/* Preview Panel (Right) */}
      <div className="hidden md:flex flex-1 bg-secondary/20 items-center justify-center p-8 lg:p-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-[21cm] h-[calc(100vh-100px)] relative group">
             {/* Toolbar overlay */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-black/80 backdrop-blur-lg rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-20 scale-90 group-hover:scale-100">
                <button onClick={handlePrint} className="flex items-center gap-2 text-white hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
                    <Printer size={16} /> Print
                </button>
                <div className="w-px h-4 bg-white/20" />
                <button className="flex items-center gap-2 text-white hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
                    <Download size={16} /> PDF
                </button>
             </div>

             <motion.div 
                key={templateId} // Animate switch
                className="w-full h-full bg-white rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
             >
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                    <ResumePreview data={data} templateId={templateId} />
                </div>
             </motion.div>
        </div>
      </div>
    </div>
  );
}
