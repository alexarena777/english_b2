"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardCheck, Headphones, Play, RotateCcw, Target } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useProgress } from "@/components/providers";
import { assessmentExercises, listeningActivities } from "@/lib/data";
import { calculateAssessment, evaluateAnswer } from "@/lib/logic";
import { assessmentDraftSchema } from "@/lib/schemas";
import type { UserAnswer } from "@/lib/types";

const DRAFT_KEY = "b2-assessment-draft-v2";

type Draft = { index: number; answers: UserAnswer[] };

export default function AssessmentPage() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [done, setDone] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const { recordAnswer, updateProfile } = useProgress();
  const exercise = assessmentExercises[index];
  const result = done ? calculateAssessment(answers) : null;

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      try {
        const parsed = assessmentDraftSchema.safeParse(JSON.parse(saved));
        if (parsed.success) setDraft(parsed.data);
        else localStorage.removeItem(DRAFT_KEY);
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    });
  }, []);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function begin(resume: boolean) {
    if (resume && draft) {
      setIndex(draft.index);
      setAnswers(draft.answers);
    } else {
      localStorage.removeItem(DRAFT_KEY);
      setDraft(null);
      setIndex(0);
      setAnswers([]);
      setAnswer("");
      setDone(false);
    }
    setStarted(true);
  }

  function next() {
    const correct = evaluateAnswer(exercise, answer);
    const entry: UserAnswer = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      answer,
      correct,
      section: exercise.section,
      topic: exercise.topic,
      answeredAt: new Date().toISOString(),
      timeSpent: exercise.estimatedTime,
    };
    const updated = [...answers, entry];
    setAnswers(updated);
    recordAnswer(exercise, answer, correct, exercise.estimatedTime);

    if (index === assessmentExercises.length - 1) {
      const score = calculateAssessment(updated);
      updateProfile({
        assessmentComplete: true,
        assessmentVersion: 2,
        estimatedLevel: score.level,
        readiness: score.readiness,
      });
      localStorage.removeItem(DRAFT_KEY);
      setDraft(null);
      setDone(true);
      return;
    }

    const nextDraft = { index: index + 1, answers: updated };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
    setDraft(nextDraft);
    setIndex((value) => value + 1);
    setAnswer("");
  }

  if (!started) {
    return (
      <main className="assessment-intro">
        <header>
          <Brand />
          <Link href="/login">Accedi per sincronizzare</Link>
        </header>
        <section>
          <div className="eyebrow">
            <ClipboardCheck size={16} /> TEST DI VALUTAZIONE
          </div>
          <h1>Scopri da dove partire.</h1>
          <p>
            28 domande oggettive su vocabolario, verbi, reading e listening per
            stimare il tuo punto di partenza senza prove di writing.
          </p>
          <div className="assessment-facts">
            <span>
              <b>20–30 min</b>
              <small>durata indicativa</small>
            </span>
            <span>
              <b>4 aree</b>
              <small>profilo dettagliato</small>
            </span>
            <span>
              <b>A2 → B2+</b>
              <small>stima del livello</small>
            </span>
          </div>
          {draft ? (
            <div className="assessment-resume-actions">
              <Button size="lg" onClick={() => begin(true)}>
                Riprendi dalla domanda {draft.index + 1} <ArrowRight size={18} />
              </Button>
              <Button variant="outline" onClick={() => begin(false)}>
                <RotateCcw size={17} /> Ricomincia
              </Button>
            </div>
          ) : (
            <Button size="lg" onClick={() => begin(false)}>
              Inizia il test <ArrowRight size={18} />
            </Button>
          )}
          <small>
            Puoi interrompere: le risposte completate vengono salvate sul
            dispositivo.
          </small>
        </section>
      </main>
    );
  }

  if (result) {
    return (
      <main className="assessment-result">
        <div className="result-top">
          <Brand />
          <Badge variant="success">TEST COMPLETATO</Badge>
          <h1>
            Il tuo livello stimato è <span>{result.level}</span>
          </h1>
          <p>
            Sei al {result.readiness}% della preparazione richiesta per affrontare
            con sicurezza un test B2.
          </p>
          <Button asChild>
            <Link href="/dashboard">
              Apri il tuo piano <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
        <div className="result-grid">
          <section>
            <h2>Profilo per area</h2>
            {Object.entries(result.sectionScores).map(([area, score]) => (
              <div className="result-area" key={area}>
                <span>{sectionLabel(area)}</span>
                <Progress value={score} />
                <b>{score}%</b>
              </div>
            ))}
          </section>
          <section>
            <h2>Priorità iniziali</h2>
            {result.studyPlan.map((item, itemIndex) => (
              <div className="study-plan-row" key={item.title}>
                <span>{itemIndex + 1}</span>
                <div>
                  <b>{item.title}</b>
                  <small>{item.reason}</small>
                </div>
                <em>{item.sessions} sessioni</em>
              </div>
            ))}
          </section>
        </div>
        <div className="result-note">
          <BarChart3 />
          <div>
            <h3>Come abbiamo calcolato il risultato</h3>
            <p>
              Il livello usa soltanto risposte oggettive nelle quattro aree del
              nuovo percorso. Nessuna prova di writing entra nel calcolo.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="assessment-run">
      <header>
        <Brand compact />
        <div>
          <span>{exercise.section}</span>
          <b>
            Domanda {index + 1} di {assessmentExercises.length}
          </b>
        </div>
        <button onClick={() => setStarted(false)}>Esci e salva</button>
      </header>
      <Progress value={(index / assessmentExercises.length) * 100} />
      <section>
        <div className="assessment-question-meta">
          <Badge>{exercise.level}</Badge>
          <span>{exercise.topic}</span>
        </div>
        <p>{exercise.instructions}</p>
        <h1>{exercise.question}</h1>
        {exercise.section === "listening" && exercise.passageId && (
          <AssessmentAudio activityId={exercise.passageId} />
        )}
        {exercise.options ? (
          <div className="option-list" role="radiogroup">
            {exercise.options.map((option, optionIndex) => (
              <button
                type="button"
                role="radio"
                aria-checked={answer === option.label}
                className={answer === option.label ? "selected" : ""}
                onClick={() => setAnswer(option.label)}
                key={option.id}
              >
                <span>{String.fromCharCode(65 + optionIndex)}</span>
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <Input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
        )}
        <Button onClick={next} disabled={!answer.trim()}>
          {index === assessmentExercises.length - 1
            ? "Concludi il test"
            : "Domanda successiva"}{" "}
          <ArrowRight size={17} />
        </Button>
      </section>
      <footer>
        <Target size={16} /> Non mostriamo le soluzioni durante il test per
        ottenere una stima attendibile.
      </footer>
    </main>
  );
}

function sectionLabel(section: string) {
  return {
    grammar: "Verbi e tempi",
    vocabulary: "Vocabolario",
    reading: "Reading",
    listening: "Listening",
  }[section] ?? section;
}

function AssessmentAudio({ activityId }: { activityId: string }) {
  const activity = listeningActivities.find((item) => item.id === activityId);
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    queueMicrotask(() => {
      setPlays(0);
      setPlaying(false);
    });
  }, [activityId]);

  if (!activity) return null;
  const selectedActivity = activity;

  function play() {
    if (!("speechSynthesis" in window) || plays >= selectedActivity.maxListens) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedActivity.transcript);
    utterance.lang = "en-GB";
    utterance.rate = 0.9;
    const voice = speechSynthesis
      .getVoices()
      .find((candidate) => candidate.lang.toLowerCase().startsWith("en-gb"));
    if (voice) utterance.voice = voice;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    setPlays((value) => value + 1);
    setPlaying(true);
    speechSynthesis.speak(utterance);
  }

  return (
    <div className="assessment-audio">
      <Headphones />
      <div>
        <b>{selectedActivity.title}</b>
        <small>
          {playing
            ? "Audio in riproduzione"
            : `Ascolti disponibili: ${Math.max(0, selectedActivity.maxListens - plays)}`}
        </small>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={play}
        disabled={playing || plays >= selectedActivity.maxListens}
      >
        <Play size={16} /> Ascolta
      </Button>
    </div>
  );
}
