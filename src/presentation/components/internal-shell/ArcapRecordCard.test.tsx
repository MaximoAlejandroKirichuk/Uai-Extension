import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ArcapRecordCard } from "./ArcapRecordCard";

afterEach(cleanup);

describe("ArcapRecordCard", () => {
  it("omits a field with no value instead of printing a bare label", () => {
    render(
      <ArcapRecordCard
        id="ARC-070"
        record={{ nombre: "Kalei Ventures", sitioWeb: "https://kalei.vc", estadoLink: "ok" }}
        fields={[
          { label: "Region", value: "Argentina" },
          { label: "Perfil buscado", value: undefined },
        ]}
      />
    );

    expect(screen.getByText(/Region:/)).toBeInTheDocument();
    expect(screen.queryByText(/Perfil buscado:/)).not.toBeInTheDocument();
  });

  it("links a reachable site and flags one that is not", () => {
    const { unmount } = render(
      <ArcapRecordCard
        id="ARC-005"
        record={{ nombre: "Kaszek", sitioWeb: "https://kaszek.com/", estadoLink: "ok" }}
        fields={[]}
      />
    );

    expect(screen.getByRole("link", { name: "Sitio web" })).toHaveAttribute(
      "href",
      "https://kaszek.com/"
    );
    unmount();

    render(
      <ArcapRecordCard
        id="ARC-078"
        record={{ nombre: "Worcap", sitioWeb: "https://www.worcap.com/", estadoLink: "roto" }}
        fields={[]}
      />
    );

    expect(screen.queryByRole("link", { name: "Sitio web" })).not.toBeInTheDocument();
    expect(screen.getByText(/el dominio no responde/)).toBeInTheDocument();
  });

  it("renders a portfolio that arrives as an index-keyed object", () => {
    render(
      <ArcapRecordCard
        id="ARC-030"
        record={{ nombre: "Draper Cygnus" }}
        fields={[]}
        lists={[{ label: "Portfolio declarado", items: { 0: "Stamm", 1: "Auth0" } }]}
      />
    );

    expect(screen.getByText("Portfolio declarado (2)")).toBeInTheDocument();
    expect(screen.getByText("Auth0")).toBeInTheDocument();
  });

  it("shows no curation state on the card", () => {
    render(
      <ArcapRecordCard
        id="ARC-005"
        record={{
          nombre: "Kaszek",
          estadoRevision: "needs_review",
          pendienteCuraduria: {
            region: { valor: "Latinoamerica, segun su propia descripcion", fidelidad: "media" },
          },
        }}
        fields={[]}
      />
    );

    expect(screen.queryByText(/sin revisar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/curaduria/i)).not.toBeInTheDocument();
    // the withheld value itself never reaches the card either
    expect(screen.queryByText(/Latinoamerica/)).not.toBeInTheDocument();
  });

  it("hides the delete button unless the caller allows it", () => {
    render(<ArcapRecordCard id="ARC-005" record={{ nombre: "Kaszek" }} fields={[]} />);

    expect(screen.queryByRole("button", { name: /eliminar/i })).not.toBeInTheDocument();
  });
});
