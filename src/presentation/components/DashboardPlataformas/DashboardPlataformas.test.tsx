import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardPlataformas } from "./DashboardPlataformas";
import { fetchPlataformas } from "../../../store/slices/plataforma/plataforma";
import { useRealtimeList } from "../../../hooks/useRealtimeList";

const { deleteRealtimeRecord } = vi.hoisted(() => ({
  deleteRealtimeRecord: vi.fn(),
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

vi.mock("../../../hooks/hooks", () => ({
  useAppSelector: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

vi.mock("../../../hooks/useRealtimeList", () => ({
  useRealtimeList: vi.fn(),
}));

vi.mock("../../../firebase/realtimeRepository", () => ({
  deleteRealtimeRecord,
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
    vi.stubGlobal("alert", vi.fn());
    vi.clearAllMocks();
  });

  it("renders the shared section header and record count", () => {
    render(<DashboardPlataformas />);

    expect(screen.getByRole("heading", { name: /dashboard de plataformas/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the existing Firebase data path and action", () => {
    render(<DashboardPlataformas />);

    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "plataformas",
        action: fetchPlataformas,
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

  it("confirms delete through the existing Firebase path without changing scope", async () => {
    const user = userEvent.setup();

    render(<DashboardPlataformas />);

    await user.click(screen.getByRole("button", { name: /eliminar plataforma prueba/i }));
    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));

    await vi.waitFor(() => {
      expect(deleteRealtimeRecord).toHaveBeenCalledTimes(1);
    });
    expect(deleteRealtimeRecord).toHaveBeenCalledWith("plataformas", "pl-1");
    expect(window.alert).toHaveBeenCalledWith("Plataforma eliminada correctamente.");
  });

  it("cancels delete without removing the record", async () => {
    const user = userEvent.setup();

    render(<DashboardPlataformas />);

    await user.click(screen.getByRole("button", { name: /eliminar plataforma prueba/i }));
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(deleteRealtimeRecord).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: /eliminar plataforma prueba/i })).not.toBeInTheDocument();
  });
});
