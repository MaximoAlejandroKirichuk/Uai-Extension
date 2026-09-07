import { renderHook, act, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteConfirmation } from "./useDeleteConfirmation";

const { deleteRealtimeRecord } = vi.hoisted(() => ({
  deleteRealtimeRecord: vi.fn(),
}));

vi.mock("../firebase/realtimeRepository", () => ({
  deleteRealtimeRecord,
}));

type Item = {
  id: string;
  name: string;
};

const ITEMS: Item[] = [
  { id: "uni-1", name: "University 1" },
  { id: "uni-2", name: "University 2" },
];

describe("useDeleteConfirmation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    deleteRealtimeRecord.mockReset();
    vi.stubGlobal("alert", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("tracks the selected item and clears the target on cancel", () => {
    const { result } = renderHook(() =>
      useDeleteConfirmation({
        path: "universidades",
        items: ITEMS,
        getId: (item) => item.id,
        canWrite: true,
        onSuccessMessage: "Deleted",
        onErrorMessage: "Delete failed",
      })
    );

    act(() => {
      result.current.requestDelete("uni-1");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedItem).toEqual(ITEMS[0]);

    act(() => {
      result.current.cancelDelete();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedItem).toBeNull();
  });

  it("keeps the pending target stable while delete is in flight and resolves successfully", async () => {
    let resolveDelete: () => void;
    const pendingDelete = new Promise<void>((resolve) => {
      resolveDelete = resolve;
    });

    deleteRealtimeRecord.mockReturnValue(pendingDelete);

    const { result } = renderHook(() =>
      useDeleteConfirmation({
        path: "universidades",
        items: ITEMS,
        getId: (item) => item.id,
        canWrite: true,
        onSuccessMessage: "Deleted",
        onErrorMessage: "Delete failed",
      })
    );

    act(() => {
      result.current.requestDelete("uni-1");
    });

    let confirmPromise: Promise<void>;
    act(() => {
      confirmPromise = result.current.confirmDelete();
    });

    await waitFor(() => expect(result.current.isDeleting).toBe(true));

    act(() => {
      result.current.requestDelete("uni-2");
    });

    expect(result.current.selectedItem).toEqual(ITEMS[0]);
    expect(deleteRealtimeRecord).toHaveBeenCalledWith("universidades", "uni-1", { canWrite: true });

    resolveDelete!();

    await act(async () => {
      await confirmPromise!;
    });

    await waitFor(() => expect(result.current.isDeleting).toBe(false));
    expect(result.current.isOpen).toBe(false);
    expect(window.alert).toHaveBeenCalledWith("Deleted");
  });

  it("keeps the confirmation target visible on failure", async () => {
    deleteRealtimeRecord.mockRejectedValue(new Error("offline"));

    const { result } = renderHook(() =>
      useDeleteConfirmation({
        path: "universidades",
        items: ITEMS,
        getId: (item) => item.id,
        canWrite: true,
        onSuccessMessage: "Deleted",
        onErrorMessage: "Delete failed",
      })
    );

    act(() => {
      result.current.requestDelete("uni-1");
    });

    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedItem).toEqual(ITEMS[0]);
    expect(result.current.error).toBe("Delete failed");
    expect(window.alert).toHaveBeenCalledWith("Delete failed");
  });

  it("blocks read-only delete requests before opening confirmation", () => {
    const { result } = renderHook(() =>
      useDeleteConfirmation({
        path: "universidades",
        items: ITEMS,
        getId: (item) => item.id,
        canWrite: false,
        onSuccessMessage: "Deleted",
        onErrorMessage: "Delete failed",
        readonlyErrorMessage: "Read-only users cannot delete records.",
      })
    );

    act(() => {
      result.current.requestDelete("uni-1");
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.error).toBe("Read-only users cannot delete records.");
    expect(deleteRealtimeRecord).not.toHaveBeenCalled();
  });
});
