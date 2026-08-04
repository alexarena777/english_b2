import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReviewPage from "@/app/review/page";
import {
  AppProviders,
  emptyProgressState,
} from "@/components/providers";
import { grammarExercises } from "@/lib/data";

vi.mock("next/navigation", () => ({
  usePathname: () => "/review",
}));

describe("quaderno degli errori", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/review");
    vi.stubGlobal("crypto", { randomUUID: () => "review-answer" });
  });

  it("filtra un errore programmato e avvia il ripasso mirato", async () => {
    const exercise = grammarExercises[0];
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString();
    localStorage.setItem(
      "b2-trainer-progress-v1",
      JSON.stringify({
        ...emptyProgressState,
        reviews: [
          {
            id: "review-1",
            exerciseId: exercise.id,
            question: exercise.question,
            givenAnswer: "am working",
            correctAnswer: String(exercise.correctAnswer),
            topic: exercise.topic,
            errorCount: 1,
            correctStreak: 0,
            mastery: 25,
            lastErrorAt: new Date().toISOString(),
            nextReviewAt: tomorrow,
          },
        ],
      }),
    );
    const user = userEvent.setup();

    render(
      <AppProviders>
        <ReviewPage />
      </AppProviders>,
    );

    await screen.findByRole("heading", {
      name: "Ogni errore ha il suo momento.",
    });
    await user.click(screen.getByRole("button", { name: /Programmati/ }));
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: exercise.topic }),
      ).toBeInTheDocument(),
    );
    await user.type(
      screen.getByLabelText("Cerca nel quaderno degli errori"),
      "present",
    );
    await user.click(screen.getByText("Vedi l’errore originale"));
    expect(screen.getByText(/La tua risposta:/)).toBeInTheDocument();
    expect(screen.getByText(/Risposta corretta:/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ripassa ora" }));
    expect(screen.getByText(exercise.question)).toBeInTheDocument();
  });
});
