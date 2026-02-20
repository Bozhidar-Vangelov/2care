import type { Baby } from "./baby";
import type { User } from "./user";

export type ActivityType =
  | "FEEDING"
  | "DIAPER_CHANGE"
  | "SLEEP"
  | "GROWTH"
  | "MEDICATION"
  | "MILESTONE"
  | "NOTE";

export interface Activity {
  id: string;
  type: ActivityType;
  babyId: string;
  userId: string;
  timestamp: Date;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  baby?: Baby;
  user?: User;
}
