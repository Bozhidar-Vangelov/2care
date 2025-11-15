import { z } from "zod";

export const createBabySchema = z.object({
  name: z.string().min(1, "Baby name is required"),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  familyId: z.string().uuid(),
});

export const updateBabySchema = z.object({
  name: z.string().min(1).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  photoUrl: z.string().url().optional(),
});

export type CreateBabyDto = z.infer<typeof createBabySchema>;
export type UpdateBabyDto = z.infer<typeof updateBabySchema>;
