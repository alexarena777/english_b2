import type { ProgressState } from "./types";

export type AchievementIcon =
  | "assessment"
  | "streak"
  | "practice"
  | "vocabulary"
  | "grammar"
  | "reading"
  | "listening"
  | "mastery";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unlocked: boolean;
  icon: AchievementIcon;
}

export function deriveAchievements(state: ProgressState): Achievement[] {
  const masteredReviews = state.reviews.filter(
    (review) => review.mastery >= 80,
  ).length;
  const masteredWords = state.vocabularyProgress.filter(
    (item) => item.status === "mastered",
  ).length;
  const attemptsBySection = (section: string) =>
    new Set(
      state.answers
        .filter((answer) => answer.section === section)
        .map((answer) => answer.exerciseId),
    ).size;
  const coreCompleted = state.answers.filter((answer) =>
    ["grammar", "vocabulary", "reading", "listening"].includes(answer.section),
  ).length;

  const entries: Omit<Achievement, "unlocked">[] = [
    {
      id: "assessment",
      title: "Punto di partenza",
      description: "Completa il test iniziale.",
      progress: Number(state.assessmentComplete),
      target: 1,
      icon: "assessment",
    },
    {
      id: "streak-3",
      title: "Buon ritmo",
      description: "Mantieni una serie di 3 giorni.",
      progress: state.streak,
      target: 3,
      icon: "streak",
    },
    {
      id: "practice-25",
      title: "Prime fondamenta",
      description: "Completa 25 esercizi.",
      progress: coreCompleted,
      target: 25,
      icon: "practice",
    },
    {
      id: "vocabulary-10",
      title: "Lessico attivo",
      description: "Consolida 10 parole della raccolta.",
      progress: masteredWords,
      target: 10,
      icon: "vocabulary",
    },
    {
      id: "grammar-25",
      title: "Verbi sotto controllo",
      description: "Completa 25 esercizi sui tempi verbali.",
      progress: attemptsBySection("grammar"),
      target: 25,
      icon: "grammar",
    },
    {
      id: "reading-12",
      title: "Lettore attento",
      description: "Rispondi a 12 domande di comprensione.",
      progress: attemptsBySection("reading"),
      target: 12,
      icon: "reading",
    },
    {
      id: "listening-10",
      title: "Orecchio B2",
      description: "Rispondi a 10 domande di ascolto.",
      progress: attemptsBySection("listening"),
      target: 10,
      icon: "listening",
    },
    {
      id: "mastery-3",
      title: "Errore trasformato",
      description: "Porta 3 elementi di ripasso almeno all'80%.",
      progress: masteredReviews,
      target: 3,
      icon: "mastery",
    },
    {
      id: "streak-7",
      title: "Settimana completa",
      description: "Mantieni una serie di 7 giorni.",
      progress: state.streak,
      target: 7,
      icon: "streak",
    },
    {
      id: "practice-100",
      title: "Cento passi",
      description: "Completa 100 esercizi.",
      progress: coreCompleted,
      target: 100,
      icon: "practice",
    },
    {
      id: "vocabulary-50",
      title: "Vocabolario in crescita",
      description: "Consolida 50 parole B2.",
      progress: masteredWords,
      target: 50,
      icon: "vocabulary",
    },
  ];

  return entries.map((entry) => ({
    ...entry,
    progress: Math.min(entry.progress, entry.target),
    unlocked: entry.progress >= entry.target,
  }));
}
