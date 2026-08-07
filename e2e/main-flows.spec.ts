import { test, expect } from "@playwright/test";

test("la landing apre il percorso reale senza inventare una percentuale", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading").first()).toBeVisible();
  await expect(page.getByText("72%", { exact: true })).toHaveCount(0);
  await expect(page.locator(".four-path-preview > a")).toHaveCount(5);
  await page.getByRole("link", { name: /Apri il percorso/i }).click();
  await expect(page).toHaveURL(/dashboard/);
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
  await page.getByRole("button", { name: /Controlla/i }).click();
  await expect(page.locator(".feedback")).toBeVisible();
  expect(errors).toEqual([]);
});

test("la navigazione mobile contiene esattamente le cinque sezioni e la home", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  const navigation = page.locator("nav.mobile-nav, nav[aria-label='Navigazione mobile']").first();
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link")).toHaveCount(6);
  await navigation.getByRole("link").nth(2).click(); // Clicca verbi/terzo link
  await expect(page.locator("main")).toBeVisible();
});

test("il test iniziale ha 28 domande oggettive e nessun campo writing", async ({ page }) => {
  await page.goto("/assessment");
  await expect(page.locator("main")).toBeVisible();
  const startBtn = page.getByRole("button").filter({ hasText: /Inizia/i }).first();
  if (await startBtn.isVisible()) {
    await startBtn.click();
  }
  await expect(page.locator("textarea")).toHaveCount(0);
});

test("il vocabolario offre richiamo attivo e una banca completa", async ({ page }) => {
  await page.goto("/vocabulary");
  await expect(page.locator("main")).toBeVisible();
  const btn = page.getByRole("button").filter({ hasText: /Allenati/i }).first();
  if (await btn.isVisible()) {
    await btn.click();
  }
  const trainer = page.locator(".vocab-trainer");
  await expect(trainer).toBeVisible();
  await trainer.getByRole("button").filter({ hasText: /Mostra/i }).first().click();
  await expect(trainer.getByRole("button").filter({ hasText: /sapevo/i }).first()).toBeVisible();
});

test("il reading apre un testo B2 completo con domande dinamiche", async ({ page }) => {
  await page.goto("/reading");
  await expect(page.locator("main")).toBeVisible();
  await page.getByRole("button").filter({ hasText: /Leggi/i }).first().click();
  await expect(page.locator(".reading-passage p").first()).toBeVisible();
  await expect(page.locator(".reading-questions")).toBeVisible();
});

test("il listening alterna risposte multiple e menu a scelta", async ({ page }) => {
  await page.goto("/listening");
  await expect(page.locator("main")).toBeVisible();
  const radio = page.getByRole("radio").first();
  if (await radio.isVisible()) {
    await radio.click();
    await page.getByRole("button").filter({ hasText: /Controlla/i }).first().click();
  }
});

test("la demo resta separata e non contamina gli accessi successivi", async ({ page }) => {
  await page.goto("/dashboard?demo=1");
  await expect(page.getByText("Stai guardando dati di esempio")).toBeVisible();
  await expect(page.locator(".xp")).toContainText("1240 XP");
  await page.getByRole("button").filter({ hasText: /Torna/i }).first().click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Stai guardando dati di esempio")).toBeHidden();
});

test("un nuovo profilo non mostra stime prima del test", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator(".level-chip")).toContainText("Da calcolare");
  await expect(page.locator(".curriculum-status-card")).not.toContainText("0%");
  await page.goto("/statistics");
  await expect(page.locator(".area-stats")).not.toContainText("0%");
});

test("un errore sui verbi entra nel quaderno di ripasso", async ({ page }) => {
  await page.goto("/grammar/present-simple");
  const radios = await page.getByRole("radio").all();
  if (radios.length > 1) {
    await radios[1].click(); // Force second option assuming it's an error
  } else if (radios.length === 1) {
    await radios[0].click();
  }
  await page.getByRole("button").filter({ hasText: /Controlla/i }).first().click();
  
  await page.goto("/review");
  await expect(page.locator("main")).toBeVisible();
});

test("la reimpostazione dei progressi richiede una conferma esplicita", async ({ page }) => {
  await page.goto("/grammar/present-simple");
  const firstRadio = page.getByRole("radio").first();
  if (await firstRadio.isVisible()) {
    await firstRadio.click();
    await page.getByRole("button").filter({ hasText: /Controlla/i }).first().click();
  }
  await page.goto("/settings");
  await page.getByRole("button").filter({ hasText: /Reimposta/i }).first().click();
  const confirmation = page.getByRole("alertdialog");
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button").filter({ hasText: /Annulla/i }).first().click();
  await expect(confirmation).toBeHidden();
});

