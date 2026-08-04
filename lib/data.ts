import type { Exercise, ListeningActivity, ReadingPassage, VocabularyItem, WritingPrompt } from "./types";
import { verbTenseExercises, verbTenseTopics } from "./curriculum/verbs";
import {
  b2VocabularyExercises,
  b2VocabularyItems,
} from "./curriculum/vocabulary";
import { b2ReadingPassages } from "./curriculum/reading";
import { b2ListeningActivities } from "./curriculum/listening";
import { universityGrammarExercises } from "./curriculum/university";

const createdAt = "2026-07-01T00:00:00.000Z";
type Seed = [string, string, string, string, string, string, string];
const grammarSeeds: Seed[] = [
  ["Present tenses", "I usually ___ from home, but this week I’m at the office.", "work", "am working", "worked", "Per un’abitudine si usa il present simple; “this week” introduce invece una situazione temporanea nella seconda parte.", "Present simple per abitudini e fatti stabili; present continuous per situazioni temporanee."],
  ["Present tenses", "Please be quiet. I ___ to an important client.", "am talking", "talk", "have talked", "L’azione è in corso nel momento in cui si parla, quindi serve il present continuous.", "Be + verbo in -ing descrive un’azione in corso ora."],
  ["Past tenses", "While I ___ dinner, the lights went out.", "was making", "made", "have made", "L’azione lunga in corso fa da sfondo a un evento breve al past simple.", "Past continuous per lo sfondo; past simple per l’evento che interrompe."],
  ["Past tenses", "We ___ the museum before it closed for renovation.", "visited", "were visiting", "have visited", "Si parla di un evento concluso in un momento passato definito.", "Past simple per azioni concluse in un tempo passato finito."],
  ["Present perfect", "She ___ three reports so far today.", "has written", "wrote", "writes", "“So far today” indica un periodo non ancora concluso con risultato presente.", "Present perfect per esperienze o risultati in periodi ancora aperti."],
  ["Present perfect", "I ___ him since we were at university.", "have known", "know", "am knowing", "Con “since” e un verbo di stato si usa il present perfect simple.", "Since introduce il momento iniziale di una situazione che continua nel presente."],
  ["Present perfect continuous", "They ___ for over an hour, so they need a break.", "have been driving", "are driving", "drove", "L’enfasi è sulla durata di un’attività iniziata nel passato e ancora rilevante.", "Have/has been + -ing enfatizza durata e continuità."],
  ["Present perfect continuous", "How long ___ English?", "have you been studying", "do you study", "did you study", "La domanda chiede la durata fino al presente di un’attività ripetuta.", "How long + present perfect continuous per attività ancora in corso."],
  ["Past perfect", "By the time we arrived, the film ___.", "had already started", "already started", "has already started", "L’inizio del film è precedente a un altro evento passato.", "Past perfect per chiarire quale di due azioni passate è avvenuta prima."],
  ["Past perfect", "She was nervous because she ___ abroad before.", "had never travelled", "never travelled", "has never travelled", "L’esperienza mai avvenuta precede il momento passato in cui era nervosa.", "Had + participio per esperienze anteriori a un riferimento passato."],
  ["Future forms", "Look at those clouds! It ___.", "is going to rain", "will rain", "rains", "La previsione è basata su un’evidenza visibile nel presente.", "Be going to per previsioni fondate su evidenze presenti."],
  ["Future forms", "This time tomorrow, we ___ over the Atlantic.", "will be flying", "will fly", "are flown", "Si immagina un’azione in corso in un preciso momento futuro.", "Future continuous: will be + -ing."],
  ["Zero conditional", "If you heat ice, it ___.", "melts", "will melt", "would melt", "È una verità generale, quindi entrambe le proposizioni usano il present simple.", "Zero conditional: if + present simple, present simple."],
  ["First conditional", "If the weather improves, we ___ for a walk.", "will go", "would go", "went", "È una possibilità reale nel futuro.", "First conditional: if + present simple, will + verbo base."],
  ["Second conditional", "If I ___ more confident, I would apply for that job.", "were", "am", "will be", "La situazione è ipotetica nel presente; “were” è la forma standard con tutte le persone.", "Second conditional: if + past simple, would + verbo base."],
  ["Third conditional", "If they had left earlier, they ___ the train.", "would have caught", "would catch", "caught", "Si immagina un risultato diverso per una condizione passata non realizzata.", "Third conditional: if + past perfect, would have + participio."],
  ["Mixed conditionals", "If I had accepted the offer, I ___ in Berlin now.", "would be living", "would have lived", "will live", "La condizione è passata, ma il risultato immaginato riguarda il presente.", "Mixed conditional: if + past perfect, would + verbo per un risultato presente."],
  ["Passive voice", "The new library ___ next spring.", "will be opened", "will open by them", "is opening by", "L’attenzione è sull’edificio, non su chi lo inaugura.", "Passivo futuro: will be + participio passato."],
  ["Passive voice", "My bike ___ while I was shopping.", "was stolen", "stole", "has stolen", "La bici subisce l’azione e l’evento è concluso nel passato.", "Passivo al past simple: was/were + participio."],
  ["Reported speech", "‘I can help you,’ Marta said. Marta said that she ___ help me.", "could", "can", "will", "Nel discorso indiretto “can” arretra normalmente a “could”.", "Nel reported speech i modali e i tempi spesso fanno backshift."],
  ["Reported speech", "He asked me where I ___.", "lived", "did I live", "do I live", "La domanda indiretta usa l’ordine affermativo, senza ausiliare interrogativo.", "Question word + soggetto + verbo nelle domande indirette."],
  ["Modal verbs", "You ___ have told me; I already knew.", "needn’t", "mustn’t", "couldn’t", "“Needn’t have” indica che un’azione svolta non era necessaria.", "Needn’t have + participio: azione compiuta ma non necessaria."],
  ["Modal verbs", "That ___ be Carla; she’s in Madrid this week.", "can’t", "mustn’t", "shouldn’t", "L’informazione rende la deduzione negativa praticamente certa.", "Can’t + verbo base esprime una deduzione negativa forte."],
  ["Relative clauses", "The colleague ___ desk is next to mine is from Dublin.", "whose", "who", "which", "“Whose” esprime possesso: la scrivania appartiene al collega.", "Whose sostituisce un possessivo nelle relative."],
  ["Relative clauses", "The café, ___ opened last year, is always busy.", "which", "that", "where", "La virgola introduce una relativa non definente; in questo caso non si usa “that”.", "Nelle non-defining relative clauses si usano who/which, non that."],
  ["Comparatives", "The task was far ___ than we had expected.", "more demanding", "most demanding", "demandinger", "Gli aggettivi lunghi formano il comparativo con “more”; “far” lo intensifica.", "Far/much/a lot possono intensificare un comparativo."],
  ["Comparatives", "It’s ___ interesting book I’ve read this year.", "the most", "the more", "most", "Si confronta un elemento con tutti gli altri del gruppo, quindi serve il superlativo.", "Superlativo: the most + aggettivo lungo."],
  ["Gerund and infinitive", "I regret ___ you that your application was unsuccessful.", "to inform", "informing", "inform", "“Regret to inform” introduce formalmente una cattiva notizia presente.", "Regret + to-infinitive per ciò che si sta per dire; regret + -ing per un’azione passata."],
  ["Gerund and infinitive", "She avoided ___ a direct answer.", "giving", "to give", "give", "“Avoid” è seguito dal gerundio.", "Avoid, consider, suggest e mind reggono la forma in -ing."],
  ["Articles", "She was appointed ___ head of the department.", "—", "the", "a", "Dopo “appoint/elect” + carica unica non si usa normalmente l’articolo.", "Niente articolo con titoli e cariche dopo appoint, elect o become."],
  ["Articles", "We had ___ lunch near the station.", "—", "a", "the", "I nomi dei pasti si usano normalmente senza articolo.", "Breakfast, lunch e dinner non prendono l’articolo quando indicano il pasto in generale."],
  ["Countable nouns", "We don’t have ___ information about the delay.", "much", "many", "a few", "“Information” è un nome non numerabile.", "Much con nomi uncountable; many con nomi countable plurali."],
  ["Quantifiers", "Only ___ students completed the optional task.", "a few", "a little", "much", "“Students” è numerabile plurale; “a few” indica un piccolo numero ma con valore positivo.", "A few + plurale numerabile; a little + non numerabile."],
  ["Prepositions", "She is responsible ___ training new staff.", "for", "of", "to", "L’aggettivo “responsible” regge la preposizione “for”.", "Responsible for + nome o gerundio."],
  ["Prepositions", "The course focuses ___ practical communication.", "on", "in", "at", "Il verbo “focus” regge “on”.", "Focus on something; concentrate on something."],
  ["Phrasal verbs", "We had to ___ the meeting until Friday.", "put off", "put up", "put out", "“Put off” significa rimandare.", "Put off = postpone; è separabile con un oggetto pronominale."],
  ["Phrasal verbs", "I ___ an old friend at the conference.", "ran into", "ran out", "ran over", "“Run into someone” significa incontrare qualcuno per caso.", "Run into = meet unexpectedly."],
  ["Question forms", "How long ___ you known each other?", "have", "do", "are", "Il participio “known” richiede l’ausiliare del present perfect.", "Present perfect question: have/has + soggetto + participio."],
  ["Question forms", "Who ___ you that the office was closed?", "told", "did tell", "has telling", "“Who” è il soggetto della domanda, quindi non si usa “did”.", "Nelle subject questions non si usa do/does/did."],
  ["Wish and if only", "I wish I ___ so much work to do tonight.", "didn’t have", "don’t have", "wouldn’t have had", "Il desiderio riguarda una situazione presente diversa dalla realtà.", "Wish + past simple per desideri sul presente."],
  ["Wish and if only", "If only we ___ the map before leaving!", "had checked", "checked", "would check", "Si esprime rimpianto per un’azione passata non compiuta.", "If only + past perfect per rimpianti sul passato."],
  ["Used to", "I ___ commuting now, but it was difficult at first.", "am used to", "used to", "get used", "“Be used to” indica essere abituati; è seguito da nome o gerundio.", "Be used to + nome/-ing descrive una situazione ormai familiare."],
  ["Used to", "It took me months to ___ working at night.", "get used to", "be used", "used to", "“Get used to” descrive il processo di abituarsi.", "Get used to + nome/-ing = diventare abituati."],
  ["Causative form", "I’m going to ___ at the weekend.", "have my laptop repaired", "repair my laptop by", "have repaired my laptop", "Il causativo indica che un’altra persona eseguirà il lavoro.", "Have + oggetto + participio passato."],
  ["Linkers", "The job is demanding; ___, it offers excellent career prospects.", "however", "because", "therefore", "Le due idee sono in contrasto.", "However introduce contrasto ed è separato da virgola."],
  ["Linkers", "The flight was cancelled ___ the heavy snow.", "because of", "although", "despite of", "“Because of” è seguito da un gruppo nominale.", "Because of + nome; because + proposizione."],
  ["Word formation", "Her explanation was clear and very ___. (HELP)", "helpful", "helply", "helpness", "Serve un aggettivo dopo “very”; il suffisso corretto è -ful.", "Il suffisso -ful forma aggettivi con il significato di ‘pieno di/che offre’."],
  ["Word formation", "The plan is financially ___. (SUSTAIN)", "sustainable", "sustainment", "sustainably", "Dopo “is financially” serve un aggettivo.", "-able forma aggettivi che indicano possibilità o capacità."],
  ["Common B2 mistakes", "I’ve lived here ___ five years.", "for", "since", "from", "“Five years” è una durata, quindi si usa “for”.", "For + periodo; since + punto iniziale."],
  ["Common B2 mistakes", "I’m looking forward to ___ from you.", "hearing", "hear", "have heard", "In questa espressione “to” è una preposizione, quindi è seguito dal gerundio.", "Look forward to + nome o verbo in -ing."]
];

function grammarExercise(seed: Seed, index: number): Exercise {
  const [topic, question, correct, wrong1, wrong2, explanation, grammarRule] = seed;
  const labels = [correct, wrong1, wrong2].sort((a, b) => `${index}-${a}`.localeCompare(`${index}-${b}`));
  return { id: `g-${String(index + 1).padStart(2, "0")}`, type: "multiple-choice", section: "grammar", topic, difficulty: index < 12 ? "easy" : index < 34 ? "medium" : "b2", level: index < 12 ? "B1" : index < 34 ? "B1+" : "B2", question, instructions: "Scegli l’opzione corretta.", options: labels.map((label, optionIndex) => ({ id: String(optionIndex), label })), correctAnswer: correct, explanation, grammarRule, examples: [{ english: question.replace("___", correct) }], tags: [topic.toLowerCase().replaceAll(" ", "-")], estimatedTime: 45, source: "original", createdAt };
}
const legacyGrammarExercises = grammarSeeds.map(grammarExercise);

const vocabularySeeds = [
  ["deadline", "scadenza", "the latest time by which something must be completed", "We need to meet the deadline on Friday.", "time limit", "work"],
  ["workload", "carico di lavoro", "the amount of work a person has to do", "My workload increases at the end of the month.", "burden", "work"],
  ["tuition fees", "tasse universitarie", "money paid for teaching at a university", "Tuition fees vary between institutions.", "course fees", "education"],
  ["compulsory", "obbligatorio", "required by a rule or law", "Attendance is compulsory for first-year students.", "mandatory", "education"],
  ["layover", "scalo", "a period spent waiting between parts of a journey", "We had a three-hour layover in Frankfurt.", "stopover", "travel"],
  ["off the beaten track", "fuori dai percorsi turistici", "far from places that many people visit", "The village is well off the beaten track.", "remote", "travel"],
  ["user-friendly", "facile da usare", "easy for people to understand and use", "The new platform is remarkably user-friendly.", "intuitive", "technology"],
  ["data breach", "violazione di dati", "an incident in which private information is accessed", "The company reported a serious data breach.", "security incident", "technology"],
  ["renewable", "rinnovabile", "able to be replaced naturally", "The region invests heavily in renewable energy.", "sustainable", "environment"],
  ["carbon footprint", "impronta di carbonio", "the greenhouse gases caused by a person or activity", "Cycling reduces your carbon footprint.", "emissions impact", "environment"],
  ["well-being", "benessere", "the state of feeling healthy and comfortable", "Regular breaks improve employees’ well-being.", "welfare", "health"],
  ["recover", "riprendersi", "to become healthy or strong again", "It took her several weeks to recover.", "get better", "health"],
  ["inequality", "disuguaglianza", "an unfair difference between groups", "The policy aims to reduce social inequality.", "disparity", "society"],
  ["household", "nucleo familiare", "all the people living together in one home", "Energy costs affect every household.", "family unit", "society"],
  ["supportive", "solidale", "giving encouragement or emotional help", "My colleagues were extremely supportive.", "encouraging", "relationships"],
  ["fall out", "litigare", "to argue and stop being friendly", "They fell out over a minor misunderstanding.", "quarrel", "relationships"],
  ["affordable", "accessibile economicamente", "not too expensive", "The city needs more affordable housing.", "reasonably priced", "economy"],
  ["shortage", "carenza", "a situation in which there is not enough of something", "There is a shortage of skilled workers.", "lack", "economy"],
  ["landmark", "luogo emblematico", "a building or place that is easy to recognise", "The cathedral is the city’s best-known landmark.", "monument", "tourism"],
  ["peak season", "alta stagione", "the time of year with the most tourists", "Prices rise sharply during peak season.", "high season", "tourism"],
  ["bias", "pregiudizio", "an unfair preference that influences judgement", "Readers should be aware of possible media bias.", "prejudice", "media"],
  ["headline", "titolo di giornale", "the title of a news story", "The headline did not reflect the full story.", "heading", "media"],
  ["draw", "pareggio", "a game that ends with equal scores", "The match ended in a goalless draw.", "tie", "sport"],
  ["stamina", "resistenza", "the strength to continue physical effort", "Long-distance running requires stamina.", "endurance", "sport"],
  ["leftovers", "avanzi", "food that remains after a meal", "We used the leftovers for lunch.", "remaining food", "food"],
  ["nutritious", "nutriente", "containing substances needed for health", "Lentils are cheap and nutritious.", "nourishing", "food"],
  ["spacious", "spazioso", "having a lot of room", "The flat is bright and surprisingly spacious.", "roomy", "home"],
  ["tenant", "inquilino", "a person who pays to live in a property", "The tenant reported the broken heating.", "renter", "home"],
  ["overwhelmed", "sopraffatto", "feeling unable to deal with too many things", "She felt overwhelmed by the amount of work.", "overloaded", "emotions"],
  ["relieved", "sollevato", "happy because something unpleasant has ended", "I was relieved to hear the good news.", "reassured", "emotions"],
  ["witness", "testimone", "a person who sees an event or crime", "Police appealed to witnesses for information.", "observer", "crime"],
  ["evidence", "prova", "facts that show whether something is true", "There was not enough evidence to charge him.", "proof", "crime"],
  ["heritage", "patrimonio", "traditions and culture passed through generations", "The festival celebrates the region’s heritage.", "legacy", "culture"],
  ["thought-provoking", "stimolante", "making people think seriously about a subject", "It was a thought-provoking documentary.", "stimulating", "culture"],
  ["policy", "politica/linea d’azione", "an official plan used by an organisation or government", "The government announced a new housing policy.", "strategy", "politics"],
  ["turnout", "affluenza", "the number of people who vote in an election", "Voter turnout reached a ten-year high.", "participation", "politics"],
  ["breakthrough", "svolta scientifica", "an important discovery or development", "The treatment represents a major breakthrough.", "advance", "science"],
  ["reliable", "affidabile", "able to be trusted or depended on", "Researchers need reliable data.", "dependable", "science"],
  ["eventually", "alla fine", "after a long time or series of events", "The team eventually found a solution.", "in the end", "false friends"],
  ["sensible", "ragionevole", "showing good judgement", "Taking the earlier train is the sensible choice.", "reasonable", "false friends"]
] as const;

const legacyVocabularyItems: VocabularyItem[] = vocabularySeeds.map(([term, translation, definition, example, synonym, category], index) => ({ id: `v-${String(index + 1).padStart(2, "0")}`, term, translation, definition, example, synonym, category, difficulty: index < 12 ? "B1" : "B2" }));
const legacyVocabularyExercises: Exercise[] = legacyVocabularyItems.map((item, index) => { const distractors = legacyVocabularyItems.filter((_, i) => i !== index).slice((index + 5) % 30, (index + 5) % 30 + 2).map((v) => v.translation); const labels = [item.translation, ...distractors]; return { id: `vx-${String(index + 1).padStart(2, "0")}`, type: "multiple-choice", section: "vocabulary", topic: item.category, difficulty: index < 12 ? "easy" : "b2", level: index < 12 ? "B1" : "B2", question: `What does “${item.term}” mean?`, instructions: "Scegli la traduzione più precisa.", options: labels.map((label, i) => ({ id: `${i}`, label })), correctAnswer: item.translation, explanation: `“${item.term}” significa “${item.translation}”. In inglese semplice: ${item.definition}.`, examples: [{ english: item.example }], tags: [item.category, index >= 38 ? "false-friends" : "vocabulary"], estimatedTime: 35, source: "original", createdAt }; });

type UseOfEnglishSeed = {
  type: "multiple-choice" | "fill-gap" | "transformation" | "word-formation";
  topic: string;
  question: string;
  answer: string;
  options?: string[];
  accepted?: string[];
  explanation: string;
  contextTitle?: string;
  context?: string;
};

const eveningCourseCloze =
  "When Westbridge College decided to redesign its evening programme, staff first asked what would meet the (1) ___ of adult learners. They surveyed former students to gain an (2) ___ into why many had left early. The team had to bear (3) ___ mind that most learners also had full-time jobs. After several meetings, they came (4) ___ with a more flexible timetable. The course description was kept brief and straight (5) ___ the point. Although a funding decision was delayed, the team carried (6) ___ working on the materials. They knew there was little (7) ___ in advertising the course until the dates were certain. The new timetable will take (8) ___ in September.";

const commutingCloze =
  "Many learners believe (1) ___ useful study requires a long, quiet period at a desk. Yet a short journey can be more productive (2) ___ an unfocused hour at home. One reason (3) ___ this works is that the available time has a clear limit. Instead (4) ___ trying to cover an entire topic, commuters can choose one small task. If they decide (5) ___ to do before leaving home, they are less likely to waste time choosing. By the time they reach their destination, they may (6) ___ reviewed ten expressions. This method works not only for vocabulary (7) ___ also for listening, as (8) ___ as headphones are safe to use.";

const repairWorkshopCloze =
  "Community repair workshops have grown in (1) ___ (POPULAR) as consumers become more concerned about waste. Many household items are thrown away (2) ___ (NECESSARY) because their owners lack the (3) ___ (CONFIDENT) to investigate a minor fault. Some people also feel (4) ___ (ABLE) to identify which part has failed. At a workshop, experienced volunteers offer (5) ___ (PRACTICE) advice and show visitors how to use basic tools. Any equipment provided must be safe and (6) ___ (RELY), while the venue should be (7) ___ (ACCESS) to people with limited mobility. Organisers hope that these projects will lead to a significant (8) ___ (REDUCE) in local waste.";

const useOfEnglishSeeds: UseOfEnglishSeed[] = [
  { type: "multiple-choice", topic: "Multiple-choice cloze", question: "Gap 1: meet the ___ of adult learners", answer: "needs", options: ["needs", "demands", "uses", "claims"], explanation: "Meet the needs è la collocazione naturale per esprimere l'idea di soddisfare le necessità.", contextTitle: "A new evening course", context: eveningCourseCloze },
  { type: "multiple-choice", topic: "Multiple-choice cloze", question: "Gap 2: gain an ___ into why many had left", answer: "insight", options: ["insight", "outlook", "image", "appearance"], explanation: "Gain an insight into significa ottenere una comprensione più profonda di qualcosa.", contextTitle: "A new evening course", context: eveningCourseCloze },
  { type: "multiple-choice", topic: "Multiple-choice cloze", question: "Gap 3: bear ___ mind that most learners had jobs", answer: "in", options: ["at", "by", "in", "on"], explanation: "L'espressione fissa è bear in mind: tenere presente.", contextTitle: "A new evening course", context: eveningCourseCloze },
  { type: "multiple-choice", topic: "Multiple-choice cloze", question: "Gap 4: came ___ with a more flexible timetable", answer: "up", options: ["up", "out", "across", "forward"], explanation: "Come up with significa proporre o ideare una soluzione.", contextTitle: "A new evening course", context: eveningCourseCloze },
  { type: "multiple-choice", topic: "Multiple-choice cloze", question: "Gap 5: straight ___ the point", answer: "to", options: ["at", "for", "on", "to"], explanation: "Straight to the point descrive un messaggio diretto e privo di dettagli superflui.", contextTitle: "A new evening course", context: eveningCourseCloze },
  { type: "multiple-choice", topic: "Multiple-choice cloze", question: "Gap 6: carried ___ working on the materials", answer: "on", options: ["away", "on", "over", "through"], explanation: "Carry on + -ing significa continuare a fare qualcosa.", contextTitle: "A new evening course", context: eveningCourseCloze },
  { type: "multiple-choice", topic: "Multiple-choice cloze", question: "Gap 7: there was little ___ in advertising early", answer: "point", options: ["aim", "point", "reason", "target"], explanation: "There is little point in + -ing indica che un'azione sarebbe poco utile.", contextTitle: "A new evening course", context: eveningCourseCloze },
  { type: "multiple-choice", topic: "Multiple-choice cloze", question: "Gap 8: the timetable will take ___ in September", answer: "effect", options: ["action", "effect", "place", "result"], explanation: "Take effect significa entrare in vigore o cominciare a produrre un effetto.", contextTitle: "A new evening course", context: eveningCourseCloze },
  { type: "fill-gap", topic: "Open cloze", question: "Gap 1: believe ___ useful study requires a long period", answer: "that", explanation: "That introduce la proposizione che esprime ciò che molti studenti credono.", contextTitle: "Studying on the move", context: commutingCloze },
  { type: "fill-gap", topic: "Open cloze", question: "Gap 2: more productive ___ an unfocused hour", answer: "than", explanation: "Il comparativo more productive è seguito da than.", contextTitle: "Studying on the move", context: commutingCloze },
  { type: "fill-gap", topic: "Open cloze", question: "Gap 3: one reason ___ this works", answer: "why", explanation: "Reason è naturalmente seguito da why quando introduce una spiegazione.", contextTitle: "Studying on the move", context: commutingCloze },
  { type: "fill-gap", topic: "Open cloze", question: "Gap 4: instead ___ trying to cover an entire topic", answer: "of", explanation: "La struttura corretta è instead of + forma in -ing.", contextTitle: "Studying on the move", context: commutingCloze },
  { type: "fill-gap", topic: "Open cloze", question: "Gap 5: decide ___ to do before leaving home", answer: "what", explanation: "What introduce l'oggetto da scegliere nella struttura decide what to do.", contextTitle: "Studying on the move", context: commutingCloze },
  { type: "fill-gap", topic: "Open cloze", question: "Gap 6: may ___ reviewed ten expressions", answer: "have", explanation: "May have + participio descrive un possibile risultato già completato entro quel momento.", contextTitle: "Studying on the move", context: commutingCloze },
  { type: "fill-gap", topic: "Open cloze", question: "Gap 7: not only for vocabulary ___ also for listening", answer: "but", explanation: "La correlazione completa è not only ... but also.", contextTitle: "Studying on the move", context: commutingCloze },
  { type: "fill-gap", topic: "Open cloze", question: "Gap 8: as ___ as headphones are safe to use", answer: "long", explanation: "As long as introduce una condizione: purché o a condizione che.", contextTitle: "Studying on the move", context: commutingCloze },
  { type: "word-formation", topic: "Word formation", question: "Gap 1: grown in ___ (POPULAR)", answer: "popularity", explanation: "Dopo in serve il sostantivo popularity, formato da popular.", contextTitle: "The return of repair skills", context: repairWorkshopCloze },
  { type: "word-formation", topic: "Word formation", question: "Gap 2: thrown away ___ (NECESSARY)", answer: "unnecessarily", explanation: "Serve l'avverbio negativo unnecessarily per indicare che gli oggetti vengono buttati senza necessità.", contextTitle: "The return of repair skills", context: repairWorkshopCloze },
  { type: "word-formation", topic: "Word formation", question: "Gap 3: lack the ___ to investigate (CONFIDENT)", answer: "confidence", explanation: "Dopo the serve il sostantivo confidence.", contextTitle: "The return of repair skills", context: repairWorkshopCloze },
  { type: "word-formation", topic: "Word formation", question: "Gap 4: feel ___ to identify the fault (ABLE)", answer: "unable", explanation: "Il contesto richiede l'aggettivo negativo unable.", contextTitle: "The return of repair skills", context: repairWorkshopCloze },
  { type: "word-formation", topic: "Word formation", question: "Gap 5: offer ___ advice (PRACTICE)", answer: "practical", explanation: "Advice richiede l'aggettivo practical, non il sostantivo practice.", contextTitle: "The return of repair skills", context: repairWorkshopCloze },
  { type: "word-formation", topic: "Word formation", question: "Gap 6: safe and ___ (RELY)", answer: "reliable", explanation: "Dopo safe and serve l'aggettivo reliable.", contextTitle: "The return of repair skills", context: repairWorkshopCloze },
  { type: "word-formation", topic: "Word formation", question: "Gap 7: should be ___ to people (ACCESS)", answer: "accessible", explanation: "Accessible è l'aggettivo formato da access con il suffisso -ible.", contextTitle: "The return of repair skills", context: repairWorkshopCloze },
  { type: "word-formation", topic: "Word formation", question: "Gap 8: a significant ___ in waste (REDUCE)", answer: "reduction", explanation: "Dopo a significant serve il sostantivo reduction.", contextTitle: "The return of repair skills", context: repairWorkshopCloze },
  { type: "transformation", topic: "Key word transformation", question: "It isn’t necessary for you to bring a laptop. → You ___ a laptop. (HAVE)", answer: "do not have to bring", accepted: ["don't have to bring"], explanation: "Don’t have to esprime assenza di necessità." },
  { type: "transformation", topic: "Key word transformation", question: "I last saw Nina three months ago. → I ___ three months. (FOR)", answer: "have not seen Nina for", accepted: ["haven't seen Nina for"], explanation: "La durata fino al presente richiede il present perfect con for." },
  { type: "transformation", topic: "Key word transformation", question: "The film was so boring that we left early. → It was ___ that we left early. (SUCH)", answer: "such a boring film", explanation: "Such + a/an + aggettivo + nome sostituisce so + aggettivo." },
  { type: "transformation", topic: "Key word transformation", question: "People believe the painting is genuine. → The painting ___ genuine. (BELIEVED)", answer: "is believed to be", explanation: "Il passivo impersonale usa subject + be believed + to-infinitive." },
  { type: "transformation", topic: "Key word transformation", question: "I regret not accepting that offer. → I wish ___ that offer. (ACCEPTED)", answer: "I had accepted", explanation: "Wish + past perfect esprime un rimpianto sul passato." },
  { type: "transformation", topic: "Key word transformation", question: "The weather prevented us from going out. → We couldn’t go out ___ the weather. (BECAUSE)", answer: "because of", explanation: "Because of introduce la causa espressa dal gruppo nominale the weather." },
];

export const useOfEnglishExercises: Exercise[] = useOfEnglishSeeds.map(
  (seed, index) => ({
    id: `uoe-${String(index + 1).padStart(2, "0")}`,
    type: seed.type === "word-formation" ? "fill-gap" : seed.type,
    section:
      seed.topic === "Multiple-choice cloze" || seed.topic === "Word formation"
        ? "vocabulary"
        : "grammar",
    topic: seed.topic,
    difficulty: "b2",
    level: "B2",
    question: seed.question,
    instructions:
      seed.type === "multiple-choice"
        ? "Scegli la parola che completa correttamente il testo."
        : seed.type === "transformation"
        ? "Completa la seconda frase usando la parola data senza cambiarne il significato."
        : seed.type === "word-formation"
          ? "Trasforma la parola tra parentesi nella forma corretta."
          : "Inserisci una sola parola nello spazio.",
    correctAnswer: seed.answer,
    options: seed.options?.map((label, optionIndex) => ({
      id: String(optionIndex),
      label,
    })),
    acceptedAnswers: seed.accepted?.filter(Boolean),
    explanation: seed.explanation,
    grammarRule: seed.explanation,
    examples: [],
    tags: ["use-of-english", seed.topic.toLowerCase().replaceAll(" ", "-")],
    estimatedTime: seed.type === "transformation" ? 75 : 45,
    source: "original",
    createdAt,
    contextTitle: seed.contextTitle,
    context: seed.context,
  }),
);

function comprehension(id: string, passageId: string, topic: string, question: string, options: string[], correctAnswer: string, explanation: string): Exercise { return { id, type: "reading", section: "reading", topic, difficulty: "b2", level: "B2", question, instructions: "Leggi il testo e scegli la risposta corretta.", options: options.map((label, index) => ({ id: `${index}`, label })), correctAnswer, explanation, examples: [], tags: ["reading", topic], estimatedTime: 90, source: "original", createdAt, passageId }; }
const legacyReadingPassages: ReadingPassage[] = [
  { id: "r-remote", title: "The quiet shift to hybrid work", kind: "Articolo", level: "B2", minutes: 7, text: "When remote work first became widespread, many companies treated it as a temporary solution. Yet employees soon discovered benefits that were difficult to ignore: less commuting, greater control over their schedules and more time with their families. Employers, meanwhile, worried about collaboration and company culture. Recent workplace experiments suggest that neither full-time office work nor permanent isolation is ideal. Teams that agree on a small number of shared office days often report better communication without losing flexibility. The most successful organisations do not simply count hours at a desk; they define clear outcomes, train managers to lead distributed teams and make meetings purposeful. Hybrid work is therefore less a location policy than a test of how well a company communicates.", exercises: [comprehension("r1-q1", "r-remote", "main idea", "What is the writer’s main point?", ["Remote work should replace offices completely.", "Hybrid work succeeds when organisations improve how they work together.", "Employees are less productive at home."], "Hybrid work succeeds when organisations improve how they work together.", "Il testo conclude che il lavoro ibrido è soprattutto una prova della qualità della comunicazione organizzativa."), comprehension("r1-q2", "r-remote", "inference", "What can be inferred about successful hybrid teams?", ["They never hold meetings.", "They focus more on results than physical presence.", "They work in the office every day."], "They focus more on results than physical presence.", "Il riferimento a ‘clear outcomes’ e al non contare le ore alla scrivania suggerisce un focus sui risultati.")] },
  { id: "r-repair", title: "The return of the repair café", kind: "Reportage", level: "B2", minutes: 6, text: "On Saturday mornings, a former library in Bristol fills with broken lamps, silent radios and torn jackets. Their owners have not come to throw them away. Instead, volunteer engineers, electricians and sewing enthusiasts help visitors repair them. The repair café began as a small environmental project, but it has become a social meeting place too. Visitors learn practical skills, while retired specialists enjoy sharing knowledge that might otherwise be lost. Not every object can be saved, and volunteers are careful not to promise success. Even so, the project changes how people think about possessions. A broken toaster is no longer automatically waste; it becomes a problem that might be understood and solved.", exercises: [comprehension("r2-q1", "r-repair", "detail", "Why do retired specialists take part?", ["They are paid to repair appliances.", "They value the chance to pass on their skills.", "They want to sell old equipment."], "They value the chance to pass on their skills.", "Il testo afferma che apprezzano la possibilità di condividere conoscenze che altrimenti potrebbero perdersi."), comprehension("r2-q2", "r-repair", "author attitude", "What is the author’s attitude to the project?", ["Cautiously positive", "Highly critical", "Completely indifferent"], "Cautiously positive", "L’autore ne mostra i benefici ma riconosce che non tutto può essere riparato.")] },
  { id: "r-university", title: "A different kind of lecture", kind: "Testo universitario", level: "B2+", minutes: 8, text: "At several European universities, the traditional lecture is being turned upside down. Students watch short presentations before class, then use classroom time to solve problems in groups. This ‘flipped’ model is not simply homework with a new name. Its purpose is to move basic information outside the classroom so that teachers can spend more time answering questions and observing how students apply ideas. Critics point out that the model depends on students preparing in advance. Supporters accept this risk but argue that passive attendance is no guarantee of learning either. Early research is mixed, although courses with careful guidance and short, focused videos tend to achieve better results than those that merely upload hour-long recordings.", exercises: [comprehension("r3-q1", "r-university", "meaning in context", "In the text, ‘turned upside down’ means:", ["made confusing", "organised in the opposite way", "cancelled completely"], "organised in the opposite way", "Il modello inverte il normale ordine: contenuti a casa, applicazione in aula."), comprehension("r3-q2", "r-university", "detail", "What appears to improve results?", ["Longer recorded lectures", "Removing all homework", "Focused videos and careful support"], "Focused videos and careful support", "L’ultima frase collega risultati migliori a guida attenta e video brevi e mirati.")] },
  { id: "r-tourism", title: "When a city becomes too popular", kind: "Saggio breve", level: "B2", minutes: 7, text: "Tourism brings jobs, restores historic buildings and allows cultures to meet. Yet success can produce its own problems. In cities visited by millions, apartments are converted into short-term rentals and local shops are replaced by businesses aimed only at visitors. Some councils have responded with tourist taxes or limits on new accommodation. These measures are controversial: small businesses fear losing income, while residents argue that a city must remain liveable. A balanced policy should not treat tourists as the enemy. It should instead protect housing, spread visitors across different seasons and neighbourhoods, and ensure that tourism contributes directly to the services it uses.", exercises: [comprehension("r4-q1", "r-tourism", "main idea", "Which policy does the writer support?", ["Stopping tourism entirely", "Balancing visitor income with residents’ needs", "Building hotels in every neighbourhood"], "Balancing visitor income with residents’ needs", "La conclusione propone protezione degli alloggi, distribuzione dei visitatori e contributo ai servizi."), comprehension("r4-q2", "r-tourism", "true false", "The writer describes tourist taxes as universally popular.", ["True", "False"], "False", "Le misure sono definite ‘controversial’, quindi non sono universalmente popolari.")] },
  { id: "r-sleep", title: "Why rest improves learning", kind: "Articolo scientifico", level: "B1+", minutes: 6, text: "Students often reduce sleep when exams approach, believing that every extra hour of revision will help. Memory research suggests the opposite may happen. During sleep, the brain does not simply switch off. It processes recently learned information and strengthens useful connections. This does not mean that sleep can replace study: the brain needs material to work with. However, a consistent sleep routine can make revision more effective. Short breaks during the day also matter. After concentrated effort, even a brief walk can restore attention. The most efficient learners are not necessarily those who study longest, but those who alternate focused work with genuine recovery.", exercises: [comprehension("r5-q1", "r-sleep", "main idea", "What does the text recommend?", ["Studying all night before an exam", "Replacing revision with sleep", "Combining focused study with adequate recovery"], "Combining focused study with adequate recovery", "Il testo insiste sull’alternanza tra lavoro concentrato e recupero reale."), comprehension("r5-q2", "r-sleep", "inference", "Why is sleep alone insufficient?", ["The brain first needs information to process.", "Sleep prevents concentration.", "Memory only works during the day."], "The brain first needs information to process.", "Il testo dice che il cervello ha bisogno di materiale su cui lavorare.")] }
];

function listeningExercise(id: string, activityId: string, question: string, options: string[], correct: string, explanation: string): Exercise { return { ...comprehension(id, activityId, "listening comprehension", question, options, correct, explanation), type: "listening", section: "listening" }; }
const legacyListeningActivities: ListeningActivity[] = [
  { id: "l-station", title: "Cambio di binario", kind: "Annuncio", level: "B1+", duration: "0:42", maxListens: 3, transcript: "Attention please. The 14:35 service to Brighton will now depart from platform nine, not platform six. Passengers requiring step-free access should use the lift beside the information desk. We apologise for the late change.", exercises: [listeningExercise("l1-q1", "l-station", "Where will the train depart from?", ["Platform 6", "Platform 9", "Platform 14"], "Platform 9", "L’annuncio corregge esplicitamente il binario da sei a nove.")] },
  { id: "l-interview", title: "Un lavoro nato per caso", kind: "Intervista", level: "B2", duration: "1:08", maxListens: 2, transcript: "I never planned to become a food photographer. I studied graphic design and took pictures only to illustrate my university projects. A small restaurant saw one of those images online and asked me to photograph its new menu. I was terrified, but the owner liked the result. For two years I worked as a designer during the week and accepted photography jobs at weekends. I only changed careers when I had saved enough to manage six months without regular income.", exercises: [listeningExercise("l2-q1", "l-interview", "Why did the speaker wait before changing careers?", ["She needed more training.", "She wanted a financial safety net.", "She disliked weekend work."], "She wanted a financial safety net.", "Ha cambiato lavoro solo dopo aver risparmiato abbastanza per vivere sei mesi senza reddito regolare.")] },
  { id: "l-lecture", title: "Il valore della noia", kind: "Mini lezione", level: "B2+", duration: "1:16", maxListens: 2, transcript: "We tend to treat boredom as a problem to solve immediately, usually by reaching for a phone. Yet studies suggest that undemanding moments allow the mind to connect ideas that seem unrelated. This does not mean that boredom automatically makes us creative. If people are anxious or exhausted, an empty hour may simply feel unpleasant. But when the mind is rested, a routine task such as walking or washing dishes can create space for reflection. The useful lesson is not to seek boredom for its own sake, but to stop filling every pause with information.", exercises: [listeningExercise("l3-q1", "l-lecture", "What is the speaker’s main recommendation?", ["Avoid all routine tasks.", "Leave some pauses free from new information.", "Use a phone whenever boredom begins."], "Leave some pauses free from new information.", "La conclusione invita a non riempire ogni pausa con informazioni.")] }
];

export const writingPrompts: WritingPrompt[] = [
  { id: "w-email-formal", type: "Email formale", title: "Richiesta di informazioni", prompt: "You have seen an advertisement for a summer course in Dublin. Write to the course organiser asking about accommodation, class size and social activities.", minWords: 140, maxWords: 190, structure: ["Saluto formale", "Motivo della richiesta", "Tre domande chiare", "Chiusura cortese"], criteria: ["Grammatica", "Vocabolario", "Coerenza", "Aderenza", "Registro"] },
  { id: "w-essay", type: "Essay", title: "Technology and learning", prompt: "Some people believe technology makes students less independent. Discuss both views and give your opinion.", minWords: 160, maxWords: 220, structure: ["Introduzione neutra", "Argomento a favore", "Argomento contrario", "Opinione e conclusione"], criteria: ["Grammatica", "Vocabolario", "Coesione", "Struttura", "Chiarezza"] },
  { id: "w-article", type: "Article", title: "A habit that changed my week", prompt: "Write an article for a student website about one realistic habit that helps people study or work better.", minWords: 140, maxWords: 190, structure: ["Titolo coinvolgente", "Esperienza o problema", "Consiglio concreto", "Finale memorabile"], criteria: ["Grammatica", "Vocabolario", "Coinvolgimento", "Struttura", "Registro"] },
  { id: "w-review", type: "Review", title: "A place worth visiting", prompt: "Write a review of a museum, exhibition or cultural place. Explain what makes it interesting and who would enjoy it.", minWords: 140, maxWords: 190, structure: ["Contesto", "Punti di forza", "Un limite", "Raccomandazione"], criteria: ["Grammatica", "Vocabolario", "Dettaglio", "Struttura", "Registro"] },
  { id: "w-report", type: "Report", title: "Improving the study area", prompt: "Your college wants to improve its study area. Write a report describing current problems and recommending two changes.", minWords: 160, maxWords: 220, structure: ["Heading e scopo", "Situazione attuale", "Raccomandazioni", "Conclusione"], criteria: ["Grammatica", "Vocabolario", "Coerenza", "Aderenza", "Registro formale"] }
];

export const grammarExercises = [
  ...verbTenseExercises,
  ...universityGrammarExercises,
];
export const vocabularyItems = b2VocabularyItems;
export const vocabularyExercises = b2VocabularyExercises;
export const readingPassages = b2ReadingPassages;
export const listeningActivities = b2ListeningActivities;

export const allExercises: Exercise[] = [
  ...grammarExercises,
  ...vocabularyExercises,
  ...useOfEnglishExercises,
  ...readingPassages.flatMap((passage) => passage.exercises),
  ...listeningActivities.flatMap((activity) => activity.exercises),
];

export const assessmentExercises: Exercise[] = [
  ...grammarExercises
    .filter((exercise) => exercise.id.endsWith("-01-choice"))
    .slice(0, 8),
  ...vocabularyExercises
    .filter((exercise) => exercise.id.endsWith("-translation"))
    .slice(0, 8),
  ...readingPassages.flatMap((passage) => passage.exercises).slice(0, 6),
  ...listeningActivities.flatMap((activity) => activity.exercises).slice(0, 6),
];

export const grammarTopics = verbTenseTopics.map((topic) => topic.title);

void legacyGrammarExercises;
void legacyVocabularyExercises;
void legacyReadingPassages;
void legacyListeningActivities;
