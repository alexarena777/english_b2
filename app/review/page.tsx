"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  RefreshCcw,
  Search,
} from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useProgress } from "@/components/providers";
import { allExercises } from "@/lib/data";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";
import {
  buildReviewForecast,
  deriveReviewInsights,
  reviewDueLabel,
  summarizeReviews,
  type ReviewBucket,
  type ReviewInsight,
} from "@/lib/review-insights";
import type { Exercise } from "@/lib/types";

type ReviewFilter = "all" | ReviewBucket;

const filters: { key: ReviewFilter; label: string }[] = [
  { key: "all", label: "Tutti" },
  { key: "due", label: "Da fare" },
  { key: "scheduled", label: "Programmati" },
  { key: "mastered", label: "Consolidati" },
];

const bucketLabels: Record<ReviewBucket, string> = {
  due: "Da ripassare",
  scheduled: "Programmato",
  mastered: "Consolidato",
};

export default function ReviewPage() {
  const { state } = useProgress();
  const [now, setNow] = useState<number>();
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");
  const [query, setQuery] = useState("");
  const [session, setSession] = useState<Exercise[] | null>(null);

  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
  }, []);

  const currentDate = useMemo(() => new Date(now ?? 0), [now]);
  const insights = useMemo(
    () => (now ? deriveReviewInsights(state.reviews, currentDate) : []),
    [currentDate, now, state.reviews],
  );
  const summary = useMemo(
    () => (now ? summarizeReviews(state.reviews, currentDate) : null),
    [currentDate, now, state.reviews],
  );
  const forecast = useMemo(
    () => (now ? buildReviewForecast(state.reviews, currentDate) : []),
    [currentDate, now, state.reviews],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase("it-IT");
  const visibleInsights = insights.filter(
    (insight) =>
      (activeFilter === "all" || insight.bucket === activeFilter) &&
      (!normalizedQuery ||
        insight.item.topic.toLocaleLowerCase("it-IT").includes(normalizedQuery) ||
        insight.item.question.toLocaleLowerCase("it-IT").includes(normalizedQuery)),
  );
  const dueInsights = insights.filter((insight) => insight.bucket === "due");
  const maxForecast = Math.max(1, ...forecast.map((day) => day.count));

  function exercisesFor(items: ReviewInsight[]) {
    return items
      .map((insight) =>
        allExercises.find((exercise) => exercise.id === insight.item.exerciseId),
      )
      .filter((exercise): exercise is Exercise => Boolean(exercise));
  }

  function startReview(items: ReviewInsight[]) {
    const exercises = exercisesFor(items);
    if (exercises.length) setSession(exercises);
  }

  if (session) {
    return (
      <AppPage>
        <button className="back-link" onClick={() => setSession(null)}>
          <ArrowLeft size={17} /> Torna al quaderno degli errori
        </button>
        <ExerciseRenderer exercises={session} />
      </AppPage>
    );
  }

  return (
    <AppPage>
      <PageHeader
        eyebrow="QUADERNO DEGLI ERRORI"
        title="Ogni errore ha il suo momento."
        description="Controlla ciò che è scaduto, anticipa il carico della settimana e ripassa un argomento preciso quando vuoi."
        action={
          dueInsights.length ? (
            <Button onClick={() => startReview(dueInsights)}>
              <RefreshCcw size={17} /> Ripassa {dueInsights.length} scaduti
            </Button>
          ) : undefined
        }
      />

      {state.reviews.length ? (
        <>
          <div className="review-metrics review-metrics-wide">
            <Card>
              <CalendarClock />
              <div>
                <strong>{summary?.due ?? 0}</strong>
                <span>da ripassare ora</span>
              </div>
            </Card>
            <Card>
              <CalendarRange />
              <div>
                <strong>{summary?.scheduledNext7 ?? 0}</strong>
                <span>nei prossimi 7 giorni</span>
              </div>
            </Card>
            <Card>
              <CheckCircle2 />
              <div>
                <strong>{summary?.mastered ?? 0}</strong>
                <span>elementi consolidati</span>
              </div>
            </Card>
            <Card>
              <Brain />
              <div>
                <strong>{summary?.averageMastery ?? 0}%</strong>
                <span>padronanza media</span>
              </div>
            </Card>
          </div>

          <Card className="review-forecast">
            <div className="panel-heading">
              <div>
                <h2>Carico dei prossimi sette giorni</h2>
                <p>Gli arretrati vengono conteggiati nella colonna di oggi.</p>
              </div>
              <span>{summary?.total ?? 0} errori monitorati</span>
            </div>
            <div className="review-forecast-bars">
              {forecast.map((day) => (
                <div key={day.date}>
                  <b>{day.count}</b>
                  <i>
                    <span
                      style={{
                        height: `${day.count ? Math.max(14, (day.count / maxForecast) * 100) : 4}%`,
                      }}
                    />
                  </i>
                  <small>{day.label}</small>
                </div>
              ))}
            </div>
          </Card>

          <Card className="review-toolbar">
            <label>
              <Search size={17} />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cerca per argomento o domanda"
                aria-label="Cerca nel quaderno degli errori"
              />
            </label>
            <div className="review-filter-tabs" aria-label="Filtra gli errori">
              {filters.map((filter) => {
                const count =
                  filter.key === "all"
                    ? insights.length
                    : insights.filter((insight) => insight.bucket === filter.key).length;
                return (
                  <button
                    key={filter.key}
                    className={activeFilter === filter.key ? "active" : ""}
                    onClick={() => setActiveFilter(filter.key)}
                    aria-pressed={activeFilter === filter.key}
                  >
                    {filter.label} <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <section className="review-journal">
            <div className="section-heading">
              <div>
                <h2>Gli errori registrati</h2>
                <p>{visibleInsights.length} risultati nella vista corrente</p>
              </div>
            </div>
            {visibleInsights.length ? (
              visibleInsights.map((insight) => {
                const exerciseAvailable = exercisesFor([insight]).length > 0;
                return (
                  <Card className="review-journal-row" key={insight.item.id}>
                    <header>
                      <Badge
                        variant={
                          insight.bucket === "due"
                            ? "warning"
                            : insight.bucket === "mastered"
                              ? "success"
                              : "neutral"
                        }
                      >
                        {bucketLabels[insight.bucket]}
                      </Badge>
                      <time dateTime={insight.item.nextReviewAt}>
                        {reviewDueLabel(insight.item, currentDate)}
                      </time>
                    </header>
                    <div className="review-journal-main">
                      <div>
                        <h3>{insight.item.topic}</h3>
                        <p>{insight.item.question}</p>
                      </div>
                      <div className="review-mastery">
                        <span>Padronanza</span>
                        <b>{insight.item.mastery}%</b>
                        <Progress
                          value={insight.item.mastery}
                          label={`Padronanza ${insight.item.topic}`}
                        />
                        <small>{insight.item.errorCount} errori registrati</small>
                      </div>
                    </div>
                    <footer>
                      <details>
                        <summary>Vedi l’errore originale</summary>
                        <p>
                          La tua risposta: <b>{insight.item.givenAnswer}</b>
                        </p>
                        <p>
                          Risposta corretta: <strong>{insight.item.correctAnswer}</strong>
                        </p>
                      </details>
                      <Button
                        size="sm"
                        variant={insight.bucket === "due" ? "default" : "outline"}
                        disabled={!exerciseAvailable}
                        onClick={() => startReview([insight])}
                      >
                        <RefreshCcw size={14} /> Ripassa ora
                      </Button>
                    </footer>
                  </Card>
                );
              })
            ) : (
              <EmptyState
                title="Nessun errore in questa vista"
                description="Cambia filtro oppure rimuovi la ricerca per vedere gli altri elementi."
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveFilter("all");
                      setQuery("");
                    }}
                  >
                    Mostra tutti
                  </Button>
                }
              />
            )}
          </section>
        </>
      ) : (
        <EmptyState
          title="Il quaderno è ancora vuoto"
          description="Gli errori dei prossimi esercizi verranno programmati automaticamente qui."
          action={
            <Button asChild>
              <Link href="/grammar">Allenati con la grammatica</Link>
            </Button>
          }
        />
      )}
    </AppPage>
  );
}
