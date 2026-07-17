import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardOrganismos } from "./DasboardOrganismosEstados";
import { fetchOrganismos, setError, setLoading } from "../../../store/slices/organismosEstados/organismosEstados";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";

const { useDeleteConfirmationMock } = vi.hoisted(() => ({
  useDeleteConfirmationMock: vi.fn(),
}));

let mockState = {
  organismos: {
    organismos: [
      {
        id: "org-1",
        nombre: "Organismo de Prueba",
        area: "Innovación",
        descripcion: "Descripción de prueba",
        programas: "Programa A",
        tiposFinanciamiento: "Subsidio",
        fechasRelevantes: "2026",
        requisitosAcceso: "Registro",
        contacto: "contacto@prueba.gob",
        enlaces: "https://organismos.example",
        estadoSeguimiento: "Activo",
        beneficiarios: "PYMES",
        alianzas: "Sí",
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
  selectedItem: mockState.organismos.organismos[0],
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

describe("DashboardOrganismos", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mockState = {
      organismos: {
        organismos: [
          {
            id: "org-1",
            nombre: "Organismo de Prueba",
            area: "Innovación",
            descripcion: "Descripción de prueba",
            programas: "Programa A",
            tiposFinanciamiento: "Subsidio",
            fechasRelevantes: "2026",
            requisitosAcceso: "Registro",
            contacto: "contacto@prueba.gob",
            enlaces: "https://organismos.example",
            estadoSeguimiento: "Activo",
            beneficiarios: "PYMES",
            alianzas: "Sí",
          },
        ],
        loading: false,
        error: null,
      },
    };
    deleteHookState.selectedItem = mockState.organismos.organismos[0];
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
    render(<DashboardOrganismos />);

    expect(screen.getByRole("heading", { name: /dashboard de organismos del estado/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the shared realtime and delete hook contracts", () => {
    render(<DashboardOrganismos />);

    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "organismosEstado",
        action: fetchOrganismos,
        setLoadingAction: setLoading,
        setErrorAction: setError,
        errorMessage: "No se pudieron cargar los registros.",
      })
    );

    expect(useDeleteConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "organismosEstado",
        getId: expect.any(Function),
        onSuccessMessage: "Organismo eliminado correctamente.",
        onErrorMessage: "Error al eliminar el organismo.",
      })
    );
  });

  it("renders the loading state while fetching data", () => {
    mockState.organismos.loading = true;
    mockState.organismos.organismos = [];

    render(<DashboardOrganismos />);

    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
  });

  it("renders the empty state when there are no records", () => {
    mockState.organismos.organismos = [];

    render(<DashboardOrganismos />);

    expect(screen.getByRole("heading", { name: /no se encontraron registros/i })).toBeInTheDocument();
  });

  it("renders the error state on failure without exposing technical details", () => {
    mockState.organismos.error = "network error";

    render(<DashboardOrganismos />);

    expect(screen.getByRole("heading", { name: /no se pudieron cargar los registros/i })).toBeInTheDocument();
    expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
  });

  it("wires delete confirmation through the hook seam", async () => {
    const user = userEvent.setup();

    render(<DashboardOrganismos />);

    await user.click(screen.getByRole("button", { name: /eliminar organismo de prueba/i }));

    expect(requestDelete).toHaveBeenCalledWith("org-1");
    expect(screen.getByRole("dialog", { name: /eliminar organismo de prueba/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(cancelDelete).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));
    expect(confirmDelete).toHaveBeenCalledTimes(1);
  });
});
