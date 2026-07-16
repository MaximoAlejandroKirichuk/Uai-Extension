import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTimedMessage } from "./useTimedMessage";

const Harness = () => {
  const { message, showMessage, clearMessage } = useTimedMessage();

  return (
    <div>
      <button onClick={() => showMessage({ type: "success", text: "First" })}>show-first</button>
      <button onClick={() => showMessage({ type: "error", text: "Second" })}>show-second</button>
      <button onClick={clearMessage}>clear</button>
      {message && <p>{message.text}</p>}
    </div>
  );
};

describe("useTimedMessage", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("replaces the previous timeout when a new message is shown", () => {
    vi.useFakeTimers();

    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: /show-first/i }));
    expect(screen.getByText("First")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    fireEvent.click(screen.getByRole("button", { name: /show-second/i }));
    expect(screen.getByText("Second")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(screen.getByText("Second")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByText("Second")).not.toBeInTheDocument();
  });

  it("clears the pending timeout when the component unmounts", () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { unmount } = render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: /show-first/i }));
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
