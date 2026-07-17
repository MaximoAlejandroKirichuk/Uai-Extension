import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfirmAction } from "./ConfirmAction";

afterEach(cleanup);

describe("ConfirmAction", () => {
  it("renders Spanish labels and triggers cancel/confirm callbacks", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmAction
        open
        title="Eliminar universidad"
        description="¿Desea continuar?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByRole("dialog", { name: /eliminar universidad/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    await user.click(screen.getByRole("button", { name: /confirmar/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
