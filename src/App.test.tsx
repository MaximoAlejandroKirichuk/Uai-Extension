import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const { useSelectorMock } = vi.hoisted(() => ({
  useSelectorMock: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: (selector: unknown) => useSelectorMock(selector),
}));

vi.mock("./presentation/screens/Home", () => ({
  Home: () => <div>Home route</div>,
}));

vi.mock("./presentation/screens/Login", () => ({
  Login: () => <div>Login route</div>,
}));

describe("App routing", () => {
  afterEach(() => {
    cleanup();
    useSelectorMock.mockReset();
  });

  it("allows an anonymous mapped Redux user to reach Home", () => {
    useSelectorMock.mockReturnValue({
      value: {
        user: {
        emailUser: "",
        token: "guest-token",
        localId: "guest-uid",
        readonly: true,
        canWrite: false,
        isAnonymous: true,
      },
      },
    });

    render(
      <MemoryRouter initialEntries={["/Home"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Home route")).toBeInTheDocument();
    expect(screen.queryByText("Login route")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users from Home to Login", () => {
    useSelectorMock.mockReturnValue({ value: { user: null } });

    render(
      <MemoryRouter initialEntries={["/Home"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Login route")).toBeInTheDocument();
    expect(screen.queryByText("Home route")).not.toBeInTheDocument();
  });
});
