import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { InternalPortalShell } from "./InternalPortalShell";

afterEach(cleanup);

describe("InternalPortalShell", () => {
  it("renders Spanish shell header and branded accent without a large brand background", () => {
    render(
      <InternalPortalShell
        title="Portal"
        description="Descripción"
        navigation={<nav>Nav</nav>}
      >
        <div>Contenido</div>
      </InternalPortalShell>
    );

    expect(screen.getByRole("heading", { name: /portal/i })).toBeInTheDocument();
    expect(screen.getByText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByText(/^Portal interno$/i)).toBeInTheDocument();
    expect(screen.getByText(/extensión uai/i)).toBeInTheDocument();
  });

  it("uses CSS custom property tokens for brand and surface colors", () => {
    const { container } = render(
      <InternalPortalShell title="Portal" description="Descripción">
        <div>Contenido</div>
      </InternalPortalShell>
    );

    const shell = container.firstChild as HTMLElement;
    expect(shell.className).toContain("bg-[var(--color-surface)]");
    expect(shell.className).toContain("text-[color:var(--color-text)]");
    expect(shell.className).not.toContain("bg-[var(--color-brand)]");
    expect(screen.getByText(/^Portal interno$/i).className).toContain(
      "text-[color:var(--color-brand)]"
    );
  });

  it("keeps responsive padding classes for mobile and desktop", () => {
    const { container } = render(
      <InternalPortalShell title="Portal" description="Descripción">
        <div>Contenido</div>
      </InternalPortalShell>
    );

    const wrapper = container.firstChild?.firstChild as HTMLElement;
    expect(wrapper.className).toContain("sm:px-6");
    expect(wrapper.className).toContain("lg:px-8");
  });
});
