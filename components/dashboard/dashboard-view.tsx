"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookType,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Headphones,
  Languages,
  PenTool,
  RefreshCcw,
  Target,
} from "lucide-react";
import { useProgress } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardCard } from "./dashboard-card";
import {
  grammarExercises,
  listeningActivities,
  readingPassages,
  vocabularyExercises,
  vocabularyItems,
} from "@/lib/data";
import { verbTenseTopics } from "@/lib/curriculum/verbs";
import { deriveLearningProfile } from "@/lib/learning-profile";
import { todayKey } from "@/lib/utils";
import React from "react";

type GoalItemProps = {
  label: string;
  done: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>;
  href: string;
};

function DailyGoalsWidget({ quotas }: { quotas?: { date: string; vocabulary: number; reading: number; listening: number } }) {
  const today = todayKey();
  const activeQuotas = (quotas?.date === today) ? quotas : { vocabulary: 0, reading: 0, listening: 0 };
  const vDone = activeQuotas.vocabulary >= 1;
  const rDone = activeQuotas.reading >= 1;
  const lDone = activeQuotas.listening >= 1;
  const allDone = vDone && rDone && lDone;

  return (
    <Card className="mb-6 p-5" style={{ background: allDone ? 'var(--mint)' : 'var(--card-2)', border: allDone ? '1px solid var(--green)' : undefined }}>
      <div className="flex items-center justify-between mb-4">
        <div>
           <h2 className="font-bold text-[15px] mb-1 text-[var(--ink)]">{allDone ? "Obiettivi completati!" : "Obiettivi Giornalieri"}</h2>
           <p className="text-[11px] text-[var(--muted)]">{allDone ? "Hai salvato il tuo streak di oggi. Ottimo lavoro!" : "Completa un esercizio per ogni sezione per mantenere lo streak."}</p>
        </div>
        {!allDone && <Target size={24} className="text-[var(--green)]" />}
        {allDone && <CheckCircle2 size={28} className="text-[var(--green)]" />}
      </div>
      <div className="grid grid-cols-3 gap-3">
         <GoalItem label="Vocabolario" done={vDone} icon={Languages} href="/vocabulary" />
         <GoalItem label="Reading" done={rDone} icon={BrainCircuit} href="/reading" />
         <GoalItem label="Listening" done={lDone} icon={Headphones} href="/listening" />
      </div>
    </Card>
  );
}

function GoalItem({ label, done, icon: Icon, href }: GoalItemProps) {
  return (
    <Link href={href} className="block">
       <div className="flex flex-col items-center justify-center p-3 rounded-[14px] border text-center transition-colors" style={{ background: done ? 'color-mix(in srgb, var(--green) 12%, transparent)' : 'var(--card)', borderColor: done ? 'var(--green)' : 'var(--line)', opacity: done ? 0.7 : 1 }}>
         <div className="mb-2 relative">
           <Icon size={20} style={{ color: done ? 'var(--green)' : 'var(--ink)' }} />
           {done && <CheckCircle2 size={12} className="absolute -bottom-1 -right-1 text-[var(--green)] bg-white rounded-full" />}
         </div>
         <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: done ? 'var(--green)' : 'var(--muted)' }}>{label}</span>
       </div>
    </Link>
  );
}

export function DashboardView() {
  const { state, hydrated } = useProgress();
  const [now, setNow] = useState(0);
  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
  }, []);
  const learningProfile = deriveLearningProfile(state);
  const coreAnswers = state.answers.filter((answer) =>
    ["grammar", "vocabulary", "reading", "listening"].includes(answer.section),
  );
  const accuracy = coreAnswers.length
    ? Math.round((coreAnswers.filter((answer) => answer.correct).length / coreAnswers.length) * 100)
    : 0;
  const dueReviews = state.reviews.filter(
    (review) => now > 0 && new Date(review.nextReviewAt).getTime() <= now,
  );
  const readingQuestions = readingPassages.reduce(
    (total, passage) => total + passage.exercises.length,
    0,
  );
  const listeningQuestions = listeningActivities.reduce(
    (total, activity) => total + activity.exercises.length,
    0,
  );

  const sections = [
    {
      href: "/vocabulary",
      label: "01 · VOCABOLARIO",
      title: "Costruisci un lessico B2 solido",
      description:
        "Parole, espressioni, phrasal verbs e collocazioni divisi per tema, con richiamo attivo e pronuncia.",
      facts: `${vocabularyItems.length} parole · ${vocabularyExercises.length} esercizi`,
      attempted: state.vocabularyProgress.length,
      total: vocabularyItems.length,
      icon: Languages,
      tone: "mint",
    },
    {
      href: "/grammar",
      label: "02 · VERBI E TEMPI",
      title: "Impara a coniugare e scegliere",
      description:
        "Tutti i tempi inglesi, spiegati in italiano con forma, uso, segnali temporali ed esercizi intensivi.",
      facts: `${verbTenseTopics.length} moduli · ${grammarExercises.length} esercizi`,
      attempted: uniqueAttempted(state.answers, "grammar"),
      total: grammarExercises.length,
      icon: BookType,
      tone: "amber",
    },
    {
      href: "/reading",
      label: "03 · READING",
      title: "Leggi testi completi di livello B2",
      description:
        "Articoli e report originali con domande su idea principale, dettagli, inferenze e atteggiamento.",
      facts: `${readingPassages.length} testi · ${readingQuestions} domande`,
      attempted: uniqueAttempted(state.answers, "reading"),
      total: readingQuestions,
      icon: BrainCircuit,
      tone: "blue",
    },
    {
      href: "/listening",
      label: "04 · LISTENING",
      title: "Allenati con audio in stile esame",
      description:
        "Annunci, interviste e conversazioni con due ascolti e risposte multiple o menu a scelta.",
      facts: `${listeningActivities.length} audio · ${listeningQuestions} domande`,
      attempted: uniqueAttempted(state.answers, "listening"),
      total: listeningQuestions,
      icon: Headphones,
      tone: "lilac",
    },
    {
      href: "/use-of-english",
      label: "05 · USE OF ENGLISH",
      title: "Costruisci precisione grammaticale",
      description:
        "Trasforma le parole e completa i testi con open cloze, word formation e key word transformations.",
      facts: "Pratica intensiva per l'esame",
      attempted: uniqueAttempted(state.answers, "use-of-english"),
      total: 100, // Placeholder until fully populated
      icon: FileCheck2,
      tone: "amber",
    },
  ];

  return (
    <>
      <DailyGoalsWidget quotas={state.dailyQuotas} />
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6" aria-busy={!hydrated}>
        {sections.map((section) => {
          const progress = section.total
            ? Math.min(100, Math.round((section.attempted / section.total) * 100))
            : 0;
          const Icon = section.icon;
          return (
            <Link href={section.href} key={section.href}>
              <Card className={`curriculum-section-card ${section.tone}`} style={{ minHeight: '180px', padding: '16px' }}>
                <header style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                  <i style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
                    <Icon size={20} />
                  </i>
                  <span style={{ fontSize: '9px' }}>{section.label.split('·')[1].trim()}</span>
                </header>
                <h2 style={{ fontSize: '15px', marginTop: '12px', marginBottom: '8px', lineHeight: '1.2' }}>{section.title}</h2>
                
                <footer style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'stretch' }}>
                  <div style={{ height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                    <Progress value={progress} />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <small style={{ fontSize: '10px' }}>{progress}%</small>
                    <ArrowRight size={14} className="opacity-50" />
                  </div>
                </footer>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="dashboard-welcome curriculum-welcome">
        <div>
          <span className="page-eyebrow">IL TUO PERCORSO B2</span>
          <h1>Cinque sezioni. Un obiettivo chiaro.</h1>
          <p>
            Vocabolario, verbi, reading, listening e use of english: studia una sezione alla volta
            e lascia che i risultati reali costruiscano il tuo profilo.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href={state.assessmentComplete ? "/vocabulary" : "/assessment"}>
            {state.assessmentComplete ? "Inizia a studiare" : "Fai il test iniziale"}
            <ArrowRight size={18} />
          </Link>
        </Button>
      </div>

      <Card className="curriculum-status-card mb-6">
        <div>
          <span>
            {state.assessmentComplete ? "STIMA BASATA SUL TEST" : "PRIMA DEL TEST"}
          </span>
          <h2>
            {state.assessmentComplete
              ? `${learningProfile.level} · preparazione ${learningProfile.readiness}%`
              : "Livello e preparazione da calcolare"}
          </h2>
          <p>
            {state.assessmentComplete
              ? `La stima usa ${learningProfile.evidenceCount} risposte e attività registrate.`
              : "Il test contiene domande oggettive nelle cinque sezioni e non include writing."}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={state.assessmentComplete ? "/statistics" : "/assessment"}>
            <ClipboardCheck size={17} />
            {state.assessmentComplete ? "Vedi il dettaglio" : "Inizia il test"}
          </Link>
        </Button>
      </Card>

      <div className="metric-grid curriculum-metrics">
        <DashboardCard
          label="Esercizi completati"
          value={String(coreAnswers.length)}
          detail="Solo attività realmente svolte"
          icon={CheckCircle2}
          tone="blue"
        />
        <DashboardCard
          label="Accuratezza media"
          value={coreAnswers.length ? `${accuracy}%` : "—"}
          detail={coreAnswers.length ? "Dalle tue risposte" : "Nessuna risposta registrata"}
          icon={Target}
          tone="lilac"
        />
        <DashboardCard
          label="Parole consolidate"
          value={String(
            state.vocabularyProgress.filter((item) => item.status === "mastered").length,
          )}
          detail={`Su ${vocabularyItems.length} parole B2`}
          icon={Languages}
        />
        <DashboardCard
          label="Errori da ripassare"
          value={String(dueReviews.length)}
          detail={`${state.reviews.length} errori monitorati`}
          icon={RefreshCcw}
          tone="orange"
        />
      </div>

      <div className="curriculum-next-step">
        <div>
          <span>PROSSIMO PASSO CONSIGLIATO</span>
          <h2>
            {dueReviews.length
              ? "Ripassa gli errori già pronti"
              : "Comincia dal vocabolario essenziale"}
          </h2>
          <p>
            {dueReviews.length
              ? "Le risposte sbagliate tornano al momento giusto con spiegazione e soluzione."
              : "Una sessione breve ti aiuta a costruire subito una base utile anche per reading e listening."}
          </p>
        </div>
        <Button asChild>
          <Link href={dueReviews.length ? "/review" : "/vocabulary"}>
            Vai alla sessione <ArrowRight size={17} />
          </Link>
        </Button>
      </div>
    </>
  );
}

function uniqueAttempted(
  answers: { exerciseId: string; section: string }[],
  section: string,
) {
  return new Set(
    answers
      .filter((answer) => answer.section === section)
      .map((answer) => answer.exerciseId),
  ).size;
}
