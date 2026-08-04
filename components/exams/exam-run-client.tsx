"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";
import { ExamRunner } from "@/components/exams/exam-runner";
import { Button } from "@/components/ui/button";
import {
  grammarExercises,
  listeningActivities,
  readingPassages,
  vocabularyExercises,
} from "@/lib/data";

function examQuestions(full: boolean) {
  const reading = readingPassages.flatMap((passage) => passage.exercises);
  const listening = listeningActivities.flatMap((activity) => activity.exercises);
  return full
    ? [
        ...grammarExercises.slice(0, 16),
        ...vocabularyExercises.slice(0, 12),
        ...reading.slice(0, 10),
        ...listening.slice(0, 10),
      ]
    : [
        ...grammarExercises.slice(0, 6),
        ...vocabularyExercises.slice(0, 5),
        ...reading.slice(0, 5),
        ...listening.slice(0, 4),
      ];
}

export function ExamRunPageClient({ id }: { id: string }) {
  const full = id.startsWith("full");
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const questions = examQuestions(full);
  const title = full ? "Simulazione estesa" : "Simulazione breve";
  const minutes = full ? 105 : 35;

  useEffect(() => {
    queueMicrotask(() => setReady(true));
  }, []);

  if (started) {
    return (
      <ExamRunner
        examId={id}
        title={title}
        minutes={minutes}
        exercises={questions}
      />
    );
  }

  return (
    <main className="exam-instructions">
      <header>
        <Brand />
        <Link href="/exam">Torna alle simulazioni</Link>
      </header>
      <section>
        <FileText />
        <span>{title.toUpperCase()}</span>
        <h1>Prima di iniziare</h1>
        <p>
          Lavora senza consultare appunti. Puoi spostarti tra le domande e
          consegnare anche prima dello scadere del tempo.
        </p>
        <ul>
          <li><CheckCircle2 /> {questions.length} domande originali</li>
          <li><CheckCircle2 /> {minutes} minuti complessivi</li>
          <li><CheckCircle2 /> Verbi, vocabolario, reading e listening</li>
          <li><ShieldCheck /> Soluzioni e report soltanto dopo la consegna</li>
        </ul>
        <Button size="lg" onClick={() => setStarted(true)} disabled={!ready}>
          Avvia la simulazione <ArrowRight size={18} />
        </Button>
      </section>
    </main>
  );
}
