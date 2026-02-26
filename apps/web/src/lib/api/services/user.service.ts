import type { User } from "@2care/types";
import { apiClient } from "../client";

/**
 * User service — calls /api/v1/* which Next.js rewrites to NestJS.
 * The Bearer token is automatically attached by the axios request interceptor
 * in client.ts via the in-memory token store.
 */
export const userService = {
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/api/v1/users/me");
    return data;
  },
};
