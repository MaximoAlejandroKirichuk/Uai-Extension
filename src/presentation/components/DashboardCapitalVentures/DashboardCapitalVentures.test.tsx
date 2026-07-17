import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardCapitalVentures } from "./DashboardCapitalVentures";
import { fetchCapitalVentures, setError, setLoading } from "../../../store/slices/capitalVentures/capitalVentures";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";

const { useDeleteConfirmationMock } = vi.hoisted(() => ({
  useDeleteConfirmationMock: vi.fn(),
}));

let mockState = {
  capitalVentures: {
    capitalVentures: [
      {
        id: "cv-1",
        nombre: "Capital Venture Prueba",
        sitioWeb: "https://prueba.example",
        comentario: "Comentario de prueba",
        region: "Centro",
        tipoInversion: "Seed",
        foco: "B2B",
        etapa: "Early",
        montoPromedio: "USD 100k",
        perfilBuscado: "SaaS",
        convocatoria: "Abierta",
        algoritmo: "Sí",
      },
    ],
    loading: false,
    error: null as string | null,
  },
};

const requestDelete = vi.fn();
const confirmDelete = vi.fn();
const cancelDelete = vi.fn();

const deleteHookState = {
  selectedItem: mockState.capitalVentures.capitalVentures[0],
  isOpen: true,
  isDeleting: false,
  error: null as string | null,
  requestDelete,
  confirmDelete,
  cancelDelete,
};

vi.mock("../../../hooks/hooks", () => ({
  useAppSelector: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

vi.mock("../../../hooks/useRealtimeList", () => ({
  useRealtimeList: vi.fn(),
}));

vi.mock("../../../hooks/useDeleteConfirmation", () => ({
  useDeleteConfirmation: useDeleteConfirmationMock,
}));

describe("DashboardCapitalVentures", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mockState = {
      capitalVentures: {
        capitalVentures: [
          {
            id: "cv-1",
            nombre: "Capital Venture Prueba",
            sitioWeb: "https://prueba.example",
            comentario: "Comentario de prueba",
            region: "Centro",
            tipoInversion: "Seed",
            foco: "B2B",
            etapa: "Early",
            montoPromedio: "USD 100k",
            perfilBuscado: "SaaS",
            convocatoria: "Abierta",
            algoritmo: "Sí",
          },
        ],
        loading: false,
        error: null,
      },
    };
    deleteHookState.selectedItem = mockState.capitalVentures.capitalVentures[0];
    deleteHookState.isOpen = true;
    deleteHookState.isDeleting = false;
    deleteHookState.error = null;
    requestDelete.mockClear();
    confirmDelete.mockClear();
    cancelDelete.mockClear();
    vi.stubGlobal("alert", vi.fn());
    vi.clearAllMocks();
    useDeleteConfirmationMock.mockReturnValue(deleteHookState);
  });

  it("renders the shared section header and record count", () => {
    render(<DashboardCapitalVentures />);

    expect(screen.getByRole("heading", { name: /dashboard de capital ventures/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the shared realtime and delete hook contracts", () => {
    render(<DashboardCapitalVentures />);

    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "capitalVentures",
        action: fetchCapitalVentures,
        setLoadingAction: setLoading,
        setErrorAction: setError,
        errorMessage: "No se pudieron cargar los registros.",
      })
    );

    expect(useDeleteConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "capitalVentures",
        getId: expect.any(Function),
        onSuccessMessage: "Registro eliminado",
        onErrorMessage: "Error al eliminar",
      })
    );
  });

  it("renders the loading state while fetching data", () => {
    mockState.capitalVentures.loading = true;
    mockState.capitalVentures.capitalVentures = [];

    render(<DashboardCapitalVentures />);

    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
  });

  it("renders the empty state when there are no records", () => {
    mockState.capitalVentures.capitalVentures = [];

    render(<DashboardCapitalVentures />);

    expect(screen.getByRole("heading", { name: /no se encontraron registros/i })).toBeInTheDocument();
  });

  it("renders the error state on failure without exposing technical details", () => {
    mockState.capitalVentures.error = "network error";

    render(<DashboardCapitalVentures />);

    expect(screen.getByRole("heading", { name: /no se pudieron cargar los registros/i })).toBeInTheDocument();
    expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
  });

  it("wires delete confirmation through the hook seam", async () => {
    const user = userEvent.setup();

    render(<DashboardCapitalVentures />);

    await user.click(screen.getByRole("button", { name: /eliminar capital venture prueba/i }));

    expect(requestDelete).toHaveBeenCalledWith("cv-1");
    expect(screen.getByRole("dialog", { name: /eliminar capital venture prueba/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(cancelDelete).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));
    expect(confirmDelete).toHaveBeenCalledTimes(1);
  });
});
