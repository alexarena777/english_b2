import { describe, expect, it } from "vitest";
import { updateVocabularyRecall, vocabularyStatusProgress } from "@/lib/vocabulary";

describe("ripasso del vocabolario", () => {
  const now = new Date("2026-08-01T12:00:00.000Z");

  it("programma prima una parola non ricordata", () => {
    const result = updateVocabularyRecall(undefined, "v-01", false, now);
    expect(result.status).toBe("learning");
    expect(result.mastery).toBe(10);
    expect(result.incorrectRecall).toBe(1);
    expect(result.nextReviewAt).toContain("2026-08-02");
  });

  it("aumenta padronanza e intervallo con richiami corretti", () => {
    const first = updateVocabularyRecall(undefined, "v-01", true, now);
    const second = updateVocabularyRecall(first, "v-01", true, now);
    const third = updateVocabularyRecall(second, "v-01", true, now);
    expect(third.mastery).toBe(85);
    expect(third.status).toBe("mastered");
    expect(third.correctRecall).toBe(3);
    expect(third.nextReviewAt).toContain("2026-08-15");
  });

  it("consente di classificare manualmente una parola", () => {
    const result = vocabularyStatusProgress(undefined, "v-02", "mastered", now);
    expect(result.mastery).toBe(100);
    expect(result.status).toBe("mastered");
  });
});
