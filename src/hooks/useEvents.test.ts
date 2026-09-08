import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useEvents } from "./useEvents";

const { getEventsMock } = vi.hoisted(() => ({
  getEventsMock: vi.fn(),
}));

vi.mock("../api/eventsApi", () => ({
  getEvents: getEventsMock,
}));

describe("useEvents", () => {
  afterEach(() => {
    getEventsMock.mockReset();
  });

  it("starts in loading state", () => {
    getEventsMock.mockReturnValue(new Promise(() => undefined));

    const { result } = renderHook(() => useEvents());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.events).toEqual([]);
  });

  it("returns success state for loaded events", async () => {
    getEventsMock.mockResolvedValue([{ id: "1", nombre: "Demo event" }]);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.events).toEqual([{ id: "1", nombre: "Demo event" }]);
    expect(result.current.error).toBeNull();
  });

  it("returns empty success state when the API returns no events", async () => {
    getEventsMock.mockResolvedValue([]);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("returns error state when loading fails", async () => {
    getEventsMock.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("No se pudieron cargar los eventos.");
    expect(result.current.events).toEqual([]);
  });
});
