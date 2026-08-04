import { describe, expect, it } from "vitest";
import {
  assessmentExercises,
  grammarExercises,
  listeningActivities,
  readingPassages,
  useOfEnglishExercises,
  vocabularyExercises,
  vocabularyItems,
} from "@/lib/data";
import { verbTenseTopics } from "@/lib/curriculum/verbs";
import {
  universityGrammarExercises,
  universityGrammarTopics,
} from "@/lib/curriculum/university";
import { exerciseSchema } from "@/lib/schemas";

describe("curriculum B2 in quattro sezioni", () => {
  it("offre le quantità previste di contenuti originali", () => {
    expect(vocabularyItems).toHaveLength(272);
    expect(vocabularyExercises).toHaveLength(816);
    expect(verbTenseTopics).toHaveLength(16);
    expect(universityGrammarTopics).toHaveLength(8);
    expect(universityGrammarExercises).toHaveLength(48);
    expect(grammarExercises).toHaveLength(2096);
    expect(readingPassages).toHaveLength(15);
    expect(
      readingPassages
        .filter((passage) => !passage.kind.includes("Cambridge Part 7"))
        .every((passage) => passage.exercises.length === 6),
    ).toBe(true);
    expect(
      readingPassages.find((passage) => passage.kind.includes("Cambridge Part 7"))
        ?.exercises,
    ).toHaveLength(10);
    expect(listeningActivities).toHaveLength(14);
    expect(listeningActivities.every((activity) => activity.exercises.length >= 5)).toBe(true);
    expect(useOfEnglishExercises).toHaveLength(30);
    expect(
      vocabularyItems.filter((item) => item.category === "programma universitario"),
    ).toHaveLength(32);
    expect(
      readingPassages.find((passage) =>
        passage.kind.includes("University course"),
      )?.exercises,
    ).toHaveLength(6);
  });

  it("varia i formati di pratica nelle due banche più grandi", () => {
    expect(new Set(vocabularyExercises.map((exercise) => exercise.type))).toEqual(
      new Set(["multiple-choice", "synonym"]),
    );
    expect(new Set(grammarExercises.map((exercise) => exercise.type))).toEqual(
      new Set(["multiple-choice", "fill-gap", "error-correction", "verb-tense"]),
    );
    expect(new Set(vocabularyItems.map((item) => item.category)).size).toBe(16);
    expect(new Set(useOfEnglishExercises.map((exercise) => exercise.topic))).toEqual(
      new Set([
        "Multiple-choice cloze",
        "Open cloze",
        "Word formation",
        "Key word transformation",
      ]),
    );
    expect(
      useOfEnglishExercises.filter((exercise) => exercise.topic === "Multiple-choice cloze"),
    ).toHaveLength(8);
    expect(
      useOfEnglishExercises.filter((exercise) => exercise.topic === "Open cloze"),
    ).toHaveLength(8);
    expect(
      useOfEnglishExercises.filter((exercise) => exercise.topic === "Word formation"),
    ).toHaveLength(8);
    expect(
      useOfEnglishExercises.filter((exercise) => exercise.topic === "Key word transformation"),
    ).toHaveLength(6);
    for (const topic of verbTenseTopics) {
      const topicExercises = grammarExercises.filter((exercise) =>
        exercise.tags.includes(topic.slug),
      );
      expect(topicExercises).toHaveLength(128);
      expect(new Set(topicExercises.map((exercise) => exercise.question)).size).toBeGreaterThanOrEqual(100);
    }
    for (const topic of universityGrammarTopics) {
      expect(
        universityGrammarExercises.filter((exercise) =>
          exercise.tags.includes(topic.slug),
        ),
      ).toHaveLength(6);
    }
  });

  it("mantiene il test iniziale oggettivo e senza writing", () => {
    expect(assessmentExercises).toHaveLength(28);
    expect(new Set(assessmentExercises.map((exercise) => exercise.section))).toEqual(
      new Set(["grammar", "vocabulary", "reading", "listening"]),
    );
    expect(assessmentExercises.some((exercise) => exercise.type === "writing")).toBe(false);
  });

  it("valida tutti gli esercizi del nuovo curriculum", () => {
    const exercises = [
      ...vocabularyExercises,
      ...grammarExercises,
      ...useOfEnglishExercises,
      ...readingPassages.flatMap((passage) => passage.exercises),
      ...listeningActivities.flatMap((activity) => activity.exercises),
    ];
    expect(exerciseSchema.array().safeParse(exercises).success).toBe(true);
    expect(new Set(exercises.map((exercise) => exercise.id)).size).toBe(exercises.length);
    expect(
      exercises
        .filter((exercise) => exercise.options?.length)
        .every((exercise) =>
          exercise.options?.some((option) => option.label === exercise.correctAnswer),
        ),
    ).toBe(true);
    expect(readingPassages.every((passage) => passage.text.split("\n\n").length >= 4)).toBe(true);
    expect(
      listeningActivities.every(
        (activity) => activity.transcript.split(/\s+/).length >= 120,
      ),
    ).toBe(true);
  });

  it("riproduce la struttura delle parti Cambridge estese", () => {
    const readingPart6 = readingPassages.find((passage) =>
      passage.kind.includes("Cambridge Part 6"),
    );
    const readingPart7 = readingPassages.find((passage) =>
      passage.kind.includes("Cambridge Part 7"),
    );
    const listeningPart2 = listeningActivities.find((activity) =>
      activity.kind.includes("Cambridge Part 2"),
    );
    const listeningPart3 = listeningActivities.find((activity) =>
      activity.kind.includes("Cambridge Part 3"),
    );

    expect(readingPart6?.exercises).toHaveLength(6);
    expect(readingPart6?.exercises.every((exercise) => exercise.options?.length === 7)).toBe(true);
    expect(readingPart7?.exercises).toHaveLength(10);
    expect(readingPart7?.exercises.every((exercise) => exercise.options?.length === 4)).toBe(true);
    expect(listeningPart2?.exercises).toHaveLength(10);
    expect(listeningPart2?.exercises.every((exercise) => !exercise.options?.length)).toBe(true);
    expect(listeningPart3?.exercises).toHaveLength(5);
    expect(listeningPart3?.exercises.every((exercise) => exercise.options?.length === 8)).toBe(true);
  });

  it("mantiene testi Use of English coerenti e trasformazioni entro due-cinque parole", () => {
    for (const topic of ["Multiple-choice cloze", "Open cloze", "Word formation"]) {
      const exercises = useOfEnglishExercises.filter((exercise) => exercise.topic === topic);
      expect(exercises.every((exercise) => Boolean(exercise.contextTitle && exercise.context))).toBe(true);
      expect(new Set(exercises.map((exercise) => exercise.context)).size).toBe(1);
    }

    const transformations = useOfEnglishExercises.filter(
      (exercise) => exercise.topic === "Key word transformation",
    );
    expect(
      transformations.every((exercise) => {
        const answer = String(exercise.correctAnswer);
        const keyWord = exercise.question.match(/\(([A-Z]+)\)/)?.[1]?.toLowerCase();
        const wordCount = answer.trim().split(/\s+/).length;
        return wordCount >= 2 && wordCount <= 5 && Boolean(keyWord && answer.toLowerCase().includes(keyWord));
      }),
    ).toBe(true);
  });

  it("blocca formulazioni meccaniche e opzioni duplicate nella banca dei verbi", () => {
    expect(grammarExercises.filter((exercise) => /^[a-z]/.test(exercise.question))).toEqual([]);
    expect(
      grammarExercises.filter((exercise) => /\b(?:they|we|you|he|she|it) every Monday\b/i.test(exercise.question)),
    ).toEqual([]);

    const exercisesWithDuplicateOptions = [
      ...grammarExercises,
      ...useOfEnglishExercises,
      ...readingPassages.flatMap((passage) => passage.exercises),
      ...listeningActivities.flatMap((activity) => activity.exercises),
    ].filter((exercise) => {
      const labels = exercise.options?.map((option) => option.label.trim().toLowerCase()) ?? [];
      return new Set(labels).size !== labels.length;
    });
    expect(exercisesWithDuplicateOptions).toEqual([]);

    const generatedChoices = grammarExercises.filter(
      (exercise) => exercise.type === "multiple-choice" && exercise.tags.includes("extended-practice"),
    );
    expect(
      generatedChoices
        .filter((exercise) => exercise.tags.includes("will-future"))
        .every((exercise) => exercise.options?.every((option) => option.label.startsWith("will"))),
    ).toBe(true);
    expect(
      generatedChoices
        .filter((exercise) => exercise.tags.includes("be-going-to"))
        .every((exercise) => exercise.options?.every((option) => !option.label.startsWith("will "))),
    ).toBe(true);
    expect(
      generatedChoices
        .filter((exercise) => exercise.tags.includes("present-continuous-future"))
        .every((exercise) => exercise.options?.every((option) => !option.label.includes("going to"))),
    ).toBe(true);
  });
});
