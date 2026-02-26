export const queryKeys = {
  users: {
    all: () => ["users"] as const,
    me: () => ["users", "me"] as const,
  },
  auth: {
    all: () => ["auth"] as const,
  },
} as const;
