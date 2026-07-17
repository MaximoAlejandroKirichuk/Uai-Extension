import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchUniversidades, setError, setLoading } from "../store/slices/universidades/universidadesSlice";
import { useRealtimeList } from "./useRealtimeList";

const { subscribeToRealtimeList } = vi.hoisted(() => ({
  subscribeToRealtimeList: vi.fn(),
}));

const mockDispatch = vi.fn();

vi.mock("./hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock("../firebase/realtimeRepository", () => ({
  subscribeToRealtimeList,
}));

describe("useRealtimeList", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    mockDispatch.mockClear();
    subscribeToRealtimeList.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("sets loading and clears stale errors before subscribing, then dispatches transformed items", async () => {
    const unsubscribe = vi.fn();
    subscribeToRealtimeList.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() =>
      useRealtimeList({
        path: "universidades",
        action: fetchUniversidades,
        setLoadingAction: setLoading,
        setErrorAction: setError,
        errorMessage: "No se pudieron cargar las universidades.",
        transformItems: (items) => [...items].reverse(),
      })
    );

    await waitFor(() => expect(subscribeToRealtimeList).toHaveBeenCalled());

    expect(mockDispatch).toHaveBeenNthCalledWith(1, setLoading(true));
    expect(mockDispatch).toHaveBeenNthCalledWith(2, setError(null));

    const listOptions = subscribeToRealtimeList.mock.calls[0][0] as {
      onData: (items: Array<{ id: string; nombre: string; descripcion: string }>) => void;
    };

    listOptions.onData([
      { id: "1", nombre: "A", descripcion: "A" },
      { id: "2", nombre: "B", descripcion: "B" },
    ]);

    expect(mockDispatch).toHaveBeenCalledWith(
      fetchUniversidades([
        { id: "2", nombre: "B", descripcion: "B" },
        { id: "1", nombre: "A", descripcion: "A" },
      ])
    );

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("dispatches the shared error state when the subscription fails", async () => {
    subscribeToRealtimeList.mockImplementation((options) => options.onError?.(new Error("offline")));

    renderHook(() =>
      useRealtimeList({
        path: "universidades",
        action: fetchUniversidades,
        setLoadingAction: setLoading,
        setErrorAction: setError,
        errorMessage: "No se pudieron cargar las universidades.",
      })
    );

    await waitFor(() => expect(subscribeToRealtimeList).toHaveBeenCalled());

    expect(mockDispatch).toHaveBeenNthCalledWith(1, setLoading(true));
    expect(mockDispatch).toHaveBeenNthCalledWith(2, setError(null));
    expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    expect(mockDispatch).toHaveBeenCalledWith(setError("No se pudieron cargar las universidades."));
  });
});
