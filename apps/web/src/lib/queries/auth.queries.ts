"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginDto, RegisterDto } from "@2care/schemas";
import type { AuthResponse, ApiError } from "@2care/types";
import { authService, tokenStore } from "@/lib/api";
import { queryKeys } from "./keys";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginDto>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      tokenStore.set(data.accessToken);
      queryClient.setQueryData(queryKeys.users.me(), data.user);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, RegisterDto>({
    mutationFn: authService.register,
    onSuccess: (data) => {
      tokenStore.set(data.accessToken);
      queryClient.setQueryData(queryKeys.users.me(), data.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: authService.logout,
    onSettled: () => {
      tokenStore.clear();
      queryClient.clear();
    },
  });
}
