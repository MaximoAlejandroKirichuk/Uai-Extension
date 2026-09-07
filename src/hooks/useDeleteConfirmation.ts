import { useCallback, useMemo, useState } from "react";
import { deleteRealtimeRecord } from "../firebase/realtimeRepository";

interface UseDeleteConfirmationOptions<T> {
  path: string;
  items: T[];
  getId: (item: T) => string;
  canWrite: boolean;
  onSuccessMessage: string;
  onErrorMessage: string;
  readonlyErrorMessage?: string;
}

export const useDeleteConfirmation = <T,>(options: UseDeleteConfirmationOptions<T>) => {
  const {
    canWrite,
    getId,
    items,
    onErrorMessage,
    onSuccessMessage,
    path,
    readonlyErrorMessage = "This session is read-only. Changes are disabled.",
  } = options;
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

      if (!canWrite) {
        setPendingDeleteId(null);
        setError(readonlyErrorMessage);
        return;
      }

      setPendingDeleteId(id);
      setError(null);
    },
    [canWrite, isDeleting, readonlyErrorMessage]
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

    if (!canWrite) {
      setError(readonlyErrorMessage);
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteRealtimeRecord(path, pendingDeleteId, { canWrite });
      setPendingDeleteId(null);
      alert(onSuccessMessage);
    } catch (deleteError) {
      console.error(`Error deleting ${path}:`, deleteError);
      setError(onErrorMessage);
      alert(onErrorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [canWrite, isDeleting, onErrorMessage, onSuccessMessage, pendingDeleteId, path, readonlyErrorMessage]);

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
