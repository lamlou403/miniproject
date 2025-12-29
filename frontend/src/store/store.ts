import { create } from "zustand";
import axios from "axios";

// 1. Axios Instance with Credentials
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

interface User {
  id: string;
  nom: string;
  prenom: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  refresh: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isHydrated: false,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  clearAuth: async () => {
    await apiClient.post("/api/logout", { withCredentials: true });
    set({ accessToken: null, user: null });
  },

  refresh: async () => {
    try {
      const response = await apiClient.post("/api/token");
      const { accessToken, user } = response.data;
      set({ accessToken, user, isHydrated: true });
    } catch (error) {
      set({ accessToken: null, user: null, isHydrated: true });
      throw error;
    }
  },
}));

export { apiClient };
export default useAuthStore;
