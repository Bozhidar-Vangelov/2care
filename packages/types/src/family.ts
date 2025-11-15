import type { User } from "./user";

export interface Family {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  familyId: string;
  role: "PRIMARY_PARENT" | "CO_PARENT" | "CAREGIVER" | "VIEWER";
  createdAt: string;
  user?: User;
  family?: Family;
}
