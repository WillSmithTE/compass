import { STORAGE_KEYS } from "@web/common/constants/storage.constants";
import {
  clearStoredWeekStart,
  getStoredWeekStart,
  setStoredWeekStart,
} from "./week-state.util";

describe("week-state.util", () => {
  const weekStart = "2024-01-07T00:00:00-05:00";

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("getStoredWeekStart", () => {
    it("should return null when no value is stored", () => {
      expect(getStoredWeekStart()).toBeNull();
    });

    it("should return the stored value", () => {
      localStorage.setItem(STORAGE_KEYS.WEEK, weekStart);
      expect(getStoredWeekStart()).toBe(weekStart);
    });

    it("should return null for an invalid date string", () => {
      localStorage.setItem(STORAGE_KEYS.WEEK, "not-a-date");
      expect(getStoredWeekStart()).toBeNull();
    });

    it("should handle localStorage errors gracefully", () => {
      const getItemSpy = jest
        .spyOn(Storage.prototype, "getItem")
        .mockImplementation(() => {
          throw new Error("localStorage not available");
        });

      expect(getStoredWeekStart()).toBeNull();

      getItemSpy.mockRestore();
    });
  });

  describe("setStoredWeekStart", () => {
    it("should persist a valid date string", () => {
      setStoredWeekStart(weekStart);
      expect(localStorage.getItem(STORAGE_KEYS.WEEK)).toBe(weekStart);
    });

    it("should ignore an invalid date string", () => {
      setStoredWeekStart("not-a-date");
      expect(localStorage.getItem(STORAGE_KEYS.WEEK)).toBeNull();
    });

    it("should handle localStorage errors gracefully", () => {
      const setItemSpy = jest
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage quota exceeded");
        });

      expect(() => setStoredWeekStart(weekStart)).not.toThrow();

      setItemSpy.mockRestore();
    });
  });

  describe("clearStoredWeekStart", () => {
    it("should remove the stored value", () => {
      setStoredWeekStart(weekStart);
      clearStoredWeekStart();
      expect(localStorage.getItem(STORAGE_KEYS.WEEK)).toBeNull();
    });

    it("should handle localStorage errors gracefully", () => {
      const removeItemSpy = jest
        .spyOn(Storage.prototype, "removeItem")
        .mockImplementation(() => {
          throw new Error("localStorage not available");
        });

      expect(() => clearStoredWeekStart()).not.toThrow();

      removeItemSpy.mockRestore();
    });
  });

  describe("integration", () => {
    it("should round-trip the selected start of week", () => {
      expect(getStoredWeekStart()).toBeNull();

      setStoredWeekStart(weekStart);
      expect(getStoredWeekStart()).toBe(weekStart);

      clearStoredWeekStart();
      expect(getStoredWeekStart()).toBeNull();
    });
  });
});
