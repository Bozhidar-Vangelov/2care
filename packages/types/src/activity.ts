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
  timestamp: string;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  baby?: Baby;
  user?: User;
}
