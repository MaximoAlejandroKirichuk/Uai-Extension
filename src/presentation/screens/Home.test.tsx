import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Home } from "./Home";

const { useAppSelectorMock } = vi.hoisted(() => ({
  useAppSelectorMock: vi.fn(),
}));

afterEach(cleanup);

vi.mock("../components/DashboardUniversidades/DasboardUniversidades", () => ({
  DashboardUniversidades: ({ canWrite }: { canWrite: boolean }) => (
    <div>Panel de universidades {canWrite ? "writable" : "readonly"}</div>
  ),
}));

vi.mock("../components/ButtonAdd/ButtonAdd", () => ({
  ButtonAdd: ({ canWrite }: { canWrite: boolean }) => canWrite ? <div>Agregar universidad</div> : null,
}));

vi.mock("../components/DashboardCrowfunding/DashboardCrowfunding", () => ({
  DashboardCrowfunding: () => <div>Panel de financiamiento colectivo</div>,
}));

vi.mock("../components/ButtonAddCrowfunding/ButtonAddCrowfunding", () => ({
  ButtonAddCrowfunding: ({ canWrite }: { canWrite: boolean }) =>
    canWrite ? <div>Agregar financiamiento colectivo</div> : null,
}));

vi.mock("../components/DashboardCapitalVentures/DashboardCapitalVentures", () => ({
  DashboardCapitalVentures: () => <div>Panel de capital de riesgo</div>,
}));

vi.mock("../components/ButtonAddCV/ButtonAddCapitalVenture", () => ({
  ButtonAddCapitalVentures: ({ canWrite }: { canWrite: boolean }) =>
    canWrite ? <div>Agregar capital de riesgo</div> : null,
}));

vi.mock("../components/DashboardPlataformas/DashboardPlataformas", () => ({
  DashboardPlataformas: () => <div>Panel de plataformas</div>,
}));

vi.mock("../components/ButtonAddPlataformas/ButtonAddPlataformas", () => ({
  ButtonAddPlataformas: ({ canWrite }: { canWrite: boolean }) =>
    canWrite ? <div>Agregar plataforma</div> : null,
}));

vi.mock("../components/DashboardOrganismosEstados/DasboardOrganismosEstados", () => ({
  DashboardOrganismos: () => <div>Panel de organismos estatales</div>,
}));

vi.mock("../components/ButtonAddOrganismos/ButtonAddOrganismos", () => ({
  ButtonAddOrganismoEstado: ({ canWrite }: { canWrite: boolean }) =>
    canWrite ? <div>Agregar organismo estatal</div> : null,
}));

vi.mock("../components/DashboardIncubadoras/DashboardIncubadoras", () => ({
  DashboardIncubadoras: () => <div>Panel de incubadoras</div>,
}));

vi.mock("../components/DashboardEventos/DashboardEventos", () => ({
  DashboardEventos: () => <div>Panel de eventos module</div>,
}));

vi.mock("../../hooks/hooks", () => ({
  useAppSelector: (selector: unknown) => useAppSelectorMock(selector),
}));

describe("Home", () => {
  afterEach(() => {
    useAppSelectorMock.mockReset();
  });

  beforeEach(() => {
    useAppSelectorMock.mockReturnValue({
      emailUser: "staff@uai.edu.ar",
      token: "token",
      localId: "uid",
      readonly: false,
      canWrite: true,
    });
  });

  it("renders the Spanish portal shell and navigation", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /portal interno institucional/i })).toBeInTheDocument();
    expect(screen.getByText(/seleccione un módulo/i)).toBeInTheDocument();
    expect(screen.getByText(/^Portal interno$/i)).toBeInTheDocument();
    expect(screen.getByText(/extensión uai/i)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /módulos internos/i })).toBeInTheDocument();
    expect(screen.getAllByText(/^Módulo$/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /eventos/i })).toBeInTheDocument();
    expect(screen.queryByText(/panel de eventos module/i)).not.toBeInTheDocument();
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

  it("passes read-only capability so write affordances are unavailable while data modules render", () => {
    useAppSelectorMock.mockReturnValue({
      emailUser: "ciiti-test@uai.edu.ar",
      token: "token",
      localId: "uid",
      readonly: false,
      canWrite: true,
    });

    render(<Home />);

    expect(screen.getByText(/panel de universidades readonly/i)).toBeInTheDocument();
    expect(screen.queryByText(/agregar universidad/i)).not.toBeInTheDocument();
    expect(screen.getByText(/^Acceso de solo lectura$/i)).toBeInTheDocument();
  });

  it("shows guest read-only context while preserving all module navigation", () => {
    useAppSelectorMock.mockReturnValue({
      emailUser: "",
      token: "guest-token",
      localId: "guest-uid",
      readonly: true,
      canWrite: false,
      isAnonymous: true,
    });

    render(<Home />);

    expect(screen.getByRole("region", { name: /contexto de acceso de solo lectura/i })).toBeInTheDocument();
    expect(screen.getByText(/acceso invitado de solo lectura/i)).toBeInTheDocument();
    expect(screen.getByText(/panel de universidades readonly/i)).toBeInTheDocument();
    expect(screen.queryByText(/agregar universidad/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /financiamiento colectivo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /capital de riesgo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /plataformas/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /organismos estatales/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /incubadoras/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /eventos/i })).toBeInTheDocument();
  });

  it("opens the read-only Events module without write controls", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: /eventos/i }));

    expect(screen.getByText("Panel de eventos module")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /create|edit|delete|approve/i })).not.toBeInTheDocument();
  });
});
