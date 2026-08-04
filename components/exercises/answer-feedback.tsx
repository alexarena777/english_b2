import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function AnswerFeedback({ exercise, answer, correct, onContinue }: { exercise: Exercise; answer: string; correct: boolean; onContinue?: () => void }) {
  const expected = Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer.join(" / ") : exercise.correctAnswer;
  return <section className={`feedback ${correct ? "correct" : "incorrect"}`} aria-live="polite">
    <div className="feedback-title">{correct ? <CheckCircle2 /> : <XCircle />}<div><span>{correct ? "Risposta corretta" : "Non ancora"}</span><h3>{correct ? "Ottimo ragionamento." : "Vediamo perché."}</h3></div></div>
    <div className="answer-compare"><div><small>LA TUA RISPOSTA</small><p>{answer || "Nessuna risposta"}</p></div>{!correct && <div><small>RISPOSTA CORRETTA</small><p>{expected}</p></div>}</div>
    <p className="feedback-explanation">{exercise.explanation}</p>
    {exercise.grammarRule && <div className="rule-box"><Lightbulb size={18} /><div><b>Regola da ricordare</b><p>{exercise.grammarRule}</p></div></div>}
    {!!exercise.examples.length && <div className="example-box"><small>ESEMPIO</small>{exercise.examples.map((example) => <p key={example.english}><b>{example.english}</b>{example.italian && <span>{example.italian}</span>}</p>)}</div>}
    <div className="feedback-meta"><span>Categoria: {exercise.topic}</span><span>Difficoltà: {exercise.difficulty}</span>{onContinue && <Button onClick={onContinue}>Continua</Button>}</div>
  </section>;
}
