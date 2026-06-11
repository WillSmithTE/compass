import { z } from "zod";

export const StorageKeySchema = z.enum([
  "compass.reminder",
  "compass.auth",
  "compass.weekStart",
]);

export type StorageKey = z.infer<typeof StorageKeySchema>;

export const STORAGE_KEYS: Record<
  "REMINDER" | "AUTH" | "WEEK_START",
  StorageKey
> = {
  REMINDER: "compass.reminder",
  AUTH: "compass.auth",
  WEEK_START: "compass.weekStart",
} as const;
