import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DashboardEventos } from "./DashboardEventos";

const { useEventsMock } = vi.hoisted(() => ({
  useEventsMock: vi.fn(),
}));

vi.mock("../../../hooks/useEvents", () => ({
  useEvents: () => useEventsMock(),
}));

afterEach(cleanup);

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <DashboardEventos />
    </MemoryRouter>
  );

describe("DashboardEventos", () => {
  afterEach(() => {
    useEventsMock.mockReset();
  });

  it("renders the loading state", () => {
    useEventsMock.mockReturnValue({ events: [], loading: true, error: null });

    renderDashboard();

    expect(screen.getByRole("heading", { name: /panel de eventos/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
  });

  it("renders the error state without stack traces", () => {
    useEventsMock.mockReturnValue({ events: [], loading: false, error: "No se pudieron cargar los eventos." });

    renderDashboard();

    expect(screen.getByRole("heading", { name: /no se pudieron cargar los eventos/i })).toBeInTheDocument();
    expect(screen.queryByText(/stack trace/i)).not.toBeInTheDocument();
  });

  it("renders the empty state", () => {
    useEventsMock.mockReturnValue({ events: [], loading: false, error: null });

    renderDashboard();

    expect(screen.getByRole("heading", { name: /no hay eventos disponibles/i })).toBeInTheDocument();
  });

  it("renders events with nullable fields and detail navigation", () => {
    useEventsMock.mockReturnValue({
      loading: false,
      error: null,
      events: [
        {
          id: "66f000000000000000000002",
          nombre: "Founder Meetup",
          descripcion: undefined,
          fecha_inicio: null,
          fecha_fin: null,
          ubicacion: null,
          categoria: null,
          modalidad: null,
          costo_entrada: null,
          fuente_id: "66f000000000000000000001",
          fuente: null,
          url_detalles: null,
          finalizado: false,
          createdAt: "2026-09-08T12:00:00.000Z",
          updatedAt: "2026-09-08T12:00:00.000Z",
        },
      ],
    });

    renderDashboard();

    expect(screen.getByRole("heading", { name: /founder meetup/i })).toBeInTheDocument();
    expect(screen.getByText(/^Disponible$/i)).toBeInTheDocument();
    expect(screen.getByText("1 evento")).toBeInTheDocument();
    expect(screen.getByText(/fecha no disponible/i)).toBeInTheDocument();
    expect(screen.getByText(/fuente: fuente no disponible/i)).toBeInTheDocument();
    expect(screen.queryByText("66f000000000000000000001")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver detalle/i })).toHaveAttribute(
      "href",
      "/Home/eventos/66f000000000000000000002"
    );
    expect(screen.queryByRole("button", { name: /create|edit|delete|approve/i })).not.toBeInTheDocument();
  });

  it("renders the source name and URL without exposing source ids", () => {
    useEventsMock.mockReturnValue({
      loading: false,
      error: null,
      events: [
        {
          id: "66f000000000000000000002",
          nombre: "Founder Meetup",
          url: "https://www.endeavor.org.ar/eventos/experiencia-endeavor-noa-4/",
          descripcion: "Networking event",
          fecha_inicio: "2026-09-08T12:00:00.000Z",
          fecha_fin: null,
          ubicacion: "Buenos Aires",
          categoria: "Entrepreneurship",
          modalidad: "Online",
          costo_entrada: "Free",
          fuente_id: "66f000000000000000000001",
          fuente: {
            id: "66f000000000000000000001",
            nombre: "Endeavor",
            url: "https://www.endeavor.org.ar",
          },
          url_detalles: null,
          finalizado: false,
          createdAt: "2026-09-08T12:00:00.000Z",
          updatedAt: "2026-09-08T12:00:00.000Z",
        },
      ],
    });

    renderDashboard();

    expect(screen.getByText(/fuente: endeavor/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /página del evento/i })).toHaveAttribute(
      "href",
      "https://www.endeavor.org.ar/eventos/experiencia-endeavor-noa-4/"
    );
    expect(screen.getByRole("link", { name: /página del evento/i })).toHaveTextContent(
      "https://www.endeavor.org.ar/eventos/experiencia-endeavor-noa-4/"
    );
    expect(screen.getByRole("link", { name: /página del evento/i })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /página del evento/i })).toHaveAttribute("rel", "noreferrer");
    expect(screen.getByRole("link", { name: /sitio de la fuente/i })).toHaveAttribute(
      "href",
      "https://www.endeavor.org.ar"
    );
    expect(screen.getByRole("link", { name: /sitio de la fuente/i })).toHaveTextContent(
      "https://www.endeavor.org.ar"
    );
    expect(screen.getByRole("link", { name: /sitio de la fuente/i })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /sitio de la fuente/i })).toHaveAttribute("rel", "noreferrer");
    expect(screen.queryByText("66f000000000000000000001")).not.toBeInTheDocument();
  });
});
