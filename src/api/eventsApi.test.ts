import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventsApiError, getEvent, getEvents } from "./eventsApi";

const fetchMock = vi.fn();

const setApiUrl = (value?: string) => {
  vi.stubEnv("VITE_API_URL", value);
};

const okJson = (body: unknown) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as Response);

describe("eventsApi", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    setApiUrl("http://localhost:3000/api/");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("requests GET /api/events without auth headers or query parameters when base URL includes /api", async () => {
    fetchMock.mockResolvedValue(okJson([]));

    await expect(getEvents()).resolves.toEqual([]);

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/events", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    expect(fetchMock.mock.calls[0][0]).not.toContain("?");
    expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty("Authorization");
  });

  it("requests GET /api/events when base URL is the backend root", async () => {
    setApiUrl("http://localhost:3000");
    fetchMock.mockResolvedValue(okJson([]));

    await getEvents();

    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:3000/api/events");
  });

  it("requests GET /events/:id with an encoded id", async () => {
    fetchMock.mockResolvedValue(okJson({ id: "event id", nombre: "Demo" }));

    await getEvent("event id");

    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:3000/api/events/event%20id");
    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
  });

  it("maps 404 responses to an EventsApiError", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 } as Response);

    await expect(getEvent("missing")).rejects.toMatchObject({ status: 404 });
  });

  it("maps non-OK responses to an EventsApiError", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 } as Response);

    await expect(getEvents()).rejects.toBeInstanceOf(EventsApiError);
  });

  it("throws a client configuration error before calling fetch when VITE_API_URL is missing", async () => {
    setApiUrl(undefined);

    await expect(getEvents()).rejects.toThrow(/VITE_API_URL/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
