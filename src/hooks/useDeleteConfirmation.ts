import { useCallback, useMemo, useState } from "react";
import { deleteRealtimeRecord } from "../firebase/realtimeRepository";

interface UseDeleteConfirmationOptions<T> {
  path: string;
  items: T[];
  getId: (item: T) => string;
  onSuccessMessage: string;
  onErrorMessage: string;
}

export const useDeleteConfirmation = <T,>(options: UseDeleteConfirmationOptions<T>) => {
  const { getId, items, onErrorMessage, onSuccessMessage, path } = options;
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedItem = useMemo(
    () =>
      pendingDeleteId ? items.find((item) => getId(item) === pendingDeleteId) ?? null : null,
    [getId, items, pendingDeleteId]
  );

  const requestDelete = useCallback(
    (id: string) => {
      if (isDeleting) {
        return;
      }

      setPendingDeleteId(id);
      setError(null);
    },
    [isDeleting]
  );

  const cancelDelete = useCallback(() => {
    if (isDeleting) {
      return;
    }

    setPendingDeleteId(null);
    setIsDeleting(false);
    setError(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!pendingDeleteId || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteRealtimeRecord(path, pendingDeleteId);
      setPendingDeleteId(null);
      alert(onSuccessMessage);
    } catch (deleteError) {
      console.error(`Error deleting ${path}:`, deleteError);
      setError(onErrorMessage);
      alert(onErrorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, onErrorMessage, onSuccessMessage, pendingDeleteId, path]);

  return {
    selectedItem,
    isOpen: pendingDeleteId !== null,
    isDeleting,
    error,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
};
