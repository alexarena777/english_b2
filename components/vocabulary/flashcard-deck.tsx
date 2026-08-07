"use client";

import { useCallback, useEffect, useState } from "react";
import { useSpeechSynthesis } from "@/lib/hooks/use-speech";

export type CardItem = {
  id: string;
  front: string;
  frontSub?: string;
  backTitle: string;
  definition: string;
  example: string;
  tip?: string;
  category?: string;
};

interface FlashcardDeckProps {
  cards: CardItem[];
  title?: string;
  subtitle?: string;
}

export function FlashcardDeck({
  cards,
  title = "Flashcards B2 Interattive",
  subtitle = "Usa Spazio per girare la carta, le Frecce per scorrere o premi 🔊 per ascoltare la pronuncia nativa.",
}: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [shuffledCards, setShuffledCards] = useState<CardItem[]>(cards);
  const { speak, isPlaying } = useSpeechSynthesis();

  useEffect(() => {
    setShuffledCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  const currentCard = shuffledCards[currentIndex];

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % shuffledCards.length);
  }, [shuffledCards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + shuffledCards.length) % shuffledCards.length);
  }, [shuffledCards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleToggleMastered = useCallback(() => {
    if (!currentCard) return;
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
      }
      return next;
    });
  }, [currentCard]);

  const handleShuffle = useCallback(() => {
    setIsFlipped(false);
    setShuffledCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  }, []);

  const handleSpeakCurrent = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!currentCard) return;
      if (isFlipped) {
        speak(currentCard.example);
      } else {
        speak(currentCard.front);
      }
    },
    [currentCard, isFlipped, speak],
  );

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when focused inside text inputs
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.code === "KeyP" || e.code === "KeyS") {
        e.preventDefault();
        handleSpeakCurrent();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        handleToggleMastered();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, handleSpeakCurrent, handleToggleMastered]);

  if (!currentCard) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
        Nessuna carta disponibile per questa categoria.
      </div>
    );
  }

  const isMastered = masteredIds.has(currentCard.id);
  const progressPercent = Math.round(((currentIndex + 1) / shuffledCards.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>📇</span> {title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
            title="Mescola le carte"
          >
            <span>🔀</span> Mescola
          </button>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            {masteredIds.size} / {shuffledCards.length} Memorizzate
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>
            Carta {currentIndex + 1} di {shuffledCards.length}
          </span>
          <span>{progressPercent}% completato</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="relative w-full h-[340px] cursor-pointer select-none [perspective:1000px]"
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full relative duration-500 [transform-style:preserve-3d] transition-transform ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950 p-7 flex flex-col justify-between border border-slate-800 shadow-2xl hover:border-emerald-500/40 transition-colors">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              {currentCard.category && (
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                  {currentCard.category}
                </span>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakCurrent}
                  className={`p-2 rounded-lg transition-all border ${
                    isPlaying
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 scale-105"
                      : "bg-slate-800/80 text-emerald-400 hover:bg-slate-700 border-slate-700"
                  }`}
                  title="Ascolta pronuncia (P)"
                >
                  <span className="text-sm">🔊</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMastered();
                  }}
                  className={`p-2 rounded-lg transition-all border ${
                    isMastered
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700"
                  }`}
                  title="Segna come memorizzata (M)"
                >
                  <span className="text-sm">{isMastered ? "★" : "☆"}</span>
                </button>
              </div>
            </div>

            {/* Center: Phrase/Word */}
            <div className="text-center py-4 space-y-2">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400/80">
                Termine / Espressione B2
              </span>
              <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                {currentCard.front}
              </h3>
              {currentCard.frontSub && (
                <p className="text-sm text-slate-400 italic">{currentCard.frontSub}</p>
              )}
            </div>

            {/* Bottom Hint */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                SPAZIO
              </span>
              <span>Clicca o premi Spazio per svelare significato ed esempi</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900 p-7 flex flex-col justify-between border border-emerald-500/40 shadow-2xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span>🇮🇹</span> {currentCard.backTitle}
              </span>
              <button
                onClick={handleSpeakCurrent}
                className={`p-2 rounded-lg transition-all border ${
                  isPlaying
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 scale-105"
                    : "bg-slate-800/80 text-emerald-400 hover:bg-slate-700 border-slate-700"
                }`}
                title="Ascolta la frase d'esempio (P)"
              >
                <span className="text-sm">🔊</span>
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-3 my-auto">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 text-left space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                  Definizione in inglese
                </span>
                <p className="text-sm text-slate-200">{currentCard.definition}</p>
              </div>

              <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20 text-left space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                  Esempio d&apos;uso (B2 Exam Context)
                </span>
                <p className="text-sm text-slate-100 font-medium italic">
                  &ldquo;{currentCard.example}&rdquo;
                </p>
              </div>

              {currentCard.tip && (
                <div className="text-xs text-amber-300/90 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 text-left flex items-start gap-1.5">
                  <span className="text-sm leading-none">💡</span>
                  <span>
                    <strong className="font-semibold text-amber-200">Exam Tip:</strong> {currentCard.tip}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Flip Back Hint */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                SPAZIO
              </span>
              <span>Gira la carta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls & Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition-all border border-slate-700 flex items-center justify-center gap-2"
        >
          <span>←</span> Precedente
        </button>

        <button
          onClick={handleFlip}
          className="py-2.5 px-6 bg-slate-800/90 hover:bg-slate-700 text-emerald-400 rounded-xl font-medium text-sm transition-all border border-emerald-500/30"
        >
          Gira Carta ⟳
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
        >
          Successiva <span>→</span>
        </button>
      </div>

      {/* Keyboard Shortcuts Cheatsheet */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
        <span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">
            Space
          </kbd>{" "}
          Gira
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">
            ← / →
          </kbd>{" "}
          Scorri
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">
            P
          </kbd>{" "}
          Audio
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">
            M
          </kbd>{" "}
          Memorizza
        </span>
      </div>
    </div>
  );
}
