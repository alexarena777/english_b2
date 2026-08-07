"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Headphones, ListMusic, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listeningActivities } from "@/lib/data";
import type { PracticeMode } from "@/lib/types";

type PlaybackState = "idle" | "playing" | "paused";

export default function ListeningPage() {
  const [selected, setSelected] = useState(0);
  const [listens, setListens] = useState<Record<string, number>>({});
  const [playback, setPlayback] = useState<PlaybackState>("idle");
  const [showTranscript, setShowTranscript] = useState(false);
  const [audioMessage, setAudioMessage] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("study");
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentSegmentRef = useRef<number>(0);
  const isCancelledRef = useRef<boolean>(false);

  const activity = listeningActivities[selected];

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  function stopAllAudio() {
    isCancelledRef.current = true;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function transcriptSegments(transcript: string) {
    return transcript
      .split(/(?=[A-Z][A-Za-z .'-]{1,24}:\s)/g)
      .map((part) => {
        const match = part.trim().match(/^([^:]{1,25}):\s*([\s\S]+)$/);
        return match
          ? { speaker: match[1].trim(), text: match[2].trim() }
          : { speaker: "Narrator", text: part.trim() };
      })
      .filter((part) => part.text);
  }

  function playFallbackSpeech(fromIndex = 0) {
    if (!("speechSynthesis" in window)) {
      setAudioMessage("Audio non disponibile in modalità offline.");
      setPlayback("idle");
      return;
    }

    const segments = transcriptSegments(activity.transcript).slice(fromIndex);
    segments.forEach((segment, i) => {
      if (isCancelledRef.current) return;
      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = "en-GB";
      utterance.rate = playbackRate;
      if (i === segments.length - 1) {
        utterance.onend = () => setPlayback("idle");
      }
      window.speechSynthesis.speak(utterance);
    });
  }

  function playCambridgeAudio() {
    const segments = transcriptSegments(activity.transcript);
    isCancelledRef.current = false;
    currentSegmentRef.current = 0;

    function playNextSegment(index: number) {
      if (isCancelledRef.current) return;
      if (index >= segments.length) {
        setPlayback("idle");
        return;
      }

      currentSegmentRef.current = index;
      const segment = segments[index];
      const audioUrl = `/api/tts?text=${encodeURIComponent(segment.text)}&lang=en-GB`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackRate;

      let fallbackTriggered = false;
      const triggerFallback = () => {
        if (fallbackTriggered || isCancelledRef.current) return;
        fallbackTriggered = true;
        playFallbackSpeech(index);
      };

      audio.onended = () => {
        if (!isCancelledRef.current && !fallbackTriggered) {
          playNextSegment(index + 1);
        }
      };

      audio.onerror = triggerFallback;
      currentAudioRef.current = audio;
      audio.play().catch(triggerFallback);
    }

    playNextSegment(0);
  }

  function play() {
    if (playback === "paused") {
      if (currentAudioRef.current) {
        currentAudioRef.current.play();
        setPlayback("playing");
        return;
      } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.resume();
        setPlayback("playing");
        return;
      }
    }

    if (
      practiceMode === "simulation" &&
      (listens[activity.id] ?? 0) >= activity.maxListens
    ) return;

    stopAllAudio();
    isCancelledRef.current = false;
    setPlayback("playing");
    setAudioMessage(null);
    setListens((current) => ({
      ...current,
      [activity.id]: (current[activity.id] ?? 0) + 1,
    }));

    playCambridgeAudio();
  }

  function pause() {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
    setPlayback("paused");
  }

  function resetAudio() {
    stopAllAudio();
    setPlayback("idle");
  }

  function chooseActivity(index: number) {
    resetAudio();
    setSelected(index);
    setShowTranscript(false);
    setAudioMessage(null);
  }

  function changePracticeMode(nextMode: PracticeMode) {
    resetAudio();
    setPracticeMode(nextMode);
    setShowTranscript(false);
    setListens((current) => ({ ...current, [activity.id]: 0 }));
  }

  return (
    <AppPage>
      <PageHeader
        eyebrow="LISTENING"
        title="Tracce Audio Cambridge B2 con accento British nativo."
        description={`${listeningActivities.length} tracce di ascolto B2 con annunci ufficiali, interviste, conversazioni e mini lezioni. Riproduzione automatica in accento madrelingua en-GB senza bisogno di configurare voci.`}
      />
      <div className="listening-bank-summary">
        <span><ListMusic /> <b>{listeningActivities.length}</b> prove audio</span>
        <span><CheckCircle2 /> <b>{listeningActivities.reduce((total, item) => total + item.exercises.length, 0)}</b> domande</span>
        <span><Headphones /> Cambridge B2 · accento British</span>
      </div>
      <div className="listening-tabs" role="tablist">
        {listeningActivities.map((item, index) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={selected === index}
            className={selected === index ? "active" : ""}
            onClick={() => chooseActivity(index)}
          >
            <span>{index + 1}</span>
            <div>
              <b>{item.title}</b>
              <small>{item.kind} · {item.level} · {item.exercises.length} domande</small>
            </div>
          </button>
        ))}
      </div>
      <div className="listening-layout">
        <Card className="audio-card">
          <div className="audio-visual"><Headphones /><span /><span /><span /><span /><span /></div>
          <div className="flex items-center gap-2 mb-2">
            <Badge>{activity.level}</Badge>
            <Badge variant="success">CAMBRIDGE B2 AUDIO</Badge>
          </div>
          <h1>{activity.title}</h1>
          <p>{activity.kind} · {activity.duration}</p>
          <small className="audio-task-label">ASCOLTA PER GIST, DETTAGLI, OPINIONE E SCOPO</small>
          <div className="audio-controls">
            <Button
              size="icon"
              onClick={playback === "playing" ? pause : play}
              aria-label={playback === "playing" ? "Metti in pausa" : "Riproduci audio"}
              disabled={practiceMode === "simulation" && (listens[activity.id] ?? 0) >= activity.maxListens && playback === "idle"}
            >
              {playback === "playing" ? <Pause /> : <Play />}
            </Button>
            <div>
              <b>{playback === "playing" ? "Riproduzione in corso (British Accent)" : playback === "paused" ? "Audio in pausa" : "Audio pronto all'ascolto"}</b>
              <small>
                {practiceMode === "simulation"
                  ? `Ascolto ${listens[activity.id] ?? 0} di ${activity.maxListens}`
                  : `${listens[activity.id] ?? 0} ascolti · velocità ${playbackRate.toFixed(1)}×`}
              </small>
            </div>
            <button className="icon-plain" onClick={resetAudio} aria-label="Interrompi e riavvolgi"><RotateCcw size={18} /></button>
          </div>

          {practiceMode === "study" && (
            <div className="audio-study-tools">
              <span>MODALITÀ STUDIO</span>
              <button
                type="button"
                onClick={() => {
                  resetAudio();
                  setPlaybackRate((rate) => (rate === 1.0 ? 0.9 : 1.0));
                }}
              >
                <Volume2 size={14} /> Velocità {playbackRate.toFixed(1)}×
              </button>
              <small>Riascolti liberi · Accento British en-GB</small>
            </div>
          )}

          {audioMessage && <p className="audio-warning">{audioMessage}</p>}
        </Card>
        <div>
          <ExerciseRenderer
            key={`${activity.id}-${practiceMode}`}
            exercises={activity.exercises}
            compact
            onComplete={() => setShowTranscript(true)}
            enableModeSwitch
            mode={practiceMode}
            onModeChange={changePracticeMode}
          />
          {showTranscript && (
            <Card className="transcript">
              <span>TRASCRIZIONE CAMBRIDGE B2</span>
              <p>{activity.transcript}</p>
            </Card>
          )}
        </div>
      </div>
    </AppPage>
  );
}
