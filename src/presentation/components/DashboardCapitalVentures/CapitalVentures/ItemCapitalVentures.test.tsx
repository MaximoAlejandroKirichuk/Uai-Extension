import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ItemCapitalVenture } from "./ItemCapitalVentures";

afterEach(cleanup);

describe("ItemCapitalVenture", () => {
  it("exposes a shared delete button label", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <ItemCapitalVenture
        id="cv-1"
        onDelete={onDelete}
        venture={{
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
        }}
      />
    );

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /capital venture prueba/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /eliminar capital venture prueba/i }));

    expect(onDelete).toHaveBeenCalledWith("cv-1");
  });
});
