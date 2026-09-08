import { useEffect, useState } from "react";
import { getEvents } from "../api/eventsApi";
import type { ApiEvent } from "../core/entities/eventoEndeavor.entity";

interface EventsState {
  events: ApiEvent[];
  loading: boolean;
  error: string | null;
}

export const useEvents = (): EventsState => {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getEvents();
        if (active) {
          setEvents(result);
        }
      } catch {
        if (active) {
          setError("No se pudieron cargar los eventos.");
          setEvents([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      active = false;
    };
  }, []);

  return { events, loading, error };
};
