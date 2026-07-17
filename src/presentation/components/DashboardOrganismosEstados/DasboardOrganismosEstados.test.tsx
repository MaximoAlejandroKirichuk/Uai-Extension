import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardOrganismos } from "./DasboardOrganismosEstados";
import { fetchOrganismos } from "../../../store/slices/organismosEstados/organismosEstados";
import { useRealtimeList } from "../../../hooks/useRealtimeList";

const { deleteRealtimeRecord } = vi.hoisted(() => ({
  deleteRealtimeRecord: vi.fn(),
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

vi.mock("../../../hooks/hooks", () => ({
  useAppSelector: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

vi.mock("../../../hooks/useRealtimeList", () => ({
  useRealtimeList: vi.fn(),
}));

vi.mock("../../../firebase/realtimeRepository", () => ({
  deleteRealtimeRecord,
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
    vi.stubGlobal("alert", vi.fn());
    vi.clearAllMocks();
  });

  it("renders the shared section header and record count", () => {
    render(<DashboardOrganismos />);

    expect(screen.getByRole("heading", { name: /dashboard de organismos del estado/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the existing Firebase data path and action", () => {
    render(<DashboardOrganismos />);

    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "organismosEstado",
        action: fetchOrganismos,
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

  it("confirms delete through the existing Firebase path without changing scope", async () => {
    const user = userEvent.setup();

    render(<DashboardOrganismos />);

    await user.click(screen.getByRole("button", { name: /eliminar organismo de prueba/i }));
    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));

    await vi.waitFor(() => {
      expect(deleteRealtimeRecord).toHaveBeenCalledTimes(1);
    });
    expect(deleteRealtimeRecord).toHaveBeenCalledWith("organismosEstado", "org-1");
    expect(window.alert).toHaveBeenCalledWith("Organismo eliminado correctamente.");
  });

  it("cancels delete without removing the record", async () => {
    const user = userEvent.setup();

    render(<DashboardOrganismos />);

    await user.click(screen.getByRole("button", { name: /eliminar organismo de prueba/i }));
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(deleteRealtimeRecord).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: /eliminar organismo de prueba/i })).not.toBeInTheDocument();
  });
});
