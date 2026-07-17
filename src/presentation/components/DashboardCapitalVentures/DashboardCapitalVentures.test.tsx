import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardCapitalVentures } from "./DashboardCapitalVentures";
import { fetchCapitalVentures } from "../../../store/slices/capitalVentures/capitalVentures";
import { remove, ref } from "firebase/database";
import { useRealtimeList } from "../../../hooks/useRealtimeList";

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
    vi.stubGlobal("alert", vi.fn());
    vi.clearAllMocks();
  });

  it("renders the shared section header and record count", () => {
    render(<DashboardCapitalVentures />);

    expect(screen.getByRole("heading", { name: /dashboard de capital ventures/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the existing Firebase data path and action", () => {
    render(<DashboardCapitalVentures />);

    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "capitalVentures",
        action: fetchCapitalVentures,
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

  it("confirms delete through the existing Firebase path without changing scope", async () => {
    const user = userEvent.setup();

    render(<DashboardCapitalVentures />);

    await user.click(screen.getByRole("button", { name: /eliminar capital venture prueba/i }));
    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));

    await vi.waitFor(() => {
      expect(remove).toHaveBeenCalledTimes(1);
    });
    expect(ref).toHaveBeenCalledWith(expect.anything(), "capitalVentures/cv-1");
    expect(window.alert).toHaveBeenCalledWith("Registro eliminado");
  });

  it("cancels delete without removing the record", async () => {
    const user = userEvent.setup();

    render(<DashboardCapitalVentures />);

    await user.click(screen.getByRole("button", { name: /eliminar capital venture prueba/i }));
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(remove).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: /eliminar capital venture prueba/i })).not.toBeInTheDocument();
  });
});
