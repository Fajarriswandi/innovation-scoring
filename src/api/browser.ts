// src/api/browser.ts
import axios, { AxiosError, AxiosInstance } from "axios";

const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 15000);
const devProxyBase = import.meta.env.VITE_API_DEV_BASE ?? "/__api";
const baseURL = import.meta.env.DEV
  ? devProxyBase
  : (import.meta.env.VITE_API_BASE_URL as string);

// Bisa pakai Bearer dari env (dev) atau dari Redux/Storage di kemudian hari
export const API_BASE_URL = baseURL;
export const getApiAuthToken = () => {
  const token = import.meta.env.VITE_API_TOKEN; // optional
  return token ? `Bearer ${token}` : undefined;
};

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // withCredentials: true, // aktifkan jika BE butuh cookie
});

// Request interceptor (tambahkan auth header jika ada)
api.interceptors.request.use((config) => {
  const auth = getApiAuthToken();
  if (auth) config.headers.Authorization = auth;
  return config;
});

// Response interceptor (normalisasi error)
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    // Contoh logging dev
    const suppressLog = Boolean(err.config?.headers?.['x-suppress-error-log']);
    if (import.meta.env.DEV && !suppressLog) {
      console.error("[API ERROR]", {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
    return Promise.reject(err);
  }
);

export default api;
