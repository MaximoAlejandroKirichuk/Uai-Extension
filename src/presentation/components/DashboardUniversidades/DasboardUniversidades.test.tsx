import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardUniversidades } from "./DasboardUniversidades";
import { fetchUniversidades, setError, setLoading } from "../../../store/slices/universidades/universidadesSlice";
import { useRealtimeList } from "../../../hooks/useRealtimeList";

let mockState = {
  universidades: {
    universidades: [
      {
        id: "uni-1",
        nombre: "Universidad de Prueba",
        descripcion: "Descripción de prueba",
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
  selectedItem: mockState.universidades.universidades[0],
  isOpen: false,
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
  useDeleteConfirmation: () => deleteHookState,
}));

describe("DashboardUniversidades", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    mockState = {
      universidades: {
        universidades: [
          {
            id: "uni-1",
            nombre: "Universidad de Prueba",
            descripcion: "Descripción de prueba",
          },
        ],
        loading: false,
        error: null,
      },
    };

    deleteHookState.selectedItem = mockState.universidades.universidades[0];
    deleteHookState.isOpen = false;
    deleteHookState.isDeleting = false;
    deleteHookState.error = null;
    requestDelete.mockClear();
    confirmDelete.mockClear();
    cancelDelete.mockClear();
    vi.stubGlobal("alert", vi.fn());
  });

  it("renders the Spanish section header and record count", () => {
    render(<DashboardUniversidades />);

    expect(screen.getByRole("heading", { name: /panel de universidades/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the shared realtime and delete hook contracts", () => {
    render(<DashboardUniversidades />);

    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "universidades",
        action: fetchUniversidades,
        setLoadingAction: setLoading,
        setErrorAction: setError,
        errorMessage: "No se pudieron cargar las universidades.",
      })
    );

    expect(deleteHookState.requestDelete).not.toHaveBeenCalled();
  });

  it("renders the loading state while fetching data", () => {
    mockState.universidades.loading = true;
    mockState.universidades.universidades = [];

    render(<DashboardUniversidades />);

    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
  });

  it("renders the empty state when there are no records", () => {
    mockState.universidades.universidades = [];

    render(<DashboardUniversidades />);

    expect(screen.getByRole("heading", { name: /no se encontraron universidades/i })).toBeInTheDocument();
  });

  it("renders the error state on failure without exposing technical details", () => {
    mockState.universidades.error = "network error";

    render(<DashboardUniversidades />);

    expect(screen.getByRole("heading", { name: /no se pudieron cargar las universidades/i })).toBeInTheDocument();
    expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
  });

  it("wires item delete clicks and confirmation actions through the hook seam", async () => {
    const user = userEvent.setup();

    deleteHookState.isOpen = true;

    render(<DashboardUniversidades />);

    await user.click(
      screen.getByRole("button", {
        name: /eliminar universidad de prueba/i,
      })
    );

    expect(requestDelete).toHaveBeenCalledWith("uni-1");
    expect(screen.getByRole("dialog", { name: /eliminar universidad de prueba/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(cancelDelete).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));
    expect(confirmDelete).toHaveBeenCalledTimes(1);
  });
});
