"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, Clock3, Layers3, PlayCircle, BookOpen, Sparkles, ArrowDown } from "lucide-react";
import type { Exercise } from "@/lib/types";
import type { VerbTenseTopic } from "@/lib/curriculum/verbs";
import { AppPage } from "@/components/app-shell";
import { GrammarExplanation } from "@/components/exercises/grammar-explanation";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SESSION_SIZE = 8;

export function VerbTopicView({
  topic,
  exercises,
}: {
  topic: VerbTenseTopic;
  exercises: Exercise[];
}) {
  const [activeTab, setActiveTab] = useState<"exercises" | "explanation">("exercises");
  const [session, setSession] = useState(0);

  const practiceRef = useRef<HTMLDivElement>(null);

  const sessions = Array.from(
    { length: Math.ceil(exercises.length / SESSION_SIZE) },
    (_, index) => exercises.slice(index * SESSION_SIZE, (index + 1) * SESSION_SIZE),
  );
  const selected = sessions[session] ?? sessions[0] ?? [];

  function scrollToPractice() {
    setActiveTab("exercises");
    setTimeout(() => {
      practiceRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <AppPage>
      <div className="breadcrumb">
        <Link href="/grammar">Verbi e tempi</Link>
        <span>/</span>
        <b>{topic.title}</b>
      </div>

      {/* Hero Banner with Quick Actions */}
      <section className="verb-topic-hero mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge>B2 VERB LAB</Badge>
            <Badge variant="success">{exercises.length} Esercizi</Badge>
          </div>
          <span className="text-sm font-semibold opacity-90">{topic.italianTitle}</span>
          <h1 className="text-3xl font-bold my-1">{topic.title}</h1>
          <p className="font-mono text-sm opacity-90 bg-black/10 dark:bg-white/10 px-3 py-1.5 rounded-lg inline-block my-2">
            Forma: {topic.formula}
          </p>

          <div className="flex gap-3 mt-4">
            <Button size="lg" onClick={scrollToPractice}>
              <PlayCircle size={20} /> Inizia Esercizi Subito <ArrowDown size={16} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setActiveTab(activeTab === "explanation" ? "exercises" : "explanation")}
            >
              <BookOpen size={18} /> {activeTab === "explanation" ? "Nascondi Teoria" : "Leggi Teoria"}
            </Button>
          </div>
        </div>

        <dl className="mt-4 border-t border-white/20 pt-4">
          <div>
            <dt><Layers3 size={16} /> Quando si usa</dt>
            <dd>{topic.useCases.join(" · ")}</dd>
          </div>
          <div>
            <dt><Clock3 size={16} /> Segnali frequenti</dt>
            <dd>{topic.signals.join(" · ")}</dd>
          </div>
        </dl>
      </section>

      {/* Main Content Area */}
      {activeTab === "explanation" && (
        <div className="mb-8">
          <GrammarExplanation
            title={topic.italianTitle}
            short={`Forma: ${topic.formula}. Prima identifica il rapporto temporale, poi scegli la coniugazione.`}
            details={topic.useCases.join("; ")}
            examples={topic.examples}
            mistakes={topic.mistakes}
          />
        </div>
      )}

      {/* Practice Exercises Section */}
      <div ref={practiceRef} className="topic-practice">
        <div className="section-heading verb-session-heading flex items-center justify-between mb-4">
          <div>
            <span className="page-eyebrow">ESERCIZI PRATICI B2</span>
            <h2 className="text-2xl font-bold">Sessioni di Allenamento</h2>
            <p className="text-sm text-muted">
              {exercises.length} domande divisi in sessioni rapide da {SESSION_SIZE} esercizi.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/grammar">Tutti i Verbi</Link>
          </Button>
        </div>

        {/* Session Selector Pills */}
        <div className="verb-session-picker mb-6 flex flex-wrap gap-2" aria-label="Scegli una sessione">
          {sessions.map((items, index) => (
            <button
              key={index}
              type="button"
              className={`btn btn-md ${session === index ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSession(index)}
            >
              <BookOpenCheck size={18} />
              <span>Sessione {index + 1}</span>
              <small className="ml-1 opacity-80">({items.length} domande)</small>
            </button>
          ))}
        </div>

        {/* Exercise Renderer */}
        <ExerciseRenderer
          key={`${topic.slug}-${session}`}
          exercises={selected}
          compact
          enableModeSwitch
        />
      </div>
    </AppPage>
  );
}
