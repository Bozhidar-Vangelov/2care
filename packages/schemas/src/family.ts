import { z } from "zod";

export const createFamilySchema = z.object({
  name: z.string().min(1, "Family name is required"),
});

export const joinFamilySchema = z.object({
  inviteCode: z.string().length(8, "Invalid invite code"),
});

export type CreateFamilyDto = z.infer<typeof createFamilySchema>;
export type JoinFamilyDto = z.infer<typeof joinFamilySchema>;
