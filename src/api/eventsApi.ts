import type { ApiEvent } from "../core/entities/eventoEndeavor.entity";

export class EventsApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "EventsApiError";
  }
}

const getBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL;

  if (!baseUrl) {
    throw new EventsApiError("VITE_API_URL is not configured.");
  }

  return baseUrl.replace(/\/+$/, "").replace(/\/api$/i, "");
};

const readJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    throw new EventsApiError("Event not found.", 404);
  }

  if (!response.ok) {
    throw new EventsApiError("Events API request failed.", response.status);
  }

  return response.json() as Promise<T>;
};

export const getEvents = () => readJson<ApiEvent[]>("/api/events");

export const getEvent = (id: string) => readJson<ApiEvent>(`/api/events/${encodeURIComponent(id)}`);
