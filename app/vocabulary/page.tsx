"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookCheck,
  BookOpen,
  BrainCircuit,
  Check,
  FileCheck2,
  Search,
  Sparkles,
} from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { VocabularyTrainer } from "@/components/vocabulary/vocabulary-trainer";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProgress } from "@/components/providers";
import { useOfEnglishExercises, vocabularyExercises, vocabularyItems } from "@/lib/data";

type StatusFilter = "all" | "new" | "learning" | "mastered";

export default function VocabularyPage() {
  const { state, setVocabularyStatus, hydrated } = useProgress();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [training, setTraining] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [practiceSession, setPracticeSession] = useState(0);
  const [visibleCount, setVisibleCount] = useState(48);
  const [now, setNow] = useState(0);
  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
  }, []);
  const categories = ["all", ...new Set(vocabularyItems.map((item) => item.category))];
  const progressMap = useMemo(
    () => new Map(state.vocabularyProgress.map((item) => [item.wordId, item])),
    [state.vocabularyProgress],
  );
  const learning = state.vocabularyProgress.filter((item) => item.status === "learning").length;
  const mastered = state.vocabularyProgress.filter((item) => item.status === "mastered").length;
  const due = state.vocabularyProgress.filter(
    (item) => item.nextReviewAt && new Date(item.nextReviewAt).getTime() <= now,
  ).length;
  const filtered = useMemo(
    () =>
      vocabularyItems.filter((item) => {
        const wordStatus = progressMap.get(item.id)?.status ?? "new";
        return (
          (category === "all" || item.category === category) &&
          (status === "all" || wordStatus === status) &&
          [item.term, item.translation, item.definition].some((value) =>
            value.toLowerCase().includes(query.toLowerCase()),
          )
        );
      }),
    [category, progressMap, query, status],
  );
  const availablePractice = vocabularyExercises.filter(
    (exercise) => category === "all" || exercise.topic === category,
  );
  const practiceStart =
    (practiceSession * 12) % Math.max(1, availablePractice.length);
  const practiceExercises = [
    ...availablePractice.slice(practiceStart, practiceStart + 12),
    ...availablePractice.slice(
      0,
      Math.max(0, practiceStart + 12 - availablePractice.length),
    ),
  ].slice(0, 12);

  function openTrainer() {
    setSessionKey((value) => value + 1);
    setTraining(true);
  }

  return (
    <AppPage>
      <PageHeader
        eyebrow="VOCABOLARIO B2"
        title="Il lessico che ti serve davvero al B2."
        description={`${vocabularyItems.length} parole ed espressioni ad alta utilità, organizzate per tema, con richiamo attivo, pronuncia, definizioni e sinonimi.`}
        action={
          <Button onClick={openTrainer} disabled={!hydrated}>
            <BrainCircuit size={17} /> {due ? `Ripassa ${due} parole` : "Allenati ora"}
          </Button>
        }
      />

      {training && (
        <VocabularyTrainer
          key={sessionKey}
          items={vocabularyItems}
          onClose={() => setTraining(false)}
        />
      )}

      <div className="vocab-tools">
        <label>
          <Search size={18} />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(48);
            }}
            placeholder="Cerca una parola o una traduzione…"
          />
        </label>
        <select value={category} onChange={(event) => { setCategory(event.target.value); setVisibleCount(48); }} aria-label="Filtra per tema">
          {categories.map((item) => <option key={item} value={item}>{item === "all" ? "Tutti i temi" : item}</option>)}
        </select>
        <select value={status} onChange={(event) => { setStatus(event.target.value as StatusFilter); setVisibleCount(48); }} aria-label="Filtra per stato">
          <option value="all">Tutti gli stati</option>
          <option value="new">Nuove</option>
          <option value="learning">In apprendimento</option>
          <option value="mastered">Consolidate</option>
        </select>
      </div>

      <div className="vocab-summary">
        <span><BookOpen /> {vocabularyItems.length} parole</span>
        <span><BrainCircuit /> {vocabularyExercises.length} esercizi</span>
        <span><Sparkles /> {learning} in apprendimento</span>
        <span><BookCheck /> {mastered} consolidate</span>
      </div>

      <Card className="cambridge-lab-card">
        <span className="cambridge-lab-icon"><FileCheck2 /></span>
        <div>
          <Badge>CAMBRIDGE PRACTICE</Badge>
          <h2>Lessico dentro il vero Use of English</h2>
          <p>
            Allenati con multiple-choice cloze e word formation: collocazioni,
            phrasal verbs, prefissi, suffissi e famiglie di parole.
          </p>
          <small>
            {useOfEnglishExercises.filter((item) => item.section === "vocabulary").length} esercizi mirati
          </small>
        </div>
        <Button asChild variant="outline">
          <Link href="/use-of-english">Apri il laboratorio</Link>
        </Button>
      </Card>

      <section className="vocabulary-practice-section">
        <div className="section-heading">
          <div>
            <h2>Allenamento B2 sul lessico</h2>
            <p>Traduzioni precise, definizioni, collocazioni e significato nel contesto.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setPracticeSession((value) => value + 1)}
          >
            Nuova sessione da 12
          </Button>
        </div>
        <ExerciseRenderer
          key={`${category}-${practiceSession}`}
          exercises={practiceExercises}
          compact
          enableModeSwitch
        />
      </section>

      <div className="vocab-grid">
        {filtered.slice(0, visibleCount).map((item) => {
          const progress = progressMap.get(item.id);
          const itemStatus = progress?.status ?? "new";
          return (
            <Card className="vocab-card" key={item.id}>
              <div><Badge variant="neutral">{item.category}</Badge><Badge>{item.difficulty}</Badge></div>
              <h2>{item.term}</h2>
              <strong>{item.translation}</strong>
              <p>{item.definition}</p>
              <blockquote>{item.example}</blockquote>
              <footer>
                <span>Sinonimo: <b>{item.synonym}</b></span>
                <span className={itemStatus}>{itemStatus === "mastered" ? "Consolidata" : itemStatus === "learning" ? `${progress?.mastery ?? 0}% padronanza` : "Nuova"}</span>
              </footer>
              <div className="vocab-card-actions">
                <Button
                  size="sm"
                  variant={itemStatus === "learning" ? "secondary" : "ghost"}
                  disabled={!hydrated}
                  onClick={() => setVocabularyStatus(item.id, itemStatus === "learning" ? "new" : "learning")}
                >
                  <Sparkles size={14} /> {itemStatus === "learning" ? "In studio" : "Da studiare"}
                </Button>
                <Button
                  size="sm"
                  variant={itemStatus === "mastered" ? "secondary" : "ghost"}
                  disabled={!hydrated}
                  onClick={() => setVocabularyStatus(item.id, itemStatus === "mastered" ? "new" : "mastered")}
                >
                  <Check size={14} /> {itemStatus === "mastered" ? "Consolidata" : "La conosco"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      {filtered.length > visibleCount && (
        <div className="vocab-load-more">
          <Button variant="outline" onClick={() => setVisibleCount((value) => value + 48)}>
            Mostra altre parole
          </Button>
          <span>{visibleCount} di {filtered.length} visualizzate</span>
        </div>
      )}
      {!filtered.length && <div className="state-box"><h3>Nessuna parola trovata</h3><p>Prova un termine, un tema o uno stato diverso.</p></div>}
    </AppPage>
  );
}
