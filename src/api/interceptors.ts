import axios, { type AxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { apiClient, type ApiError } from "./apiClient";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_PROD,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const subscribeTokenRefresh = (cb: (success: boolean) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (success: boolean) => {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
};

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const isAuthRequest = (url?: string) => {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/refresh");
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;
    const status = error.response?.status;

    if (!originalRequest) return Promise.reject(error);

    if (status === 401 && !originalRequest._retry && !isAuthRequest(originalRequest.url)) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await refreshClient.post("/auth/refresh", null, { withCredentials: true });
          onRefreshed(true);
        } catch (refreshError) {
          onRefreshed(false);
          store.dispatch(logout());
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((success) => {
          if (success) {
            resolve(apiClient(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    const apiError: ApiError = {
      message: error.response?.data?.message || error.message,
      status,
    };

    return Promise.reject(apiError);
  }
);
