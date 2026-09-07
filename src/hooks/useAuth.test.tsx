import { cleanup, fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "./useAuth";

const dispatchMock = vi.fn();
const navigateMock = vi.fn();
const signInMock = vi.fn();
const setUserMock = vi.fn((payload: unknown) => ({ type: "user/setUser", payload }));

vi.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => signInMock(...args),
}));

vi.mock("../firebase/firebaseConfig", () => ({
  auth: { key: "mock-auth" },
}));

vi.mock("../store/slices/user/userSlice", () => ({
  setUser: (payload: unknown) => setUserMock(payload),
}));

const Harness = () => {
  const { formData, loading, error, onSubmit, onInputChange } = useAuth();

  return (
    <form onSubmit={onSubmit}>
      <input aria-label="Email" name="email" value={formData.email} onChange={onInputChange} />
      <input
        aria-label="Password"
        name="password"
        value={formData.password}
        onChange={onInputChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Login"}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
};

describe("useAuth", () => {
  beforeEach(() => {
    dispatchMock.mockReset();
    navigateMock.mockReset();
    signInMock.mockReset();
    setUserMock.mockClear();
  });

  afterEach(cleanup);

  it("ignores duplicate submits while a login request is pending", async () => {
    let resolveSignIn: ((value: unknown) => void) | undefined;
    const pendingSignIn = new Promise((resolve) => {
      resolveSignIn = resolve;
    });

    signInMock.mockReturnValue(pendingSignIn);

    render(<Harness />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: "email", value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: "password", value: "secret" },
    });

    const form = screen.getByRole("button", { name: /login/i }).closest("form");
    expect(form).not.toBeNull();

    fireEvent.submit(form as HTMLFormElement);
    fireEvent.submit(form as HTMLFormElement);

    expect(signInMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSignIn?.({
        user: {
          email: "test@example.com",
          uid: "uid-1",
          getIdTokenResult: vi.fn().mockResolvedValue({
            token: "token-123",
            claims: {},
          }),
        },
      });
      await pendingSignIn;
    });

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "user/setUser",
        payload: {
          emailUser: "test@example.com",
          token: "token-123",
          localId: "uid-1",
          readonly: false,
          canWrite: true,
        },
      });
    });
    expect(navigateMock).toHaveBeenCalledWith("/Home");
  });

  it("surfaces an inline error when sign-in fails", async () => {
    signInMock.mockRejectedValue(new Error("bad credentials"));

    render(<Harness />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: "email", value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: "password", value: "secret" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }).closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/credenciales incorrectas/i);
    });

    expect(screen.getByRole("button", { name: /login/i })).not.toBeDisabled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("maps the readonly claim to a read-only session", async () => {
    signInMock.mockResolvedValue({
      user: {
        email: "readonly@example.com",
        uid: "uid-readonly",
        getIdTokenResult: vi.fn().mockResolvedValue({
          token: "readonly-token",
          claims: { readonly: true },
        }),
      },
    });

    render(<Harness />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: "email", value: "readonly@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: "password", value: "secret" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /login/i }).closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "user/setUser",
        payload: {
          emailUser: "readonly@example.com",
          token: "readonly-token",
          localId: "uid-readonly",
          readonly: true,
          canWrite: false,
        },
      });
    });
  });

  it("forces the demo account read-only even when the readonly claim is missing", async () => {
    signInMock.mockResolvedValue({
      user: {
        email: "ciiti-test@uai.edu.ar",
        uid: "uid-demo",
        getIdTokenResult: vi.fn().mockResolvedValue({
          token: "demo-token",
          claims: {},
        }),
      },
    });

    render(<Harness />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: "email", value: "ciiti-test@uai.edu.ar" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: "password", value: "secret" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /login/i }).closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "user/setUser",
        payload: {
          emailUser: "ciiti-test@uai.edu.ar",
          token: "demo-token",
          localId: "uid-demo",
          readonly: true,
          canWrite: false,
        },
      });
    });
  });

  it("force-refreshes the ID token so freshly assigned custom claims are not stale", async () => {
    const getIdTokenResultMock = vi.fn().mockResolvedValue({
      token: "fresh-token",
      claims: { readonly: true },
    });

    signInMock.mockResolvedValue({
      user: {
        email: "readonly@example.com",
        uid: "uid-readonly",
        getIdTokenResult: getIdTokenResultMock,
      },
    });

    render(<Harness />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: "email", value: "readonly@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: "password", value: "secret" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /login/i }).closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(getIdTokenResultMock).toHaveBeenCalledWith(true);
    });
  });

  it("surfaces an inline error when token claim loading fails", async () => {
    signInMock.mockResolvedValue({
      user: {
        email: "test@example.com",
        uid: "uid-1",
        getIdTokenResult: vi.fn().mockRejectedValue(new Error("claims unavailable")),
      },
    });

    render(<Harness />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: "email", value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: "password", value: "secret" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /login/i }).closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/credenciales incorrectas/i);
    });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
