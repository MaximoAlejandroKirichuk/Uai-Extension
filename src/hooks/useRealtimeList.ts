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

  useEffect(() => {
    const listRef = ref(database, options.path);

    const unsubscribe = onValue(
      listRef,
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          const items = Object.entries(data).map(([id, value]) => {
            if (options.mapItem) {
              return options.mapItem(value, id);
            }
            return {
              ...(value ?? {}),
              id,
            } as T;
          });

          dispatch(options.action(items));
        } else {
          dispatch(options.action([]));
        }
      },
      (error) => {
        if (options.errorLabel) {
          console.error(`Error al obtener ${options.errorLabel}:`, error);
          return;
        }
        console.error(`Error reading ${options.path}:`, error);
      }
    );

    return () => unsubscribe();
  }, [dispatch, options.action, options.errorLabel, options.mapItem, options.path]);
};
