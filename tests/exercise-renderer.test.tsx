import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/components/providers";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { grammarExercises } from "@/lib/data";

describe("risultato degli esercizi", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    window.history.replaceState({}, "", "/dashboard?demo=1");
    vi.stubGlobal("crypto", { randomUUID: () => "answer-id" });
  });

  it("non conta due volte l’ultima risposta corretta", async () => {
    const user = userEvent.setup();
    render(
      <AppProviders>
        <ExerciseRenderer exercises={[grammarExercises[0]]} />
      </AppProviders>,
    );

    const option = screen
      .getAllByRole("radio")
      .find((item) =>
        item.textContent?.endsWith(String(grammarExercises[0].correctAnswer)),
      );
    expect(option).toBeDefined();
    if (!option) throw new Error("Opzione corretta non trovata");
    await waitFor(() => expect(option).toBeEnabled());
    await user.click(option);
    await user.click(screen.getByRole("button", { name: /controlla/i }));
    await user.click(screen.getByRole("button", { name: /continua/i }));

    expect(
      screen.getByRole("heading", { name: "100% di accuratezza" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/200%/)).not.toBeInTheDocument();
  });

  it("nasconde la correzione fino alla consegna in modalita simulazione", async () => {
    const user = userEvent.setup();
    render(
      <AppProviders>
        <ExerciseRenderer exercises={[grammarExercises[0]]} enableModeSwitch />
      </AppProviders>,
    );

    await user.click(screen.getByRole("button", { name: /simulazione/i }));
    const option = screen
      .getAllByRole("radio")
      .find((item) =>
        item.textContent?.endsWith(String(grammarExercises[0].correctAnswer)),
      );
    expect(option).toBeDefined();
    if (!option) throw new Error("Opzione corretta non trovata");
    await waitFor(() => expect(option).toBeEnabled());
    await user.click(option);
    expect(screen.queryByText(/risposta corretta/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /consegna/i }));

    expect(
      screen.getByRole("heading", { name: "100% di accuratezza" }),
    ).toBeInTheDocument();
    expect(screen.getByText("SIMULAZIONE CONSEGNATA")).toBeInTheDocument();
  });
});
