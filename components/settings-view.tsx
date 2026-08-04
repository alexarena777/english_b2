"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Cloud,
  Clock3,
  LogOut,
  Moon,
  RotateCcw,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { AppPage } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProgress } from "@/components/providers";

export function SettingsView({ signOutPath }: { signOutPath: string }) {
  const {
    state,
    hydrated,
    resetProgress,
    resetDemo,
    storageMode,
    syncStatus,
  } = useProgress();
  const router = useRouter();
  const [reminders, setReminders] = useState(false);
  const [reminderTime, setReminderTime] = useState("19:00");
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);
  const [contrast, setContrast] = useState(false);
  const [online, setOnline] = useState(true);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setReminders(localStorage.getItem("b2-reminders") === "on");
      setReminderTime(localStorage.getItem("b2-reminder-time") ?? "19:00");
      setContrast(localStorage.getItem("b2-contrast") === "high");
      setOnline(navigator.onLine);
    });
    const updateConnection = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  async function toggleReminders() {
    const next = !reminders;
    if (next) {
      if (!("Notification" in window)) {
        setReminderMessage("Questo browser non supporta le notifiche.");
        return;
      }
      const permission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();
      if (permission !== "granted") {
        setReminderMessage("Autorizza le notifiche nel browser per attivare il promemoria.");
        return;
      }
    }
    setReminders(next);
    localStorage.setItem("b2-reminders", next ? "on" : "off");
    setReminderMessage(next ? `Promemoria impostato alle ${reminderTime}.` : null);
  }

  function changeReminderTime(value: string) {
    setReminderTime(value);
    localStorage.setItem("b2-reminder-time", value);
    if (reminders) setReminderMessage(`Promemoria aggiornato alle ${value}.`);
  }

  function toggleContrast() {
    const next = !contrast;
    setContrast(next);
    localStorage.setItem("b2-contrast", next ? "high" : "normal");
    document.documentElement.classList.toggle("high-contrast", next);
  }

  async function reset() {
    setResetting(true);
    setResetError(null);
    try {
      if (storageMode === "demo") {
        resetDemo();
      } else {
        await resetProgress();
      }
      router.replace("/dashboard");
    } catch (error) {
      setResetError(
        error instanceof Error
          ? error.message
          : "La reimpostazione non è riuscita. I dati non sono stati modificati.",
      );
    } finally {
      setResetting(false);
    }
  }

  const syncLabel =
    storageMode === "account"
      ? syncStatus === "error"
        ? "Sincronizzazione da riprovare"
        : syncStatus === "saving"
          ? "Salvataggio in corso"
          : "Account sincronizzato"
      : storageMode === "demo"
        ? "Demo salvata su questo dispositivo"
        : "Progressi salvati su questo dispositivo";
  const completedLabel =
    state.completed === 1
      ? "1 esercizio completato"
      : `${state.completed} esercizi completati`;
  const examLabel =
    state.examAttempts.length === 1
      ? "1 simulazione"
      : `${state.examAttempts.length} simulazioni`;

  return (
    <AppPage>
      <PageHeader
        eyebrow="IMPOSTAZIONI"
        title="Un ambiente di studio su misura."
        description="Preferenze locali e progressi sincronizzati quando accedi con ChatGPT."
      />
      <div className="settings-list">
        <Card>
          <div className="setting-icon">
            <Bell />
          </div>
          <div>
            <h2>Promemoria di studio</h2>
            <p>Una notifica locale quando l’app può essere eseguita sul dispositivo.</p>
            {reminderMessage && <span className="setting-note">{reminderMessage}</span>}
          </div>
          <label className="reminder-time">
            <Clock3 size={15} />
            <Input
              type="time"
              value={reminderTime}
              onChange={(event) => changeReminderTime(event.target.value)}
              aria-label="Ora del promemoria"
            />
          </label>
          <button
            className={`switch ${reminders ? "on" : ""}`}
            onClick={toggleReminders}
            aria-label="Promemoria di studio"
            aria-pressed={reminders}
          >
            <i />
          </button>
        </Card>
        <Card>
          <div className="setting-icon">
            <Wifi />
          </div>
          <div>
            <h2>Supporto offline</h2>
            <p>
              Le pagine già preparate e i progressi locali restano disponibili senza rete;
              la sincronizzazione riprende quando torni online.
            </p>
            <span className="status-chip">{online ? "Online" : "Modalità offline"}</span>
          </div>
        </Card>
        <Card>
          <div className="setting-icon">
            <Moon />
          </div>
          <div>
            <h2>Contrasto elevato</h2>
            <p>Aumenta la differenza tra testo, bordi e sfondo.</p>
          </div>
          <button
            className={`switch ${contrast ? "on" : ""}`}
            onClick={toggleContrast}
            aria-label="Contrasto elevato"
            aria-pressed={contrast}
          >
            <i />
          </button>
        </Card>
        <Card>
          <div className="setting-icon">
            <Cloud />
          </div>
          <div>
            <h2>Sincronizzazione</h2>
            <p>{syncLabel}</p>
            <span className="status-chip">{syncLabel}</span>
          </div>
        </Card>
        <Card>
          <div className="setting-icon">
            <ShieldCheck />
          </div>
          <div>
            <h2>Privacy</h2>
            <p>Nessun microfono o dato di pronuncia viene acquisito.</p>
          </div>
        </Card>
      </div>
      <div className="danger-zone">
        <div className="danger-zone-row">
          <div>
            <h2>Account e dati</h2>
            <p>
              Le azioni che eliminano dati richiedono sempre una conferma separata.
            </p>
          </div>
          <div className="danger-zone-actions">
            {storageMode === "account" ? (
              <Button asChild variant="outline">
                <Link href={signOutPath}>
                  <LogOut size={17} /> Esci
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/login">
                  <LogOut size={17} /> Accedi per sincronizzare
                </Link>
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => {
                setResetError(null);
                setConfirmingReset(true);
              }}
              disabled={!hydrated || resetting}
            >
              <RotateCcw size={17} />
              {storageMode === "demo" ? "Esci dalla demo" : "Reimposta i progressi"}
            </Button>
          </div>
        </div>
        {confirmingReset && (
          <div
            className="reset-confirmation"
            role="alertdialog"
            aria-labelledby="reset-confirmation-title"
            aria-describedby="reset-confirmation-description"
          >
            <AlertTriangle aria-hidden="true" />
            <div>
              <h3 id="reset-confirmation-title">
                {storageMode === "demo"
                  ? "Vuoi uscire dai dati dimostrativi?"
                  : "Confermi la reimpostazione?"}
              </h3>
              <p id="reset-confirmation-description">
                {storageMode === "demo"
                  ? "I progressi reali non verranno modificati: tornerai ai dati del tuo dispositivo."
                  : `Verranno eliminati ${completedLabel}, ${examLabel} e la bozza del test iniziale. Nome, obiettivo settimanale e bozze di writing resteranno invariati.`}
              </p>
              {storageMode !== "demo" && (
                <strong>Questa operazione non può essere annullata.</strong>
              )}
              {resetError && <span role="alert">{resetError}</span>}
            </div>
            <div className="reset-confirmation-actions">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmingReset(false);
                  setResetError(null);
                }}
                disabled={resetting}
              >
                Annulla
              </Button>
              <Button variant="danger" onClick={reset} disabled={resetting}>
                {resetting
                  ? "Operazione in corso…"
                  : storageMode === "demo"
                    ? "Conferma uscita"
                    : "Conferma reimpostazione"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppPage>
  );
}
