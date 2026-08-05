"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Headphones,
  Trophy,
} from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useProgress } from "@/components/providers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const exams = [
  {
    id: "short-1",
    title: "Simulazione breve",
    duration: "35 min",
    questions: 20,
    sections: 5,
    description: "Un controllo rapido su grammatica, lessico, Use of English, reading e listening.",
  },
  {
    id: "full-1",
    title: "Simulazione estesa",
    duration: "105 min",
    questions: 48,
    sections: 5,
    description: "Una prova completa con navigazione libera e report dettagliato per area.",
  },
  {
    id: "uni-1",
    title: "Simulazione Universitaria",
    duration: "45 min",
    questions: 30,
    sections: 1,
    description: "Test Grammar Quiz Ufficiale B2 (30 domande a risposta multipla).",
  },
];

export default function ExamPage() {
  const { state } = useProgress();
  const attempts = [...state.examAttempts].reverse();
  const completed = attempts.filter((attempt) => attempt.status === "completed");
  const average = completed.length
    ? Math.round(completed.reduce((sum, attempt) => sum + attempt.score, 0) / completed.length)
    : 0;
  const best = completed.length ? Math.max(...completed.map((attempt) => attempt.score)) : 0;

  return (
    <AppPage>
      <PageHeader
        eyebrow="SIMULAZIONI"
        title="Misura la preparazione in condizioni realistiche."
        description="Timer, navigazione tra le domande, correzione finale, report per sezione e storico sincronizzato."
      />
      <div className="exam-history">
        <div><span>PROVE CONCLUSE</span><strong>{completed.length}</strong><small>nello storico corrente</small></div>
        <div><span>MEDIA</span><strong>{average}%</strong><small>sulle prove concluse</small></div>
        <div><span>MIGLIOR RISULTATO</span><strong>{best}%</strong><small>{best >= 78 ? "soglia B2 raggiunta" : "obiettivo: 78%"}</small></div>
      </div>
      <div className="exam-grid">
        {exams.map((exam, index) => (
          <Card className={`exam-card ${exam.id === "full-1" ? "featured" : ""}`} key={exam.id}>
            {exam.id === "full-1" && <Badge variant="success">PROVA ESTESA</Badge>}
            {exam.id === "uni-1" && <Badge variant="neutral">UFFICIALE</Badge>}
            <span className="exam-icon">{exam.id === "full-1" ? <FileText /> : <Clock3 />}</span>
            <h2>{exam.title}</h2>
            <p>{exam.description}</p>
            <div className="exam-details">
              <span><Clock3 /> {exam.duration}</span>
              <span><CheckCircle2 /> {exam.questions} domande</span>
              <span><Headphones /> {exam.sections} sezioni</span>
            </div>
            <Button asChild variant={exam.id === "full-1" ? "default" : "outline"}>
              <Link href={`/exam/${exam.id}`}>Vedi istruzioni <ArrowRight size={17} /></Link>
            </Button>
          </Card>
        ))}
      </div>

      <section className="past-exams">
        <div className="section-heading">
          <div><h2>Storico simulazioni</h2><p>Ultimi tentativi salvati nel profilo</p></div>
          <span>{attempts.length} tentativi</span>
        </div>
        {attempts.length ? attempts.slice(0, 10).map((attempt) => (
          <div key={attempt.id}>
            <span>{new Date(attempt.completedAt).toLocaleDateString("it-IT")}</span>
            <b>{attempt.title}</b>
            <span>{attempt.score}%</span>
            <span>{attempt.correctCount}/{attempt.questionCount}</span>
            <Badge variant={attempt.status === "completed" ? "success" : "warning"}>
              {attempt.status === "completed" ? "Conclusa" : "Scaduta"}
            </Badge>
          </div>
        )) : (
          <div className="empty-inline"><Trophy /><p>Completa una simulazione per creare il primo report.</p></div>
        )}
      </section>
    </AppPage>
  );
}
