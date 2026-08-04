"use client";

import { useMemo, useState } from "react";
import { FileCheck2, FileText, Puzzle, WandSparkles } from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { Card } from "@/components/ui/card";
import { useOfEnglishExercises } from "@/lib/data";

const topics = [
  { name: "Multiple-choice cloze", description: "Collocazioni, phrasal verbs e significato preciso.", icon: FileCheck2 },
  { name: "Open cloze", description: "Preposizioni, connettivi e strutture in contesto.", icon: Puzzle },
  { name: "Word formation", description: "Prefissi, suffissi e famiglie di parole.", icon: WandSparkles },
  { name: "Key word transformation", description: "Riscrivi senza cambiare il significato.", icon: FileText },
];

export default function UseOfEnglishPage() {
  const [selected, setSelected] = useState(topics[0].name);
  const exercises = useMemo(
    () => useOfEnglishExercises.filter((exercise) => exercise.topic === selected),
    [selected],
  );

  return (
    <AppPage>
      <PageHeader
        eyebrow="USE OF ENGLISH"
        title="Trasforma le regole in precisione."
        description="Esercizi B2 in stile d’esame su open cloze, word formation e key word transformations."
      />
      <div className="use-topic-grid">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.name}
              className={selected === topic.name ? "active" : ""}
              onClick={() => setSelected(topic.name)}
            >
              <Card>
                <Icon />
                <div>
                  <h2>{topic.name}</h2>
                  <p>{topic.description}</p>
                  <small>{useOfEnglishExercises.filter((item) => item.topic === topic.name).length} esercizi</small>
                </div>
              </Card>
            </button>
          );
        })}
      </div>
      <ExerciseRenderer key={selected} exercises={exercises} enableModeSwitch />
    </AppPage>
  );
}
