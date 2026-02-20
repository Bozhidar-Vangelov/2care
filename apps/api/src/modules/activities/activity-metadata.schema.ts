import { ActivityType } from '@/generated/prisma/client';
import { z } from 'zod';

export const metadataSchema: Record<ActivityType, z.ZodTypeAny> = {
  [ActivityType.FEEDING]: z
    .object({
      amount: z.number().optional(),
      unit: z.string().optional(),
      feedType: z.enum(['breast', 'formula', 'solid']).optional(),
    })
    .strict(),
  [ActivityType.DIAPER_CHANGE]: z
    .object({
      hasUrine: z.boolean().optional(),
      hasBowel: z.boolean().optional(),
      condition: z.string().optional(),
    })
    .strict(),
  [ActivityType.SLEEP]: z
    .object({
      duration: z.number().optional(),
      quality: z.enum(['good', 'fair', 'poor']).optional(),
    })
    .strict(),
  [ActivityType.GROWTH]: z
    .object({
      weight: z.number().optional(),
      height: z.number().optional(),
      headCircumference: z.number().optional(),
    })
    .strict(),
  [ActivityType.MEDICATION]: z
    .object({
      name: z.string().optional(),
      dose: z.number().optional(),
      unit: z.string().optional(),
    })
    .strict(),
  [ActivityType.MILESTONE]: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .strict(),
  [ActivityType.NOTE]: z.record(z.unknown()),
};
