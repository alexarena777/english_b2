import type { Exercise } from "../types";

const createdAt = "2026-08-04T00:00:00.000Z";

export interface UniversityGrammarTopic {
  slug: string;
  title: string;
  italianTitle: string;
  lesson: string;
  formula: string;
  explanation: string;
  useCases: string[];
  pitfalls: string[];
  examples: string[];
}

export const universityGrammarTopics: UniversityGrammarTopic[] = [
  {
    slug: "future-time-clauses",
    title: "Future time clauses",
    italianTitle: "Frasi temporali al futuro",
    lesson: "Lesson 4–5",
    formula: "when / as soon as / until / before / after + present; main clause + future",
    explanation:
      "Dopo connettivi temporali e nelle if-clauses riferite al futuro si usa normalmente una forma presente, non will. La principale può contenere will, un imperativo o un modale.",
    useCases: ["programmi futuri", "condizioni reali", "sequenze e scadenze"],
    pitfalls: ["Non usare will dopo when o as soon as.", "Unless significa if ... not: evita la doppia negazione."],
    examples: ["I’ll call you as soon as I arrive.", "Unless it rains, we’ll walk to the venue."],
  },
  {
    slug: "reported-speech",
    title: "Reported speech and questions",
    italianTitle: "Discorso indiretto",
    lesson: "Lesson 6",
    formula: "said (that) ... / told + person + ... / asked if, whether, wh- + statement order",
    explanation:
      "Nel discorso indiretto cambiano spesso tempi verbali, pronomi ed espressioni di tempo e luogo. Nelle domande riportate non si usa l’ordine interrogativo e non si inserisce do, does o did.",
    useCases: ["riportare affermazioni", "riferire domande", "ordini e richieste"],
    pitfalls: ["Tell richiede normalmente una persona.", "Nelle reported questions usa l’ordine soggetto-verbo."],
    examples: ["Maya said that she was tired.", "He asked me where I had parked."],
  },
  {
    slug: "passive-forms",
    title: "Passive forms",
    italianTitle: "Forma passiva",
    lesson: "Lesson 7",
    formula: "be in the required tense + past participle (+ by + agent)",
    explanation:
      "La forma passiva mette in primo piano l’azione o il risultato. Il tempo verbale è espresso da be; il verbo principale resta al participio passato.",
    useCases: ["processi", "notizie", "registro formale", "agente ignoto o irrilevante"],
    pitfalls: ["Conserva il tempo della frase attiva.", "Inserisci by solo quando l’agente aggiunge informazione utile."],
    examples: ["The results will be published tomorrow.", "The bridge was damaged during the storm."],
  },
  {
    slug: "causative-and-impersonal-passive",
    title: "Causative and impersonal passive",
    italianTitle: "Causativo e passivo impersonale",
    lesson: "Lesson 7",
    formula: "have/get + object + past participle; It is said that ... / subject + is said to ...",
    explanation:
      "Have/get something done indica che un’altra persona svolge un servizio per noi o che subiamo un evento. Il passivo impersonale riporta opinioni e informazioni in uno stile formale.",
    useCases: ["servizi professionali", "esperienze spiacevoli", "notizie e affermazioni formali"],
    pitfalls: ["L’oggetto va tra have/get e il participio.", "Per un fatto precedente usa to have + participio passato."],
    examples: ["We’re having the roof repaired.", "The painting is believed to have been stolen in 1998."],
  },
  {
    slug: "unreal-conditionals-and-wishes",
    title: "Unreal conditionals and wishes",
    italianTitle: "Condizionali irreali e wish",
    lesson: "Lesson 8",
    formula: "if + past, would + base; if + past perfect, would have + past participle; wish + past form",
    explanation:
      "Il second conditional descrive situazioni presenti o future improbabili; il third conditional immagina un passato diverso. Wish e if only esprimono desideri, rimpianti o cambiamenti desiderati.",
    useCases: ["ipotesi improbabili", "rimpianti", "consigli", "situazioni irritanti"],
    pitfalls: ["Nel third conditional non usare would nella if-clause.", "Wish + would riguarda un cambiamento desiderato, non un semplice rimpianto passato."],
    examples: ["If I were you, I’d apply.", "I wish I had checked the timetable."],
  },
  {
    slug: "verb-patterns",
    title: "Verb patterns",
    italianTitle: "Gerundio, infinito e oggetto",
    lesson: "Lesson 9",
    formula: "verb + -ing / verb + to-infinitive / verb + object + to-infinitive / make-let + object + bare infinitive",
    explanation:
      "Il verbo che precede determina la struttura successiva. Alcuni verbi cambiano significato con gerundio o infinito, quindi la scelta non è soltanto formale.",
    useCases: ["preferenze e abitudini", "intenzioni", "consigli", "permesso e obbligo"],
    pitfalls: ["Enjoy è seguito dal gerundio.", "Make e let vogliono l’infinito senza to nella forma attiva."],
    examples: ["They advised us to book early.", "I remember meeting her at the conference."],
  },
  {
    slug: "indirect-questions",
    title: "Indirect questions",
    italianTitle: "Domande indirette",
    lesson: "Lesson 10",
    formula: "introductory phrase + question word / if / whether + subject + verb",
    explanation:
      "Dopo un’introduzione cortese, la domanda mantiene l’ordine affermativo. Per le domande sì/no si usa if o whether.",
    useCases: ["richieste cortesi", "email formali", "chiedere informazioni"],
    pitfalls: ["Non invertire soggetto e verbo dopo la parola interrogativa.", "Non aggiungere do, does o did nella parte indiretta."],
    examples: ["Could you tell me where the station is?", "Do you know whether the course includes accommodation?"],
  },
  {
    slug: "exam-precision",
    title: "Exam precision",
    italianTitle: "Strutture di precisione B2",
    lesson: "Lesson 1 & 10 review",
    formula: "opinion–size–age–shape–colour–origin–material + noun; so/neither + auxiliary + subject",
    explanation:
      "Il ripasso finale dell’università combina strutture brevi ma frequenti: ordine degli aggettivi, accordo con so/neither, modali di deduzione, nomi non numerabili e had better.",
    useCases: ["accuratezza nel Use of English", "accordo e disaccordo", "deduzioni", "consigli forti"],
    pitfalls: ["Advice e information non prendono il plurale.", "Dopo had better usa la forma base senza to."],
    examples: ["It’s a beautiful old stone bridge.", "I didn’t enjoy it. — Neither did I."],
  },
];

type ExerciseSeed = {
  question: string;
  correct: string;
  distractors: [string, string, string];
  explanation: string;
};

const exerciseSeeds: Record<string, ExerciseSeed[]> = {
  "future-time-clauses": [
    { question: "I’ll send you the file as soon as I ___ the final figures.", correct: "receive", distractors: ["will receive", "received", "would receive"], explanation: "Dopo as soon as con significato futuro si usa il present simple." },
    { question: "Unless the weather ___ worse, the match will go ahead.", correct: "gets", distractors: ["will get", "doesn’t get", "would get"], explanation: "Unless equivale a if ... not e regge qui il present simple." },
    { question: "We won’t leave until everyone ___ ready.", correct: "is", distractors: ["will be", "would be", "was"], explanation: "Until introduce una time clause: il riferimento è futuro, ma la forma è presente." },
    { question: "Take an umbrella in case it ___ later.", correct: "rains", distractors: ["will rain", "would rain", "is raining tomorrow"], explanation: "In case è seguito da una forma presente per una precauzione futura." },
    { question: "If the supplier delivers today, we ___ the orders tomorrow.", correct: "can dispatch", distractors: ["dispatched", "had dispatched", "would have dispatched"], explanation: "Nel first conditional la principale può contenere un modale come can." },
    { question: "After you ___ the form, keep a copy for your records.", correct: "complete", distractors: ["will complete", "would complete", "completed yesterday"], explanation: "After introduce una sequenza futura con il present simple; la principale è un imperativo." },
  ],
  "reported-speech": [
    { question: "‘I can’t attend today,’ Leo said. Leo said that he ___ attend that day.", correct: "couldn’t", distractors: ["can’t", "won’t", "hasn’t"], explanation: "Con un verbo introduttivo al passato, can passa normalmente a could e today a that day." },
    { question: "The tutor ___ us that the deadline had changed.", correct: "told", distractors: ["said", "spoke", "asked to"], explanation: "Tell è seguito dalla persona: told us. Say non prende direttamente l’oggetto personale." },
    { question: "‘Where did you find it?’ She asked me where I ___ it.", correct: "had found", distractors: ["did find", "have found", "would find"], explanation: "La domanda riportata usa ordine affermativo e backshift al past perfect." },
    { question: "‘Don’t touch the switch.’ The engineer warned us ___ the switch.", correct: "not to touch", distractors: ["to not touching", "don’t touch", "not touching"], explanation: "Un ordine negativo riportato usa not + to-infinitive." },
    { question: "‘Are you available on Friday?’ They asked whether I ___ available on Friday.", correct: "was", distractors: ["am I", "did I be", "have been I"], explanation: "Le yes/no questions riportate usano if/whether e ordine soggetto-verbo." },
    { question: "‘I’ll email you tomorrow,’ she said. She promised ___ me the following day.", correct: "to email", distractors: ["emailing", "that emailing", "to emailing"], explanation: "Promise è seguito da to-infinitive quando si riferisce all’azione del soggetto." },
  ],
  "passive-forms": [
    { question: "The new safety rules ___ next month.", correct: "will be introduced", distractors: ["will introduce", "are introducing", "have introduced"], explanation: "Il futuro passivo è will be + participio passato." },
    { question: "The road ___ when the accident happened.", correct: "was being repaired", distractors: ["was repairing", "has repaired", "is repaired yesterday"], explanation: "Un’azione passiva in corso nel passato richiede was/were being + participio." },
    { question: "More than 2,000 applications ___ so far.", correct: "have been received", distractors: ["have received", "were receiving", "are received yesterday"], explanation: "So far richiede il present perfect; nella forma passiva: have been received." },
    { question: "The final decision must ___ by Friday.", correct: "be made", distractors: ["make", "be making", "have make"], explanation: "Dopo un modale, il passivo usa be + participio passato." },
    { question: "The gallery was closed because several paintings ___ by smoke.", correct: "had been damaged", distractors: ["had damaged", "were damaging", "have been damaging"], explanation: "Il danno precede la chiusura: past perfect passive." },
    { question: "Coffee ___ in this region for over a century.", correct: "has been grown", distractors: ["has grown", "is growing by farmers", "was grow"], explanation: "Una situazione iniziata nel passato e ancora vera usa il present perfect passive." },
  ],
  "causative-and-impersonal-passive": [
    { question: "We’re going to ___ before winter.", correct: "have the windows replaced", distractors: ["replace the windows us", "have replaced the windows", "get replace the windows"], explanation: "Il causativo segue l’ordine have + object + past participle." },
    { question: "Marta ___ while she was travelling.", correct: "had her phone stolen", distractors: ["stole her phone", "had stolen her phone", "got steal her phone"], explanation: "Have something done può descrivere un’esperienza spiacevole subita dal soggetto." },
    { question: "The actor ___ to be living abroad.", correct: "is believed", distractors: ["believes", "is believing", "has believe"], explanation: "La struttura formale è subject + passive reporting verb + to-infinitive." },
    { question: "It ___ that the two companies are negotiating a merger.", correct: "is reported", distractors: ["reports", "is reporting by", "has report"], explanation: "La costruzione impersonale è It is reported that ..." },
    { question: "The manuscript is thought ___ during the eighteenth century.", correct: "to have been written", distractors: ["to be writing", "to have wrote", "that it wrote"], explanation: "Per un’azione precedente all’opinione presente si usa perfect infinitive passive." },
    { question: "I need to ___ before the interview.", correct: "get my suit cleaned", distractors: ["clean my suit by someone", "get cleaned my suit", "have clean my suit"], explanation: "Get + object + past participle è una variante più informale del causativo con have." },
  ],
  "unreal-conditionals-and-wishes": [
    { question: "If I ___ more confident, I would apply for the role.", correct: "were", distractors: ["will be", "had been yesterday", "would be"], explanation: "Il second conditional usa il past simple nella if-clause; were è la forma consigliata in stile formale." },
    { question: "If we had checked the map, we ___ the wrong path.", correct: "wouldn’t have taken", distractors: ["wouldn’t take", "hadn’t taken", "won’t have taken"], explanation: "Il third conditional usa would have + participio nella principale." },
    { question: "I wish I ___ so much money on things I don’t need.", correct: "didn’t spend", distractors: ["won’t spend", "wouldn’t have spent yesterday", "don’t spend"], explanation: "Wish + past simple esprime insoddisfazione per una situazione presente abituale." },
    { question: "I wish you ___ interrupting me during meetings.", correct: "would stop", distractors: ["had stopped yesterday", "stop", "will stop"], explanation: "Wish + would esprime il desiderio che il comportamento di un’altra persona cambi." },
    { question: "If only they ___ us about the cancellation earlier.", correct: "had told", distractors: ["would tell", "tell", "have told"], explanation: "If only + past perfect esprime un rimpianto relativo al passato." },
    { question: "If she hadn’t moved abroad, she ___ with us now.", correct: "would still be working", distractors: ["will still work", "would have worked yesterday", "still worked"], explanation: "È un mixed conditional: una causa passata produce un risultato presente." },
  ],
  "verb-patterns": [
    { question: "The guide advised us ___ tickets in advance.", correct: "to book", distractors: ["booking", "book", "to booking"], explanation: "Advise + person è seguito da to-infinitive." },
    { question: "I clearly remember ___ the door before we left.", correct: "locking", distractors: ["to lock later", "lock", "to locking"], explanation: "Remember + -ing riguarda il ricordo di un’azione già compiuta." },
    { question: "Please remember ___ the lights when you leave.", correct: "to switch off", distractors: ["switching off", "switch off to", "to switching off"], explanation: "Remember + to-infinitive significa non dimenticare di compiere un’azione." },
    { question: "The manager made everyone ___ the training again.", correct: "complete", distractors: ["to complete", "completing", "to completing"], explanation: "Make + object è seguito dall’infinito senza to nella forma attiva." },
    { question: "We stopped ___ because the road had become unsafe.", correct: "driving", distractors: ["to drive a different purpose", "drive", "to driving"], explanation: "Stop + -ing significa interrompere l’attività in corso." },
    { question: "The website needs ___ before the campaign starts.", correct: "updating", distractors: ["to updating", "update by", "having update"], explanation: "Need + -ing ha significato passivo: the website needs to be updated." },
  ],
  "indirect-questions": [
    { question: "Could you tell me where the nearest cash machine ___?", correct: "is", distractors: ["is it", "does it be", "it is?"], explanation: "La parte indiretta mantiene l’ordine affermativo: subject + verb." },
    { question: "Do you know what time the lecture ___?", correct: "starts", distractors: ["does start", "starts it", "is start"], explanation: "Dopo what time non si usa l’ausiliare do nella domanda indiretta." },
    { question: "I’d like to know whether the fee ___ accommodation.", correct: "includes", distractors: ["does include it", "include", "is including always"], explanation: "Whether introduce una domanda indiretta sì/no con ordine affermativo." },
    { question: "Can you explain why the meeting ___?", correct: "was cancelled", distractors: ["did cancel", "was it cancelled", "cancelled it"], explanation: "La domanda indiretta richiede ordine soggetto-verbo; qui serve anche il passivo." },
    { question: "Would you mind telling me how long the journey ___?", correct: "takes", distractors: ["does take", "takes it", "is take"], explanation: "How long è seguito da soggetto e verbo, senza inversione." },
    { question: "Do you happen to know if there ___ any places left?", correct: "are", distractors: ["are there", "do have", "is"], explanation: "Con there be in una domanda indiretta si usa if + there + be." },
  ],
  "exam-precision": [
    { question: "They live in a ___ house near the coast.", correct: "beautiful old stone", distractors: ["stone old beautiful", "old beautiful stone", "beautiful stone old"], explanation: "L’ordine normale è opinion + age + material + noun." },
    { question: "‘I haven’t seen the new exhibition.’ ‘___ have I.’", correct: "Neither", distractors: ["So", "Either", "Nor I"], explanation: "Neither + auxiliary + subject esprime accordo con una frase negativa." },
    { question: "The lights are off and nobody is answering. They ___ gone out.", correct: "must have", distractors: ["should", "must", "can’t have"], explanation: "Must have + participio esprime una deduzione forte su un evento passato." },
    { question: "Could you give me some ___ about the application?", correct: "advice", distractors: ["advices", "an advice", "advice informations"], explanation: "Advice è un nome non numerabile: si usa senza -s e senza a/an." },
    { question: "You ___ save a copy before closing the program.", correct: "had better", distractors: ["had better to", "would better", "better to"], explanation: "Had better + forma base esprime un consiglio forte o un avvertimento." },
    { question: "Nora plays the violin, and ___ her brother.", correct: "so does", distractors: ["so is", "neither does", "does so"], explanation: "Per concordare con una frase positiva al present simple si usa so + do/does + subject." },
  ],
};

export const universityGrammarExercises: Exercise[] = universityGrammarTopics.flatMap(
  (topic) =>
    exerciseSeeds[topic.slug].map((seed, index) => {
      const rawOptions = [seed.correct, ...seed.distractors];
      const offset = index % rawOptions.length;
      const options = [...rawOptions.slice(offset), ...rawOptions.slice(0, offset)];
      return {
        id: `university-${topic.slug}-${String(index + 1).padStart(2, "0")}`,
        type: "multiple-choice" as const,
        section: "grammar" as const,
        topic: topic.title,
        difficulty: "b2" as const,
        level: "B2" as const,
        question: seed.question,
        instructions: "Choose the option which best completes the sentence.",
        options: options.map((label, optionIndex) => ({
          id: String(optionIndex),
          label,
        })),
        correctAnswer: seed.correct,
        explanation: seed.explanation,
        grammarRule: topic.formula,
        examples: topic.examples.map((english) => ({ english })),
        tags: ["grammar", "b2", "university-track", topic.slug],
        estimatedTime: 55,
        source: "original" as const,
        createdAt,
      };
    }),
);
