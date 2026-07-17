import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardIncubadoras } from "./DashboardIncubadoras";
import { onValue, ref } from "firebase/database";

let mockState = {
  incubadoras: {
    incubadoras: [
      {
        id: "in-1",
        nroInscripcion: "1",
        cuit: "20-12345678-9",
        nombre: "Incubadora Prueba",
        provincia: "Buenos Aires",
        localidad: "La Plata",
        direccion: "Calle 1",
        nombreResponsable: "Responsable Prueba",
        emailResponsable: "responsable@example.com",
        telefonoResponsable: "123456789",
      },
    ],
    loading: false,
    error: null as string | null,
  },
};

const mockDispatch = vi.fn();

vi.mock("../../../hooks/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

vi.mock("../../../firebase/firebaseConfig", () => ({
  database: { key: "mock-database" },
}));

vi.mock("firebase/database", () => ({
  onValue: vi.fn((_, success) => {
    success({
      val: () => ({
        "inc-1": {
          nroInscripcion: "1",
          cuit: "20-12345678-9",
          nombre: "Incubadora Prueba",
          provincia: "Buenos Aires",
          localidad: "La Plata",
          direccion: "Calle 1",
          nombreResponsable: "Responsable Prueba",
          emailResponsable: "responsable@example.com",
          telefonoResponsable: "123456789",
        },
      }),
    });
    return vi.fn();
  }),
  ref: vi.fn(),
}));

describe("DashboardIncubadoras", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mockState = {
      incubadoras: {
        incubadoras: [
          {
            id: "in-1",
            nroInscripcion: "1",
            cuit: "20-12345678-9",
            nombre: "Incubadora Prueba",
            provincia: "Buenos Aires",
            localidad: "La Plata",
            direccion: "Calle 1",
            nombreResponsable: "Responsable Prueba",
            emailResponsable: "responsable@example.com",
            telefonoResponsable: "123456789",
          },
        ],
        loading: false,
        error: null,
      },
    };
    mockDispatch.mockClear();
    vi.clearAllMocks();
  });

  it("renders the shared section header and table layout", () => {
    render(<DashboardIncubadoras />);

    expect(screen.getByRole("heading", { name: /dashboard de incubadoras/i })).toBeInTheDocument();
    expect(screen.getByText(/1 registros/i)).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /incubadora prueba/i })).toBeInTheDocument();
  });

  it("uses the existing Firebase listener path", () => {
    render(<DashboardIncubadoras />);

    expect(ref).toHaveBeenCalledWith(expect.anything(), "incubadoras");
    expect(onValue).toHaveBeenCalled();
  });

  it("renders the loading state while fetching data", () => {
    mockState.incubadoras.loading = true;
    mockState.incubadoras.incubadoras = [];

    render(<DashboardIncubadoras />);

    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
  });

  it("renders the empty state when there are no records", () => {
    mockState.incubadoras.incubadoras = [];

    render(<DashboardIncubadoras />);

    expect(screen.getByRole("heading", { name: /no se encontraron incubadoras/i })).toBeInTheDocument();
  });

  it("renders the error state on failure without exposing technical details", () => {
    mockState.incubadoras.error = "network error";

    render(<DashboardIncubadoras />);

    expect(screen.getByRole("heading", { name: /no se pudieron cargar las incubadoras/i })).toBeInTheDocument();
    expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
  });
});
