import { z } from "zod";

export const StorageKeySchema = z.enum([
  "compass.reminder",
  "compass.auth",
  "compass.week",
]);

export type StorageKey = z.infer<typeof StorageKeySchema>;

export const STORAGE_KEYS: Record<"REMINDER" | "AUTH" | "WEEK", StorageKey> = {
  REMINDER: "compass.reminder",
  AUTH: "compass.auth",
  WEEK: "compass.week",
} as const;
