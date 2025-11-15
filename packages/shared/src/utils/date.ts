import { formatDistanceToNow, format, differenceInDays, differenceInMonths } from "date-fns";

export function formatTimeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function calculateAge(birthDate: Date | string): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
} {
  const birth = new Date(birthDate);
  const now = new Date();

  const totalDays = differenceInDays(now, birth);
  const totalMonths = differenceInMonths(now, birth);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const days = totalDays % 30; // Approximate

  return { years, months, days, totalDays };
}

export function formatAge(birthDate: Date | string): string {
  const age = calculateAge(birthDate);

  if (age.totalDays < 30) {
    return `${age.totalDays} day${age.totalDays !== 1 ? "s" : ""} old`;
  } else if (age.totalDays < 365) {
    return `${age.months} month${age.months !== 1 ? "s" : ""} old`;
  } else if (age.months === 0) {
    return `${age.years} year${age.years !== 1 ? "s" : ""} old`;
  } else {
    return `${age.years}y ${age.months}mo`;
  }
}
