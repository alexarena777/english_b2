import { CheckCircle2, ArrowRight, Lightbulb, XCircle, Tag } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function AnswerFeedback({
  exercise,
  answer,
  correct,
  onContinue,
  continueLabel = "Continua",
}: {
  exercise: Exercise;
  answer: string;
  correct: boolean;
  onContinue?: () => void;
  continueLabel?: string;
}) {
  const expected = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer.join(" / ")
    : exercise.correctAnswer;

  return (
    <section
      className={`feedback ${correct ? "correct" : "incorrect"} rounded-b-2xl border-t transition-all`}
      aria-live="polite"
    >
      <div className="feedback-title flex items-start gap-3">
        {correct ? (
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500 flex-shrink-0">
            <CheckCircle2 size={24} />
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-500 flex-shrink-0">
            <XCircle size={24} />
          </div>
        )}
        <div className="space-y-0.5">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${correct ? "text-emerald-500" : "text-rose-400"}`}>
            {correct ? "Risposta corretta" : "Risposta da migliorare"}
          </span>
          <h3 className="text-base font-bold text-slate-100">
            {correct ? "Ottimo ragionamento!" : "Vediamo la spiegazione:"}
          </h3>
        </div>
      </div>

      <div className="answer-compare grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        <div className={`p-3 rounded-xl border ${correct ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
          <small className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            La tua risposta
          </small>
          <p className={`text-sm font-semibold ${correct ? "text-emerald-400" : "text-rose-400"}`}>
            {answer || "Nessuna risposta inserita"}
          </p>
        </div>
        {!correct && (
          <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/30">
            <small className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Risposta corretta
            </small>
            <p className="text-sm font-bold text-emerald-300">
              {expected}
            </p>
          </div>
        )}
      </div>

      {exercise.explanation && (
        <p className="feedback-explanation text-xs leading-relaxed text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 my-2">
          {exercise.explanation}
        </p>
      )}

      {exercise.grammarRule && (
        <div className="rule-box flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 my-2">
          <Lightbulb size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <b className="text-xs font-bold text-amber-300 block">Regola da ricordare</b>
            <p className="text-xs text-slate-300 leading-relaxed">{exercise.grammarRule}</p>
          </div>
        </div>
      )}

      {!!exercise.examples?.length && (
        <div className="example-box p-3 rounded-xl bg-slate-800/30 border-l-4 border-emerald-500 my-2">
          <small className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Esempio d&apos;uso
          </small>
          {exercise.examples.map((example, i) => (
            <p key={i} className="text-xs text-slate-200">
              <b className="text-emerald-300 font-semibold">{example.english}</b>
              {example.italian && <span className="block text-slate-400 text-[11px] font-normal">{example.italian}</span>}
            </p>
          ))}
        </div>
      )}

      <div className="feedback-meta flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-700/40 mt-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Tag size={13} className="opacity-70" />
          <span>Tema: <b className="text-slate-200 font-medium">{exercise.topic}</b></span>
        </div>
        {onContinue && (
          <Button onClick={onContinue} size="sm" className="ml-auto font-bold">
            {continueLabel} <ArrowRight size={16} className="ml-1" />
          </Button>
        )}
      </div>
    </section>
  );
}
