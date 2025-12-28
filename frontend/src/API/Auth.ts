import axios from "axios";
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
const login = async (email: string, password: string) => {
  const response = await apiClient.post("/api/login/", { email, password });
  return response.data;
};
const signin = async (
  nom: string,
  prenom: string,
  dateNaissance: string,
  email: string,
  password: string
) => {
  const response = await apiClient.post("/api/signin/", {
    nom,
    prenom,
    dateNaissance,
    email,
    password,
  });
  return response.data;
};
export { login, signin };
