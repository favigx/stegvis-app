import axios, { type AxiosInstance } from "axios";

export interface ApiError {
  message: string;
  status?: number;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

export const apiClient: AxiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
