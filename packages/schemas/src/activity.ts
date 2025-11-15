import { z } from "zod";

export const createActivitySchema = z.object({
  type: z.enum(["FEEDING", "DIAPER_CHANGE", "SLEEP", "GROWTH", "MEDICATION", "MILESTONE", "NOTE"]),
  babyId: z.string().uuid(),
  timestamp: z.coerce.date().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateActivityDto = z.infer<typeof createActivitySchema>;
