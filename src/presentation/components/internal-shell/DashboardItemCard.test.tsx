import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DeleteIconButton } from "./DashboardItemCard";

afterEach(cleanup);

describe("DeleteIconButton", () => {
  it("shows a permanent-delete warning and keeps the delete label accessible", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<DeleteIconButton label="Eliminar registro" onClick={onClick} />);

    const button = screen.getByRole("button", { name: /eliminar registro/i });

    expect(screen.getByRole("tooltip")).toHaveTextContent(
      /borra para siempre este registro/i,
    );

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
