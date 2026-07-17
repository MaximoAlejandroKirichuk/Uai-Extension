import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ItemUniversidad } from "./ItemUniversidad";

afterEach(cleanup);

describe("ItemUniversidad", () => {
  it("exposes a Spanish delete button label", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <ItemUniversidad
        id="uni-1"
        onDelete={onDelete}
        uni={{
          id: "uni-1",
          nombre: "Universidad de Prueba",
          descripcion: "Descripción de prueba",
          contacto: "contacto@prueba.edu",
        }}
      />,
    );

    const deleteButton = screen.getByRole("button", {
      name: /eliminar universidad de prueba/i,
    });

    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith("uni-1");
  });
});
