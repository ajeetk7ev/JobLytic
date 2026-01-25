import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Code2,
  Cpu,
  Mail,
  Linkedin,
  Phone
} from "lucide-react";

export default function JDMatchResultPage() {
  const location = useLocation();
  const resumeData = location.state?.resumeData;

  if (!resumeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-3xl flex items-center justify-center mb-6">
           <AlertTriangle size={40} />
        </div>
        <h2 className="text-3xl font-black mb-4">No analysis data found</h2>
        <p className="text-muted-foreground mb-8">Please upload your resume first to see the magic.</p>
        <Link to="/resume-upload" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black hover:scale-105 transition-transform flex items-center gap-2">
           <ArrowLeft size={20} /> Go Back to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-20 relative">
      <div className="absolute top-0 right-0 w-full max-w-5xl h-full bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="mb-12 relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] mb-6 uppercase"
          >
            <Sparkles size={14} className="animate-pulse" /> Analysis Completed
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tighter text-gradient"
          >
            Your AI Identity.
          </motion.h1>
          <p className="text-muted-foreground font-medium mt-3 text-lg">Detailed extraction of your professional profile.</p>
        </div>
        
        <Link to="/resume-upload" className="px-6 py-3 glass hover:bg-secondary/50 rounded-2xl font-bold flex items-center gap-2 transition-all border border-white/10">
           <ArrowLeft size={18} /> Re-extract Resume
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Left Column: Basic Info & Summary */}
        <div className="lg:col-span-1 space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 rounded-[3rem] border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="w-20 h-20 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center text-3xl font-black mb-8 shadow-xl shadow-primary/20">
               {resumeData.fullName?.charAt(0)}
            </div>
            
            <h2 className="text-3xl font-black mb-1">{resumeData.fullName}</h2>
            <p className="text-primary font-bold">{resumeData.experience?.[0]?.role || "Professionally Analyzed"}</p>
            
            <div className="mt-8 space-y-4">
               {resumeData.email && (
                 <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                    <Mail size={16} className="text-primary" /> {resumeData.email}
                 </div>
               )}
               {resumeData.phone && (
                 <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                    <Phone size={16} className="text-primary" /> {resumeData.phone}
                 </div>
               )}
               {resumeData.linkedin && (
                 <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                    <Linkedin size={16} className="text-primary" /> Profile Linked
                 </div>
               )}
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="glass p-8 rounded-[2.5rem] border border-white/10"
          >
             <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                <Sparkles size={18} className="text-primary" /> AI Summary
             </h3>
             <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {resumeData.summary}
             </p>
          </motion.div>
        </div>

        {/* Center/Right Column: Skills, Experience, Projects */}
        <div className="lg:col-span-2 space-y-10">
          {/* Skills Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-10 rounded-[3rem] border border-white/10"
          >
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <Code2 size={24} className="text-primary" /> Technical Arsenal
             </h2>
             <div className="flex flex-wrap gap-3">
                {resumeData.skills?.map((skill: string, i: number) => (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (i * 0.05) }}
                    key={skill}
                    className="px-5 py-2.5 bg-secondary/50 hover:bg-primary/20 transition-colors border border-white/10 rounded-2xl text-sm font-bold text-foreground"
                  >
                    {skill}
                  </motion.span>
                ))}
             </div>
          </motion.section>

          {/* Experience Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
             <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                   <Briefcase size={24} className="text-primary" /> Career Path
                </h2>
                <div className="h-px flex-1 bg-border/30 mx-6" />
             </div>
             
             <div className="space-y-6">
                {resumeData.experience?.map((exp: any, i: number) => (
                  <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                           <h3 className="text-xl font-black text-foreground">{exp.role}</h3>
                           <p className="text-primary font-bold">{exp.company}</p>
                        </div>
                        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                           {exp.duration}
                        </span>
                     </div>
                     <p className="text-sm text-muted-foreground font-medium leading-relaxed">{exp.description}</p>
                  </div>
                ))}
             </div>
          </motion.section>

          {/* Education & Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <motion.section 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
             >
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                   <GraduationCap size={24} className="text-primary" /> Foundation
                </h2>
                <div className="space-y-6">
                   {resumeData.education?.map((edu: any, i: number) => (
                      <div key={i} className="glass p-6 rounded-4xl border border-white/10">
                         <h3 className="font-black text-foreground">{edu.degree}</h3>
                         <p className="text-sm text-muted-foreground font-bold mt-1">{edu.institute}</p>
                         <p className="text-xs font-black text-primary uppercase mt-3">{edu.year}</p>
                      </div>
                   ))}
                </div>
             </motion.section>

             <motion.section 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
             >
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                   <Cpu size={24} className="text-primary" /> Project Forge
                </h2>
                <div className="space-y-6">
                   {resumeData.projects?.map((proj: any, i: number) => (
                      <div key={i} className="glass p-6 rounded-4xl border border-white/10">
                         <h3 className="font-black text-foreground">{proj.name}</h3>
                         <div className="flex flex-wrap gap-2 my-3">
                            {proj.tech?.map((t: string) => (
                               <span key={t} className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">{t}</span>
                            ))}
                         </div>
                         <p className="text-xs text-muted-foreground font-medium line-clamp-2">{proj.description}</p>
                      </div>
                   ))}
                </div>
             </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
