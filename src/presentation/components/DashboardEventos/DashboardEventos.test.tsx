import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DashboardEventos } from "./DashboardEventos";

afterEach(cleanup);

describe("DashboardEventos", () => {
  it("renders only the shared header and placeholder state", () => {
    render(<DashboardEventos />);

    expect(screen.getByRole("heading", { name: /dashboard de eventos/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /módulo en preparación/i })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
