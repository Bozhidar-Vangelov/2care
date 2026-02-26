import axios from "axios";
import type { AxiosError } from "axios";
import type { ApiError } from "@2care/types";
import { tokenStore } from "./token-store";

export const apiClient = axios.create({
  // Relative base — all requests route through Next.js (rewrites + route handlers)
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
  // Required for the httpOnly refresh_token cookie to be sent automatically
  withCredentials: true,
});

// ── Request interceptor ────────────────────────────────────────────────────
// Attach the in-memory access token as a Bearer header when available.
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ───────────────────────────────────────────────────
// Normalize error shape to ApiError from @2care/types so the query/mutation
// layer always receives a typed error. 401 silent-refresh is handled by the
// query layer (user.queries.ts / onError in QueryProvider), not here.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError | undefined = error.response?.data;
    return Promise.reject(apiError ?? error);
  },
);
