import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardCrowfunding } from "./DashboardCrowfunding";
import { fetchCrowfundings } from "../../../store/slices/crowfunding/crowfundingSlice";
import { remove, ref } from "firebase/database";
import { useRealtimeList } from "../../../hooks/useRealtimeList";

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

vi.mock("../../../hooks/hooks", () => ({
  useAppSelector: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

vi.mock("../../../hooks/useRealtimeList", () => ({
  useRealtimeList: vi.fn(),
}));

vi.mock("../../../firebase/firebaseConfig", () => ({
  database: { key: "mock-database" },
}));

vi.mock("firebase/database", () => ({
  remove: vi.fn(),
  ref: vi.fn(),
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
    vi.stubGlobal("alert", vi.fn());
    vi.clearAllMocks();
  });

  it("renders the shared section header and record count", () => {
    render(<DashboardCrowfunding />);

    expect(screen.getByRole("heading", { name: /dashboard de proyectos crowfunding/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the existing Firebase data path and action", () => {
    render(<DashboardCrowfunding />);

    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "crowfundings",
        action: fetchCrowfundings,
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

  it("confirms delete through the existing Firebase path without changing scope", async () => {
    const user = userEvent.setup();

    render(<DashboardCrowfunding />);

    await user.click(screen.getByRole("button", { name: /eliminar crowdfunding prueba/i }));
    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));

    await waitFor(() => {
      expect(remove).toHaveBeenCalledTimes(1);
    });
    expect(ref).toHaveBeenCalledWith(expect.anything(), "crowfundings/cr-1");
    expect(window.alert).toHaveBeenCalledWith("Proyecto eliminado");
  });

  it("cancels delete without removing the record", async () => {
    const user = userEvent.setup();

    render(<DashboardCrowfunding />);

    await user.click(screen.getByRole("button", { name: /eliminar crowdfunding prueba/i }));
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(remove).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: /eliminar crowdfunding prueba/i })).not.toBeInTheDocument();
  });
});
