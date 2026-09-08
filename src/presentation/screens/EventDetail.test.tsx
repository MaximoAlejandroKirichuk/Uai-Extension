import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EventDetail } from "./EventDetail";

const { useEventDetailMock } = vi.hoisted(() => ({
  useEventDetailMock: vi.fn(),
}));

vi.mock("../../hooks/useEventDetail", () => ({
  useEventDetail: (id: string | undefined) => useEventDetailMock(id),
}));

afterEach(cleanup);

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={["/Home/eventos/abc"]}>
      <Routes>
        <Route path="/Home/eventos/:id" element={<EventDetail />} />
      </Routes>
    </MemoryRouter>
  );

describe("EventDetail", () => {
  afterEach(() => {
    useEventDetailMock.mockReset();
  });

  it("renders loading state and passes the route id to the hook", () => {
    useEventDetailMock.mockReturnValue({ event: null, loading: true, error: null, notFound: false });

    renderDetail();

    expect(useEventDetailMock).toHaveBeenCalledWith("abc");
    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
  });

  it("renders error state without stack traces", () => {
    useEventDetailMock.mockReturnValue({ event: null, loading: false, error: "error", notFound: false });

    renderDetail();

    expect(screen.getByRole("heading", { name: /no se pudo cargar el detalle del evento/i })).toBeInTheDocument();
    expect(screen.queryByText(/stack trace/i)).not.toBeInTheDocument();
  });

  it("renders not found state", () => {
    useEventDetailMock.mockReturnValue({ event: null, loading: false, error: null, notFound: true });

    renderDetail();

    expect(screen.getByRole("heading", { name: /evento no encontrado/i })).toBeInTheDocument();
  });

  it("renders success state with null-safe values", () => {
    useEventDetailMock.mockReturnValue({
      loading: false,
      error: null,
      notFound: false,
      event: {
        id: "abc",
        nombre: "Founder Meetup",
        descripcion: undefined,
        fecha_inicio: null,
        fecha_fin: null,
        ubicacion: null,
        categoria: "Entrepreneurship",
        modalidad: null,
        costo_entrada: null,
        fuente_id: "66f000000000000000000001",
        fuente: null,
        url_detalles: null,
        finalizado: false,
        createdAt: "2026-09-08T12:00:00.000Z",
        updatedAt: "2026-09-08T12:00:00.000Z",
      },
    });

    renderDetail();

    expect(screen.getByRole("heading", { name: /founder meetup/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /información general/i })).toBeInTheDocument();
    expect(screen.getAllByText(/fecha no disponible/i)).toHaveLength(2);
    expect(screen.getByText(/fuente: fuente no disponible/i)).toBeInTheDocument();
    expect(screen.queryByText("66f000000000000000000001")).not.toBeInTheDocument();
    expect(screen.getByText(/entrepreneurship/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /create|edit|delete|approve/i })).not.toBeInTheDocument();
  });

  it("renders the source name and URL without exposing source ids", () => {
    useEventDetailMock.mockReturnValue({
      loading: false,
      error: null,
      notFound: false,
        event: {
          id: "abc",
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
          url_detalles: "https://www.endeavor.org.ar/eventos/experiencia-endeavor-noa-4/detalles",
        finalizado: false,
        createdAt: "2026-09-08T12:00:00.000Z",
        updatedAt: "2026-09-08T12:00:00.000Z",
      },
    });

    renderDetail();

    expect(screen.getByRole("heading", { name: /enlaces relacionados/i })).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: /detalle adicional/i })).toHaveAttribute(
      "href",
      "https://www.endeavor.org.ar/eventos/experiencia-endeavor-noa-4/detalles"
    );
    expect(screen.getByRole("link", { name: /detalle adicional/i })).toHaveAttribute(
      "target",
      "_blank"
    );
    expect(screen.getByRole("link", { name: /detalle adicional/i })).toHaveAttribute(
      "rel",
      "noreferrer"
    );
    expect(screen.queryByText("66f000000000000000000001")).not.toBeInTheDocument();
  });
});
