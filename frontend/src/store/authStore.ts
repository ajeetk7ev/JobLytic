import { create } from "zustand";
import { API_URL } from "@/utils/api";
import axios from "axios";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "@/utils/localstorage";

interface AuthState {
  token: string | null;
  isAuthLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; errors?: any }>;

  signup: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; errors?: any }>;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getFromLocalStorage("token") ? getFromLocalStorage("token") : null,
  isAuthLoading: false,

  //LOGIN
  login: async (email: string, password: string) => {
    set({ isAuthLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token } = res.data.token;
      setToLocalStorage("token", token);
      set({ token: token });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        errors: err.response?.data?.errors,
      };
    } finally {
      set({ isAuthLoading: false });
    }
  },

  //SIGNUP
  signup: async (fullName: string, email: string, password: string) => {
    set({isAuthLoading:true})
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        fullName,
        email,
        password,
      });

      const token = res.data.token;
      setToLocalStorage("token", token);
      set({ token: token });

      return { success: true };
    } catch (err: any) {
      console.log("error are", err)
      return {
        success: false,
        errors: err.response?.data?.errors,
      };
    } finally {
      set({ isAuthLoading: false });
    }
  },

  //LOGOUT
  logout: async () => {
    removeFromLocalStorage("token");
    set({ token: null });
  },
}));
