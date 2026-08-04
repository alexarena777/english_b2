"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";
import type {
  WritingEvaluation,
  WritingPrompt,
  WritingSubmission,
} from "@/lib/types";
import { writingEvaluationSchema } from "@/lib/schemas";
import { useProgress } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

const DRAFT_PREFIX = "b2-writing-draft-v1:";

export function WritingEditor({ prompt }: { prompt: WritingPrompt }) {
  const [text, setText] = useState("");
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [mode, setMode] = useState<"ai" | "local" | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const { saveWritingSubmission } = useProgress();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const draftKey = `${DRAFT_PREFIX}${prompt.id}`;

  useEffect(() => {
    queueMicrotask(() => {
      setText(localStorage.getItem(draftKey) ?? "");
      setDraftLoaded(true);
    });
  }, [draftKey]);

  useEffect(() => {
    if (!draftLoaded) return;
    const timer = window.setTimeout(() => {
      if (text.trim()) localStorage.setItem(draftKey, text);
      else localStorage.removeItem(draftKey);
    }, 400);
    return () => clearTimeout(timer);
  }, [draftKey, draftLoaded, text]);

  async function evaluate() {
    if (words < 20 || loading) return;
    setLoading(true);
    setWarning(null);
    try {
      const response = await fetch("/api/writing/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: prompt.id, text }),
      });
      if (!response.ok) throw new Error("evaluation-failed");
      const payload = (await response.json()) as {
        evaluation?: unknown;
        mode?: "ai" | "local";
        warning?: string;
      };
      const parsed = writingEvaluationSchema.safeParse(payload.evaluation);
      if (!parsed.success || !payload.mode) throw new Error("invalid-evaluation");

      setEvaluation(parsed.data);
      setMode(payload.mode);
      setWarning(payload.warning ?? null);
      const submission: WritingSubmission = {
        id: crypto.randomUUID(),
        promptId: prompt.id,
        promptTitle: prompt.title,
        text,
        wordCount: words,
        evaluation: parsed.data,
        evaluationMode: payload.mode,
        submittedAt: new Date().toISOString(),
      };
      saveWritingSubmission(submission);
      localStorage.removeItem(draftKey);
    } catch {
      setWarning("Non è stato possibile valutare il testo. La bozza è al sicuro.");
    } finally {
      setLoading(false);
    }
  }

  if (evaluation && mode) {
    return (
      <div className="writing-result">
        <div className="writing-score">
          <strong>{evaluation.overall}</strong>
          <div>
            <span>
              {mode === "ai" ? "VALUTAZIONE AI" : "ANALISI LOCALE"}
            </span>
            <h2>{evaluation.overall >= 75 ? "Testo solido per il B2" : "Buona base da sviluppare"}</h2>
            <p>
              {mode === "ai"
                ? "Feedback contestuale generato dal valutatore configurato."
                : "Stima automatica basata su struttura, lunghezza e coesione; non sostituisce un docente."}
            </p>
          </div>
        </div>
        {warning && <p className="writing-warning">{warning}</p>}
        <div className="criteria-grid">
          {Object.entries(evaluation.scores).map(([name, score]) => (
            <div key={name}>
              <span>{name}</span>
              <b>{score}/100</b>
              <i>
                <em style={{ width: `${score}%` }} />
              </i>
            </div>
          ))}
        </div>
        <div className="writing-strengths">
          <h3>Punti di forza</h3>
          {evaluation.strengths.map((strength) => (
            <p key={strength}>
              <CheckCircle2 size={17} /> {strength}
            </p>
          ))}
        </div>
        {evaluation.issues.map((issue) => (
          <div className="writing-issue" key={`${issue.excerpt}-${issue.explanation}`}>
            <b>{issue.excerpt}</b>
            <p>{issue.explanation}</p>
            <span>Prova così: {issue.suggestion}</span>
          </div>
        ))}
        {evaluation.improvedVersion && evaluation.improvedVersion !== text.trim() && (
          <div className="writing-improved">
            <h3>Versione migliorata</h3>
            <p>{evaluation.improvedVersion}</p>
          </div>
        )}
        <div className="writing-advice">
          <h3>Prossimi passi</h3>
          {evaluation.advice.map((advice) => (
            <p key={advice}>
              <CheckCircle2 size={17} /> {advice}
            </p>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setEvaluation(null);
            setMode(null);
          }}
        >
          Torna al testo
        </Button>
      </div>
    );
  }

  return (
    <div className="writing-editor">
      <div className="writing-brief">
        <span>{prompt.type}</span>
        <h2>{prompt.title}</h2>
        <p>{prompt.prompt}</p>
        <div>
          <b>Struttura consigliata</b>
          <ol>
            {prompt.structure.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
      <div className="writing-workspace">
        <div className="editor-toolbar">
          <span>{words} parole</span>
          <span
            className={
              words >= prompt.minWords && words <= prompt.maxWords ? "word-ok" : ""
            }
          >
            {prompt.minWords}–{prompt.maxWords} richieste
          </span>
        </div>
        <Textarea
          rows={16}
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={!draftLoaded}
          placeholder="Inizia a scrivere in inglese…"
          aria-label="Testo dell’esercizio"
        />
        {warning && <p className="writing-warning">{warning}</p>}
        <div className="writing-submit-row">
          <small>La bozza viene salvata automaticamente sul dispositivo.</small>
          <Button onClick={evaluate} disabled={!draftLoaded || words < 20 || loading}>
            {loading ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <Sparkles size={17} />
            )}
            {loading ? "Valutazione…" : "Valuta il testo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
