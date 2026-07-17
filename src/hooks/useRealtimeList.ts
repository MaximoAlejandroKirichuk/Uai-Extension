import { useEffect } from "react";
import type { AnyAction } from "@reduxjs/toolkit";
import { subscribeToRealtimeList } from "../firebase/realtimeRepository";
import { useAppDispatch } from "./hooks";

interface RealtimeListOptions<T> {
  path: string;
  action: (items: T[]) => AnyAction;
  mapItem?: (value: unknown, id: string) => T;
  errorLabel?: string;
}

export const useRealtimeList = <T>(options: RealtimeListOptions<T>) => {
  const dispatch = useAppDispatch();
  const { action, errorLabel, mapItem, path } = options;

  useEffect(() => {
    const unsubscribe = subscribeToRealtimeList<T>({
      path,
      mapItem,
      onData: (items) => {
        dispatch(action(items));
      },
      onError: (error) => {
        if (errorLabel) {
          console.error(`Error al obtener ${errorLabel}:`, error);
          return;
        }

        console.error(`Error reading ${path}:`, error);
      },
    });

    return () => unsubscribe();
  }, [action, dispatch, errorLabel, mapItem, path]);
};
