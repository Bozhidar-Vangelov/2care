import type { Family } from "./family";

export interface Baby {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  photoUrl: string | null;
  familyId: string;
  createdAt: Date;
  updatedAt: Date;
  family?: Family;
}
