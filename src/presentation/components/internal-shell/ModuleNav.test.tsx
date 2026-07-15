import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModuleNav, type HomeModuleConfig } from "./ModuleNav";

afterEach(cleanup);

const MODULES: HomeModuleConfig[] = [
  { key: "a", label: "Módulo A", render: () => <div>A</div> },
  { key: "b", label: "Módulo B", render: () => <div>B</div> },
  { key: "c", label: "Módulo C", render: () => <div>C</div> },
];

describe("ModuleNav", () => {
  it("renders metadata-driven navigation with current modules only", () => {
    render(<ModuleNav modules={MODULES} activeKey="a" onChange={vi.fn()} />);
    expect(screen.getByRole("navigation", { name: /módulos internos/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(MODULES.length);
    expect(screen.getByRole("button", { name: /módulo a/i })).toHaveAttribute("aria-pressed", "true");
  });

  it("notifies selection changes so all modules remain reachable", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ModuleNav modules={MODULES} activeKey="a" onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /módulo b/i }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("uses responsive grid classes for mobile and desktop", () => {
    const { container } = render(<ModuleNav modules={MODULES} activeKey="a" onChange={vi.fn()} />);
    const grid = container.firstChild?.firstChild as HTMLElement | undefined;
    expect(grid?.className).toContain("md:grid-cols-2");
    expect(grid?.className).toContain("xl:grid-cols-4");
  });
});
