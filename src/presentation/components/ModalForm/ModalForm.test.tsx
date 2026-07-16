import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModalForm } from "./ModalForm";

describe("ModalForm", () => {
  afterEach(cleanup);

  it("blocks overlay and close actions while pending", () => {
    const onClose = vi.fn();

    const { container } = render(
      <ModalForm
        title="Guardar registro"
        isOpen
        message={{ type: "success", text: "Guardado" }}
        pending
        onClose={onClose}
        onSubmit={vi.fn()}
        pendingLabel="Guardando..."
      >
        <input aria-label="Nombre" />
      </ModalForm>,
    );

    expect(screen.getByRole("button", { name: /guardando/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cerrar/i })).toBeDisabled();

    fireEvent.click(container.firstElementChild as HTMLElement);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("allows closing and uses the default submit label when not pending", () => {
    const onClose = vi.fn();

    const { container } = render(
      <ModalForm
        title="Guardar registro"
        isOpen
        message={null}
        onClose={onClose}
        onSubmit={vi.fn()}
      >
        <input aria-label="Nombre" />
      </ModalForm>,
    );

    expect(screen.getByRole("button", { name: /guardar/i })).toBeInTheDocument();

    fireEvent.click(container.firstElementChild as HTMLElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
