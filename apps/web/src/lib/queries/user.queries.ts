"use client";

import { useQuery } from "@tanstack/react-query";
import type { User, ApiError } from "@2care/types";
import { userService } from "@/lib/api";
import { queryKeys } from "./keys";

export function useCurrentUser() {
  return useQuery<User, ApiError>({
    queryKey: queryKeys.users.me(),
    queryFn: userService.getMe,
    staleTime: Infinity,
    retry: (failureCount, error) => {
      if (error?.statusCode === 401 || error?.statusCode === 403) return false;
      return failureCount < 2;
    },
  });
}
