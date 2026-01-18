import type { FAMILY_ROLES } from "@2care/shared/constants";
import type { User } from "./user";

export interface Family {
  id: string;
  name: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyMember {
  id: string;
  userId: string;
  familyId: string;
  role: keyof typeof FAMILY_ROLES;
  createdAt: Date;
  user?: User;
  family?: Family;
}
