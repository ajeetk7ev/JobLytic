import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, Calendar, Globe, DollarSign, ExternalLink, ListChecks, GraduationCap } from "lucide-react";

interface JobViewProps {
  job: any | null;
  onClose: () => void;
}

export default function JobView({ job, onClose }: JobViewProps) {
  if (!job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] glass bg-background/50 border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 sm:p-10 border-b border-white/5 flex items-start justify-between bg-secondary/10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-background/50 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
                {job.employer_logo ? (
                  <img src={job.employer_logo} alt={job.employer_name} className="w-full h-full object-contain p-3" />
                ) : (
                  <Building2 className="w-10 h-10 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground tracking-tighter leading-tight">{job.job_title}</h2>
                <div className="flex items-center gap-2 mt-2">
                   <p className="text-primary font-black uppercase tracking-widest text-xs">{job.employer_name}</p>
                   <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full" />
                   <p className="text-muted-foreground font-bold text-sm">Posted {job.job_posted_at || "Recently"}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-secondary/50 hover:bg-destructive/10 hover:text-destructive rounded-2xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-12 custom-scrollbar">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="p-5 glass border border-white/5 rounded-3xl flex flex-col gap-2">
                  <MapPin size={18} className="text-primary" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                  <p className="text-sm font-bold text-foreground">{job.job_city}, {job.job_country}</p>
               </div>
               <div className="p-5 glass border border-white/5 rounded-3xl flex flex-col gap-2">
                  <Calendar size={18} className="text-primary" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</p>
                  <p className="text-sm font-bold text-foreground">{job.job_employment_type?.replace('_', ' ') || "Full-Time"}</p>
               </div>
               <div className="p-5 glass border border-white/5 rounded-3xl flex flex-col gap-2">
                  <Globe size={18} className="text-primary" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Remote</p>
                  <p className="text-sm font-bold text-foreground">{job.job_is_remote ? "Yes" : "No"}</p>
               </div>
               <div className="p-5 glass border border-white/5 rounded-3xl flex flex-col gap-2">
                  <DollarSign size={18} className="text-primary" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Salary</p>
                  <p className="text-sm font-bold text-foreground">{job.job_salary || "Not Specified"}</p>
               </div>
            </div>

            {/* Highlights */}
            {job.job_highlights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {job.job_highlights.Qualifications && (
                   <div className="space-y-4">
                      <h3 className="text-xl font-black flex items-center gap-3">
                         <GraduationCap size={22} className="text-primary" /> Qualifications
                      </h3>
                      <ul className="space-y-3">
                         {job.job_highlights.Qualifications.map((item: string, i: number) => (
                           <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground leading-relaxed">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" /> {item}
                           </li>
                         ))}
                      </ul>
                   </div>
                 )}
                 {job.job_highlights.Responsibilities && (
                   <div className="space-y-4">
                      <h3 className="text-xl font-black flex items-center gap-3">
                         <ListChecks size={22} className="text-primary" /> Responsibilities
                      </h3>
                      <ul className="space-y-3">
                         {job.job_highlights.Responsibilities.map((item: string, i: number) => (
                           <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground leading-relaxed">
                              <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" /> {item}
                           </li>
                         ))}
                      </ul>
                   </div>
                 )}
              </div>
            )}

            {/* Full Description */}
            <div className="space-y-6">
               <h3 className="text-2xl font-black tracking-tighter">Full Job Description</h3>
               <div className="p-8 glass border border-white/5 rounded-4xl text-muted-foreground font-medium leading-[1.8] text-sm whitespace-pre-wrap">
                  {job.job_description}
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 sm:p-10 border-t border-white/5 bg-secondary/5 flex items-center justify-between">
             <div className="hidden sm:block">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Applying via</p>
                <p className="text-foreground font-bold">{job.job_publisher}</p>
             </div>
             <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-8 py-4 glass border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary/50 transition-all"
                >
                  Close
                </button>
                <a
                  href={job.job_apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-12 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  Apply Now <ExternalLink size={16} />
                </a>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
