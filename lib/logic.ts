import type {
  AssessmentResult,
  ExamAnswer,
  ExamSectionResult,
  Exercise,
  Level,
  ProgressState,
  ReviewItem,
  UserAnswer,
  WeeklyPlanDay,
  WritingEvaluation,
} from "./types";
import { dateKey } from "./utils";

export function normalizeAnswer(value: string) { return value.trim().toLowerCase().replace(/[.,!?;:]+$/g, "").replace(/\s+/g, " "); }
export function evaluateAnswer(exercise: Exercise, answer: string | string[]) {
  const expected = Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer : [exercise.correctAnswer];
  const accepted = [...expected, ...(exercise.acceptedAnswers ?? [])].map(normalizeAnswer);
  const given = Array.isArray(answer) ? answer.join("|") : answer;
  return accepted.includes(normalizeAnswer(given));
}

export function nextReviewDate(correctStreak: number, wasCorrect: boolean, difficulty: "easy" | "normal" | "hard" = "normal", from = new Date()) {
  const baseDays = wasCorrect ? [3, 7, 14, 30][Math.min(correctStreak, 3)] : 1;
  const factor = difficulty === "easy" ? 1.5 : difficulty === "hard" ? 0.5 : 1;
  const date = new Date(from); date.setDate(date.getDate() + Math.max(1, Math.round(baseDays * factor))); return date;
}

export function updateReview(previous: ReviewItem | undefined, exercise: Exercise, given: string, correct: boolean, difficulty: "easy" | "normal" | "hard" = "normal", now = new Date()): ReviewItem {
  const streak = correct ? (previous?.correctStreak ?? 0) + 1 : 0;
  const errorCount = (previous?.errorCount ?? 0) + (correct ? 0 : 1);
  return { id: previous?.id ?? `review-${exercise.id}`, exerciseId: exercise.id, question: exercise.question, givenAnswer: given, correctAnswer: Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer.join(" / ") : exercise.correctAnswer, topic: exercise.topic, errorCount, correctStreak: streak, mastery: Math.max(0, Math.min(100, (previous?.mastery ?? 25) + (correct ? 20 : -15))), lastErrorAt: correct ? previous?.lastErrorAt ?? now.toISOString() : now.toISOString(), nextReviewAt: nextReviewDate(streak, correct, difficulty, now).toISOString() };
}

export function calculateAssessment(answers: UserAnswer[]): AssessmentResult {
  const sections = ["grammar", "vocabulary", "reading", "listening"];
  const sectionScores = Object.fromEntries(sections.map((section) => { const subset = answers.filter((a) => a.section === section); return [section, subset.length ? Math.round(subset.filter((a) => a.correct).length / subset.length * 100) : 0]; }));
  const overall = answers.length ? Math.round(answers.filter((a) => a.correct).length / answers.length * 100) : 0;
  const level: Level = overall < 35 ? "A2" : overall < 52 ? "B1" : overall < 65 ? "B1+" : overall < 82 ? "B2" : "B2+";
  const topicErrors = new Map<string, number>(); answers.filter((a) => !a.correct).forEach((a) => topicErrors.set(a.topic, (topicErrors.get(a.topic) ?? 0) + 1));
  const weakTopics = [...topicErrors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([topic]) => topic);
  return { level, readiness: Math.round(overall), overall, sectionScores, weakTopics, studyPlan: weakTopics.slice(0, 3).map((topic, index) => ({ title: topic, reason: index === 0 ? "Priorità alta: più errori nel test" : "Da consolidare per il livello B2", sessions: 3 - Math.min(index, 1) })) };
}

export function generateDailySession(
  exercises: Exercise[],
  state: ProgressState,
  size = 8,
  now = new Date(),
) {
  const dueReviews = state.reviews
    .filter((review) => new Date(review.nextReviewAt) <= now)
    .sort(
      (left, right) =>
        new Date(left.nextReviewAt).getTime() -
        new Date(right.nextReviewAt).getTime(),
    );
  const dueIds = new Set(dueReviews.map((review) => review.exerciseId));
  const weakTopics = new Set(
    [...state.reviews]
      .sort(
        (left, right) =>
          left.mastery - right.mastery || right.errorCount - left.errorCount,
      )
      .map((review) => review.topic),
  );
  const lastAnsweredAt = new Map<string, number>();
  state.answers.forEach((answer) => {
    const answeredAt = new Date(answer.answeredAt).getTime();
    const current = lastAnsweredAt.get(answer.exerciseId) ?? 0;
    if (answeredAt > current) lastAnsweredAt.set(answer.exerciseId, answeredAt);
  });
  const ranked = [...exercises].sort(
    (left, right) =>
      Number(dueIds.has(right.id)) - Number(dueIds.has(left.id)) ||
      Number(weakTopics.has(right.topic)) - Number(weakTopics.has(left.topic)) ||
      (lastAnsweredAt.get(left.id) ?? 0) - (lastAnsweredAt.get(right.id) ?? 0) ||
      left.id.localeCompare(right.id),
  );
  const selected: Exercise[] = [];
  const selectedIds = new Set<string>();
  const add = (exercise: Exercise | undefined) => {
    if (!exercise || selectedIds.has(exercise.id) || selected.length >= size) return;
    selected.push(exercise);
    selectedIds.add(exercise.id);
  };

  ranked.filter((exercise) => dueIds.has(exercise.id)).slice(0, 3).forEach(add);
  const sectionOrder: Exercise["section"][] = [
    "grammar",
    "vocabulary",
    "reading",
    "listening",
  ];
  let cursor = 0;
  while (selected.length < size && cursor < size * sectionOrder.length) {
    const section = sectionOrder[cursor % sectionOrder.length];
    add(
      ranked.find(
        (exercise) =>
          exercise.section === section && !selectedIds.has(exercise.id),
      ),
    );
    cursor += 1;
  }
  ranked.forEach(add);
  return selected;
}

export function calculateExamResult(
  exercises: Exercise[],
  responses: Record<string, string>,
) {
  const answers: ExamAnswer[] = exercises.map((exercise) => {
    const answer = responses[exercise.id]?.trim() ?? "";
    return {
      exerciseId: exercise.id,
      answer,
      correct: answer ? evaluateAnswer(exercise, answer) : false,
      section: exercise.section,
      topic: exercise.topic,
    };
  });
  const sections = [...new Set(exercises.map((exercise) => exercise.section))];
  const sectionResults: ExamSectionResult[] = sections.map((section) => {
    const subset = answers.filter((answer) => answer.section === section);
    const correct = subset.filter((answer) => answer.correct).length;
    return {
      section,
      correct,
      total: subset.length,
      score: subset.length ? Math.round((correct / subset.length) * 100) : 0,
    };
  });
  const topicErrors = new Map<string, number>();
  answers
    .filter((answer) => !answer.correct)
    .forEach((answer) =>
      topicErrors.set(answer.topic, (topicErrors.get(answer.topic) ?? 0) + 1),
    );
  const correctCount = answers.filter((answer) => answer.correct).length;
  return {
    answers,
    answeredCount: answers.filter((answer) => answer.answer).length,
    correctCount,
    score: exercises.length
      ? Math.round((correctCount / exercises.length) * 100)
      : 0,
    sectionResults,
    weakTopics: [...topicErrors.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([topic]) => topic),
  };
}

export function buildWeeklyStudyPlan(
  state: ProgressState,
  now = new Date(),
): WeeklyPlanDay[] {
  const sectionConfig = [
    { key: "grammar", label: "Grammatica mirata", href: "/grammar" },
    { key: "vocabulary", label: "Vocabolario attivo", href: "/vocabulary" },
    { key: "use-of-english", label: "Use of English", href: "/use-of-english" },
    { key: "reading", label: "Reading strategico", href: "/reading" },
    { key: "listening", label: "Listening mirato", href: "/listening" },
  ] as const;
  const sectionPerformance = sectionConfig.map((section) => {
    const answers = state.answers.filter((answer) => answer.section === section.key);
    const vocabularyMastery =
      section.key === "vocabulary" && state.vocabularyProgress.length
        ? Math.round(
            state.vocabularyProgress.reduce(
              (total, item) => total + item.mastery,
              0,
            ) / state.vocabularyProgress.length,
          )
        : null;
    return {
      ...section,
      score: vocabularyMastery ?? (answers.length
        ? Math.round(
            (answers.filter((answer) => answer.correct).length / answers.length) *
              100,
          )
        : 50),
      total:
        vocabularyMastery === null
          ? answers.length
          : state.vocabularyProgress.length,
    };
  });
  const weakest = [...sectionPerformance].sort(
    (left, right) =>
      left.score - right.score || right.total - left.total,
  )[0];
  const comprehension = [...sectionPerformance]
    .filter((section) => section.key === "reading" || section.key === "listening")
    .sort((left, right) => left.score - right.score)[0];
  const dueReviews = state.reviews.filter(
    (review) => new Date(review.nextReviewAt) <= now,
  ).length;
  const completedDates = new Set([
    ...state.answers.map((answer) => answer.answeredAt.slice(0, 10)),
    ...state.writingSubmissions.map((item) => item.submittedAt.slice(0, 10)),
    ...state.speakingAttempts.map((item) => item.completedAt.slice(0, 10)),
    ...state.examAttempts.map((item) => item.completedAt.slice(0, 10)),
    ...state.vocabularyProgress.flatMap((item) =>
      item.lastReviewedAt ? [item.lastReviewedAt.slice(0, 10)] : [],
    ),
  ]);
  const templates = [
    dueReviews
      ? {
          title: "Ripasso in scadenza",
          focus: `${dueReviews} errori programmati`,
          reason: "Gli intervalli di ripasso indicano che questi elementi sono pronti.",
          minutes: 20,
          href: "/review",
        }
      : {
          title: "Sessione adattiva",
          focus: weakest.label,
          reason: "La sessione bilancia le aree e parte dalla priorità più utile.",
          minutes: 20,
          href: "/daily",
        },
    {
      title: weakest.label,
      focus: `Accuratezza attuale ${weakest.score}%`,
      reason: "È l’area oggettiva con il margine di crescita maggiore.",
      minutes: 25,
      href: weakest.href,
    },
    {
      title: "Precisione d’esame",
      focus: "Open cloze e transformations",
      reason: "Alterna grammatica isolata e uso della lingua in contesto.",
      minutes: 20,
      href: "/use-of-english",
    },
    {
      title: comprehension.label,
      focus: `Accuratezza attuale ${comprehension.score}%`,
      reason: "Consolida la comprensione con una sessione breve e focalizzata.",
      minutes: 25,
      href: comprehension.href,
    },
    {
      title: "Speaking Lab",
      focus: state.speakingAttempts.length
        ? "Migliora il criterio più debole"
        : "Prima registrazione guidata",
      reason: "Riascolto e autovalutazione rendono visibili ritmo e chiarezza.",
      minutes: 15,
      href: "/speaking",
    },
    {
      title: "Writing B2",
      focus: state.writingSubmissions.length
        ? "Nuova tipologia di testo"
        : "Prima consegna con feedback",
      reason: "Una produzione completa collega lessico, grammatica e organizzazione.",
      minutes: 35,
      href: "/writing",
    },
    {
      title: "Verifica settimanale",
      focus: "Simulazione breve",
      reason: "Chiudi la settimana misurando continuità e gestione del tempo.",
      minutes: 35,
      href: "/exam/short-1",
    },
  ];
  const monday = new Date(now);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  return templates.map((template, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = dateKey(date);
    return {
      ...template,
      date: key,
      weekday: new Intl.DateTimeFormat("it-IT", { weekday: "long" }).format(date),
      required: index < state.weeklyGoal,
      completed: completedDates.has(key),
    };
  });
}

export function mockEvaluateWriting(text: string): WritingEvaluation {
  const words = text.trim().split(/\s+/).filter(Boolean); const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
  const connectors = ["however", "therefore", "although", "moreover", "in addition", "on the other hand"].filter((word) => text.toLowerCase().includes(word));
  const base = Math.min(90, 48 + Math.round(words.length / 8) + connectors.length * 4 + Math.min(sentences.length, 8));
  const scores = { grammatica: Math.min(90, base - 3), vocabolario: Math.min(92, base + 2), coerenza: Math.min(95, base + connectors.length * 2), aderenza: Math.min(88, base), registro: Math.min(90, base - 1) };
  const issues = [] as WritingEvaluation["issues"];
  if (!connectors.length) issues.push({ excerpt: sentences[1]?.trim() ?? words.slice(0, 8).join(" "), explanation: "Il testo usa pochi connettivi, quindi le idee risultano giustapposte.", suggestion: "Aggiungi however, therefore o in addition per rendere esplicito il rapporto tra le idee." });
  if (words.length < 80) issues.push({ excerpt: `${words.length} parole`, explanation: "Lo sviluppo è breve per un testo B2.", suggestion: "Aggiungi un esempio concreto e una breve conclusione." });
  return { overall: Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5), scores, strengths: ["La posizione è comprensibile", "Il registro è generalmente coerente"], issues, improvedVersion: text.trim() || "Scrivi il testo per ricevere una versione migliorata.", advice: ["Usa un connettivo diverso in ogni paragrafo", "Rileggi controllando articoli e preposizioni", "Chiudi con una frase che risponda direttamente alla traccia"] };
}
