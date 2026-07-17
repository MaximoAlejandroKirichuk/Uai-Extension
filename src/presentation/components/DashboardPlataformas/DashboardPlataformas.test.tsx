import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardPlataformas } from "./DashboardPlataformas";
import { fetchPlataformas, setError, setLoading } from "../../../store/slices/plataforma/plataforma";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";

const { useDeleteConfirmationMock } = vi.hoisted(() => ({
  useDeleteConfirmationMock: vi.fn(),
}));

let mockState = {
  plataformas: {
    plataformas: [
      {
        id: "pl-1",
        nombrePlataforma: "Plataforma Prueba",
        descripcion: "Descripción de prueba",
        contacto: "contacto@example.com",
        tipoPlataforma: "Marketplace",
        industria: "Innovación",
        etapaCubre: "Seed",
        montoPromedio: "USD 50k",
        requisitosAcceso: "Registro",
        costoComision: "5%",
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
  selectedItem: mockState.plataformas.plataformas[0],
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

describe("DashboardPlataformas", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mockState = {
      plataformas: {
        plataformas: [
          {
            id: "pl-1",
            nombrePlataforma: "Plataforma Prueba",
            descripcion: "Descripción de prueba",
            contacto: "contacto@example.com",
            tipoPlataforma: "Marketplace",
            industria: "Innovación",
            etapaCubre: "Seed",
            montoPromedio: "USD 50k",
            requisitosAcceso: "Registro",
            costoComision: "5%",
            algoritmo: "Sí",
          },
        ],
        loading: false,
        error: null,
      },
    };
    deleteHookState.selectedItem = mockState.plataformas.plataformas[0];
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
    render(<DashboardPlataformas />);

    expect(screen.getByRole("heading", { name: /dashboard de plataformas/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the shared realtime and delete hook contracts", () => {
    render(<DashboardPlataformas />);

    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "plataformas",
        action: fetchPlataformas,
        setLoadingAction: setLoading,
        setErrorAction: setError,
        errorMessage: "No se pudieron cargar los registros.",
      })
    );

    expect(useDeleteConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "plataformas",
        getId: expect.any(Function),
        onSuccessMessage: "Plataforma eliminada correctamente.",
        onErrorMessage: "Error al eliminar la plataforma.",
      })
    );
  });

  it("renders the loading state while fetching data", () => {
    mockState.plataformas.loading = true;
    mockState.plataformas.plataformas = [];

    render(<DashboardPlataformas />);

    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
  });

  it("renders the empty state when there are no records", () => {
    mockState.plataformas.plataformas = [];

    render(<DashboardPlataformas />);

    expect(screen.getByRole("heading", { name: /no se encontraron registros/i })).toBeInTheDocument();
  });

  it("renders the error state on failure without exposing technical details", () => {
    mockState.plataformas.error = "network error";

    render(<DashboardPlataformas />);

    expect(screen.getByRole("heading", { name: /no se pudieron cargar los registros/i })).toBeInTheDocument();
    expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
  });

  it("wires delete confirmation through the hook seam", async () => {
    const user = userEvent.setup();

    render(<DashboardPlataformas />);

    await user.click(screen.getByRole("button", { name: /eliminar plataforma prueba/i }));

    expect(requestDelete).toHaveBeenCalledWith("pl-1");
    expect(screen.getByRole("dialog", { name: /eliminar plataforma prueba/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(cancelDelete).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));
    expect(confirmDelete).toHaveBeenCalledTimes(1);
  });
});
