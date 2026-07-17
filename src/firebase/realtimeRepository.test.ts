import { describe, expect, it, vi, beforeEach } from "vitest";
import { createRealtimeRecord, deleteRealtimeRecord, subscribeToRealtimeList } from "./realtimeRepository";

const mocks = vi.hoisted(() => {
  const databaseMock = { key: "mock-database" };
  const refMock = vi.fn();
  const pushMock = vi.fn();
  const removeMock = vi.fn();
  const onValueMock = vi.fn();
  const unsubscribeMock = vi.fn();

  return {
    databaseMock,
    refMock,
    pushMock,
    removeMock,
    onValueMock,
    unsubscribeMock,
  };
});

vi.mock("./firebaseConfig", () => ({
  database: mocks.databaseMock,
}));

vi.mock("firebase/database", () => ({
  ref: mocks.refMock,
  push: mocks.pushMock,
  remove: mocks.removeMock,
  onValue: mocks.onValueMock,
}));

describe("realtimeRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.refMock.mockImplementation((database: unknown, path: string) => ({ database, path }));
    mocks.pushMock.mockResolvedValue(undefined);
    mocks.removeMock.mockResolvedValue(undefined);
    mocks.onValueMock.mockImplementation(() => mocks.unsubscribeMock);
  });

  it("creates a realtime record at the requested path", async () => {
    await createRealtimeRecord("universidades", { nombre: "Universidad Prueba" });

    expect(mocks.refMock).toHaveBeenCalledWith(mocks.databaseMock, "universidades");
    expect(mocks.pushMock).toHaveBeenCalledWith(
      { database: mocks.databaseMock, path: "universidades" },
      { nombre: "Universidad Prueba" }
    );
  });

  it("deletes a realtime record from the requested path", async () => {
    await deleteRealtimeRecord("universidades", "uni-1");

    expect(mocks.refMock).toHaveBeenCalledWith(mocks.databaseMock, "universidades/uni-1");
    expect(mocks.removeMock).toHaveBeenCalledWith({
      database: mocks.databaseMock,
      path: "universidades/uni-1",
    });
  });

  it("subscribes to a list and maps snapshot values into items", () => {
    const onData = vi.fn();
    let successHandler: ((snapshot: { val: () => unknown }) => void) | undefined;

    mocks.onValueMock.mockImplementation((_, success) => {
      successHandler = success;
      return mocks.unsubscribeMock;
    });

    const unsubscribe = subscribeToRealtimeList({
      path: "incubadoras",
      onData,
    });

    expect(mocks.refMock).toHaveBeenCalledWith(mocks.databaseMock, "incubadoras");
    expect(unsubscribe).toBe(mocks.unsubscribeMock);

    successHandler?.({
      val: () => ({
        "inc-1": {
          nombre: "Incubadora Prueba",
          provincia: "Buenos Aires",
        },
      }),
    });

    expect(onData).toHaveBeenCalledWith([
      {
        id: "inc-1",
        nombre: "Incubadora Prueba",
        provincia: "Buenos Aires",
      },
    ]);
  });

  it("uses custom mapItem when provided", () => {
    const onData = vi.fn();
    let successHandler: ((snapshot: { val: () => unknown }) => void) | undefined;

    mocks.onValueMock.mockImplementation((_, success) => {
      successHandler = success;
      return mocks.unsubscribeMock;
    });

    subscribeToRealtimeList({
      path: "universidades",
      onData,
      mapItem: (value, id) => ({
        customId: id,
        displayName: (value as Record<string, unknown>).nombre,
      }),
    });

    successHandler?.({
      val: () => ({
        "uni-1": { nombre: "UBA" },
      }),
    });

    expect(onData).toHaveBeenCalledWith([
      { customId: "uni-1", displayName: "UBA" },
    ]);
  });

  it("calls onData with an empty array when snapshot has no value", () => {
    const onData = vi.fn();
    let successHandler: ((snapshot: { val: () => unknown }) => void) | undefined;

    mocks.onValueMock.mockImplementation((_, success) => {
      successHandler = success;
      return mocks.unsubscribeMock;
    });

    subscribeToRealtimeList({
      path: "capitalVentures",
      onData,
    });

    successHandler?.({ val: () => null });

    expect(onData).toHaveBeenCalledWith([]);
  });

  it("calls onError when the subscription errors and an error handler is provided", () => {
    const onData = vi.fn();
    const onError = vi.fn();
    const testError = new Error("Connection lost");
    let errorHandler: ((error: unknown) => void) | undefined;

    mocks.onValueMock.mockImplementation((_, _success, error) => {
      errorHandler = error;
      return mocks.unsubscribeMock;
    });

    subscribeToRealtimeList({
      path: "plataformas",
      onData,
      onError,
    });

    errorHandler?.(testError);

    expect(onError).toHaveBeenCalledWith(testError);
    expect(onData).not.toHaveBeenCalled();
  });
});
