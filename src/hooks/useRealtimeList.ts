import { useEffect } from "react";
import type { AnyAction } from "@reduxjs/toolkit";
import { ref, onValue, DataSnapshot } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
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
    const listRef = ref(database, path);

    const unsubscribe = onValue(
      listRef,
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          const items = Object.entries(data).map(([id, value]) => {
            if (mapItem) {
              return mapItem(value, id);
            }
            return {
              ...(value ?? {}),
              id,
            } as T;
          });

          dispatch(action(items));
        } else {
          dispatch(action([]));
        }
      },
      (error) => {
        if (errorLabel) {
          console.error(`Error al obtener ${errorLabel}:`, error);
          return;
        }
        console.error(`Error reading ${path}:`, error);
      }
    );

    return () => unsubscribe();
  }, [action, dispatch, errorLabel, mapItem, path]);
};
