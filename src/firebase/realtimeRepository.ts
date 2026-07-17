import { onValue, push, ref, remove } from "firebase/database";
import type { DataSnapshot } from "firebase/database";
import { database } from "./firebaseConfig";

export type RealtimePath =
  | "universidades"
  | "crowfundings"
  | "capitalVentures"
  | "plataformas"
  | "organismosEstado"
  | "incubadoras";

export interface RealtimeSubscribeOptions<T> {
  path: RealtimePath | string;
  onData: (items: T[]) => void;
  mapItem?: (value: unknown, id: string) => T;
  onError?: (error: unknown) => void;
}

const mapSnapshotValueToItem = <T>(value: unknown, id: string, mapItem?: (value: unknown, id: string) => T) => {
  if (mapItem) {
    return mapItem(value, id);
  }

  return {
    ...((typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>),
    id,
  } as T;
};

export const createRealtimeRecord = async <T>(path: RealtimePath | string, payload: T) => {
  await push(ref(database, path), payload);
};

export const deleteRealtimeRecord = async (path: RealtimePath | string, id: string) => {
  await remove(ref(database, `${path}/${id}`));
};

export const subscribeToRealtimeList = <T>({
  path,
  onData,
  mapItem,
  onError,
}: RealtimeSubscribeOptions<T>) => {
  const listRef = ref(database, path);

  return onValue(
    listRef,
    (snapshot: DataSnapshot) => {
      const data = snapshot.val();

      if (data && typeof data === "object") {
        const items = Object.entries(data as Record<string, unknown>).map(([id, value]) =>
          mapSnapshotValueToItem(value, id, mapItem)
        );

        onData(items);
        return;
      }

      onData([]);
    },
    (error) => {
      if (onError) {
        onError(error);
        return;
      }

      console.error(`Error reading ${path}:`, error);
    }
  );
};
