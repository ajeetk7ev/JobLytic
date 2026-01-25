import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, ArrowLeft, ArrowRight, Loader2, Rocket, Info } from "lucide-react";
import JobCard from "@/components/workspace/jobs/JobCard";
import JobFilters from "@/components/workspace/jobs/JobFilters";
import JobView from "@/components/workspace/jobs/JobView";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

export default function FindJobsPage() {
  const [activeTab, setActiveTab] = useState<"recommended" | "search">("recommended");
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchParams, setSearchParams] = useState<any>(null);

  const fetchRecommended = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get("/jobs/recommend", {
        params: { page: currentPage }
      });
      setJobs(res.data.jobs);
      setTotalJobs(res.data.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (filters: any, resetPage = true) => {
    const currentPage = resetPage ? 1 : filters.page || page;
    if (resetPage) {
      setPage(1);
      setSearchParams(filters);
    }
    
    setIsLoading(true);
    try {
      const res = await api.get("/jobs/search", {
        params: { ...filters, page: currentPage }
      });
      setJobs(res.data.data);
      setTotalJobs(res.data.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "recommended") {
      fetchRecommended(page);
    } else if (searchParams) {
      handleSearch(searchParams, false);
    }
  }, [activeTab, page]);

  return (
    <div className="w-full min-h-screen pb-20 relative">
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="mb-12 relative z-10">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] mb-6 uppercase"
        >
            <Rocket size={14} className="animate-pulse" /> Global Job Engine
        </motion.div>
        
        <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-tight mb-8">
          Accelerate Your <br />
          <span className="text-gradient">Career Trajectory.</span>
        </h1>

        {/* Tabs */}
        <div className="flex p-1.5 bg-secondary/30 rounded-3xl w-fit border border-white/5 mb-10">
          <button
            onClick={() => setActiveTab("recommended")}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "recommended" ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Recommended for You
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "search" ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Advanced Search
          </button>
        </div>

        {activeTab === "search" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <JobFilters onSearch={handleSearch} isLoading={isLoading} />
          </motion.div>
        )}
      </header>

      <section className="relative z-10 gap-8 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="w-12 h-12 text-primary animate-spin" />
             <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Scanning Global Databases...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {jobs.map((job, idx) => (
                  <JobCard 
                    key={job.job_id || idx} 
                    job={job} 
                    onViewDetails={(j) => setSelectedJob(j)} 
                  />
                ))}
              </AnimatePresence>
            </div>

            {totalJobs > 10 && (
              <div className="flex items-center justify-center gap-6 pt-10">
                 <button
                   disabled={page === 1 || isLoading}
                   onClick={() => setPage(page - 1)}
                   className="p-4 glass rounded-2xl hover:bg-secondary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                 >
                   <ArrowLeft size={20} />
                 </button>
                 <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-foreground">{page}</span>
                    <span className="text-muted-foreground font-bold">/ {Math.ceil(totalJobs / 10)}</span>
                 </div>
                 <button
                   disabled={page >= Math.ceil(totalJobs / 10) || isLoading}
                   onClick={() => setPage(page + 1)}
                   className="p-4 glass rounded-2xl hover:bg-secondary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                 >
                   <ArrowRight size={20} />
                 </button>
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center glass rounded-[3rem] border border-white/5"
          >
             <div className="w-20 h-20 rounded-3xl bg-secondary/50 flex items-center justify-center mb-6">
                {activeTab === "recommended" ? <Sparkles size={40} className="text-primary" /> : <Search size={40} className="text-muted-foreground" />}
             </div>
             <h3 className="text-2xl font-black mb-2">
               {activeTab === "recommended" ? "No recommendations yet" : "No jobs found"}
             </h3>
             <p className="text-muted-foreground font-medium max-w-sm px-4">
               {activeTab === "recommended" 
                 ? "Upload your resume so our AI can find the perfect matches for your unique profile." 
                 : "Try adjusting your search terms or filters to explore more opportunities."}
             </p>
          </motion.div>
        )}
      </section>

      {/* Recommended Mode Tip */}
      {activeTab === "recommended" && jobs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-6 glass border-l-4 border-l-primary rounded-3xl flex items-start gap-4"
        >
          <div className="p-2 bg-primary/10 rounded-xl text-primary mt-1">
             <Info size={20} />
          </div>
          <div>
            <h4 className="font-black text-foreground uppercase tracking-widest text-xs mb-1">AI Recommendation Intelligence</h4>
            <p className="text-sm text-muted-foreground font-medium">These jobs are ranked based on a direct semantic match between your extracted resume skills and the job's core requirements.</p>
          </div>
        </motion.div>
      )}

      {/* Job Details Modal */}
      <JobView job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
