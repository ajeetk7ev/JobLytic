
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, MoreHorizontal, MapPin, DollarSign, Calendar, ExternalLink, Trash2 
} from "lucide-react";
import { useJobApplicationStore, type JobApplication } from "@/store/jobApplicationStore";

const COLUMNS = [
  { id: "wishlist", label: "Wishlist", color: "bg-blue-500" },
  { id: "applied", label: "Applied", color: "bg-yellow-500" },
  { id: "interviewing", label: "Interviewing", color: "bg-purple-500" },
  { id: "offer", label: "Offer", color: "bg-green-500" },
  { id: "rejected", label: "Rejected", color: "bg-red-500" },
];

export default function JobTrackerPage() {
  const { applications, fetchApplications, updateApplicationStatus, createApplication, deleteApplication } = useJobApplicationStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getColumnApps = (status: string) => applications.filter(app => app.status === status);

  return (
    <div className="w-full min-h-screen p-6 md:p-10 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
        
        <header className="mb-10 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold text-primary uppercase tracking-widest mb-1">
                    Career Management
                </motion.div>
                <h1 className="text-4xl font-black text-foreground tracking-tight">Job Tracker</h1>
            </div>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
                <Plus size={20} /> Add New Job
            </button>
        </header>

        {/* Board */}
        <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-200px)]">
            {COLUMNS.map((col) => (
                <div key={col.id} className="min-w-[300px] flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                         <h3 className="font-bold text-muted-foreground flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${col.color}`} />
                            {col.label}
                            <span className="bg-secondary/50 text-xs px-2 py-0.5 rounded-full text-foreground/70">
                                {getColumnApps(col.id).length}
                            </span>
                         </h3>
                    </div>

                    <div className="flex-1 rounded-[2rem] bg-secondary/10 border border-white/5 p-4 flex flex-col gap-3 min-h-[200px]">
                        <AnimatePresence>
                            {getColumnApps(col.id).map((app) => (
                                <JobCard 
                                    key={app.id} 
                                    app={app} 
                                    updateStatus={updateApplicationStatus}
                                    onDelete={deleteApplication}
                                />
                            ))}
                        </AnimatePresence>
                        {getColumnApps(col.id).length === 0 && (
                            <div className="h-full flex items-center justify-center text-muted-foreground/30 text-sm font-medium italic">
                                Nothing here yet
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Add Job Modal */}
        <AnimatePresence>
            {isAddModalOpen && (
                <AddJobModal onClose={() => setIsAddModalOpen(false)} onAdd={createApplication} />
            )}
        </AnimatePresence>
    </div>
  );
}

function JobCard({ app, updateStatus, onDelete }: { app: JobApplication; updateStatus: (id: string, status: string) => void; onDelete: (id: string) => void }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <motion.div
            layoutId={app.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -2 }}
            className="group relative bg-background/50 backdrop-blur-md border border-white/10 p-5 rounded-[1.5rem] hover:border-primary/20 transition-colors shadow-sm"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-lg uppercase">
                        {app.company.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground leading-tight">{app.position}</h4>
                        <p className="text-xs font-semibold text-muted-foreground">{app.company}</p>
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                    {showMenu && (
                         <div className="absolute right-0 top-full mt-2 w-40 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1">
                            <p className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Move to</p>
                            {COLUMNS.filter(c => c.id !== app.status).map(col => (
                                <button 
                                    key={col.id}
                                    onClick={() => { updateStatus(app.id, col.id); setShowMenu(false); }}
                                    className="px-3 py-2 text-left text-sm hover:bg-secondary text-foreground flex items-center gap-2"
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${col.color}`} />
                                    {col.label}
                                </button>
                            ))}
                            <div className="h-px bg-border my-1" />
                            <button 
                                onClick={() => { onDelete(app.id); setShowMenu(false); }}
                                className="px-3 py-2 text-left text-sm hover:bg-red-500/10 text-red-500 flex items-center gap-2"
                            >
                                <Trash2 size={14} /> Remove
                            </button>
                         </div>
                    )}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                {app.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin size={12} /> {app.location}
                    </div>
                )}
                {app.salary && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <DollarSign size={12} /> {app.salary}
                    </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} /> Applied: {new Date(app.dateApplied || app.createdAt).toLocaleDateString()}
                </div>
            </div>

            {app.url && (
                <a 
                    href={app.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center w-full py-2 bg-secondary/50 hover:bg-secondary rounded-xl text-xs font-bold text-foreground transition-all gap-2"
                >
                    <ExternalLink size={12} /> View Job
                </a>
            )}
        </motion.div>
    );
}

function AddJobModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState({
        company: "",
        position: "",
        location: "",
        type: "On-site",
        status: "wishlist",
        salary: "",
        url: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onAdd(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0f0f10] border border-white/10 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-foreground">Add Application</h2>
                    <button onClick={onClose} className="p-2 bg-secondary hover:bg-secondary/80 rounded-full text-foreground transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Company</label>
                            <input 
                                required
                                className="w-full bg-secondary/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
                                placeholder="Google, Startup Inc..."
                                value={formData.company}
                                onChange={e => setFormData({...formData, company: e.target.value})}
                            />
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Position</label>
                            <input 
                                required
                                className="w-full bg-secondary/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
                                placeholder="Frontend Engineer..."
                                value={formData.position}
                                onChange={e => setFormData({...formData, position: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
                            <select 
                                className="w-full bg-secondary/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all [&>option]:bg-background"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Location</label>
                            <input 
                                className="w-full bg-secondary/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
                                placeholder="Remote, NYC..."
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Job URL</label>
                        <input 
                            className="w-full bg-secondary/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
                            placeholder="https://linkedin.com/jobs/..."
                            value={formData.url}
                            onChange={e => setFormData({...formData, url: e.target.value})}
                        />
                    </div>
                    
                    <div className="pt-4">
                        <button type="submit" className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20">
                            Save Application
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
