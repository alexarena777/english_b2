"use client";

import { useEffect, useState } from "react";
import { BarChart3, CalendarDays, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { ProgressChart } from "@/components/charts/progress-chart";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/components/providers";
import { deriveLearningProfile } from "@/lib/learning-profile";
import { dateKey, formatMinutes } from "@/lib/utils";

const sections = [
  { key: "vocabulary", label: "Vocabolario" },
  { key: "grammar", label: "Verbi e tempi" },
  { key: "reading", label: "Reading" },
  { key: "listening", label: "Listening" },
] as const;

export default function StatisticsPage() {
  const { state } = useProgress();
  const learningProfile = deriveLearningProfile(state);
  const [now, setNow] = useState(0);
  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
  }, []);

  const coreAnswers = state.answers.filter((answer) =>
    sections.some((section) => section.key === answer.section),
  );
  const accuracy = coreAnswers.length
    ? Math.round((coreAnswers.filter((answer) => answer.correct).length / coreAnswers.length) * 100)
    : 0;
  const objectiveAreas = sections.map((section) => {
    const answers = state.answers.filter(
      (answer) => answer.section === section.key,
    );
    if (section.key === "vocabulary" && state.vocabularyProgress.length) {
      return {
        ...section,
        total: state.vocabularyProgress.length,
        score: Math.round(
          state.vocabularyProgress.reduce((total, item) => total + item.mastery, 0) /
            state.vocabularyProgress.length,
        ),
      };
    }
    return {
      ...section,
      total: answers.length,
      score: answers.length
        ? Math.round(
            (answers.filter((answer) => answer.correct).length / answers.length) *
              100,
          )
        : 0,
    };
  });
  const areas = objectiveAreas;
  const chartData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - index));
    const answers = coreAnswers.filter(
      (answer) => answer.answeredAt.slice(0, 10) === dateKey(date),
    );
    return {
      day: new Intl.DateTimeFormat("it-IT", { weekday: "short" })
        .format(date)
        .slice(0, 3),
      score: answers.length
        ? Math.round(
            (answers.filter((answer) => answer.correct).length / answers.length) *
              100,
          )
        : 0,
    };
  });
  const studiedDates = new Set([
    ...coreAnswers.map((answer) => answer.answeredAt.slice(0, 10)),
    ...state.vocabularyProgress.flatMap((item) =>
      item.lastReviewedAt ? [item.lastReviewedAt.slice(0, 10)] : [],
    ),
  ]);
  const calendar = Array.from({ length: 35 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (34 - index));
    return { key: dateKey(date), studied: studiedDates.has(dateKey(date)) };
  });
  const weakTopics = [...state.reviews]
    .sort(
      (left, right) =>
        left.mastery - right.mastery || right.errorCount - left.errorCount,
    )
    .slice(0, 3);

  return (
    <AppPage>
      <PageHeader
        eyebrow="STATISTICHE"
        title="I progressi, senza rumore."
        description="Tutti gli indicatori derivano dalle risposte registrate: nessun dato dimostrativo viene mescolato al tuo profilo."
      />
      <div className="stats-metrics">
        <Card>
          <TrendingUp />
          <div>
            <span>Accuratezza generale</span>
            <strong>{coreAnswers.length ? `${accuracy}%` : "—"}</strong>
            <small>{coreAnswers.length ? `${coreAnswers.filter((answer) => answer.correct).length} risposte corrette` : "Nessuna risposta registrata"}</small>
          </div>
        </Card>
        <Card>
          <Clock3 />
          <div>
            <span>Tempo di studio</span>
            <strong>{formatMinutes(state.studyMinutes)}</strong>
            <small>tempo totale registrato</small>
          </div>
        </Card>
        <Card>
          <CheckCircle2 />
          <div>
            <span>Esercizi completati</span>
            <strong>{coreAnswers.length}</strong>
            <small>{state.reviews.length} errori monitorati</small>
          </div>
        </Card>
        <Card>
          <BarChart3 />
          <div>
            <span>Preparazione B2</span>
            <strong>{state.assessmentComplete ? `${learningProfile.readiness}%` : "Da calcolare"}</strong>
            <small>
              {state.assessmentComplete
                ? `${learningProfile.level} · ${learningProfile.confidence.toLowerCase()}`
                : "Completa il test iniziale"}
            </small>
          </div>
        </Card>
      </div>
      {state.assessmentComplete && (
        <Card className="readiness-signals">
          <div className="panel-heading">
            <div>
              <h2>Come viene stimata la preparazione</h2>
              <p>
                Assessment iniziale e risultati reali delle attività completate.
              </p>
            </div>
            <span>{learningProfile.coverage}% copertura esercizi</span>
          </div>
          <div className="readiness-signal-grid">
            {learningProfile.signals.map((signal) => (
              <div key={signal.key}>
                <span>{signal.label}</span>
                <Progress value={signal.score} />
                <b>{signal.score}%</b>
                <small>
                  {signal.count} {signal.count === 1 ? "dato" : "dati"}
                </small>
              </div>
            ))}
          </div>
        </Card>
      )}
      <div className="stats-grid">
        <Card className="stats-chart">
          <div className="panel-heading">
            <div>
              <h2>Accuratezza nel tempo</h2>
              <p>Ultimi sette giorni</p>
            </div>
          </div>
          {coreAnswers.length ? <ProgressChart data={chartData} /> : <div className="empty-inline"><BarChart3 /><p>Nessun andamento disponibile prima delle prime risposte.</p></div>}
        </Card>
        <Card className="area-stats">
          <div className="panel-heading">
            <div>
              <h2>Risultati per area</h2>
              <p>Solo attività delle quattro sezioni</p>
            </div>
          </div>
          {areas.map((area) => (
            <div key={area.key}>
              <span>{area.label}</span>
              <Progress value={area.score} />
              <b>{area.total ? `${area.score}%` : "—"}</b>
              <em>{area.total}</em>
            </div>
          ))}
        </Card>
      </div>
      <div className="stats-grid lower">
        <Card>
          <div className="panel-heading">
            <div>
              <h2>Argomenti da rinforzare</h2>
              <p>Ordinati per padronanza</p>
            </div>
          </div>
          {weakTopics.length ? (
            weakTopics.map((review) => (
              <div className="weak-stat" key={review.id}>
                <span>{review.topic}</span>
                <b>{review.mastery}%</b>
                <small>{review.errorCount} errori</small>
              </div>
            ))
          ) : (
            <div className="empty-inline">
              <CheckCircle2 />
              <p>Completa qualche esercizio per individuare le priorità.</p>
            </div>
          )}
        </Card>
        <Card className="activity-calendar">
          <div className="panel-heading">
            <div>
              <h2>Costanza</h2>
              <p>Ultimi 35 giorni</p>
            </div>
            <CalendarDays />
          </div>
          <div className="calendar-grid">
            {calendar.map((day) => (
              <i key={day.key} className={day.studied ? "studied" : ""} />
            ))}
          </div>
          <footer>
            <span>nessuna attività</span>
            <i />
            <i className="full" />
            <span>giorno studiato</span>
          </footer>
        </Card>
      </div>
    </AppPage>
  );
}
