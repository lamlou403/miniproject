import axios from "axios";
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getAllLinks = async () => {
  const response = await apiClient.get("/api/analyse/");
  return response.data;
};
const addLink = async (url: string) => {
  const response = await apiClient.post("/api/analyse/", { url });
  return response.data;
};
export { getAllLinks, addLink };
