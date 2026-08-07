"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  ExamAttempt,
  Exercise,
  ProgressState,
  ReviewItem,
  SpeakingAttempt,
  UserAnswer,
  VocabularyStatus,
  VocabularyWordProgress,
  WritingSubmission,
} from "@/lib/types";
import { updateReview } from "@/lib/logic";
import { updateVocabularyRecall, vocabularyStatusProgress } from "@/lib/vocabulary";
import { progressStateSchema } from "@/lib/schemas";
import { dateKey, todayKey } from "@/lib/utils";
import { PwaManager } from "@/components/pwa-manager";

const LOCAL_STORAGE_KEY = "b2-trainer-progress-v1";
const DEMO_STORAGE_KEY = "b2-trainer-demo-progress-v1";
const LEGACY_DEMO_MODE_KEY = "b2-trainer-demo-mode";
const ASSESSMENT_DRAFT_KEY = "b2-assessment-draft-v2";
const LEGACY_ASSESSMENT_DRAFT_KEY = "b2-assessment-draft-v1";
const CURRENT_ASSESSMENT_VERSION = 2;

export const emptyProgressState: ProgressState = {
  xp: 0,
  streak: 0,
  studyMinutes: 0,
  completed: 0,
  correct: 0,
  assessmentComplete: false,
  assessmentVersion: CURRENT_ASSESSMENT_VERSION,
  estimatedLevel: "B1",
  readiness: 0,
  answers: [],
  reviews: [],
  examAttempts: [],
  writingSubmissions: [],
  speakingAttempts: [],
  vocabularyProgress: [],
  weeklyGoal: 5,
  profileName: "Studente",
};

export const demoProgressState: ProgressState = {
  xp: 1240,
  streak: 9,
  studyMinutes: 742,
  completed: 186,
  correct: 151,
  assessmentComplete: true,
  assessmentVersion: CURRENT_ASSESSMENT_VERSION,
  estimatedLevel: "B1+",
  readiness: 72,
  answers: [],
  reviews: [],
  examAttempts: [],
  writingSubmissions: [],
  speakingAttempts: [],
  vocabularyProgress: [],
  lastStudyDate: "2026-07-30",
  weeklyGoal: 5,
  profileName: "Alex",
};

export type StorageMode = "loading" | "account" | "device" | "demo";
export type SyncStatus = "idle" | "saving" | "saved" | "error";

type ProgressContextValue = {
  state: ProgressState;
  recordAnswer: (
    exercise: Exercise,
    answer: string | string[],
    correct: boolean,
    timeSpent?: number,
  ) => void;
  rateReview: (
    exercise: Exercise,
    answer: string,
    correct: boolean,
    difficulty: "easy" | "normal" | "hard",
  ) => void;
  updateProfile: (partial: Partial<ProgressState>) => void;
  saveWritingSubmission: (submission: WritingSubmission) => void;
  saveSpeakingAttempt: (attempt: SpeakingAttempt) => void;
  setVocabularyStatus: (wordId: string, status: "new" | VocabularyStatus) => void;
  recordVocabularyRecall: (wordId: string, correct: boolean) => void;
  completeExam: (attempt: ExamAttempt, exercises: Exercise[]) => void;
  resetProgress: () => Promise<void>;
  resetDemo: () => void;
  hydrated: boolean;
  storageMode: StorageMode;
  syncStatus: SyncStatus;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function readStoredState(key: string, fallback: ProgressState) {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;
  const parsed = progressStateSchema.safeParse(JSON.parse(saved));
  if (!parsed.success) {
    localStorage.removeItem(key);
    return fallback;
  }
  return normalizeAssessmentState(parsed.data);
}

function normalizeAssessmentState(state: ProgressState): ProgressState {
  if (
    state.assessmentComplete &&
    state.assessmentVersion !== CURRENT_ASSESSMENT_VERSION
  ) {
    return {
      ...state,
      assessmentComplete: false,
      assessmentVersion: CURRENT_ASSESSMENT_VERSION,
      estimatedLevel: "B1",
      readiness: 0,
    };
  }
  return {
    ...state,
    assessmentVersion: CURRENT_ASSESSMENT_VERSION,
  };
}

function displayName(value: string) {
  const candidate = value.includes("@") ? value.split("@")[0] : value;
  return candidate.trim().slice(0, 60) || "Studente";
}

export function computeStreakAndQuotas(
  current: ProgressState,
  section?: string,
): Pick<
  ProgressState,
  "streak" | "lastStudyDate" | "lastStreakDate" | "dailyQuotas"
> {
  const today = todayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = dateKey(yesterday);

  let quotas = current.dailyQuotas;
  if (!quotas || quotas.date !== today) {
    quotas = { date: today, vocabulary: 0, reading: 0, listening: 0 };
  }

  if (section === "vocabulary") {
    quotas = { ...quotas, vocabulary: quotas.vocabulary + 1 };
  } else if (section === "reading") {
    quotas = { ...quotas, reading: quotas.reading + 1 };
  } else if (section === "listening") {
    quotas = { ...quotas, listening: quotas.listening + 1 };
  }

  const goalsMet =
    quotas.vocabulary >= 1 && quotas.reading >= 1 && quotas.listening >= 1;

  let streak = current.streak;
  let lastStreakDate = current.lastStreakDate;

  if (goalsMet && lastStreakDate !== today) {
    if (lastStreakDate === yesterdayStr) {
      streak += 1;
    } else {
      streak = 1;
    }
    lastStreakDate = today;
  } else if (lastStreakDate !== today && lastStreakDate !== yesterdayStr) {
    streak = 0;
  }

  return {
    streak,
    lastStudyDate: today,
    lastStreakDate,
    dailyQuotas: quotas,
  };
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(emptyProgressState);
  const [hydrated, setHydrated] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>("loading");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  useEffect(() => {
    async function loadAccountState() {
      if (typeof fetch !== "function") return;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 2500);
      try {
        const response = await fetch("/api/progress", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const payload = (await response.json()) as {
          state?: unknown;
          user?: { displayName?: string };
        };
        const parsed = progressStateSchema.safeParse(payload.state);
        setState(
          parsed.success
            ? normalizeAssessmentState(parsed.data)
            : {
                ...emptyProgressState,
                profileName: displayName(
                  payload.user?.displayName ?? "Studente",
                ),
              },
        );
        localStorage.removeItem(LEGACY_DEMO_MODE_KEY);
        setStorageMode("account");
      } catch {
        // The account endpoint is optional in local development.
      } finally {
        clearTimeout(timeout);
      }
    }

    queueMicrotask(() => {
      const requestedDemo =
        new URLSearchParams(window.location.search).get("demo") === "1";
      localStorage.removeItem(LEGACY_DEMO_MODE_KEY);

      if (requestedDemo) {
        setState(readStoredState(DEMO_STORAGE_KEY, demoProgressState));
        setStorageMode("demo");
        setHydrated(true);
        const url = new URL(window.location.href);
        url.searchParams.delete("demo");
        window.history.replaceState(
          window.history.state,
          "",
          `${url.pathname}${url.search}${url.hash}`,
        );
        return;
      }

      setState(readStoredState(LOCAL_STORAGE_KEY, emptyProgressState));
      setStorageMode("device");
      setHydrated(true);
      void loadAccountState();
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (storageMode === "demo" || storageMode === "device") {
      const key = storageMode === "demo" ? DEMO_STORAGE_KEY : LOCAL_STORAGE_KEY;
      localStorage.setItem(key, JSON.stringify(state));
      return;
    }

    if (storageMode !== "account") return;
    queueMicrotask(() => setSyncStatus("saving"));
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        });
        setSyncStatus(response.ok ? "saved" : "error");
      } catch {
        setSyncStatus("error");
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [state, hydrated, storageMode]);

  const recordAnswer = useCallback(
    (
      exercise: Exercise,
      answer: string | string[],
      correct: boolean,
      timeSpent = 45,
    ) =>
      setState((current) => {
        const userAnswer: UserAnswer = {
          id: crypto.randomUUID(),
          exerciseId: exercise.id,
          answer,
          correct,
          section: exercise.section,
          topic: exercise.topic,
          answeredAt: new Date().toISOString(),
          timeSpent,
        };
        const previous = current.reviews.find(
          (review) => review.exerciseId === exercise.id,
        );
        let reviews = current.reviews;
        if (previous || !correct) {
          const review = updateReview(
            previous,
            exercise,
            Array.isArray(answer) ? answer.join(" / ") : answer,
            correct,
          );
          reviews = [
            ...reviews.filter((item) => item.exerciseId !== exercise.id),
            review,
          ];
        }

        const streakUpdates = computeStreakAndQuotas(current, exercise.section);

        return {
          ...current,
          ...streakUpdates,
          xp: current.xp + (correct ? 12 : 4),
          completed: current.completed + 1,
          correct: current.correct + (correct ? 1 : 0),
          studyMinutes:
            current.studyMinutes + Math.max(1, Math.round(timeSpent / 60)),
          answers: [...current.answers, userAnswer].slice(-5000),
          reviews,
        };
      }),
    [],
  );

  const rateReview = useCallback(
    (
      exercise: Exercise,
      answer: string,
      correct: boolean,
      difficulty: "easy" | "normal" | "hard",
    ) =>
      setState((current) => {
        const previous = current.reviews.find(
          (review) => review.exerciseId === exercise.id,
        );
        const review: ReviewItem = updateReview(
          previous,
          exercise,
          answer,
          correct,
          difficulty,
        );
        return {
          ...current,
          reviews: [
            ...current.reviews.filter(
              (item) => item.exerciseId !== exercise.id,
            ),
            review,
          ],
        };
      }),
    [],
  );

  const updateProfile = useCallback(
    (partial: Partial<ProgressState>) =>
      setState((current) => ({ ...current, ...partial })),
    [],
  );

  const saveWritingSubmission = useCallback(
    (submission: WritingSubmission) =>
      setState((current) => {
        if (current.writingSubmissions.some((item) => item.id === submission.id)) {
          return current;
        }
        const streakUpdates = computeStreakAndQuotas(current, "writing");

        return {
          ...current,
          ...streakUpdates,
          xp: current.xp + 25,
          studyMinutes:
            current.studyMinutes + Math.max(5, Math.round(submission.wordCount / 20)),
          writingSubmissions: [...current.writingSubmissions, submission].slice(-20),
        };
      }),
    [],
  );

  const saveSpeakingAttempt = useCallback(
    (attempt: SpeakingAttempt) =>
      setState((current) => {
        if (current.speakingAttempts.some((item) => item.id === attempt.id)) {
          return current;
        }
        const streakUpdates = computeStreakAndQuotas(current, "speaking");

        return {
          ...current,
          ...streakUpdates,
          xp: current.xp + 30,
          studyMinutes:
            current.studyMinutes + Math.max(1, Math.round(attempt.durationSeconds / 60)),
          speakingAttempts: [...current.speakingAttempts, attempt].slice(-30),
        };
      }),
    [],
  );

  const setVocabularyStatus = useCallback(
    (wordId: string, status: "new" | VocabularyStatus) =>
      setState((current) => {
        if (status === "new") {
          return {
            ...current,
            vocabularyProgress: current.vocabularyProgress.filter(
              (item) => item.wordId !== wordId,
            ),
          };
        }
        const previous = current.vocabularyProgress.find(
          (item) => item.wordId === wordId,
        );
        const progress: VocabularyWordProgress = vocabularyStatusProgress(
          previous,
          wordId,
          status,
        );
        return {
          ...current,
          vocabularyProgress: [
            ...current.vocabularyProgress.filter((item) => item.wordId !== wordId),
            progress,
          ].slice(-300),
        };
      }),
    [],
  );

  const recordVocabularyRecall = useCallback(
    (wordId: string, correct: boolean) =>
      setState((current) => {
        const previous = current.vocabularyProgress.find(
          (item) => item.wordId === wordId,
        );
        const progress = updateVocabularyRecall(previous, wordId, correct);
        const streakUpdates = computeStreakAndQuotas(current, "vocabulary");

        return {
          ...current,
          ...streakUpdates,
          xp: current.xp + (correct ? 8 : 2),
          studyMinutes: current.studyMinutes + 1,
          vocabularyProgress: [
            ...current.vocabularyProgress.filter((item) => item.wordId !== wordId),
            progress,
          ].slice(-300),
        };
      }),
    [],
  );

  const completeExam = useCallback(
    (attempt: ExamAttempt, exercises: Exercise[]) =>
      setState((current) => {
        if (current.examAttempts.some((item) => item.id === attempt.id)) {
          return current;
        }

        const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));
        let reviews = current.reviews;
        const recordedAnswers: UserAnswer[] = [];
        const perAnswerSeconds = attempt.answeredCount
          ? Math.max(1, Math.round(attempt.durationSeconds / attempt.answeredCount))
          : 0;

        for (const answer of attempt.answers) {
          if (!answer.answer.trim()) continue;
          const exercise = exerciseMap.get(answer.exerciseId);
          if (!exercise) continue;
          recordedAnswers.push({
            id: crypto.randomUUID(),
            exerciseId: answer.exerciseId,
            answer: answer.answer,
            correct: answer.correct,
            section: answer.section,
            topic: answer.topic,
            answeredAt: attempt.completedAt,
            timeSpent: perAnswerSeconds,
          });
          const previous = reviews.find(
            (review) => review.exerciseId === answer.exerciseId,
          );
          if (previous || !answer.correct) {
            const review = updateReview(
              previous,
              exercise,
              answer.answer,
              answer.correct,
              "normal",
              new Date(attempt.completedAt),
            );
            reviews = [
              ...reviews.filter((item) => item.exerciseId !== answer.exerciseId),
              review,
            ];
          }
        }

        let streakUpdates: Pick<ProgressState, "streak" | "lastStudyDate" | "lastStreakDate" | "dailyQuotas"> = {
          streak: current.streak,
          lastStudyDate: current.lastStudyDate,
          lastStreakDate: current.lastStreakDate,
          dailyQuotas: current.dailyQuotas,
        };

        if (recordedAnswers.length > 0) {
          const sectionsDone = new Set(recordedAnswers.map((a) => a.section));
          for (const sec of sectionsDone) {
             streakUpdates = computeStreakAndQuotas({ ...current, ...streakUpdates }, sec);
          }
        }

        const answeredCount = recordedAnswers.length;
        const correctCount = recordedAnswers.filter((answer) => answer.correct).length;
        return {
          ...current,
          ...streakUpdates,
          xp: current.xp + correctCount * 12 + (answeredCount - correctCount) * 4,
          completed: current.completed + answeredCount,
          correct: current.correct + correctCount,
          studyMinutes:
            current.studyMinutes +
            (attempt.durationSeconds > 0
              ? Math.max(1, Math.round(attempt.durationSeconds / 60))
              : 0),
          answers: [...current.answers, ...recordedAnswers].slice(-5000),
          reviews,
          examAttempts: [...current.examAttempts, attempt].slice(-20),
        };
      }),
    [],
  );

  const resetProgress = useCallback(async () => {
    if (storageMode === "demo") {
      throw new Error(
        "La demo è separata dai tuoi progressi. Esci dalla demo per tornare ai dati reali.",
      );
    }

    if (storageMode === "account") {
      let response: Response;
      try {
        response = await fetch("/api/progress", { method: "DELETE" });
      } catch {
        throw new Error(
          "Non è stato possibile cancellare i progressi sincronizzati. I dati non sono stati modificati.",
        );
      }
      if (!response.ok) {
        throw new Error(
          "Non è stato possibile cancellare i progressi sincronizzati. I dati non sono stati modificati.",
        );
      }
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(DEMO_STORAGE_KEY);
    localStorage.removeItem(LEGACY_DEMO_MODE_KEY);
    localStorage.removeItem(ASSESSMENT_DRAFT_KEY);
    localStorage.removeItem(LEGACY_ASSESSMENT_DRAFT_KEY);
    setState((current) => ({
      ...emptyProgressState,
      profileName: current.profileName,
      weeklyGoal: current.weeklyGoal,
    }));
    if (storageMode !== "account") {
      setStorageMode("device");
    }
  }, [storageMode]);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    localStorage.removeItem(LEGACY_DEMO_MODE_KEY);
    setState(readStoredState(LOCAL_STORAGE_KEY, emptyProgressState));
    setStorageMode("device");
  }, []);

  const value = useMemo(
    () => ({
      state,
      recordAnswer,
      rateReview,
      updateProfile,
      saveWritingSubmission,
      saveSpeakingAttempt,
      setVocabularyStatus,
      recordVocabularyRecall,
      completeExam,
      resetProgress,
      resetDemo,
      hydrated,
      storageMode,
      syncStatus,
    }),
    [
      state,
      recordAnswer,
      rateReview,
      updateProfile,
      saveWritingSubmission,
      saveSpeakingAttempt,
      setVocabularyStatus,
      recordVocabularyRecall,
      completeExam,
      resetProgress,
      resetDemo,
      hydrated,
      storageMode,
      syncStatus,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>
      <PwaManager lastStudyDate={state.lastStudyDate} />
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error("useProgress deve essere usato dentro AppProviders");
  }
  return value;
}
