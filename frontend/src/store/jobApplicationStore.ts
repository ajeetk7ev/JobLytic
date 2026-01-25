import { create } from "zustand";
import api from "../utils/api";
import { toast } from "react-hot-toast";

export interface JobApplication {
  id: string;
  jobId?: string;
  company: string;
  position: string;
  location?: string;
  type?: string;
  status: "wishlist" | "applied" | "interviewing" | "offer" | "rejected";
  salary?: string;
  url?: string;
  dateApplied?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobApplicationStore {
  applications: JobApplication[];
  isLoading: boolean;
  createApplication: (data: Partial<JobApplication>) => Promise<void>;
  fetchApplications: () => Promise<void>;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

export const useJobApplicationStore = create<JobApplicationStore>(
  (set, get) => ({
    applications: [],
    isLoading: false,

    fetchApplications: async () => {
      set({ isLoading: true });
      try {
        const res = await api.get("/applications");
        set({ applications: res.data.data });
      } catch (error: any) {
        console.error("Fetch Error:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    createApplication: async (data) => {
      set({ isLoading: true });
      try {
        const res = await api.post("/applications", data);
        set((state) => ({
          applications: [res.data.data, ...state.applications],
        }));
        toast.success("Job added to tracker!");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to add job");
      } finally {
        set({ isLoading: false });
      }
    },

    updateApplicationStatus: async (id, status) => {
      // Optimistic update
      const previousApps = get().applications;
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? { ...app, status: status as any } : app,
        ),
      }));

      try {
        await api.patch(`/applications/${id}`, { status });
      } catch (error: any) {
        // Revert if failed
        set({ applications: previousApps });
        toast.error("Failed to update status");
      }
    },

    deleteApplication: async (id) => {
      set({ isLoading: true });
      try {
        await api.delete(`/applications/${id}`);
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        }));
        toast.success("Job removed");
      } catch (error: any) {
        toast.error("Failed to delete job");
      } finally {
        set({ isLoading: false });
      }
    },
  }),
);
