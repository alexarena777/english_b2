import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AppProviders,
  emptyProgressState,
  useProgress,
} from "@/components/providers";
import { grammarExercises } from "@/lib/data";
import { mockEvaluateWriting } from "@/lib/logic";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProviders>{children}</AppProviders>
);

describe("salvataggio progressi", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/");
    vi.stubGlobal("crypto", { randomUUID: () => "answer-id" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parte da uno stato pulito sul dispositivo", async () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));

    act(() =>
      result.current.recordAnswer(grammarExercises[0], "work", true, 60),
    );

    expect(result.current.state.completed).toBe(1);
    expect(result.current.state.answers.at(-1)?.correct).toBe(true);
    await waitFor(() =>
      expect(localStorage.getItem("b2-trainer-progress-v1")).toContain(
        '"completed":1',
      ),
    );
  });

  it("carica i dati dimostrativi solo con demo esplicita", async () => {
    window.history.replaceState({}, "", "/dashboard?demo=1");
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.storageMode).toBe("demo"));

    expect(window.location.search).toBe("");

    act(() =>
      result.current.recordAnswer(grammarExercises[0], "work", true, 60),
    );

    expect(result.current.state.completed).toBe(187);
  });

  it("ignora la vecchia demo persistente negli accessi normali", async () => {
    localStorage.setItem("b2-trainer-demo-mode", "1");
    localStorage.setItem(
      "b2-trainer-demo-progress-v1",
      JSON.stringify({
        ...emptyProgressState,
        xp: 1240,
        streak: 9,
        studyMinutes: 742,
        completed: 186,
        correct: 151,
        assessmentComplete: true,
        estimatedLevel: "B1+",
        readiness: 72,
        profileName: "Alex",
      }),
    );

    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.storageMode).toBe("device"));

    expect(result.current.state.completed).toBe(0);
    expect(localStorage.getItem("b2-trainer-demo-mode")).toBeNull();
  });

  it("invalida la vecchia percentuale quando il formato del test è cambiato", async () => {
    const legacyState = {
      ...emptyProgressState,
      assessmentComplete: true,
      readiness: 72,
      estimatedLevel: "B1+" as const,
    };
    delete legacyState.assessmentVersion;
    localStorage.setItem("b2-trainer-progress-v1", JSON.stringify(legacyState));

    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));

    expect(result.current.state.assessmentComplete).toBe(false);
    expect(result.current.state.readiness).toBe(0);
    expect(result.current.state.assessmentVersion).toBe(2);
  });

  it("esce dalla demo senza cancellare i progressi reali del dispositivo", async () => {
    localStorage.setItem(
      "b2-trainer-progress-v1",
      JSON.stringify({ ...emptyProgressState, completed: 4, xp: 48 }),
    );
    window.history.replaceState({}, "", "/dashboard?demo=1");
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.storageMode).toBe("demo"));

    act(() => result.current.resetDemo());

    expect(result.current.storageMode).toBe("device");
    expect(result.current.state.completed).toBe(4);
    expect(result.current.state.xp).toBe(48);
  });

  it("reimposta i progressi locali mantenendo profilo e preferenze", async () => {
    localStorage.setItem("b2-assessment-draft-v1", JSON.stringify({ index: 1, answers: [] }));
    localStorage.setItem("b2-assessment-draft-v2", JSON.stringify({ index: 1, answers: [] }));
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));

    act(() => {
      result.current.updateProfile({ profileName: "Alex", weeklyGoal: 4 });
      result.current.recordAnswer(grammarExercises[0], "work", true, 60);
    });
    await act(async () => result.current.resetProgress());

    expect(result.current.state.completed).toBe(0);
    expect(result.current.state.profileName).toBe("Alex");
    expect(result.current.state.weeklyGoal).toBe(4);
    expect(localStorage.getItem("b2-assessment-draft-v1")).toBeNull();
    expect(localStorage.getItem("b2-assessment-draft-v2")).toBeNull();
  });

  it("non modifica i dati se la cancellazione sincronizzata fallisce", async () => {
    const accountState = {
      ...emptyProgressState,
      completed: 4,
      correct: 3,
      xp: 40,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ state: accountState, user: { displayName: "Alex" } }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(new Response(null, { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.storageMode).toBe("account"));

    await expect(result.current.resetProgress()).rejects.toThrow(
      "I dati non sono stati modificati",
    );
    expect(result.current.state.completed).toBe(4);
    expect(result.current.state.xp).toBe(40);
  });

  it("avanza il ripasso quando un errore viene poi corretto", async () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));

    act(() =>
      result.current.recordAnswer(grammarExercises[0], "wrong", false, 30),
    );
    act(() =>
      result.current.recordAnswer(grammarExercises[0], "work", true, 30),
    );

    expect(result.current.state.reviews).toHaveLength(1);
    expect(result.current.state.reviews[0].errorCount).toBe(1);
    expect(result.current.state.reviews[0].correctStreak).toBe(1);
    expect(result.current.state.reviews[0].mastery).toBeGreaterThan(10);
  });

  it("salva una valutazione writing nello storico", async () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));

    act(() =>
      result.current.saveWritingSubmission({
        id: "writing-1",
        promptId: "w-essay",
        promptTitle: "Technology and learning",
        text: "However, technology can help students learn independently with clear goals.",
        wordCount: 10,
        evaluation: mockEvaluateWriting(
          "However, technology can help students learn independently with clear goals.",
        ),
        evaluationMode: "local",
        submittedAt: new Date().toISOString(),
      }),
    );

    expect(result.current.state.writingSubmissions).toHaveLength(1);
    expect(result.current.state.xp).toBe(25);
  });

  it("registra una simulazione e le sue risposte in un solo aggiornamento", async () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    const exercise = grammarExercises[0];
    const completedAt = new Date().toISOString();

    act(() =>
      result.current.completeExam(
        {
          id: "exam-1",
          examId: "short-1",
          title: "Simulazione breve",
          status: "completed",
          startedAt: new Date(Date.now() - 60_000).toISOString(),
          completedAt,
          durationSeconds: 60,
          questionCount: 1,
          answeredCount: 1,
          correctCount: 1,
          score: 100,
          sectionResults: [
            { section: "grammar", correct: 1, total: 1, score: 100 },
          ],
          weakTopics: [],
          answers: [
            {
              exerciseId: exercise.id,
              answer: String(exercise.correctAnswer),
              correct: true,
              section: exercise.section,
              topic: exercise.topic,
            },
          ],
        },
        [exercise],
      ),
    );

    expect(result.current.state.examAttempts).toHaveLength(1);
    expect(result.current.state.answers).toHaveLength(1);
    expect(result.current.state.correct).toBe(1);
  });

  it("salva solo metadati e autovalutazione dello speaking", async () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));

    act(() =>
      result.current.saveSpeakingAttempt({
        id: "speaking-1",
        promptId: "s-opinion",
        promptTitle: "Learning routines",
        durationSeconds: 90,
        scores: {
          fluency: 4,
          grammar: 3,
          vocabulary: 4,
          pronunciation: 3,
          taskAchievement: 4,
        },
        overall: 72,
        completedAt: new Date().toISOString(),
      }),
    );

    expect(result.current.state.speakingAttempts).toHaveLength(1);
    expect(result.current.state.speakingAttempts[0]).not.toHaveProperty("audio");
    expect(result.current.state.xp).toBe(30);
  });

  it("salva stato e richiamo di una parola nel profilo", async () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));

    act(() => result.current.setVocabularyStatus("v-01", "learning"));
    expect(result.current.state.vocabularyProgress[0].status).toBe("learning");

    act(() => result.current.recordVocabularyRecall("v-01", true));
    expect(result.current.state.vocabularyProgress[0].correctRecall).toBe(1);
    expect(result.current.state.vocabularyProgress[0].mastery).toBe(45);
    expect(result.current.state.xp).toBe(8);
  });
});
