"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Files } from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BatchExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { readingPassages } from "@/lib/data";

export default function ReadingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const passage = readingPassages.find((item) => item.id === selected);

  return (
    <AppPage>
      {passage ? (
        <>
          <button className="back-link" onClick={() => setSelected(null)}>
            <ArrowLeft size={17} /> Tutti i reading
          </button>
          <div className="reading-exam-note">
            <Badge>B2</Badge>
            <b>Comprensione in stile B2 First</b>
            <span>Leggi il testo completo, poi rispondi a {passage.exercises.length} domande.</span>
          </div>
          <div className="reading-layout">
            <article className="reading-passage">
              <div>
                <Badge>{passage.level}</Badge>
                <span>{passage.kind}</span>
                <span><Clock3 size={15} /> {passage.minutes} min</span>
              </div>
              <h1>{passage.title}</h1>
              {passage.text.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
            <aside className="reading-questions">
              <BatchExerciseRenderer
                key={passage.id}
                exercises={passage.exercises}
              />
            </aside>
          </div>
        </>
      ) : (
        <>
          <PageHeader
            eyebrow="READING B2"
            title="Testi veri da capire, non frasi isolate."
            description={`${readingPassages.length} reading originali di livello B2 con domande su idea principale, dettagli, inferenze, atteggiamento e lessico nel contesto.`}
          />
          <div className="reading-bank-summary">
            <span><Files /> <b>{readingPassages.length}</b> testi B2</span>
            <span><CheckCircle2 /> <b>{readingPassages.reduce((total, item) => total + item.exercises.length, 0)}</b> domande</span>
            <span><BookOpen /> articoli, report e interviste originali</span>
          </div>
          <div className="reading-grid">
            {readingPassages.map((item, index) => (
              <Card className="reading-card" key={item.id}>
                <div className={`reading-cover cover-${(index % 5) + 1}`}>
                  <BookOpen />
                  <span>{item.kind}</span>
                </div>
                <div className="reading-card-body">
                  <div>
                    <Badge>{item.level}</Badge>
                    <span><Clock3 size={14} /> {item.minutes} min</span>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.text.slice(0, 155)}…</p>
                  <footer>{item.exercises.length} domande di comprensione</footer>
                  <Button variant="ghost" onClick={() => setSelected(item.id)}>
                    Leggi e rispondi <ArrowRight size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </AppPage>
  );
}
