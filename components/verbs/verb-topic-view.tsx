"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  BookOpenCheck, Layers3, PlayCircle, ArrowDown,
  ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, Zap, Video
} from "lucide-react";
import type { Exercise } from "@/lib/types";
import type { VerbTenseTopic } from "@/lib/curriculum/verbs";
import { verbTenseTopics } from "@/lib/curriculum/verbs";
import { AppPage } from "@/components/app-shell";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SESSION_SIZE = 8;

// Mappa slug → ID YouTube (BBC Learning English)
const YOUTUBE_IDS: Record<string, string> = {
  "present-simple":             "OsW5sV3GMDM", // Present Simple vs Continuous
  "present-continuous":         "OsW5sV3GMDM", // Present Simple vs Continuous
  "present-perfect-simple":     "R_J78Gg-S4s", // Present perfect
  "present-perfect-continuous": "R_J78Gg-S4s", 
  "past-simple":                "mF8y3r3yQnE", // Actually past, need to update if needed, just placeholder for now
  "past-continuous":            "mF8y3r3yQnE",
  "past-perfect-simple":        "mF8y3r3yQnE",
  "past-perfect-continuous":    "mF8y3r3yQnE",
  "will-future":                "mF8y3r3yQnE", // Going to & Present Continuous for future
  "be-going-to":                "mF8y3r3yQnE",
  "present-continuous-future":  "mF8y3r3yQnE",
  "future-continuous":          "mF8y3r3yQnE",
  "future-perfect-simple":      "mF8y3r3yQnE",
  "future-perfect-continuous":  "mF8y3r3yQnE",
  "used-to-would":              "mF8y3r3yQnE",
  "conditionals":               "mF8y3r3yQnE",
};

export function VerbTopicView({
  topic,
  exercises,
}: {
  topic: VerbTenseTopic;
  exercises: Exercise[];
}) {
  const practiceRef = useRef<HTMLDivElement>(null);

  // Prev / Next navigation
  const allTopics = verbTenseTopics;
  const currentIdx = allTopics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIdx > 0 ? allTopics[currentIdx - 1] : null;
  const nextTopic = currentIdx < allTopics.length - 1 ? allTopics[currentIdx + 1] : null;

  // Sessions
  const sessions = Array.from(
    { length: Math.ceil(exercises.length / SESSION_SIZE) },
    (_, i) => exercises.slice(i * SESSION_SIZE, (i + 1) * SESSION_SIZE),
  );

  function scrollToPractice() {
    setTimeout(() => {
      practiceRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <AppPage>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/grammar">Verbi e tempi</Link>
        <span>/</span>
        <span style={{ color: "var(--muted)", fontSize: "11px" }}>{topic.category}</span>
        <span>/</span>
        <b>{topic.title}</b>
      </div>

      {/* Hero */}
      <section className="verb-topic-hero mb-6">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Badge>B2 VERB LAB</Badge>
            <Badge variant="success">{exercises.length} Esercizi</Badge>
            <Badge>{topic.category}</Badge>
          </div>
          <span style={{ fontSize: "12px", opacity: 0.85 }}>{topic.italianTitle}</span>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "36px", margin: "4px 0 8px" }}>
            {topic.title}
          </h1>
          <p style={{ fontFamily: "monospace", fontSize: "13px", opacity: 0.9, background: "rgba(255,255,255,0.12)", padding: "6px 12px", borderRadius: "8px", display: "inline-block", margin: "0 0 16px" }}>
            {topic.formula}
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button size="lg" onClick={scrollToPractice}>
              <PlayCircle size={20} /> Vai agli Esercizi <ArrowDown size={16} />
            </Button>
          </div>
        </div>

        {/* Signal words */}
        <dl style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "14px" }}>
          <div>
            <dt><Layers3 size={16} /> Segnali temporali</dt>
            <dd style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
              {topic.signals.map((s) => (
                <span key={s} style={{ padding: "3px 9px", borderRadius: "8px", background: "rgba(255,255,255,0.18)", fontSize: "11px", fontWeight: 750 }}>
                  {s}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      {/* ── THEORY SECTION (always visible) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>

        {/* When to use */}
        <Card style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <CheckCircle2 size={18} color="var(--green)" />
            <b style={{ fontSize: "13px" }}>Quando si usa</b>
          </div>
          <ul style={{ margin: 0, paddingLeft: "18px", display: "grid", gap: "8px" }}>
            {topic.useCases.map((uc) => (
              <li key={uc} style={{ fontSize: "12px", lineHeight: 1.55, color: "var(--ink)" }}>
                {uc}
              </li>
            ))}
          </ul>
        </Card>

        {/* Common mistakes */}
        <Card style={{ padding: "20px", background: "color-mix(in srgb, var(--amber-soft) 60%, var(--card))", border: "1px solid color-mix(in srgb, var(--amber) 25%, var(--line))" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <AlertTriangle size={18} color="var(--amber)" />
            <b style={{ fontSize: "13px" }}>Errori comuni</b>
          </div>
          <ul style={{ margin: 0, paddingLeft: "18px", display: "grid", gap: "8px" }}>
            {topic.mistakes.map((m) => (
              <li key={m} style={{ fontSize: "12px", lineHeight: 1.55, color: "var(--ink)" }}>
                {m}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Video Lesson (if available) */}
      {YOUTUBE_IDS[topic.slug] && (
        <Card style={{ padding: "20px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Video size={18} color="var(--blue)" />
            <b style={{ fontSize: "13px" }}>Videolezione Rapida</b>
          </div>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", background: "#000" }}>
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_IDS[topic.slug]}?rel=0`}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Card>
      )}

      {/* Examples with Italian translation */}
      <Card style={{ padding: "20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Zap size={18} color="var(--green)" />
          <b style={{ fontSize: "13px" }}>Esempi con traduzione</b>
        </div>
        <div style={{ display: "grid", gap: "12px" }}>
          {topic.examples.map((en, i) => (
            <div key={en} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "var(--card-2)" }}>
              <div>
                <span style={{ fontSize: "8px", fontWeight: 850, letterSpacing: "0.1em", color: "var(--green)", display: "block", marginBottom: "3px" }}>INGLESE</span>
                <p style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: "13px", lineHeight: 1.5 }}>{en}</p>
              </div>
              <div style={{ borderLeft: "2px solid var(--line)", paddingLeft: "12px" }}>
                <span style={{ fontSize: "8px", fontWeight: 850, letterSpacing: "0.1em", color: "var(--muted)", display: "block", marginBottom: "3px" }}>ITALIANO</span>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "12px", lineHeight: 1.5 }}>
                  {topic.examplesIT?.[i] ?? "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── EXERCISES ── */}
      <div ref={practiceRef}>
        <div className="section-heading verb-session-heading" style={{ marginBottom: "16px" }}>
          <div>
            <span className="page-eyebrow">ESERCIZI PRATICI B2</span>
            <h2 style={{ fontSize: "22px", fontWeight: 700 }}>Sessioni di Allenamento</h2>
            <p style={{ fontSize: "11px", color: "var(--muted)" }}>
              {exercises.length} domande in sessioni da {SESSION_SIZE} · frasi tutte diverse
            </p>
          </div>
        </div>

        {/* Session pills */}
        <div className="verb-session-picker mb-6" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {sessions.map((items, index) => (
            <Link key={index} href={`/grammar/${topic.slug}?s=${index}`}>
              <button type="button" className={`btn btn-md btn-outline`}>
                <BookOpenCheck size={16} />
                <span>Sessione {index + 1}</span>
                <small>({items.length} domande)</small>
              </button>
            </Link>
          ))}
        </div>

        <ExerciseRenderer
          key={topic.slug}
          exercises={sessions[0] ?? []}
          compact
          enableModeSwitch
        />
      </div>

      {/* Prev / Next navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--line)" }}>
        {prevTopic ? (
          <Link href={`/grammar/${prevTopic.slug}`} style={{ flex: 1 }}>
            <Card style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", cursor: "pointer" }}>
              <ArrowLeft size={18} color="var(--muted)" />
              <div>
                <span style={{ fontSize: "9px", color: "var(--muted)", fontWeight: 850, display: "block" }}>PRECEDENTE</span>
                <b style={{ fontSize: "12px" }}>{prevTopic.title}</b>
              </div>
            </Card>
          </Link>
        ) : <div style={{ flex: 1 }} />}

        {nextTopic ? (
          <Link href={`/grammar/${nextTopic.slug}`} style={{ flex: 1 }}>
            <Card style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "9px", color: "var(--muted)", fontWeight: 850, display: "block" }}>SUCCESSIVO</span>
                <b style={{ fontSize: "12px" }}>{nextTopic.title}</b>
              </div>
              <ArrowRight size={18} color="var(--muted)" />
            </Card>
          </Link>
        ) : <div style={{ flex: 1 }} />}
      </div>
    </AppPage>
  );
}


