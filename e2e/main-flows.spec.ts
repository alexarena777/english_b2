import { test, expect } from "@playwright/test";

test("la landing apre il percorso reale senza inventare una percentuale", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Il B2 si costruisce/i })).toBeVisible();
  await expect(page.getByText("72%", { exact: true })).toHaveCount(0);
  await expect(page.locator(".four-path-preview > a")).toHaveCount(4);
  await page.getByRole("link", { name: "Apri il percorso" }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole("heading", { name: /Quattro sezioni/i })).toBeVisible();
  await expect(page.getByText("Stai guardando dati di esempio")).toBeHidden();
});

test("un esercizio sui verbi mostra feedback dettagliato", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/grammar/present-simple");
  const option = page.getByRole("radio").first();
  await expect(option).toBeEnabled();
  await option.click();
  await expect(option).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: /Controlla/ }).click();
  await expect(page.getByText(/Risposta corretta|Non ancora/)).toBeVisible();
  await expect(page.getByText("Regola da ricordare")).toBeVisible();
  expect(errors).toEqual([]);
});

test("la navigazione mobile contiene esattamente le quattro sezioni e la home", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  const navigation = page.getByRole("navigation", { name: "Navigazione mobile" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link")).toHaveCount(5);
  await navigation.getByRole("link", { name: "Verbi", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Coniuga bene/i })).toBeVisible();
});

test("il test iniziale ha 28 domande oggettive e nessun campo writing", async ({ page }) => {
  await page.goto("/assessment");
  await expect(page.getByRole("heading", { name: "Scopri da dove partire." })).toBeVisible();
  await expect(page.getByText(/28 domande oggettive/)).toBeVisible();
  await page.getByRole("button", { name: /Inizia il test/ }).click();
  await expect(page.getByText("Domanda 1 di 28")).toBeVisible();
  await expect(page.locator("textarea")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Domanda successiva" })).toBeDisabled();
});

test("il vocabolario offre richiamo attivo e una banca completa", async ({ page }) => {
  await page.goto("/vocabulary");
  await expect(page.getByText("240 parole", { exact: true })).toBeVisible();
  await expect(page.getByText("720 esercizi", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Allenati ora" }).click();
  const trainer = page.locator(".vocab-trainer");
  await expect(trainer.getByRole("heading", { name: "deadline" })).toBeVisible();
  await trainer.getByRole("button", { name: "Mostra risposta" }).click();
  await expect(trainer.getByText("scadenza", { exact: true })).toBeVisible();
  await trainer.getByRole("button", { name: "La sapevo" }).click();
  await expect(trainer.getByText("2 / 10", { exact: true })).toBeVisible();
});

test("il reading apre un testo B2 completo con sei domande", async ({ page }) => {
  await page.goto("/reading");
  await expect(page.getByText("12 testi B2", { exact: true })).toBeVisible();
  await expect(page.getByText("72 domande", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Leggi e rispondi" }).first().click();
  await expect(page.getByText(/Leggi il testo completo, poi rispondi a 6 domande/)).toBeVisible();
  expect(await page.locator(".reading-passage p").count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator(".reading-questions")).toContainText("1 / 6");
});

test("il listening alterna risposte multiple e menu a scelta", async ({ page }) => {
  await page.goto("/listening");
  await expect(page.getByText("12 prove audio", { exact: true })).toBeVisible();
  await expect(page.getByText("60 domande", { exact: true })).toBeVisible();
  await page.getByRole("radio").first().click();
  await page.getByRole("button", { name: /Controlla/ }).click();
  await page.getByRole("button", { name: "Continua" }).click();
  await expect(page.getByLabel("Risposta dal menu")).toBeVisible();
});

test("la demo resta separata e non contamina gli accessi successivi", async ({ page }) => {
  await page.goto("/dashboard?demo=1");
  await expect(page.getByText("Stai guardando dati di esempio")).toBeVisible();
  await expect(page.locator(".xp")).toContainText("1240 XP");
  await page.getByRole("button", { name: "Torna ai miei progressi" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Stai guardando dati di esempio")).toBeHidden();
  await expect(page.locator(".xp")).toContainText("0 XP");
  await page.reload();
  await expect(page.locator(".xp")).toContainText("0 XP");
});

test("un nuovo profilo non mostra stime prima del test", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator(".level-chip")).toContainText("Da calcolare");
  await expect(page.locator(".curriculum-status-card")).toContainText("Livello e preparazione da calcolare");
  await expect(page.locator(".curriculum-status-card")).not.toContainText("0%");
  await page.goto("/statistics");
  await expect(page.locator(".stats-metrics").locator(".card").nth(3)).toContainText("Da calcolare");
  await expect(page.locator(".area-stats")).not.toContainText("0%");
});

test("un errore sui verbi entra nel quaderno di ripasso", async ({ page }) => {
  await page.goto("/grammar/present-simple");
  await page.getByRole("radio", { name: /am working/i }).click();
  await page.getByRole("button", { name: /Controlla/ }).click();
  await expect(page.getByText("Non ancora")).toBeVisible();
  await page.goto("/review");
  await expect(page.getByRole("heading", { name: "Ogni errore ha il suo momento." })).toBeVisible();
  await page.getByRole("button", { name: /Programmati/ }).click();
  await expect(page.getByRole("heading", { name: "Present simple" })).toBeVisible();
});

test("la reimpostazione dei progressi richiede una conferma esplicita", async ({ page }) => {
  await page.goto("/grammar/present-simple");
  await page.getByRole("radio").first().click();
  await page.getByRole("button", { name: /Controlla/ }).click();
  await page.goto("/settings");
  await page.getByRole("button", { name: "Reimposta i progressi" }).click();
  const confirmation = page.getByRole("alertdialog");
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toContainText("1 esercizio completato");
  await confirmation.getByRole("button", { name: "Annulla" }).click();
  await expect(confirmation).toBeHidden();
  await page.getByRole("button", { name: "Reimposta i progressi" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Conferma reimpostazione" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator(".xp")).toContainText("0 XP");
  await expect(page.locator(".level-chip")).toContainText("Da calcolare");
});
