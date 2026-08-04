"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Mic,
  RotateCcw,
  ShieldCheck,
  Square,
  Timer,
} from "lucide-react";
import type { SpeakingAttempt, SpeakingScores } from "@/lib/types";
import type { SpeakingPrompt } from "@/lib/speaking-data";
import { useProgress } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Stage = "idle" | "preparing" | "requesting" | "recording" | "review" | "saved";
type ScoreKey = keyof SpeakingScores;

const scoreFields: { key: ScoreKey; label: string; hint: string }[] = [
  { key: "fluency", label: "Fluency", hint: "Ritmo, pause e continuità" },
  { key: "grammar", label: "Grammar", hint: "Controllo delle strutture" },
  { key: "vocabulary", label: "Vocabulary", hint: "Varietà e precisione" },
  { key: "pronunciation", label: "Pronunciation", hint: "Chiarezza e accento comprensibile" },
  { key: "taskAchievement", label: "Task achievement", hint: "Risposta completa e pertinente" },
];

const emptyScores: SpeakingScores = {
  fluency: 0,
  grammar: 0,
  vocabulary: 0,
  pronunciation: 0,
  taskAchievement: 0,
};

export function SpeakingLab({ prompt }: { prompt: SpeakingPrompt }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [preparationLeft, setPreparationLeft] = useState(prompt.preparationSeconds);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<SpeakingScores>(emptyScores);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const { saveSpeakingAttempt } = useProgress();
  const allScored = Object.values(scores).every((score) => score >= 1);
  const overall = useMemo(
    () => Math.round((Object.values(scores).reduce((sum, score) => sum + score, 0) / 25) * 100),
    [scores],
  );

  const startRecording = useCallback(async () => {
    if (stage === "requesting" || recorderRef.current?.state === "recording") return;
    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
      setError("La registrazione audio non è supportata da questo browser.");
      setStage("idle");
      return;
    }
    try {
      setStage("requesting");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      const preferredType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : undefined;
      const recorder = new MediaRecorder(
        stream,
        preferredType ? { mimeType: preferredType } : undefined,
      );
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        const nextAudioUrl = URL.createObjectURL(blob);
        audioUrlRef.current = nextAudioUrl;
        setAudioUrl(nextAudioUrl);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setStage("review");
      };
      recorderRef.current = recorder;
      setElapsed(0);
      setError(null);
      setStage("recording");
      recorder.start(250);
    } catch {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setError("Permesso microfono non disponibile. Controlla le impostazioni del browser.");
      setStage("idle");
    }
  }, [stage]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, []);

  useEffect(() => {
    if (stage !== "preparing") return;
    const timer = window.setTimeout(
      () => {
        if (preparationLeft <= 0) void startRecording();
        else setPreparationLeft((value) => value - 1);
      },
      preparationLeft <= 0 ? 0 : 1000,
    );
    return () => clearTimeout(timer);
  }, [preparationLeft, stage, startRecording]);

  useEffect(() => {
    if (stage !== "recording") return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage === "recording" && elapsed >= prompt.targetSeconds + 30) {
      stopRecording();
    }
  }, [elapsed, prompt.targetSeconds, stage, stopRecording]);

  useEffect(() => {
    return () => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.ondataavailable = null;
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  function prepare() {
    setError(null);
    setPreparationLeft(prompt.preparationSeconds);
    setStage("preparing");
  }

  function restart() {
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setAudioUrl(null);
    setScores(emptyScores);
    setElapsed(0);
    setStage("idle");
  }

  function save() {
    if (!allScored || elapsed < 1) return;
    const attempt: SpeakingAttempt = {
      id: crypto.randomUUID(),
      promptId: prompt.id,
      promptTitle: prompt.title,
      durationSeconds: elapsed,
      scores,
      overall,
      completedAt: new Date().toISOString(),
    };
    saveSpeakingAttempt(attempt);
    setStage("saved");
  }

  return (
    <section className="speaking-lab">
      <div className="speaking-brief">
        <div><Badge>{prompt.part}</Badge><span><Timer size={15} /> {prompt.targetSeconds} sec</span></div>
        <h2>{prompt.title}</h2>
        <p>{prompt.prompt}</p>
        <ul>{prompt.questions.map((question) => <li key={question}>{question}</li>)}</ul>
        <div className="speaking-language">
          <b>Useful language</b>
          {prompt.usefulLanguage.map((phrase) => <span key={phrase}>{phrase}</span>)}
        </div>
      </div>

      <div className="speaking-workspace">
        {stage === "idle" && (
          <div className="speaking-start">
            <Mic />
            <h2>Registra una prova</h2>
            <p>Avrai {prompt.preparationSeconds} secondi per prepararti. L’audio resta nel browser e viene eliminato quando lasci la pagina.</p>
            <div className="privacy-inline"><ShieldCheck /><span>Salviamo soltanto durata e autovalutazione, mai la registrazione.</span></div>
            {error && <p className="speaking-error">{error}</p>}
            <Button size="lg" onClick={prepare}>Prepara e registra</Button>
          </div>
        )}

        {stage === "preparing" && (
          <div className="speaking-countdown">
            <span>PREPARAZIONE</span>
            <strong>{preparationLeft}</strong>
            <p>Organizza due o tre idee chiave; non scrivere una risposta completa.</p>
            <Button onClick={() => void startRecording()}>Inizia ora</Button>
          </div>
        )}

        {stage === "requesting" && (
          <div className="speaking-countdown">
            <Mic />
            <h2>Attivazione microfono…</h2>
            <p>Conferma il permesso nel browser per iniziare la registrazione.</p>
          </div>
        )}

        {stage === "recording" && (
          <div className="speaking-recording">
            <span className="recording-dot" />
            <b>REGISTRAZIONE IN CORSO</b>
            <strong>{formatSeconds(elapsed)}</strong>
            <Progress value={Math.min(100, (elapsed / prompt.targetSeconds) * 100)} />
            <small>Obiettivo: {formatSeconds(prompt.targetSeconds)} · arresto automatico dopo 30 secondi extra</small>
            <Button variant="danger" onClick={stopRecording}><Square size={16} /> Ferma registrazione</Button>
          </div>
        )}

        {stage === "review" && audioUrl && (
          <div className="speaking-review">
            <h2>Ascolta e valuta la prova</h2>
            <audio controls src={audioUrl} aria-label="Registrazione speaking" />
            <p>Durata: {formatSeconds(elapsed)}</p>
            <div className="speaking-rubric">
              {scoreFields.map((field) => (
                <label key={field.key}>
                  <span><b>{field.label}</b><small>{field.hint}</small></span>
                  <select
                    value={scores[field.key]}
                    onChange={(event) => setScores((current) => ({ ...current, [field.key]: Number(event.target.value) }))}
                    aria-label={`Punteggio ${field.label}`}
                  >
                    <option value={0}>—</option>
                    {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
              ))}
            </div>
            <div className="speaking-review-actions">
              <Button variant="outline" onClick={restart}><RotateCcw size={16} /> Registra di nuovo</Button>
              <Button onClick={save} disabled={!allScored}>Salva autovalutazione · {overall}%</Button>
            </div>
          </div>
        )}

        {stage === "saved" && (
          <div className="speaking-saved">
            <CheckCircle2 />
            <span>PROVA SALVATA</span>
            <h2>{overall}%</h2>
            <p>Il risultato e la durata sono stati aggiunti ai progressi. La registrazione resta soltanto in questa pagina.</p>
            <Button variant="outline" onClick={restart}>Nuova registrazione</Button>
          </div>
        )}
      </div>
    </section>
  );
}

function formatSeconds(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}
