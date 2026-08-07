"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, GraduationCap, GripVertical, RotateCcw, TimerReset } from "lucide-react";
import type { Exercise, PracticeMode } from "@/lib/types";
import { evaluateAnswer } from "@/lib/logic";
import { useProgress } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AnswerFeedback } from "./answer-feedback";

function examInstruction(exercise: Exercise) {
  if (exercise.topic === "Multiple-choice cloze") {
    return "Read the text and decide which answer (A, B, C or D) best fits each gap.";
  }
  if (exercise.topic === "Open cloze") {
    return "Read the text and think of the word which best fits each gap. Use only one word in each gap.";
  }
  if (exercise.topic === "Word formation") {
    return "Use the word given in capitals to form a word that fits the gap.";
  }
  if (exercise.topic === "Key word transformation") {
    return "Complete the second sentence using the word given. Use between two and five words, including the word given.";
  }
  if (exercise.section === "reading" && exercise.topic === "gapped text") {
    return "Read the text and choose the paragraph which fits each gap. There is one extra paragraph which you do not need to use.";
  }
  if (exercise.section === "reading" && exercise.topic === "multiple matching") {
    return "Read the texts and choose which person matches each statement. The people may be chosen more than once.";
  }
  if (exercise.section === "reading") {
    return "Read the text and choose the answer which best fits according to the text.";
  }
  if (exercise.section === "listening" && exercise.topic === "sentence completion") {
    return "Complete the sentences with a word or short phrase from the recording.";
  }
  if (exercise.section === "listening" && exercise.topic === "multiple matching") {
    return "Choose the option which best matches each speaker. There are three extra options which you do not need to use.";
  }
  if (exercise.section === "listening") {
    return "Listen and choose the answer which best fits what you hear.";
  }
  if (exercise.options?.length) {
    return "Choose the answer which best completes the sentence.";
  }
  return "Complete the sentence with the correct form.";
}

export function ExerciseRenderer({
  exercises,
  onComplete,
  compact = false,
  enableModeSwitch = false,
  mode,
  onModeChange,
}: {
  exercises: Exercise[];
  onComplete?: (score: number) => void;
  compact?: boolean;
  enableModeSwitch?: boolean;
  mode?: PracticeMode;
  onModeChange?: (mode: PracticeMode) => void;
}) {
  const [internalMode, setInternalMode] = useState<PracticeMode>("study");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finishedScore, setFinishedScore] = useState<number | null>(null);
  const [simulationAnswers, setSimulationAnswers] = useState<Record<string, string>>({});
  const [simulationCorrections, setSimulationCorrections] = useState<
    { exercise: Exercise; answer: string; correct: boolean }[]
  >([]);
  const [hydrated, setHydrated] = useState(false);
  const startedAt = useRef(0);
  const sessionStartedAt = useRef(0);
  const { recordAnswer } = useProgress();
  const exercise = exercises[index];
  const activeMode = mode ?? internalMode;
  const correct = useMemo(
    () => (exercise ? evaluateAnswer(exercise, answer) : false),
    [exercise, answer],
  );
  useEffect(() => {
    startedAt.current = Date.now();
    sessionStartedAt.current = Date.now();
    queueMicrotask(() => setHydrated(true));
  }, []);

  if (!exercise) {
    return (
      <div className="state-box">
        <p>Nessun esercizio disponibile per questa sessione.</p>
      </div>
    );
  }

  function check() {
    if (!answer.trim() || checked) return;
    setChecked(true);
    if (correct) setCorrectCount((value) => value + 1);
    recordAnswer(
      exercise,
      answer,
      correct,
      startedAt.current
        ? Math.max(0, Math.round((Date.now() - startedAt.current) / 1000))
        : 0,
    );
  }

  function submitSimulation() {
    const responses = { ...simulationAnswers, [exercise.id]: answer };
    const corrections = exercises.map((item) => {
      const response = responses[item.id] ?? "";
      return {
        exercise: item,
        answer: response,
        correct: response.trim() ? evaluateAnswer(item, response) : false,
      };
    });
    const answeredCorrections = corrections.filter((item) => item.answer.trim());
    const correctAnswers = answeredCorrections.filter((item) => item.correct).length;
    const score = Math.round((correctAnswers / exercises.length) * 100);
    const elapsed = Math.max(
      1,
      Math.round((Date.now() - sessionStartedAt.current) / 1000),
    );
    const secondsPerAnswer = answeredCorrections.length
      ? Math.max(1, Math.round(elapsed / answeredCorrections.length))
      : 0;

    answeredCorrections.forEach((item) => {
      recordAnswer(item.exercise, item.answer, item.correct, secondsPerAnswer);
    });
    setSimulationAnswers(responses);
    setSimulationCorrections(corrections);
    setCorrectCount(correctAnswers);
    setFinishedScore(score);
    onComplete?.(score);
  }

  function continueSimulation() {
    if (!answer.trim()) return;
    setSimulationAnswers((current) => ({
      ...current,
      [exercise.id]: answer,
    }));
    if (index === exercises.length - 1) {
      submitSimulation();
      return;
    }
    setIndex((value) => value + 1);
    setAnswer(simulationAnswers[exercises[index + 1]?.id] ?? "");
  }

  function next() {
    if (index === exercises.length - 1) {
      const score = Math.round((correctCount / exercises.length) * 100);
      if (onComplete) onComplete(score);
      else setFinishedScore(score);
      return;
    }
    startedAt.current = Date.now();
    setIndex((value) => value + 1);
    setAnswer("");
    setChecked(false);
  }

  function restart() {
    setIndex(0);
    setAnswer("");
    setChecked(false);
    setCorrectCount(0);
    setFinishedScore(null);
    setSimulationAnswers({});
    setSimulationCorrections([]);
    startedAt.current = Date.now();
    sessionStartedAt.current = Date.now();
  }

  function changeMode(nextMode: PracticeMode) {
    setInternalMode(nextMode);
    onModeChange?.(nextMode);
    restart();
  }

  if (finishedScore !== null) {
    const errors = simulationCorrections.filter((item) => !item.correct);
    return (
      <>
        <section className="exercise-complete" aria-live="polite">
          <CheckCircle2 />
          <span>{activeMode === "simulation" ? "SIMULAZIONE CONSEGNATA" : "ALLENAMENTO COMPLETATO"}</span>
          <h2>{finishedScore}% di accuratezza</h2>
          <p>
            Hai risposto correttamente a {correctCount} domande su {exercises.length}.
          </p>
          <Button variant="outline" onClick={restart}>
            <RotateCcw size={17} /> Ripeti gli esercizi
          </Button>
        </section>
        {activeMode === "simulation" && errors.length > 0 && (
          <section className="simulation-corrections">
            <div>
              <span>CORREZIONE FINALE</span>
              <h2>Rivedi le risposte da migliorare</h2>
              <p>Durante la prova non hai ricevuto suggerimenti. Ora trovi soluzione e spiegazione.</p>
            </div>
            {errors.map(({ exercise: item, answer: response }, correctionIndex) => (
              <article key={item.id}>
                <span>{correctionIndex + 1}</span>
                <div>
                  <h3>{item.question}</h3>
                  <p>La tua risposta: <b>{response || "Non inserita"}</b></p>
                  <p>Risposta corretta: <strong>{Array.isArray(item.correctAnswer) ? item.correctAnswer.join(" / ") : item.correctAnswer}</strong></p>
                  <small>{item.explanation}</small>
                </div>
              </article>
            ))}
          </section>
        )}
      </>
    );
  }

  return (
    <>
      {enableModeSwitch && (
        <div className="practice-mode-switch" aria-label="Modalità di esercizio">
          <button
            type="button"
            className={activeMode === "study" ? "active" : ""}
            onClick={() => changeMode("study")}
          >
            <GraduationCap size={17} />
            <span><b>Studio</b><small>Correzione immediata</small></span>
          </button>
          <button
            type="button"
            className={activeMode === "simulation" ? "active" : ""}
            onClick={() => changeMode("simulation")}
          >
            <TimerReset size={17} />
            <span><b>Simulazione</b><small>Soluzioni solo alla fine</small></span>
          </button>
        </div>
      )}
      <div className={compact ? "exercise-shell compact" : "exercise-shell"}>
      <div className="exercise-top">
        <div>
          <Badge variant="neutral">{exercise.section}</Badge>
          <span>{exercise.topic}</span>
        </div>
        <span className="exercise-counter">
          {activeMode === "simulation" && <Clock3 size={13} />}
          {index + 1} / {exercises.length}
        </span>
      </div>
      <Progress
        value={((index + (checked ? 1 : 0)) / exercises.length) * 100}
        label="Avanzamento esercizi"
      />
      <div className="exercise-question">
        <p>{activeMode === "simulation" ? examInstruction(exercise) : exercise.instructions}</p>
        {exercise.context && (
          <section className="exercise-context" aria-label="Testo dell'esercizio">
            {exercise.contextTitle && <span>{exercise.contextTitle}</span>}
            {exercise.context.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        )}
        <h2>{exercise.question}</h2>
      </div>
      <ExerciseInput
        exercise={exercise}
        answer={answer}
        setAnswer={setAnswer}
        disabled={checked || !hydrated}
      />
      {activeMode === "simulation" ? (
        <div className="exercise-actions simulation-actions">
          <span>Nessun feedback prima della consegna</span>
          <Button onClick={continueSimulation} disabled={!hydrated || !answer.trim()}>
            {index === exercises.length - 1 ? "Consegna" : "Salva e continua"} <ArrowRight size={17} />
          </Button>
        </div>
      ) : !checked ? (
        <div className="exercise-actions">
          <span>Circa {exercise.estimatedTime} sec</span>
          <Button onClick={check} disabled={!hydrated || !answer.trim()}>
            Controlla <ArrowRight size={17} />
          </Button>
        </div>
      ) : (
        <AnswerFeedback
          exercise={exercise}
          answer={answer}
          correct={correct}
          onContinue={next}
        />
      )}
      </div>
    </>
  );
}

function ExerciseInput({
  exercise,
  answer,
  setAnswer,
  disabled,
}: {
  exercise: Exercise;
  answer: string;
  setAnswer: (value: string) => void;
  disabled: boolean;
}) {
  if (exercise.options?.length && exercise.presentation === "select") {
    return (
      <label className="exercise-select">
        <span>Scegli una risposta</span>
        <select
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={disabled}
          aria-label="Risposta dal menu"
        >
          <option value="">Apri le opzioni…</option>
          {exercise.options.map((option) => (
            <option key={option.id} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (exercise.options?.length) {
    return (
      <div className="option-list" role="radiogroup" aria-label="Opzioni di risposta">
        {exercise.options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={answer === option.label}
            disabled={disabled}
            className={answer === option.label ? "selected" : ""}
            onClick={() => setAnswer(option.label)}
          >
            <span>{String.fromCharCode(65 + index)}</span>
            {option.label}
          </button>
        ))}
      </div>
    );
  }
  if (exercise.type === "writing") {
    return (
      <Textarea
        rows={8}
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        disabled={disabled}
        placeholder="Scrivi qui la tua risposta…"
        aria-label="Risposta di writing"
      />
    );
  }
  if (exercise.type === "reorder") {
    const words = exercise.question.split(" ");
    return (
      <div className="reorder-box">
        <GripVertical />
        <p>{words.join(" · ")}</p>
        <Input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={disabled}
          placeholder="Riscrivi la frase nell’ordine corretto"
        />
      </div>
    );
  }

  if (exercise.type === "transformation") {
    const parts = exercise.question.split(" → ");
    if (parts.length === 2) {
      const firstSentence = parts[0];
      const match = parts[1].match(/^(.*?)___(.*?)\(([^)]+)\)$/);
      if (match) {
        const [, prefix, suffix, keyword] = match;
        return (
          <div className="transformation-box p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl space-y-4">
            <p className="text-sm font-medium text-slate-200">{firstSentence}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold tracking-wider">KEY WORD:</span>
              <Badge variant="neutral" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10 font-bold">{keyword}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              {prefix.trim() && <span>{prefix.trim()}</span>}
              <Input
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={disabled}
                placeholder="2-5 parole..."
                aria-label="Risposta per transformation"
                className="w-48 text-center bg-slate-900 border-slate-700 focus:border-emerald-500 font-semibold text-emerald-400 placeholder:text-slate-600 placeholder:font-normal"
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.preventDefault();
                }}
              />
              {suffix.trim() && <span>{suffix.trim()}</span>}
            </div>
          </div>
        );
      }
    }
  }

  return (
    <Input
      value={answer}
      onChange={(event) => setAnswer(event.target.value)}
      disabled={disabled}
      placeholder="Scrivi la risposta"
      aria-label="Risposta"
      onKeyDown={(event) => {
        if (event.key === "Enter") event.preventDefault();
      }}
    />
  );
}

export function MultipleChoiceExercise({ exercise }: { exercise: Exercise }) {
  return <ExerciseRenderer exercises={[exercise]} />;
}
export function FillGapExercise({ exercise }: { exercise: Exercise }) {
  return <ExerciseRenderer exercises={[exercise]} />;
}
export function ReorderExercise({ exercise }: { exercise: Exercise }) {
  return <ExerciseRenderer exercises={[exercise]} />;
}
export function MatchingExercise({ exercise }: { exercise: Exercise }) {
  return <ExerciseRenderer exercises={[exercise]} />;
}
