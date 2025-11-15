export const FEEDING_TYPES = {
  BOTTLE: "Bottle",
  BREAST_LEFT: "Left Breast",
  BREAST_RIGHT: "Right Breast",
  BOTH_BREASTS: "Both Breasts",
  SOLID: "Solid Food",
} as const;

export const DIAPER_TYPES = {
  WET: "Wet",
  DIRTY: "Dirty",
  BOTH: "Both",
  DRY: "Dry",
} as const;

export const ACTIVITY_TYPES = {
  FEEDING: "Feeding",
  DIAPER_CHANGE: "Diaper Change",
  SLEEP: "Sleep",
  GROWTH: "Growth",
  MEDICATION: "Medication",
  MILESTONE: "Milestone",
  NOTE: "Note",
} as const;

export const FAMILY_ROLES = {
  PRIMARY_PARENT: "Primary Parent",
  CO_PARENT: "Co-Parent",
  CAREGIVER: "Caregiver",
  VIEWER: "Viewer",
} as const;
