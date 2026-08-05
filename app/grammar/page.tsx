"use client";

import Link from "next/link";
import { ArrowRight, BookMarked, CheckCircle2, Layers3, ChevronRight } from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/components/providers";
import { grammarExercises } from "@/lib/data";
import { verbTenseTopics, type VerbCategory } from "@/lib/curriculum/verbs";

const CATEGORY_ORDER: VerbCategory[] = ["Presenti", "Passati", "Futuri", "Forme speciali"];

const CATEGORY_META: Record<VerbCategory, { emoji: string; description: string }> = {
  Presenti: {
    emoji: "🟢",
    description: "Abitudini, azioni in corso, risultati e durate che toccano il presente.",
  },
  Passati: {
    emoji: "🔵",
    description: "Sequenze, sfondi, durate e anteriorità nel passato.",
  },
  Futuri: {
    emoji: "🟠",
    description: "Decisioni, intenzioni, accordi e proiezioni verso il futuro.",
  },
  "Forme speciali": {
    emoji: "🟣",
    description: "Abitudini passate, condizionali e strutture grammaticali avanzate.",
  },
};

export default function GrammarPage() {
  const { state } = useProgress();
  const latestAnswers = new Map<string, boolean>();
  state.answers
    .filter((answer) => answer.section === "grammar")
    .forEach((answer) => latestAnswers.set(answer.exerciseId, answer.correct));

  const topics = verbTenseTopics.map((topic, index) => {
    const exercises = grammarExercises.filter((exercise) =>
      exercise.tags.includes(topic.slug),
    );
    const attempted = exercises.filter((exercise) => latestAnswers.has(exercise.id));
    const correct = attempted.filter((exercise) => latestAnswers.get(exercise.id)).length;
    return {
      ...topic,
      index,
      count: exercises.length,
      attempted: attempted.length,
      score: attempted.length ? Math.round((correct / attempted.length) * 100) : 0,
      href: `/grammar/${topic.slug}`,
    };
  });

  const totalAttempted = topics.reduce((n, t) => n + t.attempted, 0);
  const totalExercises = topics.reduce((n, t) => n + t.count, 0);
  const overallScore = totalAttempted
    ? Math.round(
        (topics.reduce((n, t) => n + (t.attempted ? (t.score / 100) * t.attempted : 0), 0) /
          totalAttempted) * 100,
      )
    : 0;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    meta: CATEGORY_META[cat],
    items: topics.filter((t) => t.category === cat),
  }));

  return (
    <AppPage>
      <PageHeader
        eyebrow="VERBI E TEMPI"
        title="Coniuga bene. Scegli il tempo giusto."
        description="16 tempi verbali inglesi con spiegazioni in italiano, esempi tradotti, segnali temporali ed esercizi B2 dal riconoscimento alla produzione libera."
      />

      {/* Summary bar */}
      <div className="verb-bank-summary">
        <span><Layers3 /> <b>{verbTenseTopics.length}</b> tempi verbali</span>
        <span><BookMarked /> <b>{totalExercises}</b> esercizi totali</span>
        <span>
          <CheckCircle2 />
          {totalAttempted > 0
            ? <><b>{totalAttempted}</b> tentati · <b>{overallScore}%</b> accuratezza</>
            : <>Nessun esercizio iniziato</>}
        </span>
      </div>

      {/* Categories */}
      {grouped.map(({ category, meta, items }) => {
        const catAttempted = items.filter((t) => t.attempted > 0).length;
        return (
          <section key={category} style={{ marginBottom: "32px" }}>
            <div className="section-heading" style={{ marginBottom: "14px" }}>
              <div>
                <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span>{meta.emoji}</span>
                  {category}
                  <Badge>{items.length} moduli</Badge>
                </h2>
                <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "12px" }}>
                  {meta.description}
                </p>
              </div>
              {catAttempted > 0 && (
                <span style={{ color: "var(--muted)", fontSize: "11px" }}>
                  {catAttempted}/{items.length} iniziati
                </span>
              )}
            </div>

            <div className="topic-grid verb-topic-grid">
              {items.map((item) => (
                <Link href={item.href} key={item.slug}>
                  <Card className="topic-card verb-topic-card">
                    <span className="topic-number">{String(item.index + 1).padStart(2, "0")}</span>
                    <div style={{ flex: 1 }}>
                      <Badge>B2</Badge>
                      <small>{item.italianTitle}</small>
                      <h3>{item.title}</h3>
                      <p style={{ fontFamily: "monospace", fontSize: "10px", color: "var(--muted)", margin: "4px 0 8px" }}>
                        {item.formula}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                        {item.signals.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: "9px",
                              fontWeight: 750,
                              padding: "2px 6px",
                              borderRadius: "6px",
                              background: "var(--mint)",
                              color: "var(--green)",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <footer>
                        {item.count} esercizi
                        {item.attempted > 0
                          ? ` · ${item.score}% accuratezza`
                          : " · non iniziato"}
                      </footer>
                    </div>
                    <ArrowRight size={18} />
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* Compact links to University and Cambridge */}
      <div className="section-heading" style={{ marginTop: "8px" }}>
        <div>
          <h2>Altre sezioni di grammatica</h2>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "12px" }}>
            Strutture universitarie avanzate e pratica Cambridge Use of English.
          </p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <Link href="/grammar/university">
          <Card style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", cursor: "pointer" }}>
            <span style={{ fontSize: "22px" }}>🎓</span>
            <div style={{ flex: 1 }}>
              <b style={{ display: "block", fontSize: "13px" }}>Programma universitario</b>
              <small style={{ color: "var(--muted)", fontSize: "10px" }}>
                Reported speech, passivi, conditionals avanzati
              </small>
            </div>
            <ChevronRight size={16} color="var(--muted)" />
          </Card>
        </Link>
        <Link href="/use-of-english">
          <Card style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", cursor: "pointer" }}>
            <span style={{ fontSize: "22px" }}>📝</span>
            <div style={{ flex: 1 }}>
              <b style={{ display: "block", fontSize: "13px" }}>Cambridge Use of English</b>
              <small style={{ color: "var(--muted)", fontSize: "10px" }}>
                Open cloze, key word transformation
              </small>
            </div>
            <ChevronRight size={16} color="var(--muted)" />
          </Card>
        </Link>
      </div>
    </AppPage>
  );
}
