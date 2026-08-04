"use client";

import { useState } from "react";
import { Mic, ShieldCheck, Timer } from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { SpeakingLab } from "@/components/speaking/speaking-lab";
import { useProgress } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { speakingPrompts } from "@/lib/speaking-data";

export default function SpeakingPage() {
  const [selected, setSelected] = useState(0);
  const { state } = useProgress();
  const prompt = speakingPrompts[selected];
  const attempts = [...state.speakingAttempts].reverse();
  const average = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.overall, 0) / attempts.length)
    : 0;

  return (
    <AppPage>
      <PageHeader
        eyebrow="SPEAKING LAB"
        title="Parla, riascolta, migliora."
        description="Tracce B2 con preparazione a tempo, registrazione privata e rubrica di autovalutazione."
      />
      <div className="speaking-privacy-banner">
        <ShieldCheck />
        <div>
          <b>Audio privato per impostazione predefinita</b>
          <p>La registrazione non lascia il dispositivo. Nei progressi salviamo soltanto durata e punteggi scelti da te.</p>
        </div>
      </div>
      <div className="speaking-tabs">
        {speakingPrompts.map((item, index) => (
          <button
            key={item.id}
            className={selected === index ? "active" : ""}
            onClick={() => setSelected(index)}
          >
            <span>{item.part}</span>
            <b>{item.title}</b>
            <small><Timer size={13} /> {item.targetSeconds} secondi</small>
          </button>
        ))}
      </div>
      <SpeakingLab key={prompt.id} prompt={prompt} />

      <section className="speaking-history">
        <div className="section-heading">
          <div><h2>Storico speaking</h2><p>Autovalutazioni sincronizzate, senza file audio</p></div>
          <span>{attempts.length} prove · media {average}%</span>
        </div>
        {attempts.length ? (
          <div className="speaking-history-grid">
            {attempts.slice(0, 8).map((attempt) => (
              <Card key={attempt.id}>
                <div><Badge variant="neutral">Speaking</Badge><strong>{attempt.overall}%</strong></div>
                <h3>{attempt.promptTitle}</h3>
                <p><Mic size={14} /> {Math.round(attempt.durationSeconds / 60)} min · {new Date(attempt.completedAt).toLocaleDateString("it-IT")}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="empty-inline"><Mic /><p>La prima autovalutazione apparirà qui.</p></div>
        )}
      </section>
    </AppPage>
  );
}
