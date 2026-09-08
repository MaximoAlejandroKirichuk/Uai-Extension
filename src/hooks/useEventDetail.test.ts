import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EventsApiError } from "../api/eventsApi";
import { useEventDetail } from "./useEventDetail";

const { getEventMock } = vi.hoisted(() => ({
  getEventMock: vi.fn(),
}));

vi.mock("../api/eventsApi", async () => {
  const actual = await vi.importActual<typeof import("../api/eventsApi")>("../api/eventsApi");
  return {
    ...actual,
    getEvent: getEventMock,
  };
});

describe("useEventDetail", () => {
  afterEach(() => {
    getEventMock.mockReset();
  });

  it("loads an event by id", async () => {
    getEventMock.mockResolvedValue({ id: "abc", nombre: "Demo event" });

    const { result } = renderHook(() => useEventDetail("abc"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getEventMock).toHaveBeenCalledWith("abc");
    expect(result.current.event).toEqual({ id: "abc", nombre: "Demo event" });
    expect(result.current.error).toBeNull();
    expect(result.current.notFound).toBe(false);
  });

  it("maps 404 errors to not found", async () => {
    getEventMock.mockRejectedValue(new EventsApiError("missing", 404));

    const { result } = renderHook(() => useEventDetail("missing"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notFound).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("maps non-404 failures to error state", async () => {
    getEventMock.mockRejectedValue(new Error("offline"));

    const { result } = renderHook(() => useEventDetail("abc"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("No se pudo cargar el detalle del evento.");
    expect(result.current.notFound).toBe(false);
  });
});
