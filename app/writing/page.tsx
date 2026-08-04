"use client";

import { useState } from "react";
import { Clock3, Sparkles } from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { WritingEditor } from "@/components/exercises/writing-editor";
import { useProgress } from "@/components/providers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { writingPrompts } from "@/lib/data";

export default function WritingPage() {
  const [selected, setSelected] = useState(0);
  const { state } = useProgress();
  const prompt = writingPrompts[selected];
  const recent = [...state.writingSubmissions].reverse().slice(0, 5);

  return (
    <AppPage>
      <PageHeader
        eyebrow="WRITING"
        title="Scrivi con struttura e intenzione."
        description="Tracce B2, bozze automatiche, feedback trasparente e storico dei testi valutati."
      />
      <div className="writing-tabs">
        {writingPrompts.map((item, index) => (
          <button
            key={item.id}
            className={selected === index ? "active" : ""}
            onClick={() => setSelected(index)}
          >
            <span>{item.type}</span>
            <b>{item.title}</b>
            <small>
              {item.minWords}–{item.maxWords} parole
            </small>
          </button>
        ))}
      </div>
      <WritingEditor key={prompt.id} prompt={prompt} />

      <section className="writing-history">
        <div className="section-heading">
          <div>
            <h2>Testi recenti</h2>
            <p>Le ultime valutazioni salvate nei tuoi progressi</p>
          </div>
          <span>{state.writingSubmissions.length} completati</span>
        </div>
        {recent.length ? (
          <div className="writing-history-grid">
            {recent.map((submission) => (
              <Card key={submission.id}>
                <div>
                  <Badge variant={submission.evaluationMode === "ai" ? "success" : "neutral"}>
                    {submission.evaluationMode === "ai" ? "AI" : "LOCALE"}
                  </Badge>
                  <strong>{submission.evaluation.overall}</strong>
                </div>
                <h3>{submission.promptTitle}</h3>
                <p>{submission.text.slice(0, 150)}{submission.text.length > 150 ? "…" : ""}</p>
                <footer>
                  <span><Clock3 size={14} /> {submission.wordCount} parole</span>
                  <span><Sparkles size={14} /> {new Date(submission.submittedAt).toLocaleDateString("it-IT")}</span>
                </footer>
              </Card>
            ))}
          </div>
        ) : (
          <div className="empty-inline">
            <Sparkles />
            <p>Il primo testo valutato apparirà qui.</p>
          </div>
        )}
      </section>
    </AppPage>
  );
}
