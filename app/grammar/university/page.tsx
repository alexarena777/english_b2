"use client";

import { useState } from "react";
import { BookOpenCheck, CheckCircle2, GraduationCap } from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  universityGrammarExercises,
  universityGrammarTopics,
} from "@/lib/curriculum/university";

export default function UniversityGrammarPage() {
  const [selected, setSelected] = useState(universityGrammarTopics[0].slug);
  const topic = universityGrammarTopics.find((item) => item.slug === selected)!;
  const exercises = universityGrammarExercises.filter((exercise) =>
    exercise.tags.includes(selected),
  );

  return (
    <AppPage>
      <PageHeader
        eyebrow="PROGRAMMA UNIVERSITARIO"
        title="Le regole che completano il tuo B2."
        description="Un percorso ricavato dalle dieci lezioni del corso: spiegazioni chiare, errori tipici ed esercizi originali sulle strutture effettivamente richieste all’esame."
      />

      <div className="university-summary">
        <div><GraduationCap /><strong>{universityGrammarTopics.length}</strong><span>moduli mirati</span></div>
        <div><BookOpenCheck /><strong>{universityGrammarExercises.length}</strong><span>esercizi originali</span></div>
        <div><CheckCircle2 /><strong>10</strong><span>lezioni analizzate</span></div>
      </div>

      <div className="use-topic-grid university-topic-grid">
        {universityGrammarTopics.map((item) => (
          <button
            type="button"
            key={item.slug}
            className={selected === item.slug ? "active" : ""}
            onClick={() => setSelected(item.slug)}
          >
            <Card>
              <BookOpenCheck />
              <div>
                <h2>{item.title}</h2>
                <p>{item.italianTitle}</p>
                <small>{item.lesson} · 6 esercizi</small>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <section className="university-rule-card">
        <header>
          <div>
            <Badge>{topic.lesson}</Badge>
            <span>{topic.italianTitle}</span>
            <h2>{topic.title}</h2>
          </div>
          <p>{topic.formula}</p>
        </header>
        <div className="university-rule-body">
          <div>
            <h3>Come funziona</h3>
            <p>{topic.explanation}</p>
            <h3>Quando ti serve</h3>
            <ul>{topic.useCases.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <aside>
            <h3>Errori da evitare</h3>
            <ul>{topic.pitfalls.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>Esempi</h3>
            {topic.examples.map((item) => <p key={item}>{item}</p>)}
          </aside>
        </div>
      </section>

      <div className="section-heading university-practice-heading">
        <div>
          <h2>Allenamento: {topic.title}</h2>
          <p>Modalità studio con correzione immediata o simulazione senza suggerimenti.</p>
        </div>
        <span>{exercises.length} domande</span>
      </div>
      <ExerciseRenderer key={selected} exercises={exercises} enableModeSwitch />
    </AppPage>
  );
}
