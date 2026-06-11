import { STORAGE_KEYS } from "@web/common/constants/storage.constants";

/**
 * Utility for persisting the calendar's selected start-of-week.
 * Keeps the viewed week stable across page refreshes and re-renders.
 *
 * The value is stored as an ISO date string (the start of the week).
 */

const isValidDateString = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

/**
 * Get the persisted start-of-week ISO string from localStorage.
 * Returns null if not found or invalid.
 */
export function getStoredWeekStart(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WEEK);
    if (isValidDateString(stored)) {
      return stored;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Persist the start-of-week ISO string to localStorage.
 * Silently ignores invalid input or storage errors.
 */
export function setStoredWeekStart(start: string): void {
  if (typeof window === "undefined") return;
  if (!isValidDateString(start)) return;

  try {
    localStorage.setItem(STORAGE_KEYS.WEEK, start);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Remove the persisted start-of-week from localStorage.
 */
export function clearStoredWeekStart(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.WEEK);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
