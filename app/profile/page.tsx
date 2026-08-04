"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Award,
  BookType,
  BrainCircuit,
  Flame,
  Headphones,
  Languages,
  LockKeyhole,
  Medal,
  RefreshCcw,
  Save,
} from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProgress } from "@/components/providers";
import { profileSchema } from "@/lib/schemas";
import { deriveAchievements, type AchievementIcon } from "@/lib/achievements";
import { deriveLearningProfile } from "@/lib/learning-profile";

type Values = z.infer<typeof profileSchema>;

const achievementIcons = {
  assessment: Award,
  streak: Flame,
  practice: Medal,
  vocabulary: Languages,
  grammar: BookType,
  reading: BrainCircuit,
  listening: Headphones,
  mastery: RefreshCcw,
} satisfies Record<AchievementIcon, typeof Award>;

export default function ProfilePage() {
  const { state, updateProfile, storageMode, hydrated } = useProgress();
  const learningProfile = deriveLearningProfile(state);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Values>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: state.profileName,
      weeklyGoal: state.weeklyGoal,
    },
  });

  useEffect(() => {
    if (!hydrated) return;
    queueMicrotask(() =>
      reset({ name: state.profileName, weeklyGoal: state.weeklyGoal }),
    );
  }, [hydrated, reset, state.profileName, state.weeklyGoal]);

  const modeLabel =
    storageMode === "account"
      ? "Account sincronizzato"
      : storageMode === "demo"
        ? "Modalità demo"
        : "Profilo locale";
  const level = Math.max(1, Math.floor(state.xp / 500) + 1);
  const levelProgress = state.xp % 500;
  const achievements = deriveAchievements(state);
  const unlocked = achievements.filter((achievement) => achievement.unlocked);
  const highlights = unlocked.length
    ? unlocked.slice(-3).reverse()
    : achievements.slice(0, 3);

  return (
    <AppPage>
      <PageHeader
        eyebrow="PROFILO"
        title="Il tuo percorso B2"
        description="Gestisci il nome visualizzato e un obiettivo settimanale realistico."
      />
      <div className="profile-grid">
        <Card className="profile-main">
          <div className="profile-identity">
            <span>{state.profileName.slice(0, 1).toUpperCase()}</span>
            <div>
              <h2>{state.profileName}</h2>
              <p>
                {state.assessmentComplete
                  ? `Studente ${learningProfile.level}`
                  : "Livello da calcolare"} · {modeLabel}
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit((values) =>
              updateProfile({
                profileName: values.name,
                weeklyGoal: values.weeklyGoal,
              }),
            )}
          >
            <label>
              Nome visualizzato
              <Input {...register("name")} />
              {errors.name && <small>{errors.name.message}</small>}
            </label>
            <label>
              Obiettivo settimanale
              <Input
                type="number"
                {...register("weeklyGoal", { valueAsNumber: true })}
              />
              {errors.weeklyGoal && <small>{errors.weeklyGoal.message}</small>}
            </label>
            <Button type="submit">
              <Save size={17} /> Salva modifiche
            </Button>
            {isSubmitSuccessful && <span className="saved-note">Salvato</span>}
          </form>
        </Card>
        <aside>
          <Card className="profile-level">
            <span>LIVELLO {level}</span>
            <strong>{state.xp.toLocaleString("it-IT")} XP</strong>
            <p>{500 - levelProgress} XP al livello successivo</p>
            <div>
              <i style={{ width: `${(levelProgress / 500) * 100}%` }} />
            </div>
          </Card>
          <Card className="badges-card">
            <h2>{unlocked.length} / {achievements.length} traguardi</h2>
            <div>
              {highlights.map((achievement) => {
                const Icon = achievementIcons[achievement.icon];
                return (
                  <span className={achievement.unlocked ? "" : "locked"} key={achievement.id}>
                    {achievement.unlocked ? <Icon /> : <LockKeyhole />}
                    {achievement.title}
                  </span>
                );
              })}
            </div>
          </Card>
        </aside>
      </div>
      <section className="achievements-section">
        <div className="section-heading">
          <div>
            <h2>Tutti i traguardi</h2>
            <p>Obiettivi misurabili, sbloccati soltanto da attività registrate.</p>
          </div>
          <span>{unlocked.length} sbloccati</span>
        </div>
        <div className="achievement-grid">
          {achievements.map((achievement) => {
            const Icon = achievementIcons[achievement.icon];
            const percentage = Math.round(
              (achievement.progress / achievement.target) * 100,
            );
            return (
              <Card
                className={`achievement-card ${achievement.unlocked ? "unlocked" : "locked"}`}
                key={achievement.id}
              >
                <div>{achievement.unlocked ? <Icon /> : <LockKeyhole />}</div>
                <span>{achievement.unlocked ? "SBLOCCATO" : "IN CORSO"}</span>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <footer>
                  <i><b style={{ width: `${Math.min(100, percentage)}%` }} /></i>
                  <small>{achievement.progress} / {achievement.target}</small>
                </footer>
              </Card>
            );
          })}
        </div>
      </section>
    </AppPage>
  );
}
