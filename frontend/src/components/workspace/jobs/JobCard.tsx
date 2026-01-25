import { motion } from "framer-motion";
import { MapPin, Calendar, ExternalLink, Globe, DollarSign, Building2 } from "lucide-react";

interface JobCardProps {
  job: any;
  onViewDetails: (job: any) => void;
}

export default function JobCard({ job, onViewDetails }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-4xl border border-white/10 hover:shadow-2xl hover:shadow-primary/10 transition-all group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center overflow-hidden border border-white/5">
            {job.employer_logo ? (
              <img src={job.employer_logo} alt={job.employer_name} className="w-full h-full object-contain p-2" />
            ) : (
              <Building2 className="w-7 h-7 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {job.job_title}
            </h3>
            <p className="text-sm font-bold text-muted-foreground">{job.employer_name}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-widest uppercase">
          {job.job_employment_type?.replace('_', ' ') || "Fulltime"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <MapPin size={14} className="text-primary" />
          <span className="line-clamp-1">{job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : "Location Remote"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <Calendar size={14} className="text-primary" />
          <span>{job.job_posted_at ? job.job_posted_at : "Recent"}</span>
        </div>
        {job.job_is_remote ? (
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Globe size={14} />
            <span>Remote Friendly</span>
          </div>
        ) : null}
        {job.job_salary ? (
          <div className="flex items-center gap-2 text-xs font-bold text-accent">
            <DollarSign size={14} />
            <span>{job.job_salary}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3">
        <button
          onClick={() => onViewDetails(job)}
          className="flex-1 py-3 bg-secondary/50 hover:bg-secondary text-foreground rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
        >
          Details
        </button>
        <a
          href={job.job_apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-primary text-primary-foreground rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center"
        >
          <ExternalLink size={18} />
        </a>
      </div>
    </motion.div>
  );
}
