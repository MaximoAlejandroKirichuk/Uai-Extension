import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Login } from "./Login";

const onSubmitMock = vi.fn();
const onInputChangeMock = vi.fn();
const onGuestSignInMock = vi.fn();
let useAuthState = {
  formData: { email: "user@example.com", password: "secret" },
  loading: false,
  error: null as string | null,
  guestLoading: false,
  guestError: null as string | null,
  onSubmit: onSubmitMock,
  onGuestSignIn: onGuestSignInMock,
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
    onGuestSignInMock.mockReset();
    useAuthState = {
      formData: { email: "user@example.com", password: "secret" },
      loading: false,
      error: null,
      guestLoading: false,
      guestError: null,
      onSubmit: onSubmitMock,
      onGuestSignIn: onGuestSignInMock,
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
      guestLoading: false,
      guestError: null,
      onSubmit: onSubmitMock,
      onGuestSignIn: onGuestSignInMock,
      onInputChange: onInputChangeMock,
    };

    render(<Login />);

    expect(screen.getByRole("button", { name: /ingresando/i })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(/credenciales incorrectas/i);
  });

  it("renders an operable guest action outside the credential submit path", () => {
    useAuthState = {
      formData: { email: "", password: "" },
      loading: false,
      error: null,
      guestLoading: false,
      guestError: null,
      onSubmit: onSubmitMock,
      onGuestSignIn: onGuestSignInMock,
      onInputChange: onInputChangeMock,
    };

    render(<Login />);

    const guestButton = screen.getByRole("button", { name: /continuar como invitado/i });
    expect(guestButton).toHaveAttribute("type", "button");

    fireEvent.click(guestButton);

    expect(onGuestSignInMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("renders guest loading and error states", () => {
    useAuthState = {
      formData: { email: "user@example.com", password: "secret" },
      loading: false,
      error: null,
      guestLoading: true,
      guestError: "No pudimos iniciar el acceso invitado. Por favor, intentá de nuevo.",
      onSubmit: onSubmitMock,
      onGuestSignIn: onGuestSignInMock,
      onInputChange: onInputChangeMock,
    };

    render(<Login />);

    expect(screen.getByRole("button", { name: /ingresando como invitado/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(/acceso invitado/i);
  });
});
