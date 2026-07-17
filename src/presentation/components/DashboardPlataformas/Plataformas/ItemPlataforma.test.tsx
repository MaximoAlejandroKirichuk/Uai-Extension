import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ItemPlataforma } from "./ItemPlataforma";

afterEach(cleanup);

describe("ItemPlataforma", () => {
  it("exposes a shared delete button label", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <ItemPlataforma
        id="pl-1"
        onDelete={onDelete}
        plataforma={{
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
        }}
      />
    );

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /plataforma prueba/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /eliminar plataforma prueba/i }));

    expect(onDelete).toHaveBeenCalledWith("pl-1");
  });
});
