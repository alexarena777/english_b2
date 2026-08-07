"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, GraduationCap, GripVertical, RotateCcw, Sparkles, TimerReset } from "lucide-react";
import confetti from "canvas-confetti";
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
  const [activeExercises, setActiveExercises] = useState<Exercise[]>(exercises);
  const [index, setIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>({});
  const [correctStates, setCorrectStates] = useState<Record<number, boolean>>({});
  const [finishedScore, setFinishedScore] = useState<number | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"all" | "errors">("all");
  const [hydrated, setHydrated] = useState(false);

  const startedAt = useRef(0);
  const sessionStartedAt = useRef(0);
  const { recordAnswer } = useProgress();

  const activeMode = mode ?? internalMode;

  // Reset when exercises prop changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveExercises(exercises);
    setIndex(0);
    setUserAnswers({});
    setCheckedStates({});
    setCorrectStates({});
    setFinishedScore(null);
    startedAt.current = Date.now();
    sessionStartedAt.current = Date.now();
  }, [exercises]);

  useEffect(() => {
    startedAt.current = Date.now();
    sessionStartedAt.current = Date.now();
    queueMicrotask(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (finishedScore === 100) {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#26816a", "#183a2e", "#f5f4ee", "#ffd460"],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#26816a", "#183a2e", "#f5f4ee", "#ffd460"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [finishedScore]);

  const currentExercise = activeExercises[index];
  const currentAnswer = userAnswers[index] ?? "";
  const isChecked = checkedStates[index] ?? false;
  const isCorrect = correctStates[index] ?? (currentExercise ? evaluateAnswer(currentExercise, currentAnswer) : false);

  const setCurrentAnswer = useCallback((val: string) => {
    setUserAnswers((prev) => ({ ...prev, [index]: val }));
  }, [index]);

  const checkCurrent = useCallback(() => {
    if (!currentAnswer.trim() || isChecked || !currentExercise) return;
    const evaluatedCorrect = evaluateAnswer(currentExercise, currentAnswer);
    setCheckedStates((prev) => ({ ...prev, [index]: true }));
    setCorrectStates((prev) => ({ ...prev, [index]: evaluatedCorrect }));

    recordAnswer(
      currentExercise,
      currentAnswer,
      evaluatedCorrect,
      startedAt.current ? Math.max(0, Math.round((Date.now() - startedAt.current) / 1000)) : 0
    );
  }, [currentAnswer, isChecked, currentExercise, index, recordAnswer]);

  const finishSession = useCallback(() => {
    let correctCount = 0;
    activeExercises.forEach((ex, idx) => {
      const ans = userAnswers[idx] ?? "";
      const isRight = checkedStates[idx] ? correctStates[idx] : evaluateAnswer(ex, ans);
      if (isRight) correctCount++;
    });
    const score = Math.round((correctCount / activeExercises.length) * 100);
    setFinishedScore(score);
    onComplete?.(score);
  }, [activeExercises, userAnswers, checkedStates, correctStates, onComplete]);

  const prevQuestion = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1);
      startedAt.current = Date.now();
    }
  }, [index]);

  const nextQuestion = useCallback(() => {
    if (index < activeExercises.length - 1) {
      setIndex((i) => i + 1);
      startedAt.current = Date.now();
    } else {
      finishSession();
    }
  }, [index, activeExercises.length, finishSession]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in a textarea or input field
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";

      if (e.key === "ArrowLeft" && !isInputField && index > 0) {
        e.preventDefault();
        prevQuestion();
      }
      if (e.key === "ArrowRight" && !isInputField && (isChecked || activeMode === "simulation")) {
        e.preventDefault();
        nextQuestion();
      }
      if (e.key === "Enter" && !isChecked && currentAnswer.trim() && activeMode === "study") {
        if (target.tagName !== "TEXTAREA") {
          e.preventDefault();
          checkCurrent();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, isChecked, currentAnswer, activeMode, prevQuestion, nextQuestion, checkCurrent]);

  const restartSession = useCallback((onlyErrors = false) => {
    if (onlyErrors) {
      const failed = activeExercises.filter((ex, idx) => {
        const ans = userAnswers[idx] ?? "";
        const isRight = checkedStates[idx] ? correctStates[idx] : evaluateAnswer(ex, ans);
        return !isRight;
      });
      if (failed.length > 0) {
        setActiveExercises(failed);
      }
    } else {
      setActiveExercises(exercises);
    }
    setIndex(0);
    setUserAnswers({});
    setCheckedStates({});
    setCorrectStates({});
    setFinishedScore(null);
    setReviewFilter("all");
    startedAt.current = Date.now();
    sessionStartedAt.current = Date.now();
  }, [activeExercises, userAnswers, checkedStates, correctStates, exercises]);

  function changeMode(nextMode: PracticeMode) {
    setInternalMode(nextMode);
    onModeChange?.(nextMode);
    restartSession(false);
  }

  if (!currentExercise) {
    return (
      <div className="state-box">
        <p>Nessun esercizio disponibile per questa sessione.</p>
      </div>
    );
  }

  // Finished Session View
  if (finishedScore !== null) {
    const resultsList = activeExercises.map((ex, idx) => {
      const userAns = userAnswers[idx] ?? "";
      const isRight = checkedStates[idx] ? correctStates[idx] : evaluateAnswer(ex, userAns);
      return { exercise: ex, answer: userAns, correct: isRight, index: idx };
    });
    const correctCount = resultsList.filter((r) => r.correct).length;
    const errorsList = resultsList.filter((r) => !r.correct);
    const displayedResults = reviewFilter === "errors" ? errorsList : resultsList;

    return (
      <div className="space-y-6">
        <section className="exercise-complete bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl text-center space-y-4" aria-live="polite">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/15 text-emerald-400 mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              {activeMode === "simulation" ? "SIMULAZIONE CONSEGNATA" : "ALLENAMENTO COMPLETATO"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 mt-1">
              {finishedScore}% di accuratezza
            </h2>
          </div>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Hai risposto correttamente a <b className="text-emerald-400">{correctCount}</b> domande su <b>{activeExercises.length}</b>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => restartSession(false)} className="font-semibold">
              <RotateCcw size={16} className="mr-2" /> Ripeti la sessione
            </Button>
            {errorsList.length > 0 && (
              <Button onClick={() => restartSession(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                <Sparkles size={16} className="mr-2" /> Ripassa solo gli errori ({errorsList.length})
              </Button>
            )}
          </div>
        </section>

        {/* Errors / All Review Section */}
        <section className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">REVISIONE FINALE</span>
              <h3 className="text-lg font-bold text-slate-100">Rivedi le risposte e le spiegazioni</h3>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs font-semibold">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg transition-all ${reviewFilter === "all" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setReviewFilter("all")}
              >
                Tutti ({activeExercises.length})
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg transition-all ${reviewFilter === "errors" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setReviewFilter("errors")}
              >
                Solo errori ({errorsList.length})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {displayedResults.map(({ exercise: item, answer: response, correct: isRight, index: origIdx }) => (
              <article
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${isRight ? "bg-emerald-950/10 border-emerald-500/20" : "bg-rose-950/10 border-rose-500/20"}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${isRight ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                    {origIdx + 1}
                  </span>
                  <div className="space-y-2 flex-1">
                    <h4 className="text-sm font-semibold text-slate-200">{item.question}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className={`p-2.5 rounded-lg border ${isRight ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">La tua risposta:</span>
                        <b className={isRight ? "text-emerald-400" : "text-rose-400"}>{response || "Non inserita"}</b>
                      </div>
                      {!isRight && (
                        <div className="p-2.5 rounded-lg border bg-emerald-500/10 border-emerald-500/30">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-0.5">Risposta corretta:</span>
                          <strong className="text-emerald-300">
                            {Array.isArray(item.correctAnswer) ? item.correctAnswer.join(" / ") : item.correctAnswer}
                          </strong>
                        </div>
                      )}
                    </div>
                    {item.explanation && (
                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        {item.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
            {displayedResults.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6">Nessun errore da mostrare in questa sessione!</p>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Active Exercise View
  return (
    <>
      {enableModeSwitch && (
        <div className="practice-mode-switch mb-4" aria-label="Modalità di esercizio">
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
        {/* Top Header */}
        <div className="exercise-top flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="neutral" className="font-semibold">{currentExercise.section}</Badge>
            <span className="text-xs font-medium text-slate-400">{currentExercise.topic}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="exercise-counter text-xs font-mono font-bold text-emerald-400 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
              {activeMode === "simulation" && <Clock3 size={13} className="inline mr-1" />}
              {index + 1} / {activeExercises.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress
          value={((index + (isChecked ? 1 : 0)) / activeExercises.length) * 100}
          label="Avanzamento esercizi"
        />

        {/* Question Area */}
        <div className="exercise-question my-5">
          <p className="text-xs text-slate-400 font-medium mb-2">
            {activeMode === "simulation" ? examInstruction(currentExercise) : currentExercise.instructions}
          </p>
          {currentExercise.context && (
            <section className="exercise-context bg-slate-900/50 p-4 rounded-xl border border-slate-800 my-3 space-y-2 text-sm leading-relaxed text-slate-300" aria-label="Testo dell'esercizio">
              {currentExercise.contextTitle && <span className="font-bold text-emerald-400 block text-xs tracking-wider uppercase mb-1">{currentExercise.contextTitle}</span>}
              {currentExercise.context.split("\n\n").map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </section>
          )}
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-slate-100 leading-snug">
            {currentExercise.question}
          </h2>
        </div>

        {/* Input Area */}
        <ExerciseInput
          exercise={currentExercise}
          answer={currentAnswer}
          setAnswer={setCurrentAnswer}
          disabled={isChecked || !hydrated}
        />

        {/* Feedback Section (if checked) */}
        {isChecked && activeMode === "study" && (
          <div className="mt-4">
            <AnswerFeedback
              exercise={currentExercise}
              answer={currentAnswer}
              correct={isCorrect}
              onContinue={nextQuestion}
              continueLabel={index === activeExercises.length - 1 ? "Vedi risultati" : "Successiva"}
            />
          </div>
        )}

        {/* Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prevQuestion}
            disabled={index === 0}
            className="flex items-center gap-1.5 font-semibold text-xs h-10 px-4 min-w-[110px]"
            aria-label="Domanda precedente"
          >
            <ArrowLeft size={16} /> Precedente
          </Button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Domanda {index + 1} di {activeExercises.length}</span>
            {isChecked && activeMode === "study" && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isCorrect ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"}`}>
                {isCorrect ? "Corretta" : "Errata"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {!isChecked && activeMode === "study" ? (
              <Button
                type="button"
                onClick={checkCurrent}
                disabled={!hydrated || !currentAnswer.trim()}
                className="flex items-center gap-1.5 font-bold h-10 px-5 min-w-[120px]"
              >
                Controlla <ArrowRight size={16} />
              </Button>
            ) : isChecked && activeMode === "study" ? (
              <Button
                type="button"
                onClick={nextQuestion}
                className="flex items-center gap-1.5 font-bold h-10 px-5 min-w-[120px]"
              >
                {index === activeExercises.length - 1 ? "Vedi risultati" : "Successiva"}
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextQuestion}
                disabled={!hydrated || !currentAnswer.trim()}
                className="flex items-center gap-1.5 font-bold h-10 px-5 min-w-[120px]"
              >
                {index === activeExercises.length - 1 ? "Consegna" : "Salva e continua"}
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>
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
      <label className="exercise-select block space-y-1.5">
        <span className="text-xs font-semibold text-slate-400">Scegli una risposta</span>
        <select
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={disabled}
          aria-label="Risposta dal menu"
          className="w-full h-11 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm font-medium focus:border-emerald-500 focus:outline-none disabled:opacity-60"
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
      <div className="option-list grid gap-2.5" role="radiogroup" aria-label="Opzioni di risposta">
        {exercise.options.map((option, index) => {
          const isSelected = answer === option.label;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              className={`w-full min-h-[52px] text-left flex items-center gap-3.5 p-3 sm:p-4 rounded-xl border-2 transition-all font-medium text-sm ${
                isSelected
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold shadow-sm"
                  : "border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60"
              } ${disabled && !isSelected ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => setAnswer(option.label)}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-colors ${
                isSelected ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option.label}</span>
            </button>
          );
        })}
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
        className="w-full bg-slate-900 border-slate-800 focus:border-emerald-500 text-slate-100 text-sm p-4 rounded-xl"
      />
    );
  }
  if (exercise.type === "reorder") {
    const words = exercise.question.split(" ");
    return (
      <div className="reorder-box p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <GripVertical size={16} />
          <p>{words.join(" · ")}</p>
        </div>
        <Input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={disabled}
          placeholder="Riscrivi la frase nell’ordine corretto"
          aria-label="Risposta per riordinare"
          className="bg-slate-950 border-slate-800 text-slate-100 h-11 rounded-lg"
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
          <div className="transformation-box p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <p className="text-sm font-medium text-slate-200">{firstSentence}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">KEY WORD:</span>
              <Badge variant="neutral" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 font-bold px-2.5 py-0.5">
                {keyword}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              {prefix.trim() && <span>{prefix.trim()}</span>}
              <Input
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={disabled}
                placeholder="2-5 parole..."
                aria-label="Risposta per transformation"
                className="w-full sm:w-56 text-center bg-slate-950 border-slate-800 focus:border-emerald-500 font-semibold text-emerald-400 placeholder:text-slate-600 placeholder:font-normal h-11 rounded-lg"
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
      className="h-11 bg-slate-900 border-slate-800 focus:border-emerald-500 text-slate-100 text-sm rounded-xl px-4"
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

export function BatchExerciseRenderer({
  exercises,
  onComplete,
}: {
  exercises: Exercise[];
  onComplete?: (score: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "errors">("all");
  const [hydrated, setHydrated] = useState(false);
  const { recordAnswer } = useProgress();

  useEffect(() => {
    queueMicrotask(() => setHydrated(true));
  }, []);

  const corrections = useMemo(() => {
    if (!checked) return [];
    return exercises.map((ex) => {
      const response = answers[ex.id] ?? "";
      return {
        exercise: ex,
        answer: response,
        correct: response.trim() ? evaluateAnswer(ex, response) : false,
      };
    });
  }, [checked, answers, exercises]);

  const score = useMemo(() => {
    if (!checked) return null;
    const correctCount = corrections.filter((c) => c.correct).length;
    return Math.round((correctCount / exercises.length) * 100);
  }, [checked, corrections, exercises]);

  function submit() {
    setChecked(true);
    let correctCount = 0;
    exercises.forEach((ex) => {
      const response = answers[ex.id] ?? "";
      const isCorrect = response.trim() ? evaluateAnswer(ex, response) : false;
      if (isCorrect) correctCount++;
      recordAnswer(ex, response, isCorrect, 30);
    });
    const finalScore = Math.round((correctCount / exercises.length) * 100);
    onComplete?.(finalScore);
  }

  function restartBatch() {
    setAnswers({});
    setChecked(false);
    setReviewFilter("all");
  }

  if (checked) {
    const correctCount = corrections.filter((c) => c.correct).length;
    const errors = corrections.filter((item) => !item.correct);

    return (
      <div className="flex flex-col gap-6">
        <section className="exercise-complete bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl text-center space-y-4" aria-live="polite">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/15 text-emerald-400 mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">COMPRENSIONE COMPLETATA</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 mt-1">{score}% di accuratezza</h2>
          </div>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Hai risposto correttamente a <b className="text-emerald-400">{correctCount}</b> domande su <b>{exercises.length}</b>.
          </p>
          <div className="flex justify-center pt-2">
            <Button variant="outline" onClick={restartBatch} className="font-semibold">
              <RotateCcw size={16} className="mr-2" /> Riprova questo esercizio
            </Button>
          </div>
        </section>

        {/* Inline Feedback for all items */}
        <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">REVISIONE RISPOSTE</span>
              <h3 className="text-lg font-bold text-slate-100">Soluzioni e spiegazioni dettagliate</h3>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs font-semibold">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg transition-all ${reviewFilter === "all" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setReviewFilter("all")}
              >
                Tutti ({exercises.length})
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg transition-all ${reviewFilter === "errors" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setReviewFilter("errors")}
              >
                Solo errori ({errors.length})
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {corrections
              .filter((c) => reviewFilter === "all" || !c.correct)
              .map(({ exercise: item, answer: response, correct: isRight }, idx) => (
                <div key={item.id} className="exercise-shell compact relative border-l-4 border-l-slate-700 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-400">Domanda {idx + 1}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isRight ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"}`}>
                      {isRight ? "Corretta" : "Errata"}
                    </span>
                  </div>
                  <h4 className="text-base font-serif font-medium text-slate-100 mb-3">{item.question}</h4>
                  <AnswerFeedback
                    exercise={item}
                    answer={response}
                    correct={isRight}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {exercises.map((exercise, idx) => (
        <div key={exercise.id} className="exercise-shell compact relative">
          <div className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
            {idx + 1}
          </div>
          <div className="exercise-question pr-10">
            <p className="text-xs text-slate-400 mb-1">{examInstruction(exercise)}</p>
            <h2 className="text-lg font-serif font-medium text-slate-100">{exercise.question}</h2>
          </div>
          <ExerciseInput
            exercise={exercise}
            answer={answers[exercise.id] ?? ""}
            setAnswer={(val) => setAnswers({ ...answers, [exercise.id]: val })}
            disabled={!hydrated}
          />
        </div>
      ))}
      <div className="flex justify-end mt-4">
        <Button onClick={submit} disabled={!hydrated} size="lg" className="font-bold">
          Controlla tutte le risposte <ArrowRight size={17} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

