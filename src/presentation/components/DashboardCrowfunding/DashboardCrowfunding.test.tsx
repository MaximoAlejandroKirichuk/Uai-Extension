import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardCrowfunding } from "./DashboardCrowfunding";
import { fetchCrowfundings, setError, setLoading } from "../../../store/slices/crowfunding/crowfundingSlice";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";

const { useDeleteConfirmationMock } = vi.hoisted(() => ({
  useDeleteConfirmationMock: vi.fn(),
}));

let mockState = {
  crowfundings: {
    crowfundings: [
      {
        id: "cr-1",
        nombrePlataforma: "Crowdfunding Prueba",
        descripcion: "Descripción de prueba",
        contacto: "contacto@example.com",
        facilidadUso: "Alta",
        comisiones: "5%",
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
  selectedItem: mockState.crowfundings.crowfundings[0],
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

describe("DashboardCrowfunding", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mockState = {
      crowfundings: {
        crowfundings: [
          {
            id: "cr-1",
            nombrePlataforma: "Crowdfunding Prueba",
            descripcion: "Descripción de prueba",
            contacto: "contacto@example.com",
            facilidadUso: "Alta",
            comisiones: "5%",
            algoritmo: "Sí",
          },
        ],
        loading: false,
        error: null,
      },
    };
    deleteHookState.selectedItem = mockState.crowfundings.crowfundings[0];
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
    render(<DashboardCrowfunding />);

    expect(screen.getByRole("heading", { name: /dashboard de proyectos crowfunding/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the shared realtime and delete hook contracts", () => {
    render(<DashboardCrowfunding />);

    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "crowfundings",
        action: fetchCrowfundings,
        setLoadingAction: setLoading,
        setErrorAction: setError,
        errorMessage: "No se pudieron cargar los proyectos.",
      })
    );

    expect(useDeleteConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "crowfundings",
        getId: expect.any(Function),
        onSuccessMessage: "Proyecto eliminado",
        onErrorMessage: "Error al eliminar",
      })
    );
  });

  it("renders the loading state while fetching data", () => {
    mockState.crowfundings.loading = true;
    mockState.crowfundings.crowfundings = [];

    render(<DashboardCrowfunding />);

    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
  });

  it("renders the empty state when there are no records", () => {
    mockState.crowfundings.crowfundings = [];

    render(<DashboardCrowfunding />);

    expect(screen.getByRole("heading", { name: /no se encontraron proyectos/i })).toBeInTheDocument();
  });

  it("renders the error state on failure without exposing technical details", () => {
    mockState.crowfundings.error = "network error";

    render(<DashboardCrowfunding />);

    expect(screen.getByRole("heading", { name: /no se pudieron cargar los proyectos/i })).toBeInTheDocument();
    expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
  });

  it("wires delete confirmation through the hook seam", async () => {
    const user = userEvent.setup();

    render(<DashboardCrowfunding />);

    await user.click(screen.getByRole("button", { name: /eliminar crowdfunding prueba/i }));

    expect(requestDelete).toHaveBeenCalledWith("cr-1");
    expect(screen.getByRole("dialog", { name: /eliminar crowdfunding prueba/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(cancelDelete).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));
    expect(confirmDelete).toHaveBeenCalledTimes(1);
  });
});
