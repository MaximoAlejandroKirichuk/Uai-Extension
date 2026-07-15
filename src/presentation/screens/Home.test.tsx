import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Home } from "./Home";

afterEach(cleanup);

vi.mock("../components/DashboardUniversidades/DasboardUniversidades", () => ({
  DashboardUniversidades: () => <div>Panel de universidades</div>,
}));

vi.mock("../components/ButtonAdd/ButtonAdd", () => ({
  ButtonAdd: () => <div>Agregar universidad</div>,
}));

vi.mock("../components/DashboardCrowfunding/DashboardCrowfunding", () => ({
  DashboardCrowfunding: () => <div>Panel de financiamiento colectivo</div>,
}));

vi.mock("../components/ButtonAddCrowfunding/ButtonAddCrowfunding", () => ({
  ButtonAddCrowfunding: () => <div>Agregar financiamiento colectivo</div>,
}));

vi.mock("../components/DashboardCapitalVentures/DashboardCapitalVentures", () => ({
  DashboardCapitalVentures: () => <div>Panel de capital de riesgo</div>,
}));

vi.mock("../components/ButtonAddCV/ButtonAddCapitalVenture", () => ({
  ButtonAddCapitalVentures: () => <div>Agregar capital de riesgo</div>,
}));

vi.mock("../components/DashboardPlataformas/DashboardPlataformas", () => ({
  DashboardPlataformas: () => <div>Panel de plataformas</div>,
}));

vi.mock("../components/ButtonAddPlataformas/ButtonAddPlataformas", () => ({
  ButtonAddPlataformas: () => <div>Agregar plataforma</div>,
}));

vi.mock("../components/DashboardOrganismosEstados/DasboardOrganismosEstados", () => ({
  DashboardOrganismos: () => <div>Panel de organismos estatales</div>,
}));

vi.mock("../components/ButtonAddOrganismos/ButtonAddOrganismos", () => ({
  ButtonAddOrganismoEstado: () => <div>Agregar organismo estatal</div>,
}));

vi.mock("../components/DashboardEventos/DashboardEventos", () => ({
  DashboardEventos: () => <div>Panel de eventos</div>,
}));

vi.mock("../components/DashboardIncubadoras/DashboardIncubadoras", () => ({
  DashboardIncubadoras: () => <div>Panel de incubadoras</div>,
}));

describe("Home", () => {
  it("renders the Spanish portal shell and navigation", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /portal interno institucional/i })).toBeInTheDocument();
    expect(screen.getByText(/seleccione un módulo/i)).toBeInTheDocument();
    expect(screen.getByText(/^Portal interno$/i)).toBeInTheDocument();
    expect(screen.getByText(/extensión uai/i)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /módulos internos/i })).toBeInTheDocument();
    expect(screen.getAllByText(/^Módulo$/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Internal portal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Select a module/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Module$/i)).not.toBeInTheDocument();
  });

  it("switches between modules while preserving the existing module set", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const button = screen.getByRole("button", { name: /financiamiento colectivo/i });
    await user.click(button);
    expect(screen.getByText("Panel de financiamiento colectivo")).toBeInTheDocument();
    expect(screen.queryByText("Panel de capital de riesgo")).not.toBeInTheDocument();
  });
});
