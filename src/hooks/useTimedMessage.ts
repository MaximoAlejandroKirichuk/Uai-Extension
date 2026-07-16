import { useCallback, useEffect, useRef, useState } from "react";

export type TimedMessage = {
  type: "success" | "error";
  text: string;
};

export const useTimedMessage = () => {
  const [message, setMessage] = useState<TimedMessage | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearMessage = useCallback(() => {
    clearTimer();
    setMessage(null);
  }, [clearTimer]);

  const showMessage = useCallback(
    (nextMessage: TimedMessage, durationMs = 3000) => {
      clearTimer();
      setMessage(nextMessage);
      timeoutRef.current = setTimeout(() => {
        setMessage(null);
        timeoutRef.current = null;
      }, durationMs);
    },
    [clearTimer]
  );

  useEffect(() => clearTimer, [clearTimer]);

  return {
    message,
    showMessage,
    clearMessage,
  };
};
