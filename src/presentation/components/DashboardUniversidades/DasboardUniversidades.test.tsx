import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { DashboardUniversidades } from "./DasboardUniversidades";
import { fetchUniversidades } from "../../../store/slices/universidades/universidadesSlice";
import { useRealtimeList } from "../../../hooks/useRealtimeList";

const { deleteRealtimeRecord } = vi.hoisted(() => ({
  deleteRealtimeRecord: vi.fn(),
}));

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

vi.mock("../../../hooks/hooks", () => ({
  useAppSelector: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

vi.mock("../../../hooks/useRealtimeList", () => ({
  useRealtimeList: vi.fn(),
}));

vi.mock("../../../firebase/realtimeRepository", () => ({
  deleteRealtimeRecord,
}));

describe("DashboardUniversidades", () => {
  afterEach(cleanup);

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
    vi.stubGlobal("alert", vi.fn());
    vi.clearAllMocks();
  });

  it("renders the Spanish section header and record count", () => {
    render(<DashboardUniversidades />);
    expect(screen.getByRole("heading", { name: /panel de universidades/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
  });

  it("uses the existing Firebase data path and action", () => {
    render(<DashboardUniversidades />);
    expect(useRealtimeList).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "universidades",
        action: fetchUniversidades,
      })
    );
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

  it("renders the Spanish delete flow and cancel preserves data", async () => {
    const user = userEvent.setup();

    render(<DashboardUniversidades />);

    const deleteButton = screen.getByRole("button", {
      name: /eliminar universidad de prueba/i,
    });

    await user.click(deleteButton);

    expect(screen.getByRole("dialog", { name: /eliminar universidad de prueba/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^eliminar$/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(deleteRealtimeRecord).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: /eliminar universidad de prueba/i })).not.toBeInTheDocument();
  });

  it("confirms delete through the existing Firebase path without changing scope", async () => {
    const user = userEvent.setup();

    render(<DashboardUniversidades />);

    const deleteButton = screen.getByRole("button", {
      name: /eliminar universidad de prueba/i,
    });

    await user.click(deleteButton);
    await user.click(screen.getByRole("button", { name: /^eliminar$/i }));

    await vi.waitFor(() => {
      expect(deleteRealtimeRecord).toHaveBeenCalledTimes(1);
    });
    expect(deleteRealtimeRecord).toHaveBeenCalledWith("universidades", "uni-1");
    expect(window.alert).toHaveBeenCalledWith("Universidad eliminada correctamente.");
  });
});
