"use client";

import Link from "next/link";
import { ArrowRight, BookMarked, CheckCircle2, GraduationCap, Layers3, Puzzle } from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/components/providers";
import { grammarExercises, useOfEnglishExercises } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { verbTenseTopics } from "@/lib/curriculum/verbs";
import { universityGrammarExercises, universityGrammarTopics } from "@/lib/curriculum/university";

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

  const started = topics.filter((topic) => topic.attempted > 0);
  const recommended = started.length
    ? [...started].sort(
        (left, right) => left.score - right.score || right.attempted - left.attempted,
      )[0]
    : topics[0];

  return (
    <AppPage>
      <PageHeader
        eyebrow="VERBI E TEMPI"
        title="Coniuga bene. Scegli il tempo giusto."
        description="Tutti i tempi verbali inglesi: forma, uso, indicatori temporali ed esercizi B2 dal riconoscimento alla produzione."
      />

      <div className="verb-bank-summary">
        <span><Layers3 /> <b>{verbTenseTopics.length}</b> moduli completi</span>
        <span><BookMarked /> <b>{grammarExercises.length}</b> esercizi di grammatica</span>
        <span><CheckCircle2 /> spiegazioni in italiano</span>
      </div>

      <Card className="cambridge-lab-card university-lab-card">
        <span className="cambridge-lab-icon"><GraduationCap /></span>
        <div>
          <Badge>PROGRAMMA UNIVERSITARIO</Badge>
          <h2>Le strutture richieste nelle dieci lezioni</h2>
          <p>
            Reported speech, passivi e causativi, wish, verb patterns, indirect
            questions e future time clauses con regole, errori tipici ed esempi.
          </p>
          <small>
            {universityGrammarTopics.length} moduli · {universityGrammarExercises.length} esercizi originali
          </small>
        </div>
        <Button asChild variant="outline">
          <Link href="/grammar/university">Apri il percorso</Link>
        </Button>
      </Card>

      <Card className="cambridge-lab-card">
        <span className="cambridge-lab-icon"><Puzzle /></span>
        <div>
          <Badge>CAMBRIDGE PRACTICE</Badge>
          <h2>Grammatica applicata al Use of English</h2>
          <p>
            Metti alla prova preposizioni, connettivi, inversioni e trasformazioni
            di frase con open cloze e key word transformation.
          </p>
          <small>
            {useOfEnglishExercises.filter((item) => item.section === "grammar").length} esercizi mirati
          </small>
        </div>
        <Button asChild variant="outline">
          <Link href="/use-of-english">Apri il laboratorio</Link>
        </Button>
      </Card>

      <div className="topic-feature verb-feature">
        <div>
          <Badge variant="warning">
            {started.length ? "PRIORITÀ DAI TUOI RISULTATI" : "INIZIA DA QUI"}
          </Badge>
          <span>{recommended.italianTitle}</span>
          <h2>{recommended.title}</h2>
          <p>{recommended.formula}</p>
          <Link href={recommended.href}>
            Studia e allenati <ArrowRight size={17} />
          </Link>
        </div>
        <div className="feature-progress">
          <strong>{recommended.attempted ? `${recommended.score}%` : "—"}</strong>
          <span>{recommended.attempted ? "ACCURATEZZA" : "DA INIZIARE"}</span>
          <p>
            <CheckCircle2 size={15} /> {recommended.attempted} di {recommended.count} tentati
          </p>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Tutti i tempi verbali</h2>
          <p>Presenti, passati, futuri e forme condizionali in ordine logico</p>
        </div>
        <span>{topics.reduce((total, item) => total + item.count, 0)} esercizi originali</span>
      </div>

      <div className="topic-grid verb-topic-grid">
        {topics.map((item) => (
          <Link href={item.href} key={item.slug}>
            <Card className="topic-card verb-topic-card">
              <span className="topic-number">{String(item.index + 1).padStart(2, "0")}</span>
              <div>
                <Badge>B2</Badge>
                <small>{item.italianTitle}</small>
                <h3>{item.title}</h3>
                <p>{item.formula}</p>
                <footer>
                  {item.count} esercizi
                  {item.attempted ? ` · ${item.score}% accuratezza` : " · non iniziato"}
                </footer>
              </div>
              <ArrowRight size={18} />
            </Card>
          </Link>
        ))}
      </div>
    </AppPage>
  );
}
