"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookCheck,
  BookOpen,
  BrainCircuit,
  Check,
  FileCheck2,
  Layers,
  ListFilter,
  Search,
  Sparkles,
} from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { VocabularyTrainer } from "@/components/vocabulary/vocabulary-trainer";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { FlashcardDeck, type CardItem } from "@/components/vocabulary/flashcard-deck";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProgress } from "@/components/providers";
import { useOfEnglishExercises, vocabularyExercises, vocabularyItems } from "@/lib/data";
import { b2Collocations } from "@/lib/curriculum/b2-collocations";

type StatusFilter = "all" | "new" | "learning" | "mastered";
type VocabViewMode = "flashcards" | "practice" | "grid";

export default function VocabularyPage() {
  const { state, setVocabularyStatus, hydrated } = useProgress();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<VocabViewMode>("flashcards");
  const [deckSource, setDeckSource] = useState<"all" | "collocations">("all");
  const [training, setTraining] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [practiceSession, setPracticeSession] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;
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

  // Map vocabulary items into Flashcard CardItems
  const flashcardsData: CardItem[] = useMemo(() => {
    if (deckSource === "collocations") {
      return b2Collocations.map((col) => ({
        id: col.id,
        front: col.phrase,
        frontSub: `Categoria: ${col.category}`,
        backTitle: col.translation,
        definition: col.definition,
        example: col.example,
        tip: col.examTip,
        category: col.category,
      }));
    }

    return filtered.map((item) => ({
      id: item.id,
      front: item.term,
      frontSub: `Tema: ${item.category}`,
      backTitle: item.translation,
      definition: item.definition,
      example: item.example,
      tip: item.synonym ? `Sinonimo chiave: ${item.synonym}` : undefined,
      category: item.category,
    }));
  }, [deckSource, filtered]);

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
        description={`${vocabularyItems.length} vocaboli ed espressioni ad alta utilità, arricchiti con Flashcard 3D, sintesi vocale e collocazioni d'esame.`}
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

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode("flashcards")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              viewMode === "flashcards"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers size={16} /> Flashcards 3D & Audio 🔊
          </button>
          <button
            onClick={() => setViewMode("practice")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              viewMode === "practice"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <BrainCircuit size={16} /> Quiz Rapido da 12
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              viewMode === "grid"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <ListFilter size={16} /> Elenco & Ricerca
          </button>
        </div>

        {viewMode === "flashcards" && (
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs text-slate-400 font-mono">Mazzo:</span>
            <select
              value={deckSource}
              onChange={(e) => setDeckSource(e.target.value as "all" | "collocations")}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-medium cursor-pointer"
            >
              <option value="all">Vocabolario Completo ({filtered.length})</option>
              <option value="collocations">Cambridge Collocations B2 ({b2Collocations.length})</option>
            </select>
          </div>
        )}
      </div>

      {/* FLASHCARD 3D VIEW */}
      {viewMode === "flashcards" && (
        <section className="py-4">
          <FlashcardDeck
            cards={flashcardsData}
            title={deckSource === "collocations" ? "Cambridge B2 Collocations & Phrasal Verbs" : `Vocaboli B2: ${category === "all" ? "Tutti i temi" : category}`}
            subtitle="Premi Spazio per girare la carta, Frecce per scorrere o 🔊 (tasto P) per ascoltare la pronuncia nativa britannica."
          />
        </section>
      )}

      {/* PRACTICE QUIZ VIEW */}
      {viewMode === "practice" && (
        <section className="vocabulary-practice-section py-4">
          <div className="section-heading mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Allenamento Quiz B2 sul lessico</h2>
              <p className="text-sm text-slate-400">Traduzioni precise, definizioni, collocazioni e significato nel contesto.</p>
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
      )}

      {/* FULL GRID & SEARCH VIEW */}
      {viewMode === "grid" && (
        <>
          <div className="vocab-tools">
            <label>
              <Search size={18} />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cerca una parola o una traduzione…"
              />
            </label>
            <select value={category} onChange={(event) => { setCategory(event.target.value); setCurrentPage(1); }} aria-label="Filtra per tema">
              {categories.map((item) => <option key={item} value={item}>{item === "all" ? "Tutti i temi" : item}</option>)}
            </select>
            <select value={status} onChange={(event) => { setStatus(event.target.value as StatusFilter); setCurrentPage(1); }} aria-label="Filtra per stato">
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

          <div className="vocab-grid">
            {filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((item) => {
              const progress = progressMap.get(item.id);
              const itemStatus = progress?.status ?? "new";
              return (
                <div 
                  key={item.id}
                  className={`group relative flex flex-col p-6 rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl bg-gradient-to-br from-[var(--card)] to-[var(--card-2)] border ${itemStatus === 'mastered' ? 'border-[var(--green)] shadow-[var(--green)]/10' : itemStatus === 'learning' ? 'border-[var(--amber)] shadow-[var(--amber)]/10' : 'border-[var(--line)] shadow-black/5'}`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <Badge variant="neutral" className="bg-black/5 dark:bg-white/5 border-0 backdrop-blur-sm font-semibold">{item.category}</Badge>
                      <Badge className="bg-black/5 dark:bg-white/5 border-0 text-[var(--muted)] font-medium">{item.difficulty}</Badge>
                    </div>
                    {itemStatus === 'mastered' && <div className="bg-[var(--green)] text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg shadow-[var(--green)]/30"><Check size={14} strokeWidth={3} /></div>}
                    {itemStatus === 'learning' && <div className="bg-[var(--amber)] text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg shadow-[var(--amber)]/30"><Sparkles size={14} strokeWidth={2} /></div>}
                  </div>
                  
                  <h2 className="text-3xl font-serif font-medium text-[var(--ink)] mb-1 group-hover:text-[var(--green)] transition-colors">{item.term}</h2>
                  <strong className="text-[var(--green)] text-sm font-bold uppercase tracking-wider mb-3">{item.translation}</strong>
                  
                  <p className="text-[var(--muted)] text-[13px] leading-relaxed mb-4">{item.definition}</p>
                  
                  <blockquote className="relative p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border-l-4 border-[var(--green)] text-[13px] italic text-[var(--muted)] mb-5">
                    &quot;{item.example}&quot;
                  </blockquote>
                  
                  <div className="mt-auto pt-4 border-t border-[var(--line)] flex items-center justify-between">
                    <span className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 font-medium">
                      <Layers size={14} className="opacity-50" /> Sinonimo: <b className="text-[var(--ink)] font-bold">{item.synonym}</b>
                    </span>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={itemStatus === "learning" ? "secondary" : "ghost"}
                        className={`h-8 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider ${itemStatus === "learning" ? "bg-[var(--amber)]/15 text-[var(--amber)] hover:bg-[var(--amber)]/25 border border-[var(--amber)]/20" : "hover:bg-[var(--amber)]/10 hover:text-[var(--amber)]"}`}
                        disabled={!hydrated}
                        onClick={() => setVocabularyStatus(item.id, itemStatus === "learning" ? "new" : "learning")}
                      >
                        <Sparkles size={13} className="mr-1.5" /> Studio
                      </Button>
                      <Button
                        size="sm"
                        variant={itemStatus === "mastered" ? "secondary" : "ghost"}
                        className={`h-8 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider ${itemStatus === "mastered" ? "bg-[var(--green)]/15 text-[var(--green)] hover:bg-[var(--green)]/25 border border-[var(--green)]/20" : "hover:bg-[var(--green)]/10 hover:text-[var(--green)]"}`}
                        disabled={!hydrated}
                        onClick={() => setVocabularyStatus(item.id, itemStatus === "mastered" ? "new" : "mastered")}
                      >
                        <Check size={13} className="mr-1.5" /> Fatto
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {Math.ceil(filtered.length / ITEMS_PER_PAGE) > 1 && (
            <div className="flex items-center justify-center gap-6 my-10">
              <Button 
                variant="outline" 
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(p => p - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Precedente
              </Button>
              <span className="text-sm font-medium text-slate-400">
                Pagina {currentPage} di {Math.ceil(filtered.length / ITEMS_PER_PAGE)}
              </span>
              <Button 
                variant="outline" 
                disabled={currentPage === Math.ceil(filtered.length / ITEMS_PER_PAGE)}
                onClick={() => {
                  setCurrentPage(p => p + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Successiva
              </Button>
            </div>
          )}
          {!filtered.length && <div className="state-box"><h3>Nessuna parola trovata</h3><p>Prova un termine, un tema o uno stato diverso.</p></div>}
        </>
      )}
    </AppPage>
  );
}
