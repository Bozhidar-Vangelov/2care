import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes safely, resolving conflicts in favour of the
 * last class (e.g. `cn('p-4', 'p-2')` → `'p-2'`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
