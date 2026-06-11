import { act } from "react";
import dayjs from "@core/util/date/dayjs";
import { renderHook } from "@web/__tests__/__mocks__/mock.render";
import { STORAGE_KEYS } from "@web/common/constants/storage.constants";
import { useWeek } from "@web/views/Calendar/hooks/useWeek";

describe("useWeek persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists the start of view to localStorage when the week changes", () => {
    const today = dayjs("2024-01-15");
    const { result } = renderHook(() => useWeek(today));

    act(() => {
      result.current.util.incrementWeek();
    });

    const expectedStart = today.startOf("week").add(7, "day");
    const stored = localStorage.getItem(STORAGE_KEYS.WEEK_START);

    expect(stored).not.toBeNull();
    expect(dayjs(stored as string).startOf("week").format()).toBe(
      expectedStart.startOf("week").format(),
    );
  });

  it("restores the persisted start of view on mount", () => {
    const today = dayjs("2024-01-15");
    const persistedStart = today.startOf("week").add(14, "day");
    localStorage.setItem(STORAGE_KEYS.WEEK_START, persistedStart.format());

    const { result } = renderHook(() => useWeek(today));

    expect(result.current.component.startOfView.format()).toBe(
      persistedStart.startOf("week").format(),
    );
  });

  it("falls back to the current week when nothing is persisted", () => {
    const today = dayjs("2024-01-15");
    const { result } = renderHook(() => useWeek(today));

    expect(result.current.component.startOfView.format()).toBe(
      today.startOf("week").format(),
    );
  });

  it("falls back to the current week when the persisted value is invalid", () => {
    const today = dayjs("2024-01-15");
    localStorage.setItem(STORAGE_KEYS.WEEK_START, "not-a-date");

    const { result } = renderHook(() => useWeek(today));

    expect(result.current.component.startOfView.format()).toBe(
      today.startOf("week").format(),
    );
  });
});
