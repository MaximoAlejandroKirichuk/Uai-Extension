import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DashboardItemCard, DeleteIconButton } from "./DashboardItemCard";

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

  it("hides the delete affordance when deletion is not allowed", () => {
    render(
      <DashboardItemCard
        title="Readonly item"
        deleteLabel="Eliminar registro"
        onDelete={vi.fn()}
        canDelete={false}
      >
        <p>Existing data</p>
      </DashboardItemCard>
    );

    expect(screen.getByText("Readonly item")).toBeInTheDocument();
    expect(screen.getByText("Existing data")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /eliminar registro/i })).not.toBeInTheDocument();
  });
});
