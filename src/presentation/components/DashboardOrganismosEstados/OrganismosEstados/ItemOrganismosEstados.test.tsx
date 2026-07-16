import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ItemOrganismosEstados } from "./ItemOrganismosEstados";

afterEach(cleanup);

describe("ItemOrganismosEstados", () => {
  it("exposes a shared delete button label and brand token link", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <ItemOrganismosEstados
        id="org-1"
        onDelete={onDelete}
        organismo={{
          id: "org-1",
          nombre: "Organismo de Prueba",
          area: "Innovación",
          descripcion: "Descripción de prueba",
          programas: "Programa A",
          tiposFinanciamiento: "Subsidio",
          fechasRelevantes: "2026",
          requisitosAcceso: "Registro",
          contacto: "contacto@prueba.gob",
          enlaces: "https://organismos.example",
          estadoSeguimiento: "Activo",
          beneficiarios: "PYMES",
          alianzas: "Sí",
        }}
      />
    );

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /organismo de prueba/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /https:\/\/organismos\.example/i })).toHaveClass(
      "text-[color:var(--color-brand)]"
    );

    await user.click(screen.getByRole("button", { name: /eliminar organismo de prueba/i }));

    expect(onDelete).toHaveBeenCalledWith("org-1");
  });
});
