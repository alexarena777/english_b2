"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClockAlert,
  FileCheck2,
  Flag,
  Headphones,
} from "lucide-react";
import type { ExamAttempt, Exercise } from "@/lib/types";
import { calculateExamResult } from "@/lib/logic";
import { readingPassages, listeningActivities } from "@/lib/data";
import { useProgress } from "@/components/providers";
import { Brand } from "@/components/brand";
import { ExamTimer } from "@/components/exam-timer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export function ExamRunner({
  examId,
  title,
  minutes,
  exercises,
}: {
  examId: string;
  title: string;
  minutes: number;
  exercises: Exercise[];
}) {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const startedAt = useRef(new Date());
  const { completeExam } = useProgress();
  const exercise = exercises[index];
  const answered = Object.values(responses).filter((answer) => answer.trim()).length;

  function finish(status: ExamAttempt["status"]) {
    if (attempt) return;
    const completedAt = new Date();
    const result = calculateExamResult(exercises, responses);
    const nextAttempt: ExamAttempt = {
      id: crypto.randomUUID(),
      examId,
      title,
      status,
      startedAt: startedAt.current.toISOString(),
      completedAt: completedAt.toISOString(),
      durationSeconds: Math.max(
        0,
        Math.round((completedAt.getTime() - startedAt.current.getTime()) / 1000),
      ),
      questionCount: exercises.length,
      ...result,
    };
    completeExam(nextAttempt, exercises);
    setAttempt(nextAttempt);
  }

  if (attempt) {
    return <ExamReport attempt={attempt} exercises={exercises} />;
  }

  const passage =
    exercise.section === "reading"
      ? readingPassages.find((item) => item.id === exercise.passageId)
      : null;
  const listening =
    exercise.section === "listening"
      ? listeningActivities.find((item) => item.id === exercise.passageId)
      : null;

  return (
    <main className="exam-run advanced-exam">
      <header>
        <Brand compact />
        <div>
          <b>{title}</b>
          <small>{answered} di {exercises.length} risposte inserite</small>
        </div>
        <ExamTimer minutes={minutes} onExpire={() => finish("expired")} />
      </header>
      <div className="exam-workspace">
        <aside className="exam-navigator">
          <div>
            <span>AVANZAMENTO</span>
            <b>{Math.round((answered / exercises.length) * 100)}%</b>
          </div>
          <Progress value={(answered / exercises.length) * 100} />
          <div className="exam-question-map" aria-label="Navigazione domande">
            {exercises.map((item, itemIndex) => (
              <button
                key={item.id}
                className={`${itemIndex === index ? "current" : ""} ${responses[item.id]?.trim() ? "answered" : ""}`}
                onClick={() => setIndex(itemIndex)}
                aria-label={`Domanda ${itemIndex + 1}${responses[item.id]?.trim() ? ", risposta inserita" : ""}`}
              >
                {itemIndex + 1}
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={() => finish("completed")}>
            <Flag size={16} /> Consegna prova
          </Button>
        </aside>

        <section className="exam-question-card">
          <div className="exam-question-meta">
            <Badge variant="neutral">{exercise.section}</Badge>
            <span>{exercise.topic}</span>
            <b>Domanda {index + 1} di {exercises.length}</b>
          </div>
          {passage && (
            <details className="exam-source" open>
              <summary>{passage.title}</summary>
              <p>{passage.text}</p>
            </details>
          )}
          {listening && <ExamListening activityId={listening.id} title={listening.title} transcript={listening.transcript} />}
          <p>{exercise.instructions}</p>
          <h1>{exercise.question}</h1>
          {exercise.options?.length ? (
            <div className="option-list" role="radiogroup" aria-label="Opzioni di risposta">
              {exercise.options.map((option, optionIndex) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={responses[exercise.id] === option.label}
                  className={responses[exercise.id] === option.label ? "selected" : ""}
                  onClick={() =>
                    setResponses((current) => ({
                      ...current,
                      [exercise.id]: option.label,
                    }))
                  }
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <Input
              value={responses[exercise.id] ?? ""}
              onChange={(event) =>
                setResponses((current) => ({
                  ...current,
                  [exercise.id]: event.target.value,
                }))
              }
              aria-label="Risposta"
            />
          )}
          <div className="exam-question-actions">
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
            >
              <ArrowLeft size={17} /> Precedente
            </Button>
            {index < exercises.length - 1 ? (
              <Button onClick={() => setIndex((value) => value + 1)}>
                Successiva <ArrowRight size={17} />
              </Button>
            ) : (
              <Button onClick={() => finish("completed")}>
                Consegna <FileCheck2 size={17} />
              </Button>
            )}
          </div>
          <small className="exam-neutral-note">
            Le soluzioni vengono mostrate soltanto dopo la consegna.
          </small>
        </section>
      </div>
    </main>
  );
}

function ExamListening({
  activityId,
  title,
  transcript,
}: {
  activityId: string;
  title: string;
  transcript: string;
}) {
  const [plays, setPlays] = useState(0);

  function play() {
    if (!("speechSynthesis" in window) || plays >= 2) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = "en-GB";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
    setPlays((value) => value + 1);
  }

  return (
    <div className="exam-listening" data-activity={activityId}>
      <Headphones />
      <div>
        <b>{title}</b>
        <small>Puoi ascoltare ancora {Math.max(0, 2 - plays)} volte</small>
      </div>
      <Button variant="outline" onClick={play} disabled={plays >= 2}>
        Ascolta
      </Button>
    </div>
  );
}

function ExamReport({
  attempt,
  exercises,
}: {
  attempt: ExamAttempt;
  exercises: Exercise[];
}) {
  const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const errors = attempt.answers.filter((answer) => !answer.correct);
  return (
    <main className="exam-report-page">
      <section className="exam-report-hero">
        {attempt.status === "expired" ? <ClockAlert /> : <CheckCircle2 />}
        <span>{attempt.status === "expired" ? "TEMPO SCADUTO" : "PROVA COMPLETATA"}</span>
        <h1>{attempt.score}%</h1>
        <h2>
          Livello indicativo: {attempt.score >= 78 ? "B2" : attempt.score >= 60 ? "B1+" : "B1"}
        </h2>
        <p>
          {attempt.correctCount} risposte corrette su {attempt.questionCount}; {attempt.questionCount - attempt.answeredCount} non risposte.
        </p>
        <div>
          <Button asChild><Link href="/exam">Torna alle simulazioni</Link></Button>
          <Button asChild variant="outline"><Link href="/statistics">Apri le statistiche</Link></Button>
        </div>
      </section>
      <section className="exam-section-report">
        <h2>Risultato per sezione</h2>
        <div>
          {attempt.sectionResults.map((section) => (
            <article key={section.section}>
              <span>{section.section}</span>
              <strong>{section.score}%</strong>
              <Progress value={section.score} />
              <small>{section.correct} / {section.total} corrette</small>
            </article>
          ))}
        </div>
      </section>
      {attempt.weakTopics.length > 0 && (
        <section className="exam-priorities">
          <h2>Priorità di ripasso</h2>
          <div>{attempt.weakTopics.map((topic) => <Badge key={topic}>{topic}</Badge>)}</div>
        </section>
      )}
      <section className="exam-corrections">
        <h2>Correzione delle risposte</h2>
        {errors.length ? errors.map((answer, errorIndex) => {
          const item = exerciseMap.get(answer.exerciseId);
          if (!item) return null;
          return (
            <article key={answer.exerciseId}>
              <span>{errorIndex + 1}</span>
              <div>
                <b>{item.question}</b>
                <p>La tua risposta: {answer.answer || "Nessuna risposta"}</p>
                <strong>Risposta corretta: {Array.isArray(item.correctAnswer) ? item.correctAnswer.join(" / ") : item.correctAnswer}</strong>
                <small>{item.explanation}</small>
              </div>
            </article>
          );
        }) : (
          <div className="empty-inline"><CheckCircle2 /><p>Nessun errore: prova completata perfettamente.</p></div>
        )}
      </section>
    </main>
  );
}
