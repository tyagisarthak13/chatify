import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api", // ✅ ALWAYS
  withCredentials: true,
});
