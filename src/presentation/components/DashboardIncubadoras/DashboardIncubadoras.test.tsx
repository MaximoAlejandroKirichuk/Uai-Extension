import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { DashboardIncubadoras } from "./DashboardIncubadoras";
import {
  fetchIncubadoras,
  setError,
  setLoading,
} from "../../../store/slices/incubadoras/incubadorasSlice";
import type { RealtimeSubscribeOptions } from "../../../firebase/realtimeRepository";
import type { Incubadora } from "../../../core/entities/incubadora.entity";

const { subscribeToRealtimeList } = vi.hoisted(() => ({
  subscribeToRealtimeList: vi.fn(),
}));

let mockState = {
  incubadoras: {
    incubadoras: [
      {
        id: "in-1",
        nroInscripcion: "1",
        cuit: "20-12345678-9",
        nombre: "Incubadora Prueba",
        provincia: "Buenos Aires",
        localidad: "La Plata",
        direccion: "Calle 1",
        nombreResponsable: "Responsable Prueba",
        emailResponsable: "responsable@example.com",
        telefonoResponsable: "123456789",
      },
    ],
    loading: false,
    error: null as string | null,
  },
};

const mockDispatch = vi.fn();

vi.mock("../../../hooks/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

vi.mock("../../../firebase/realtimeRepository", () => ({
  subscribeToRealtimeList,
}));

const UNSORTED: Incubadora[] = [
  { id: "b", nroInscripcion: "10", cuit: "-", nombre: "B", provincia: "-", localidad: "-", direccion: "-", nombreResponsable: "-", emailResponsable: "-", telefonoResponsable: "-" },
  { id: "a", nroInscripcion: "2", cuit: "-", nombre: "A", provincia: "-", localidad: "-", direccion: "-", nombreResponsable: "-", emailResponsable: "-", telefonoResponsable: "-" },
  { id: "c", nroInscripcion: "5", cuit: "-", nombre: "C", provincia: "-", localidad: "-", direccion: "-", nombreResponsable: "-", emailResponsable: "-", telefonoResponsable: "-" },
];

describe("DashboardIncubadoras", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mockState = {
      incubadoras: {
        incubadoras: [
          {
            id: "in-1",
            nroInscripcion: "1",
            cuit: "20-12345678-9",
            nombre: "Incubadora Prueba",
            provincia: "Buenos Aires",
            localidad: "La Plata",
            direccion: "Calle 1",
            nombreResponsable: "Responsable Prueba",
            emailResponsable: "responsable@example.com",
            telefonoResponsable: "123456789",
          },
        ],
        loading: false,
        error: null,
      },
    };
    mockDispatch.mockClear();
    vi.clearAllMocks();
    subscribeToRealtimeList.mockReturnValue(vi.fn());
  });

  const mountAndCaptureCallbacks = () => {
    render(<DashboardIncubadoras />);

    const calls = (subscribeToRealtimeList as Mock).mock.calls;
    const lastCall = calls[calls.length - 1]?.[0] as
      | RealtimeSubscribeOptions<Incubadora>
      | undefined;

    if (!lastCall) {
      throw new Error("subscribeToRealtimeList was not called");
    }

    return { onData: lastCall.onData, onError: lastCall.onError! };
  };

  it("renders the shared section header and table layout", () => {
    render(<DashboardIncubadoras />);

    expect(screen.getByRole("heading", { name: /dashboard de incubadoras/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /incubadora prueba/i })).toBeInTheDocument();
  });

  it("uses the repository subscription helper for the incubadoras path", () => {
    render(<DashboardIncubadoras />);

    expect(subscribeToRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "incubadoras",
        onData: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it("sorts incoming items by nroInscripcion before dispatching", () => {
    const { onData } = mountAndCaptureCallbacks();
    mockDispatch.mockClear();

    onData(UNSORTED);

    expect(mockDispatch).toHaveBeenCalledWith(
      fetchIncubadoras([
        UNSORTED[1], // nro 2
        UNSORTED[2], // nro 5
        UNSORTED[0], // nro 10
      ])
    );
  });

  it("dispatches loading and error updates on subscription error", () => {
    const { onError } = mountAndCaptureCallbacks();
    mockDispatch.mockClear();

    onError(new Error("connection refused"));

    expect(mockDispatch).toHaveBeenCalledWith(
      setError("No se pudieron cargar las incubadoras.")
    );
    expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
  });

  it("renders the loading state while fetching data", () => {
    mockState.incubadoras.loading = true;
    mockState.incubadoras.incubadoras = [];

    render(<DashboardIncubadoras />);

    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
  });

  it("renders the empty state when there are no records", () => {
    mockState.incubadoras.incubadoras = [];

    render(<DashboardIncubadoras />);

    expect(screen.getByRole("heading", { name: /no se encontraron incubadoras/i })).toBeInTheDocument();
  });

  it("renders the error state on failure without exposing technical details", () => {
    mockState.incubadoras.error = "network error";

    render(<DashboardIncubadoras />);

    expect(screen.getByRole("heading", { name: /no se pudieron cargar las incubadoras/i })).toBeInTheDocument();
    expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
  });
});
