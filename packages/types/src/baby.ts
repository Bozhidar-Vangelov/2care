import type { Family } from "./family";

export interface Baby {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  photoUrl: string | null;
  familyId: string;
  createdAt: string;
  updatedAt: string;
  family?: Family;
}
