"use client";

import { useEffect } from "react";
import { todayKey } from "@/lib/utils";

export function PwaManager({ lastStudyDate }: { lastStudyDate?: string }) {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      return;
    }
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        const worker = registration.active ?? registration.waiting ?? registration.installing;
        worker?.postMessage({ type: "CACHE_APP" });
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    async function checkReminder() {
      if (
        localStorage.getItem("b2-reminders") !== "on" ||
        !("Notification" in window) ||
        Notification.permission !== "granted" ||
        lastStudyDate === todayKey()
      ) {
        return;
      }

      const now = new Date();
      const reminderTime = localStorage.getItem("b2-reminder-time") ?? "19:00";
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const today = todayKey();
      if (
        currentTime !== reminderTime ||
        localStorage.getItem("b2-reminder-last") === today
      ) {
        return;
      }

      localStorage.setItem("b2-reminder-last", today);
      const registration = await navigator.serviceWorker?.getRegistration();
      if (registration) {
        await registration.showNotification("È il momento del tuo B2", {
          body: "Una sessione breve mantiene attivo il percorso di oggi.",
          icon: "/favicon.svg",
          badge: "/favicon.svg",
          tag: "b2-daily-reminder",
          data: { url: "/daily" },
        });
      } else {
        new Notification("È il momento del tuo B2", {
          body: "Una sessione breve mantiene attivo il percorso di oggi.",
          icon: "/favicon.svg",
          tag: "b2-daily-reminder",
        });
      }
    }

    void checkReminder();
    const timer = window.setInterval(() => void checkReminder(), 60_000);
    return () => clearInterval(timer);
  }, [lastStudyDate]);

  return null;
}
