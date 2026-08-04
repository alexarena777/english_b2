"use client";

import { useState } from "react";
import {
  CheckCircle2,
  RotateCcw,
  Volume2,
  X,
  XCircle,
} from "lucide-react";
import { useProgress } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { VocabularyItem, VocabularyWordProgress } from "@/lib/types";

import { getEnglishVoices } from "@/lib/speech";

export function VocabularyTrainer({
  items,
  onClose,
}: {
  items: VocabularyItem[];
  onClose: () => void;
}) {
  const { state, recordVocabularyRecall } = useProgress();
  const [queue] = useState(() =>
    buildQueue(items, state.vocabularyProgress, new Date()).slice(0, 10),
  );
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [complete, setComplete] = useState(false);
  const item = queue[index];

  function rate(correct: boolean) {
    if (!item || !revealed) return;
    recordVocabularyRecall(item.id, correct);
    const nextResults = [...results, correct];
    setResults(nextResults);
    if (index >= queue.length - 1) {
      setComplete(true);
      return;
    }
    setIndex((value) => value + 1);
    setRevealed(false);
  }

  function restart() {
    setIndex(0);
    setResults([]);
    setRevealed(false);
    setComplete(false);
  }

  function pronounce() {
    if (!("speechSynthesis" in window) || !item) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.term);
    utterance.lang = "en-GB";
    const available = getEnglishVoices();
    if (available.length) utterance.voice = available[0];
    window.speechSynthesis.speak(utterance);
  }

  if (!item) {
    return (
      <Card className="vocab-trainer vocab-trainer-empty">
        <CheckCircle2 />
        <h2>Nessuna parola da ripassare</h2>
        <p>Hai già classificato tutta la raccolta disponibile.</p>
        <Button onClick={onClose}>Torna alla raccolta</Button>
      </Card>
    );
  }

  if (complete) {
    const correct = results.filter(Boolean).length;
    return (
      <Card className="vocab-trainer vocab-trainer-complete">
        <CheckCircle2 />
        <span>SESSIONE COMPLETATA</span>
        <h2>{correct} / {results.length}</h2>
        <p>
          Le parole meno sicure torneranno prima; quelle ricordate bene avranno
          un intervallo più lungo.
        </p>
        <div>
          <Button variant="outline" onClick={restart}>
            <RotateCcw size={16} /> Ripeti sessione
          </Button>
          <Button onClick={onClose}>Torna alla raccolta</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="vocab-trainer">
      <header>
        <div>
          <Badge variant="neutral">Richiamo attivo</Badge>
          <span>{index + 1} / {queue.length}</span>
        </div>
        <button onClick={onClose} aria-label="Chiudi allenamento"><X /></button>
      </header>
      <Progress value={((index + Number(revealed)) / queue.length) * 100} />
      <div className="vocab-trainer-card">
        <small>{item.category} · {item.difficulty}</small>
        <div className="vocab-trainer-term">
          <h2>{item.term}</h2>
          <button onClick={pronounce} aria-label={`Ascolta ${item.term}`}>
            <Volume2 />
          </button>
        </div>
        {!revealed ? (
          <>
            <p>Pronuncia la traduzione e una frase d’esempio, poi controlla.</p>
            <Button size="lg" onClick={() => setRevealed(true)}>
              Mostra risposta
            </Button>
          </>
        ) : (
          <div className="vocab-reveal">
            <strong>{item.translation}</strong>
            <p>{item.definition}</p>
            <blockquote>{item.example}</blockquote>
            <small>Sinonimo: {item.synonym}</small>
            <div>
              <Button variant="outline" onClick={() => rate(false)}>
                <XCircle size={17} /> Da ripassare
              </Button>
              <Button onClick={() => rate(true)}>
                <CheckCircle2 size={17} /> La sapevo
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function buildQueue(
  items: VocabularyItem[],
  progress: VocabularyWordProgress[],
  now: Date,
) {
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const progressMap = new Map(progress.map((item) => [item.wordId, item]));
  const due = [...progress]
    .filter(
      (item) =>
        item.nextReviewAt && new Date(item.nextReviewAt).getTime() <= now.getTime(),
    )
    .sort((left, right) => left.mastery - right.mastery)
    .map((item) => itemMap.get(item.wordId))
    .filter((item): item is VocabularyItem => Boolean(item));
  const learning = [...progress]
    .filter(
      (item) =>
        item.status === "learning" &&
        !due.some((word) => word.id === item.wordId),
    )
    .sort((left, right) => left.mastery - right.mastery)
    .map((item) => itemMap.get(item.wordId))
    .filter((item): item is VocabularyItem => Boolean(item));
  const unseen = items.filter((item) => !progressMap.has(item.id));
  return [...due, ...learning, ...unseen];
}
