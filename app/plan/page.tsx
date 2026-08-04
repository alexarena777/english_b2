"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Settings2,
  Sparkles,
} from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/components/providers";
import { buildWeeklyStudyPlan } from "@/lib/logic";

export default function PlanPage() {
  const { state } = useProgress();
  const [now, setNow] = useState<number>();
  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
  }, []);

  const plan = now ? buildWeeklyStudyPlan(state, new Date(now)) : [];
  const required = plan.filter((day) => day.required);
  const completed = required.filter((day) => day.completed).length;
  const minutes = required.reduce((total, day) => total + day.minutes, 0);

  return (
    <AppPage>
      <PageHeader
        eyebrow="PIANO SETTIMANALE"
        title="Una settimana costruita sui tuoi dati."
        description="Il piano combina errori in scadenza, aree più deboli e produzione. Si aggiorna automaticamente quando studi."
        action={
          <Button asChild variant="outline">
            <Link href="/profile">
              <Settings2 size={16} /> Modifica obiettivo
            </Link>
          </Button>
        }
      />

      <div className="plan-summary">
        <Card>
          <CalendarCheck2 />
          <div>
            <span>Obiettivo</span>
            <strong>{completed} / {state.weeklyGoal} giorni</strong>
            <Progress value={state.weeklyGoal ? (completed / state.weeklyGoal) * 100 : 0} />
          </div>
        </Card>
        <Card>
          <Clock3 />
          <div>
            <span>Tempo pianificato</span>
            <strong>{minutes} minuti</strong>
            <small>distribuiti nelle attività richieste</small>
          </div>
        </Card>
        <Card>
          <Sparkles />
          <div>
            <span>Metodo</span>
            <strong>Adattivo</strong>
            <small>priorità ricalcolate dai progressi</small>
          </div>
        </Card>
      </div>

      <section className="weekly-plan" aria-busy={!now}>
        {plan.map((day) => (
          <Card
            className={`plan-day ${day.completed ? "completed" : ""} ${!day.required ? "optional" : ""}`}
            key={day.date}
          >
            <header>
              <div>
                <span>{day.weekday}</span>
                <time dateTime={day.date}>
                  {new Intl.DateTimeFormat("it-IT", {
                    day: "numeric",
                    month: "short",
                  }).format(new Date(`${day.date}T12:00:00`))}
                </time>
              </div>
              {day.completed ? (
                <Badge variant="success"><CheckCircle2 size={12} /> Fatto</Badge>
              ) : (
                <Badge variant={day.required ? "warning" : "neutral"}>
                  {day.required ? "Obiettivo" : "Extra"}
                </Badge>
              )}
            </header>
            <div className="plan-day-body">
              <small>{day.focus}</small>
              <h2>{day.title}</h2>
              <p>{day.reason}</p>
            </div>
            <footer>
              <span><Clock3 size={14} /> {day.minutes} min</span>
              <Button asChild size="sm" variant={day.completed ? "ghost" : "default"}>
                <Link href={day.href}>
                  {day.completed ? "Riapri" : "Inizia"} <ArrowRight size={14} />
                </Link>
              </Button>
            </footer>
          </Card>
        ))}
      </section>
    </AppPage>
  );
}
