import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Login } from "./Login";

const onSubmitMock = vi.fn();
const onInputChangeMock = vi.fn();
let useAuthState = {
  formData: { email: "user@example.com", password: "secret" },
  loading: false,
  error: null as string | null,
  onSubmit: onSubmitMock,
  onInputChange: onInputChangeMock,
};

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => useAuthState,
}));

describe("Login", () => {
  afterEach(() => {
    cleanup();
    onSubmitMock.mockReset();
    onInputChangeMock.mockReset();
    useAuthState = {
      formData: { email: "user@example.com", password: "secret" },
      loading: false,
      error: null,
      onSubmit: onSubmitMock,
      onInputChange: onInputChangeMock,
    };
  });

  it("submits through the form path", () => {
    render(<Login />);

    const form = screen.getByRole("button", { name: /login/i }).closest("form");
    expect(screen.getByRole("button", { name: /login/i })).toHaveAttribute("type", "submit");
    expect(form).not.toBeNull();

    fireEvent.submit(form as HTMLFormElement);

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });

  it("renders the loading and error states from useAuth", () => {
    useAuthState = {
      formData: { email: "user@example.com", password: "secret" },
      loading: true,
      error: "Credenciales incorrectas. Por favor, intentá de nuevo.",
      onSubmit: onSubmitMock,
      onInputChange: onInputChangeMock,
    };

    render(<Login />);

    expect(screen.getByRole("button", { name: /ingresando/i })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(/credenciales incorrectas/i);
  });
});
