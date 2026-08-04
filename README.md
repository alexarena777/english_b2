# B2 Trainer

B2 Trainer è un’app web per studenti italiani che preparano un esame di
inglese B2. Il percorso è organizzato in quattro sezioni: vocabolario, verbi e
tempi, reading e listening. I contenuti sono originali e prendono come
riferimento le abilità e i formati oggettivi del Cambridge B2 First.

## Contenuti principali

- Test iniziale da 28 domande nelle quattro aree, senza writing.
- 240 parole ed espressioni B2 e 720 esercizi di vocabolario.
- 16 moduli sui tempi e sulle forme verbali, con 2.048 esercizi in quattro formati.
- 12 reading originali di livello B2 con 72 domande di comprensione.
- 12 listening originali con 60 domande, due ascolti e risposte radio o a
  comparsa.
- Ripasso degli errori e progressi calcolati soltanto da attività realmente
  svolte.

## Requisiti

- Node.js `>=22.13.0`
- npm

## Avvio locale

```bash
npm install
npm run dev
```

In sviluppo, quando le intestazioni di identità OpenAI Sites non sono
disponibili, i progressi vengono salvati localmente sul dispositivo.

## Verifiche

```bash
npm run lint
npm run typecheck
npm test
npm run test:coverage
npm run test:e2e
npm run db:generate
npm run build
```

## Architettura

- Next.js App Router, React e TypeScript.
- Vinext/Vite su Cloudflare Workers e OpenAI Sites.
- Identità gestita da Sign in with ChatGPT; l’app non conserva password.
- Cloudflare D1 per lo snapshot validato dei progressi dell’utente.
- Drizzle come sorgente dello schema e delle migrazioni D1.
- Zod sui confini di storage, API e integrazioni esterne.
- Service worker per shell offline, cache delle pagine visitate e notifiche
  locali.
- `localStorage` soltanto per progressi del dispositivo, preferenze e bozze.

La migrazione D1 viene generata da `db/schema.ts` in `drizzle/`. Il binding
logico `DB` è dichiarato in `.openai/hosting.json`; OpenAI Sites gestisce la
risorsa reale durante la pubblicazione.

## Criteri dei contenuti

Gli esercizi non copiano prove Cambridge. Sono materiali originali costruiti
attorno a competenze tipiche del livello B2: comprensione dell’idea principale,
dettagli e inferenze, lessico in contesto, scelta dei tempi verbali e ascolto di
annunci, conversazioni e interviste. Le soluzioni includono una spiegazione e
gli errori possono essere riproposti nel ripasso.

La sintesi vocale del listening usa una voce inglese disponibile sul
dispositivo. Qualità e disponibilità della voce dipendono dal browser e dal
sistema operativo.
