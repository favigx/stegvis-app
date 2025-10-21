import axios, { type AxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { apiClient, type ApiError } from "./apiClient";

// 🔹 Separat instans för refresh, för att undvika interceptor-loop
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

// Helper: Kontrollera om det är login/refresh request
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

    // 🔹 Hantera 401 och inte redan retry:ad
    if (status === 401 && !originalRequest._retry && !isAuthRequest(originalRequest.url)) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Refresh-anropet returnerar ny HttpOnly-cookie
          await refreshClient.post("/auth/refresh", null, { withCredentials: true });
          onRefreshed(true); // alla väntande requests fortsätter
        } catch (refreshError) {
          onRefreshed(false); // alla väntande requests misslyckas
          store.dispatch(logout()); // logga ut användaren
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Vänta tills refresh är klar, kör sedan om originalRequest
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
