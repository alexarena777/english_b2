"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  RefreshCcw,
  Target,
  Trophy,
} from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/providers";
import { allExercises } from "@/lib/data";
import { generateDailySession } from "@/lib/logic";
import type { Exercise } from "@/lib/types";

export default function DailyPage() {
  const { state } = useProgress();
  const [session, setSession] = useState<Exercise[] | null>(null);
  const [score, setScore] = useState<number | null>(null);

  function startSession() {
    setSession(generateDailySession(allExercises, state, 8));
  }

  return (
    <AppPage>
      {score !== null ? (
        <div className="session-summary">
          <Trophy />
          <span>SESSIONE COMPLETATA</span>
          <h1>{score}% di accuratezza</h1>
          <p>
            Hai completato {session?.length ?? 0} attività. Gli errori sono già
            stati aggiunti al ripasso e le risposte corrette aggiornano gli
            intervalli esistenti.
          </p>
          <div>
            <Card>
              <b>+{session?.length ? session.length * 12 : 0} XP max</b>
              <span>esperienza</span>
            </Card>
            <Card>
              <b>{session?.length ?? 0}</b>
              <span>attività completate</span>
            </Card>
            <Card>
              <b>{score >= 75 ? "Ottimo" : "Da rivedere"}</b>
              <span>ritmo</span>
            </Card>
          </div>
          <Button asChild>
            <Link href="/dashboard">Torna alla dashboard</Link>
          </Button>
        </div>
      ) : !session ? (
        <>
          <PageHeader
            eyebrow="ALLENAMENTO GIORNALIERO"
            title="La tua sessione di oggi"
            description="Una sequenza breve che privilegia i ripassi in scadenza e ruota gli esercizi già incontrati."
          />
          <div className="session-plan">
            <Card>
              <div className="session-plan-head">
                <span>
                  <Target />
                </span>
                <div>
                  <h2>Obiettivo: consolidare il B2</h2>
                  <p>
                    Gli argomenti con ripassi scaduti vengono proposti per primi.
                  </p>
                </div>
              </div>
              <div className="session-parts">
                <p>
                  <RefreshCcw /> Ripasso programmato <b>priorità alta</b>
                </p>
                <p>
                  <Target /> Grammatica e lessico <b>mix adattivo</b>
                </p>
                <p>
                  <Clock3 /> Comprensione <b>quando disponibile</b>
                </p>
                <p>
                  <CheckCircle2 /> Riepilogo finale <b>automatico</b>
                </p>
              </div>
              <Button size="lg" onClick={startSession}>
                Inizia · 8 attività
              </Button>
            </Card>
            <aside>
              <h3>Perché questi esercizi?</h3>
              <p>
                La selezione usa ripassi scaduti, aree deboli e attività viste
                meno di recente. Una volta iniziata, la sessione non cambia ordine.
              </p>
              <div className="adaptation-note">
                <span>ADATTAMENTO ATTIVO</span>
                <b>{state.reviews.length} errori monitorati</b>
                <small>{state.answers.length} risposte usate per la rotazione</small>
              </div>
            </aside>
          </div>
        </>
      ) : (
        <ExerciseRenderer exercises={session} onComplete={setScore} />
      )}
    </AppPage>
  );
}
