import { useEffect, useState } from "react";
import { EventsApiError, getEvent } from "../api/eventsApi";
import type { ApiEvent } from "../core/entities/eventoEndeavor.entity";

interface EventDetailState {
  event: ApiEvent | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

export const useEventDetail = (id: string | undefined): EventDetailState => {
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const loadEvent = async () => {
      if (!id) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const result = await getEvent(id);
        if (active) {
          setEvent(result);
        }
      } catch (error) {
        if (active) {
          setEvent(null);
          if (error instanceof EventsApiError && error.status === 404) {
            setNotFound(true);
          } else {
            setError("No se pudo cargar el detalle del evento.");
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadEvent();

    return () => {
      active = false;
    };
  }, [id]);

  return { event, loading, error, notFound };
};
