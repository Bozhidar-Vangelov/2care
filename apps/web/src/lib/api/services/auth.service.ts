import type { LoginDto, RegisterDto } from "@2care/schemas";
import type { AuthResponse } from "@2care/types";
import { apiClient } from "../client";

/**
 * Auth service — all calls go to Next.js Route Handlers (/api/auth/*) which
 * proxy to NestJS and manage the httpOnly refresh_token cookie server-side.
 */
export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post<AuthResponse>("/api/auth/login", data);
    return response;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post<AuthResponse>("/api/auth/register", data);
    return response;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/api/auth/logout");
  },

  /**
   * Silent token refresh — the Route Handler reads the httpOnly
   * refresh_token cookie automatically, no manual token passing needed.
   */
  refresh: async (): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post<AuthResponse>("/api/auth/refresh");
    return response;
  },
};
