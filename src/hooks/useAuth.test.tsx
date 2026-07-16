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
          getIdToken: vi.fn().mockResolvedValue("token-123"),
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
});
