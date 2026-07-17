import { useEffect } from "react";
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { subscribeToRealtimeList } from "../firebase/realtimeRepository";
import { useAppDispatch } from "./hooks";

interface RealtimeListOptions<T> {
  path: string;
  action: ActionCreatorWithPayload<T[]>;
  setLoadingAction?: ActionCreatorWithPayload<boolean>;
  setErrorAction?: ActionCreatorWithPayload<string | null>;
  errorMessage?: string;
  errorLabel?: string;
  mapItem?: (value: unknown, id: string) => T;
  transformItems?: (items: T[]) => T[];
}

export const useRealtimeList = <T>(options: RealtimeListOptions<T>) => {
  const dispatch = useAppDispatch();
  const {
    action,
    errorLabel,
    errorMessage,
    mapItem,
    path,
    setErrorAction,
    setLoadingAction,
    transformItems,
  } = options;

  useEffect(() => {
    if (setLoadingAction) {
      dispatch(setLoadingAction(true));
    }

    if (setErrorAction) {
      dispatch(setErrorAction(null));
    }

    const unsubscribe = subscribeToRealtimeList<T>({
      path,
      mapItem,
      onData: (items) => {
        const nextItems = transformItems ? transformItems(items) : items;

        dispatch(action(nextItems));
      },
      onError: (error) => {
        if (errorLabel) {
          console.error(`Error al obtener ${errorLabel}:`, error);
        } else {
          console.error(`Error reading ${path}:`, error);
        }

        if (setLoadingAction) {
          dispatch(setLoadingAction(false));
        }

        if (setErrorAction && errorMessage) {
          dispatch(setErrorAction(errorMessage));
        }
      },
    });

    return () => unsubscribe();
  }, [action, dispatch, errorLabel, errorMessage, mapItem, path, setErrorAction, setLoadingAction, transformItems]);
};
