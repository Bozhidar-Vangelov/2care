export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "PARENT" | "ADMIN";
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
