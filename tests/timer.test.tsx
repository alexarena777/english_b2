import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExamTimer } from "@/components/exam-timer";
describe("timer simulazione", () => { it("scala il tempo e notifica la scadenza", () => { vi.useFakeTimers(); const onExpire=vi.fn(); render(<ExamTimer minutes={1} onExpire={onExpire}/>); expect(screen.getByText("01:00")).toBeInTheDocument(); act(()=>vi.advanceTimersByTime(60000)); expect(screen.getByText("00:00")).toBeInTheDocument(); act(()=>vi.runOnlyPendingTimers()); expect(onExpire).toHaveBeenCalled(); vi.useRealTimers(); }); });
