"use client";

import { useEffect, useRef, useState } from "react";
import { Clock3 } from "lucide-react";

export function ExamTimer({
  minutes,
  running = true,
  onExpire,
}: {
  minutes: number;
  running?: boolean;
  onExpire?: () => void;
}) {
  const [seconds, setSeconds] = useState(minutes * 60);
  const expired = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setSeconds((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (seconds !== 0 || expired.current) return;
    expired.current = true;
    onExpireRef.current?.();
  }, [seconds]);

  return (
    <div
      className={`exam-timer ${seconds < 300 ? "urgent" : ""}`}
      role="timer"
      aria-live={seconds < 60 ? "polite" : "off"}
    >
      <Clock3 size={17} />
      <span>
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
      </span>
    </div>
  );
}
