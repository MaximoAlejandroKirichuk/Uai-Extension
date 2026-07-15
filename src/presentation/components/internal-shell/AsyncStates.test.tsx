import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { EmptyState, ErrorState, LoadingState } from "./AsyncStates";

afterEach(cleanup);

describe("AsyncStates", () => {
  it("LoadingState renders Spanish loading copy", () => {
    render(<LoadingState />);
    expect(screen.getByRole("heading", { name: /cargando contenido/i })).toBeInTheDocument();
    expect(screen.getByText(/espere mientras se prepara la vista actual/i)).toBeInTheDocument();
  });

  it("EmptyState renders Spanish title and description", () => {
    render(<EmptyState title="Sin registros" description="No hay nada para mostrar." />);
    expect(screen.getByRole("heading", { name: /sin registros/i })).toBeInTheDocument();
    expect(screen.getByText(/no hay nada para mostrar/i)).toBeInTheDocument();
  });

  it("ErrorState renders Spanish error copy without a stack trace", () => {
    render(<ErrorState title="Error de conexión" description="Intente más tarde." />);
    expect(screen.getByRole("heading", { name: /error de conexión/i })).toBeInTheDocument();
    expect(screen.getByText(/intente más tarde/i)).toBeInTheDocument();
    expect(screen.queryByText(/stack trace/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/at /i)).not.toBeInTheDocument();
  });
});
