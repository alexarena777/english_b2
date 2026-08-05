import type { Exercise } from "../types";

const createdAt = "2026-08-02T00:00:00.000Z";

type VerbSeed = {
  sentence: string;
  answer: string;
  distractors: [string, string];
  note: string;
};

export type VerbCategory = "Presenti" | "Passati" | "Futuri" | "Forme speciali";

export type VerbTenseTopic = {
  slug: string;
  title: string;
  italianTitle: string;
  category: VerbCategory;
  formula: string;
  useCases: string[];
  signals: string[];
  examples: string[];
  examplesIT: string[];
  mistakes: string[];
  youtubeId?: string;
};

type VerbTopicDefinition = VerbTenseTopic & { seeds: VerbSeed[] };

const definitions: VerbTopicDefinition[] = [
  {
    slug: "present-simple",
    title: "Present simple",
    italianTitle: "Presente semplice",
    category: "Presenti",
    formula: "soggetto + verbo base; he/she/it + -s",
    useCases: ["abitudini e routine", "fatti stabili e verità generali", "orari e programmi ufficiali"],
    signals: ["usually", "often", "every", "rarely", "never"],
    examples: ["I usually work from home.", "The train leaves at 7.15."],
    examplesIT: ["Di solito lavoro da casa.", "Il treno parte alle 7:15."],
    mistakes: ["Dimenticare la -s alla terza persona.", "Usarlo per un'azione temporanea in corso."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "I usually ___ from home, but today I am at the office.", answer: "work", distractors: ["am working", "worked"], note: "Usually segnala un'abitudine." },
      { sentence: "My sister ___ two languages fluently.", answer: "speaks", distractors: ["is speaking", "speak"], note: "Una capacità stabile richiede il present simple." },
      { sentence: "The museum ___ at ten on Sundays.", answer: "opens", distractors: ["is opening", "open"], note: "Gli orari ufficiali usano il present simple." },
      { sentence: "Water ___ at 100°C at sea level.", answer: "boils", distractors: ["is boiling", "boil"], note: "È una verità generale." },
      { sentence: "How often ___ your team meet?", answer: "does", distractors: ["is", "do"], note: "Con un soggetto singolare la domanda usa does." },
      { sentence: "Lena rarely ___ late for meetings.", answer: "arrives", distractors: ["arrive", "is arriving"], note: "Rarely indica frequenza; Lena richiede la -s." },
      { sentence: "This guide ___ everything you need to know.", answer: "contains", distractors: ["is containing", "contain"], note: "Contain descrive uno stato stabile." },
      { sentence: "We ___ online orders after 6 p.m.", answer: "do not process", distractors: ["are not processing", "does not process"], note: "È una regola abituale espressa al negativo." },
    ],
  },
  {
    slug: "present-continuous",
    title: "Present continuous",
    italianTitle: "Presente progressivo",
    category: "Presenti",
    formula: "am/is/are + verbo in -ing",
    useCases: ["azione in corso ora", "situazione temporanea", "cambiamento o tendenza attuale"],
    signals: ["now", "at the moment", "currently", "this week", "increasingly"],
    examples: ["She is talking to a client now.", "More people are working remotely."],
    examplesIT: ["Sta parlando con un cliente adesso.", "Sempre più persone lavorano da remoto."],
    mistakes: ["Dimenticare il verbo be.", "Usarlo normalmente con verbi di stato come know o believe."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "Please be quiet; I ___ to an important client.", answer: "am talking", distractors: ["talk", "have talked"], note: "L'azione è in corso nel momento in cui si parla." },
      { sentence: "We ___ with friends while our flat is being painted.", answer: "are staying", distractors: ["stay", "have stayed"], note: "È una sistemazione temporanea." },
      { sentence: "The cost of energy ___ rapidly this year.", answer: "is rising", distractors: ["rises", "has rose"], note: "Descrive una tendenza attuale in cambiamento." },
      { sentence: "Why ___ you wearing a coat indoors?", answer: "are", distractors: ["do", "have"], note: "La domanda riguarda ciò che sta accadendo ora." },
      { sentence: "I ___ on a new project this month.", answer: "am working", distractors: ["work", "have worked"], note: "This month presenta una situazione temporanea." },
      { sentence: "They ___ always ___ their keys!", answer: "are / losing", distractors: ["do / lose", "have / lost"], note: "Always con il continuous può esprimere irritazione." },
      { sentence: "The company ___ its customer service at present.", answer: "is improving", distractors: ["improves", "improved"], note: "At present indica un processo in corso." },
      { sentence: "I ___ what you mean now.", answer: "understand", distractors: ["am understanding", "have understanding"], note: "Understand è normalmente un verbo di stato, quindi non usa il continuous." },
    ],
  },
  {
    slug: "present-perfect-simple",
    title: "Present perfect simple",
    italianTitle: "Passato collegato al presente",
    category: "Presenti",
    formula: "have/has + participio passato",
    useCases: ["esperienze senza tempo passato definito", "risultati presenti", "azioni in periodi non conclusi"],
    signals: ["already", "yet", "ever", "never", "so far", "since", "for"],
    examples: ["I have visited Dublin twice.", "She has finished the report."],
    examplesIT: ["Ho visitato Dublino due volte.", "Ha finito il rapporto."],
    mistakes: ["Usarlo con yesterday o last year.", "Confondere since, che introduce l'inizio, con for, che indica la durata."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "She ___ three reports so far today.", answer: "has written", distractors: ["wrote", "writes"], note: "So far today indica un periodo ancora aperto." },
      { sentence: "I ___ that film, so please do not tell me the ending.", answer: "have not seen", distractors: ["did not see", "do not see"], note: "L'esperienza manca fino al presente." },
      { sentence: "___ you ever tried rock climbing?", answer: "Have", distractors: ["Did", "Do"], note: "Ever introduce un'esperienza nella vita." },
      { sentence: "We ___ each other since primary school.", answer: "have known", distractors: ["know", "are knowing"], note: "La situazione è iniziata nel passato e continua ora." },
      { sentence: "The parcel ___ yet.", answer: "has not arrived", distractors: ["did not arrive", "is not arriving"], note: "Yet al negativo richiama il present perfect." },
      { sentence: "Researchers ___ a promising solution.", answer: "have discovered", distractors: ["discovered yesterday", "are discover"], note: "Il risultato della scoperta è rilevante ora." },
      { sentence: "This is the best meal I ___ in months.", answer: "have had", distractors: ["had", "am having"], note: "Dopo un superlativo si usa spesso il present perfect." },
      { sentence: "He ___ in Rome for five years.", answer: "has lived", distractors: ["lives since", "is living since"], note: "For introduce la durata fino al presente." },
    ],
  },
  {
    slug: "present-perfect-continuous",
    title: "Present perfect continuous",
    italianTitle: "Durata fino al presente",
    category: "Presenti",
    formula: "have/has been + verbo in -ing",
    useCases: ["attività iniziata nel passato e ancora in corso", "durata messa in evidenza", "causa visibile nel presente"],
    signals: ["for", "since", "all day", "lately", "how long"],
    examples: ["I have been studying for two hours.", "It has been raining."],
    examplesIT: ["Studio da due ore (e continuo).", "Sta piovendo da un po'."],
    mistakes: ["Usarlo con verbi di stato.", "Confonderlo con il simple quando conta soprattutto il risultato completato."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "They ___ for over an hour, so they need a break.", answer: "have been driving", distractors: ["are driving", "drove"], note: "L'enfasi è sulla durata dell'attività." },
      { sentence: "How long ___ English?", answer: "have you been studying", distractors: ["do you study", "did you study"], note: "How long chiede una durata fino al presente." },
      { sentence: "Your hands are dirty. What ___?", answer: "have you been doing", distractors: ["did you do", "are you do"], note: "C'è un risultato visibile di un'attività recente." },
      { sentence: "I ___ to contact the support team all morning.", answer: "have been trying", distractors: ["am trying", "tried"], note: "All morning sottolinea uno sforzo ripetuto e continuato." },
      { sentence: "She ___ much better lately.", answer: "has been sleeping", distractors: ["sleeps", "slept"], note: "Lately collega una tendenza recente al presente." },
      { sentence: "We ___ for the bus since six o'clock.", answer: "have been waiting", distractors: ["are waiting", "waited"], note: "Since indica quando è iniziata l'attesa ancora in corso." },
      { sentence: "The team ___ on the update for several weeks.", answer: "has been working", distractors: ["works", "worked"], note: "L'attività continua e la durata è importante." },
      { sentence: "I ___ this book all week, but I still have two chapters left.", answer: "have been reading", distractors: ["have read", "read"], note: "L'attività non è terminata; conta il processo." },
    ],
  },
  {
    slug: "past-simple",
    title: "Past simple",
    italianTitle: "Passato semplice",
    category: "Passati",
    formula: "verbo al passato; did + verbo base nelle domande e negazioni",
    useCases: ["evento concluso in un tempo passato finito", "sequenza narrativa", "abitudine passata conclusa"],
    signals: ["yesterday", "last", "ago", "in 2024", "when"],
    examples: ["We moved here last year.", "Did you call her?"],
    examplesIT: ["Ci siamo trasferiti qui l'anno scorso.", "L'hai chiamata?"],
    mistakes: ["Usare il participio dopo did.", "Usarlo per una situazione che continua ancora adesso."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "We ___ the museum before it closed for renovation.", answer: "visited", distractors: ["have visited", "were visiting"], note: "L'evento è concluso in un periodo passato finito." },
      { sentence: "I ___ your message yesterday evening.", answer: "received", distractors: ["have received", "receive"], note: "Yesterday richiede il past simple." },
      { sentence: "Where ___ you buy that jacket?", answer: "did", distractors: ["have", "were"], note: "La domanda al past simple usa did." },
      { sentence: "She ___ not attend the conference last week.", answer: "did", distractors: ["was", "has"], note: "La negazione usa did not + verbo base." },
      { sentence: "The lights went out, so we ___ some candles.", answer: "lit", distractors: ["have lit", "were lighting"], note: "È una sequenza di eventi conclusi." },
      { sentence: "He ___ in Madrid from 2018 to 2021.", answer: "lived", distractors: ["has lived", "lives"], note: "L'intervallo è completamente concluso." },
      { sentence: "The meeting ___ longer than anyone expected.", answer: "lasted", distractors: ["has lasted", "was lasting"], note: "La riunione è un evento passato terminato." },
      { sentence: "I ___ her at a workshop two years ago.", answer: "met", distractors: ["have met", "meet"], note: "Ago segnala un momento passato finito." },
    ],
  },
  {
    slug: "past-continuous",
    title: "Past continuous",
    italianTitle: "Azione in corso nel passato",
    category: "Passati",
    formula: "was/were + verbo in -ing",
    useCases: ["azione in corso a un'ora passata", "sfondo narrativo", "due azioni contemporanee"],
    signals: ["while", "as", "at 8 p.m.", "when"],
    examples: ["I was cooking when you called.", "While she was reading, he was working."],
    examplesIT: ["Stavo cucinando quando hai chiamato.", "Mentre lei leggeva, lui lavorava."],
    mistakes: ["Usarlo per l'evento breve che interrompe.", "Dimenticare la concordanza was/were."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "While I ___ dinner, the lights went out.", answer: "was making", distractors: ["made", "have made"], note: "L'azione lunga fa da sfondo all'evento breve." },
      { sentence: "At nine last night, we ___ home.", answer: "were driving", distractors: ["drove", "have driven"], note: "L'azione era in corso a un momento preciso del passato." },
      { sentence: "What ___ you doing when the alarm rang?", answer: "were", distractors: ["did", "have"], note: "La domanda chiede l'azione in corso al momento dell'interruzione." },
      { sentence: "As the speaker ___, someone opened the door.", answer: "was presenting", distractors: ["presented", "has presented"], note: "As introduce l'azione di sfondo." },
      { sentence: "They ___ attention while the guide was explaining the rules.", answer: "were not paying", distractors: ["did not pay", "have not paid"], note: "Due azioni si svolgevano nello stesso intervallo." },
      { sentence: "It ___ heavily, so the roads were slippery.", answer: "was raining", distractors: ["rained once", "has rained"], note: "Descrive la situazione di sfondo." },
      { sentence: "I saw Maya while she ___ for the bus.", answer: "was waiting", distractors: ["waited", "has waited"], note: "L'attesa era già in corso quando l'ho vista." },
      { sentence: "While one group ___ the data, the other was writing the report.", answer: "was analysing", distractors: ["analysed", "has analysed"], note: "Le due attività erano contemporanee." },
    ],
  },
  {
    slug: "past-perfect-simple",
    title: "Past perfect simple",
    italianTitle: "Il passato prima del passato",
    category: "Passati",
    formula: "had + participio passato",
    useCases: ["azione precedente a un'altra azione passata", "causa di una situazione passata", "esperienza anteriore a un riferimento passato"],
    signals: ["by the time", "already", "before", "after", "never"],
    examples: ["The film had started before we arrived.", "She had never flown before."],
    examplesIT: ["Il film era già iniziato prima che arrivassimo.", "Non aveva mai volato prima."],
    mistakes: ["Usarlo quando l'ordine degli eventi è già evidente e non serve enfasi.", "Usare had + past simple invece del participio."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "By the time we arrived, the film ___.", answer: "had already started", distractors: ["already started", "has already started"], note: "L'inizio precede il nostro arrivo, entrambi nel passato." },
      { sentence: "She was nervous because she ___ abroad before.", answer: "had never travelled", distractors: ["never travelled", "has never travelled"], note: "L'assenza di esperienza precede il momento in cui era nervosa." },
      { sentence: "After the team ___ the data, it published the report.", answer: "had checked", distractors: ["has checked", "was checking"], note: "Il controllo è completato prima della pubblicazione." },
      { sentence: "I recognised the café because I ___ there once before.", answer: "had been", distractors: ["was", "have been"], note: "La visita precedente spiega il riconoscimento passato." },
      { sentence: "The room was empty; everyone ___ home.", answer: "had gone", distractors: ["went just", "has gone"], note: "La partenza è precedente alla scoperta della stanza vuota." },
      { sentence: "He apologised for what he ___.", answer: "had said", distractors: ["has said", "was saying"], note: "Le parole vengono prima delle scuse." },
      { sentence: "They missed the train because they ___ the departure time.", answer: "had misunderstood", distractors: ["misunderstood later", "have misunderstood"], note: "L'errore precedente causa il risultato passato." },
      { sentence: "Until that day, I ___ such a difficult decision.", answer: "had never faced", distractors: ["never faced", "have never faced"], note: "Until that day crea un limite nel passato." },
    ],
  },
  {
    slug: "past-perfect-continuous",
    title: "Past perfect continuous",
    italianTitle: "Durata prima di un momento passato",
    category: "Passati",
    formula: "had been + verbo in -ing",
    useCases: ["attività durata fino a un punto passato", "causa visibile di una situazione passata", "processo interrotto nel passato"],
    signals: ["for", "since", "all morning", "before", "when"],
    examples: ["They had been waiting for an hour when the bus came.", "She was tired because she had been working."],
    examplesIT: ["Aspettavano da un'ora quando arrivò il bus.", "Era stanca perché aveva lavorato a lungo."],
    mistakes: ["Usarlo con verbi di stato.", "Usarlo quando conta soltanto il risultato completato."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "They ___ for an hour when the bus finally arrived.", answer: "had been waiting", distractors: ["were waiting", "have been waiting"], note: "L'attesa dura fino a un punto nel passato." },
      { sentence: "Her eyes were tired because she ___ at the screen all day.", answer: "had been looking", distractors: ["was looking", "has looked"], note: "L'attività precedente spiega il risultato visibile passato." },
      { sentence: "We ___ for months before the project was cancelled.", answer: "had been preparing", distractors: ["were preparing", "have prepared"], note: "La preparazione prolungata precede la cancellazione." },
      { sentence: "How long ___ there before you changed jobs?", answer: "had you been working", distractors: ["were you working", "have you worked"], note: "Si chiede la durata anteriore a un evento passato." },
      { sentence: "The ground was wet because it ___.", answer: "had been raining", distractors: ["was raining now", "has rained"], note: "La pioggia precedente spiega lo stato del terreno." },
      { sentence: "He was exhausted; he ___ since five in the morning.", answer: "had been travelling", distractors: ["was travelling", "has travelled"], note: "Since introduce l'inizio di una durata già conclusa nel passato." },
      { sentence: "Before the break, the students ___ without stopping.", answer: "had been studying", distractors: ["were studied", "have studied"], note: "Il processo continua fino alla pausa passata." },
      { sentence: "The machine failed after it ___ continuously for two days.", answer: "had been running", distractors: ["was run", "has been running"], note: "La durata del funzionamento precede e spiega il guasto." },
    ],
  },
  {
    slug: "will-future",
    title: "Future with will",
    italianTitle: "Futuro con will",
    category: "Futuri",
    formula: "will + verbo base",
    useCases: ["decisione presa nel momento", "promessa o offerta", "previsione basata su opinione"],
    signals: ["I think", "probably", "perhaps", "I promise", "do not worry"],
    examples: ["I'll answer the phone.", "I think prices will rise."],
    examplesIT: ["Rispondo io al telefono.", "Penso che i prezzi aumenteranno."],
    mistakes: ["Usarlo per un piano già deciso.", "Aggiungere to dopo will."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "The phone is ringing. I ___ it.", answer: "will answer", distractors: ["am answering yesterday", "answer usually"], note: "La decisione viene presa mentre si parla." },
      { sentence: "I think the new system ___ time.", answer: "will save", distractors: ["is saving last week", "has saved tomorrow"], note: "I think introduce una previsione personale." },
      { sentence: "Do not worry; I ___ anyone your secret.", answer: "will not tell", distractors: ["am not telling yesterday", "do not told"], note: "È una promessa spontanea." },
      { sentence: "___ you help me carry this box?", answer: "Will", distractors: ["Do going to", "Are"], note: "Will può formulare una richiesta." },
      { sentence: "Perhaps people ___ less cash in the future.", answer: "will use", distractors: ["are use", "have used"], note: "Perhaps segnala una previsione incerta." },
      { sentence: "I am sure you ___ the course useful.", answer: "will find", distractors: ["are finding yesterday", "found tomorrow"], note: "È una previsione/opinione sul futuro." },
      { sentence: "We ___ you as soon as we have more information.", answer: "will contact", distractors: ["contact will", "will to contact"], note: "La principale futura usa will; dopo as soon as si usa il presente." },
      { sentence: "If you wait here, the manager ___ with you shortly.", answer: "will speak", distractors: ["speaks yesterday", "would spoke"], note: "È il risultato futuro di una condizione reale." },
    ],
  },
  {
    slug: "be-going-to",
    title: "Be going to",
    italianTitle: "Intenzioni e previsioni con evidenza",
    category: "Futuri",
    formula: "am/is/are going to + verbo base",
    useCases: ["intenzione già decisa", "piano generale", "previsione basata su evidenza presente"],
    signals: ["look", "plan", "intend", "this year", "those clouds"],
    examples: ["I'm going to apply for the job.", "Look! It's going to rain."],
    examplesIT: ["Ho intenzione di candidarmi per il lavoro.", "Guarda! Sta per piovere."],
    mistakes: ["Dimenticare il verbo be.", "Usarlo per una decisione davvero spontanea."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "Look at those clouds! It ___.", answer: "is going to rain", distractors: ["rains yesterday", "has raining"], note: "La previsione è basata su un'evidenza visibile." },
      { sentence: "I ___ a digital marketing course next month.", answer: "am going to start", distractors: ["will started", "going start"], note: "L'intenzione è già stata decisa." },
      { sentence: "They ___ their kitchen this summer.", answer: "are going to renovate", distractors: ["will renovating", "going renovate"], note: "È un piano futuro già esistente." },
      { sentence: "Be careful! You ___ that glass.", answer: "are going to drop", distractors: ["drop usually", "have dropped tomorrow"], note: "La situazione presente rende il risultato imminente." },
      { sentence: "What ___ you going to do after the course?", answer: "are", distractors: ["do", "will to"], note: "La domanda con going to richiede il verbo be." },
      { sentence: "She ___ not going to accept the offer.", answer: "is", distractors: ["does", "has"], note: "La forma negativa è be + not + going to." },
      { sentence: "We have saved enough money, so we ___ a new laptop.", answer: "are going to buy", distractors: ["buy yesterday", "have buy"], note: "La preparazione dimostra un'intenzione già formata." },
      { sentence: "The shelf is shaking; the books ___.", answer: "are going to fall", distractors: ["fall every day", "have fell"], note: "L'evidenza presente sostiene la previsione." },
    ],
  },
  {
    slug: "present-continuous-future",
    title: "Present continuous for arrangements",
    italianTitle: "Accordi futuri già fissati",
    category: "Futuri",
    formula: "am/is/are + verbo in -ing + riferimento futuro",
    useCases: ["appuntamento confermato", "viaggio prenotato", "accordo con altre persone"],
    signals: ["tomorrow", "on Friday", "at 6", "this weekend"],
    examples: ["I'm meeting Sara at six.", "We're flying to Lisbon on Friday."],
    examplesIT: ["Incontro Sara alle sei (è già deciso).", "Voliamo a Lisbona venerdì (biglietti prenotati)."],
    mistakes: ["Usarlo senza un riferimento futuro chiaro.", "Confonderlo con going to, che può indicare un'intenzione meno fissata."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "I ___ the dentist at three tomorrow.", answer: "am seeing", distractors: ["see every day", "have seen tomorrow"], note: "L'appuntamento è fissato a un'ora precisa." },
      { sentence: "We ___ to Lisbon on Friday; the tickets are booked.", answer: "are flying", distractors: ["fly usually", "have flown Friday"], note: "La prenotazione rende l'accordo definito." },
      { sentence: "What time ___ you meeting the client?", answer: "are", distractors: ["do", "have"], note: "È una domanda su un appuntamento futuro confermato." },
      { sentence: "She ___ dinner with her former colleagues tonight.", answer: "is having", distractors: ["has every night", "had tomorrow"], note: "Tonight chiarisce il valore futuro dell'accordo." },
      { sentence: "They ___ not coming to the workshop next week.", answer: "are", distractors: ["do", "will to"], note: "La forma negativa del present continuous usa be + not." },
      { sentence: "I ___ my supervisor on Monday morning.", answer: "am meeting", distractors: ["meet last Monday", "have meeting"], note: "È un incontro programmato." },
      { sentence: "The team ___ the new version at noon.", answer: "is presenting", distractors: ["presents every noon", "has presented tomorrow"], note: "L'evento è organizzato per un orario futuro." },
      { sentence: "My cousins ___ with us this weekend.", answer: "are staying", distractors: ["stay last weekend", "have stayed next"], note: "È un accordo temporaneo già stabilito." },
    ],
  },
  {
    slug: "future-continuous",
    title: "Future continuous",
    italianTitle: "Azione in corso nel futuro",
    category: "Futuri",
    formula: "will be + verbo in -ing",
    useCases: ["azione in corso a un momento futuro", "evento previsto come parte di una routine", "domanda cortese sui programmi"],
    signals: ["this time tomorrow", "at 8 tomorrow", "all afternoon"],
    examples: ["This time tomorrow, we'll be flying.", "Will you be using the car?"],
    examplesIT: ["Domani a quest'ora staremo volando.", "Userai la macchina?"],
    mistakes: ["Usarlo per un'azione completata entro una scadenza.", "Dimenticare be dopo will."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "This time tomorrow, we ___ over the Atlantic.", answer: "will be flying", distractors: ["will have flown", "are flew"], note: "L'azione sarà in corso in un preciso momento futuro." },
      { sentence: "At eight tonight, I ___ the webinar.", answer: "will be watching", distractors: ["will have watched", "watch yesterday"], note: "L'attività sarà in svolgimento alle otto." },
      { sentence: "___ you be using the meeting room this afternoon?", answer: "Will", distractors: ["Do", "Have"], note: "È una domanda cortese sui programmi previsti." },
      { sentence: "Do not call at six; we ___ dinner.", answer: "will be having", distractors: ["will have had", "have yesterday"], note: "La cena sarà in corso alle sei." },
      { sentence: "The train ___ through the mountains for most of the journey.", answer: "will be travelling", distractors: ["will travelled", "has travel"], note: "Descrive il processo previsto durante il viaggio." },
      { sentence: "Next month, she ___ from the Berlin office.", answer: "will be working", distractors: ["will have worked", "worked next"], note: "È una situazione che sarà in corso in un periodo futuro." },
      { sentence: "When you arrive, I ___ near the entrance.", answer: "will be waiting", distractors: ["will have waited", "waited"], note: "L'attesa sarà in corso al momento dell'arrivo." },
      { sentence: "They ___ the road all week, so expect delays.", answer: "will be repairing", distractors: ["will have repaired before", "repair last"], note: "L'attività coprirà un intervallo futuro." },
    ],
  },
  {
    slug: "future-perfect-simple",
    title: "Future perfect simple",
    italianTitle: "Azione completata entro il futuro",
    category: "Futuri",
    formula: "will have + participio passato",
    useCases: ["azione completata entro una scadenza futura", "risultato raggiunto prima di un evento futuro", "quantità accumulata entro il futuro"],
    signals: ["by", "by the time", "before", "within"],
    examples: ["By Friday, I will have finished.", "They will have left before noon."],
    examplesIT: ["Entro venerdì avrò finito.", "Saranno partiti prima di mezzogiorno."],
    mistakes: ["Usarlo per un'azione semplicemente in corso nel futuro.", "Usare il past simple dopo will have."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "By Friday, I ___ the report.", answer: "will have finished", distractors: ["will be finishing", "have finish"], note: "By Friday fissa una scadenza entro cui il risultato sarà completo." },
      { sentence: "They ___ by the time we arrive.", answer: "will have left", distractors: ["will be leaving now", "have leave"], note: "La partenza sarà anteriore al nostro arrivo futuro." },
      { sentence: "Next month, she ___ ten years at the company.", answer: "will have completed", distractors: ["will be completing daily", "completed next"], note: "Si misura un traguardo raggiunto entro una data futura." },
      { sentence: "How many units ___ you have completed by June?", answer: "will", distractors: ["do", "are"], note: "La domanda usa will have + participio." },
      { sentence: "The builders ___ the bridge before winter.", answer: "will have repaired", distractors: ["will repairing", "have repair"], note: "Before winter indica il limite di completamento." },
      { sentence: "By then, everyone ___ the instructions.", answer: "will have received", distractors: ["will receiving", "has receive"], note: "La ricezione sarà completata entro quel momento." },
      { sentence: "Within two years, the city ___ 5,000 trees.", answer: "will have planted", distractors: ["will be plant", "planted tomorrow"], note: "La quantità sarà raggiunta entro un periodo futuro." },
      { sentence: "I ___ all my exams before the summer begins.", answer: "will have taken", distractors: ["will be take", "have took"], note: "Gli esami saranno conclusi prima dell'inizio dell'estate." },
    ],
  },
  {
    slug: "future-perfect-continuous",
    title: "Future perfect continuous",
    italianTitle: "Durata fino a un momento futuro",
    category: "Futuri",
    formula: "will have been + verbo in -ing",
    useCases: ["durata di un'attività fino a un punto futuro", "processo continuato prima di un risultato futuro", "enfasi sul tempo trascorso"],
    signals: ["for ... by", "by next month", "when"],
    examples: ["By June, I'll have been working here for a year.", "They'll have been travelling for ten hours."],
    examplesIT: ["A giugno sarà un anno che lavoro qui.", "Avranno viaggiato per dieci ore."],
    mistakes: ["Usarlo con verbi di stato.", "Usarlo quando interessa soltanto il risultato completato."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "By June, I ___ here for a year.", answer: "will have been working", distractors: ["will be worked", "have work"], note: "La frase misura la durata fino a giugno." },
      { sentence: "When we land, we ___ for twelve hours.", answer: "will have been travelling", distractors: ["will travel yesterday", "have travelled now"], note: "Il viaggio continuerà fino al momento dell'atterraggio." },
      { sentence: "Next week, she ___ for the exam for three months.", answer: "will have been preparing", distractors: ["will preparing", "has prepared next"], note: "Conta la durata accumulata entro la prossima settimana." },
      { sentence: "By midnight, the technicians ___ all day.", answer: "will have been testing", distractors: ["will have test", "tested tomorrow"], note: "All day enfatizza la continuità fino a mezzanotte." },
      { sentence: "How long ___ you have been living abroad by then?", answer: "will", distractors: ["do", "are"], note: "La domanda richiede will have been + -ing." },
      { sentence: "In September, they ___ the service for five years.", answer: "will have been running", distractors: ["will run yesterday", "have ran"], note: "La gestione continua fino a settembre." },
      { sentence: "By the end of the shift, he ___ for eight hours.", answer: "will have been driving", distractors: ["will drive last", "has drove"], note: "La durata è misurata al termine del turno." },
      { sentence: "When the review begins, researchers ___ data for a decade.", answer: "will have been collecting", distractors: ["will collected", "have collect"], note: "Il processo prolungato continuerà fino alla revisione futura." },
    ],
  },
  {
    slug: "used-to-would",
    title: "Used to and would",
    italianTitle: "Abitudini e stati passati",
    category: "Forme speciali",
    formula: "used to + verbo; would + verbo per azioni ripetute",
    useCases: ["abitudine passata non più vera", "stato passato cambiato", "azione ripetuta in un racconto"],
    signals: ["when I was", "in those days", "every summer", "before"],
    examples: ["I used to live near the sea.", "Every summer, we would camp there."],
    examplesIT: ["Una volta abitavo vicino al mare.", "Ogni estate andavamo in campeggio lì."],
    mistakes: ["Usare would per stati come know, own o be.", "Confondere used to con be used to + -ing."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "I ___ live near the station, but I moved last year.", answer: "used to", distractors: ["am used to", "would be"], note: "Descrive uno stato passato non più vero." },
      { sentence: "Every summer, my grandfather ___ take us fishing.", answer: "would", distractors: ["used being", "was used to"], note: "Would descrive un'azione ripetuta in un racconto passato." },
      { sentence: "She ___ have very long hair when she was younger.", answer: "used to", distractors: ["would having", "is used to"], note: "Have qui è uno stato; used to è la scelta adatta." },
      { sentence: "Did you ___ play outside after school?", answer: "use to", distractors: ["used to", "using to"], note: "Dopo did si usa la forma base use to." },
      { sentence: "We ___ not use to order food online.", answer: "did", distractors: ["were", "had"], note: "La negazione standard è did not use to." },
      { sentence: "On winter evenings, we ___ sit by the fire and tell stories.", answer: "would", distractors: ["are used to", "use to be"], note: "È un'azione abituale ripetuta nel passato." },
      { sentence: "There ___ be a cinema here before the supermarket was built.", answer: "used to", distractors: ["would", "is used to"], note: "Per l'esistenza passata si usa used to, non would." },
      { sentence: "I am now used to ___ early.", answer: "getting up", distractors: ["get up", "got up"], note: "Be used to significa essere abituati ed è seguito da -ing." },
    ],
  },
  {
    slug: "conditionals",
    title: "Conditional forms",
    italianTitle: "Periodo ipotetico completo",
    category: "Forme speciali",
    formula: "zero, first, second, third e mixed conditionals",
    useCases: ["verità generali", "possibilità reali", "ipotesi presenti", "rimpianti passati", "risultati presenti di cause passate"],
    signals: ["if", "unless", "provided", "as long as", "would"],
    examples: ["If you heat ice, it melts.", "If I had known, I would have called."],
    examplesIT: ["Se scaldi il ghiaccio, si scioglie.", "Se l'avessi saputo, avrei chiamato."],
    mistakes: ["Usare will nella if-clause standard.", "Confondere il secondo e il terzo condizionale."],
    youtubeId: "L9AWrJuqaQA",
    seeds: [
      { sentence: "If you heat ice, it ___.", answer: "melts", distractors: ["will melt", "would melt"], note: "Lo zero conditional descrive una verità generale." },
      { sentence: "If the weather improves, we ___ for a walk.", answer: "will go", distractors: ["would go", "went"], note: "È una possibilità reale futura: first conditional." },
      { sentence: "If I ___ more confident, I would apply for that job.", answer: "were", distractors: ["am", "will be"], note: "È un'ipotesi irreale nel presente: second conditional." },
      { sentence: "If they had left earlier, they ___ the train.", answer: "would have caught", distractors: ["would catch", "caught"], note: "Si immagina un risultato passato diverso: third conditional." },
      { sentence: "If I had accepted the offer, I ___ in Berlin now.", answer: "would be living", distractors: ["would have lived", "will live"], note: "Causa passata e risultato presente formano un mixed conditional." },
      { sentence: "Unless you ___ now, you will miss the bus.", answer: "leave", distractors: ["will leave", "would leave"], note: "Unless equivale a if not e regge il present simple." },
      { sentence: "Provided that everyone agrees, we ___ the plan tomorrow.", answer: "will approve", distractors: ["approved", "would have approved"], note: "La condizione è reale e riguarda il futuro." },
      { sentence: "If she ___ the warning, she would not be in trouble now.", answer: "had followed", distractors: ["followed", "would follow"], note: "Una causa passata non realizzata produce un risultato presente." },
    ],
  },
];

type PracticeVerb = {
  base: string;
  third: string;
  past: string;
  participle: string;
  ing: string;
  object: string;
};

type PracticeSubject = {
  label: string;
  thirdPerson: boolean;
  bePresent: "am" | "is" | "are";
  bePast: "was" | "were";
  have: "have" | "has";
};

const practiceSubjects: PracticeSubject[] = [
  { label: "I", thirdPerson: false, bePresent: "am", bePast: "was", have: "have" },
  { label: "you", thirdPerson: false, bePresent: "are", bePast: "were", have: "have" },
  { label: "we", thirdPerson: false, bePresent: "are", bePast: "were", have: "have" },
  { label: "they", thirdPerson: false, bePresent: "are", bePast: "were", have: "have" },
  { label: "she", thirdPerson: true, bePresent: "is", bePast: "was", have: "has" },
  { label: "he", thirdPerson: true, bePresent: "is", bePast: "was", have: "has" },
  { label: "the project team", thirdPerson: true, bePresent: "is", bePast: "was", have: "has" },
  { label: "the course tutor", thirdPerson: true, bePresent: "is", bePast: "was", have: "has" },
];

const practiceVerbs: PracticeVerb[] = [
  { base: "review", third: "reviews", past: "reviewed", participle: "reviewed", ing: "reviewing", object: "the weekly figures" },
  { base: "prepare", third: "prepares", past: "prepared", participle: "prepared", ing: "preparing", object: "the client presentation" },
  { base: "write", third: "writes", past: "wrote", participle: "written", ing: "writing", object: "the project summary" },
  { base: "send", third: "sends", past: "sent", participle: "sent", ing: "sending", object: "the confirmation emails" },
  { base: "analyse", third: "analyses", past: "analysed", participle: "analysed", ing: "analysing", object: "the survey results" },
  { base: "organise", third: "organises", past: "organised", participle: "organised", ing: "organising", object: "the training sessions" },
  { base: "lead", third: "leads", past: "led", participle: "led", ing: "leading", object: "the team meetings" },
  { base: "choose", third: "chooses", past: "chose", participle: "chosen", ing: "choosing", object: "the most suitable supplier" },
  { base: "build", third: "builds", past: "built", participle: "built", ing: "building", object: "a working prototype" },
  { base: "solve", third: "solves", past: "solved", participle: "solved", ing: "solving", object: "the technical problems" },
  { base: "take", third: "takes", past: "took", participle: "taken", ing: "taking", object: "detailed notes" },
  { base: "make", third: "makes", past: "made", participle: "made", ing: "making", object: "backup copies" },
  { base: "update", third: "updates", past: "updated", participle: "updated", ing: "updating", object: "the shared calendar" },
  { base: "check", third: "checks", past: "checked", participle: "checked", ing: "checking", object: "the final calculations" },
  { base: "deliver", third: "delivers", past: "delivered", participle: "delivered", ing: "delivering", object: "the new equipment" },
  { base: "plan", third: "plans", past: "planned", participle: "planned", ing: "planning", object: "the next campaign" },
  { base: "read", third: "reads", past: "read", participle: "read", ing: "reading", object: "the safety instructions" },
  { base: "speak", third: "speaks", past: "spoke", participle: "spoken", ing: "speaking", object: "to the new customers" },
  { base: "drive", third: "drives", past: "drove", participle: "driven", ing: "driving", object: "to the regional office" },
  { base: "meet", third: "meets", past: "met", participle: "met", ing: "meeting", object: "the external consultants" },
  { base: "teach", third: "teaches", past: "taught", participle: "taught", ing: "teaching", object: "the evening classes" },
  { base: "run", third: "runs", past: "ran", participle: "run", ing: "running", object: "the community workshops" },
  { base: "set", third: "sets", past: "set", participle: "set", ing: "setting", object: "realistic deadlines" },
  { base: "grow", third: "grows", past: "grew", participle: "grown", ing: "growing", object: "the local support network" },
];

function generatedVerbSeed(
  topic: VerbTopicDefinition,
  verb: PracticeVerb,
  verbIndex: number,
  variant: number,
): VerbSeed {
  const subject = practiceSubjects[(verbIndex + variant * 3) % practiceSubjects.length];
  const sentenceSubject =
    subject.label === "I"
      ? "I"
      : `${subject.label.charAt(0).toUpperCase()}${subject.label.slice(1)}`;
  const present = subject.thirdPerson ? verb.third : verb.base;
  const rootHint = `(${verb.base})`;
  const duration = ["for two hours", "since early this morning", "all week", "lately"][variant];

  switch (topic.slug) {
    case "present-simple":
      return {
        sentence: [
          `${sentenceSubject} usually ___ ${verb.object}. ${rootHint}`,
          `Every Monday, ${subject.label} ___ ${verb.object}. ${rootHint}`,
          `${sentenceSubject} often ___ ${verb.object}. ${rootHint}`,
          `${sentenceSubject} rarely ___ ${verb.object}. ${rootHint}`,
        ][variant],
        answer: present,
        distractors: [`${subject.bePresent} ${verb.ing}`, verb.past],
        note: "L'espressione di frequenza presenta un'abitudine o una routine, quindi serve il present simple.",
      };
    case "present-continuous":
      return {
        sentence: `${["At the moment", "This week", "Right now", "Currently"][variant]}, ${subject.label} ___ ${verb.object}. ${rootHint}`,
        answer: `${subject.bePresent} ${verb.ing}`,
        distractors: [present, `${subject.have} ${verb.participle}`],
        note: "Il contesto descrive un'attività temporanea o in corso nel presente.",
      };
    case "present-perfect-simple":
      return {
        sentence: `${["So far this week", "Up to now", "Already this month", "Since the project began"][variant]}, ${subject.label} ___ ${verb.object}. ${rootHint}`,
        answer: `${subject.have} ${verb.participle}`,
        distractors: [verb.past, present],
        note: "Il periodo arriva fino al presente e mette in evidenza il risultato.",
      };
    case "present-perfect-continuous":
      return {
        sentence: `${sentenceSubject} ___ ${verb.object} ${duration}, and the activity is still in progress. ${rootHint}`,
        answer: `${subject.have} been ${verb.ing}`,
        distractors: [`${subject.bePresent} ${verb.ing}`, `${subject.have} ${verb.participle}`],
        note: "La durata continua fino al presente e l'attività non è ancora conclusa.",
      };
    case "past-simple":
      return {
        sentence: `${["Yesterday", "Last Tuesday", "Two days ago", "During the previous meeting"][variant]}, ${subject.label} ___ ${verb.object}. ${rootHint}`,
        answer: verb.past,
        distractors: [`${subject.have} ${verb.participle}`, `${subject.bePast} ${verb.ing}`],
        note: "Il riferimento temporale è concluso, quindi si usa il past simple.",
      };
    case "past-continuous":
      return {
        sentence: `${["At nine yesterday", "When the manager called", "While everyone else was waiting", "At that exact moment"][variant]}, ${subject.label} ___ ${verb.object}. ${rootHint}`,
        answer: `${subject.bePast} ${verb.ing}`,
        distractors: [verb.past, `had ${verb.participle}`],
        note: "L'attività era in corso in un preciso momento del passato.",
      };
    case "past-perfect-simple":
      return {
        sentence: `${["By the time the supervisor arrived", "Before the meeting started", "When the client phoned", "By the end of that morning"][variant]}, ${subject.label} ___ ${verb.object}. ${rootHint}`,
        answer: `had ${verb.participle}`,
        distractors: [verb.past, `${subject.have} ${verb.participle}`],
        note: "L'azione era già completata prima di un altro punto nel passato.",
      };
    case "past-perfect-continuous":
      return {
        sentence: `Before the interruption, ${subject.label} ___ ${verb.object} ${["for two hours", "since dawn", "all morning", "for several days"][variant]}. ${rootHint}`,
        answer: `had been ${verb.ing}`,
        distractors: [`${subject.bePast} ${verb.ing}`, `${subject.have} been ${verb.ing}`],
        note: "La frase misura la durata di un processo fino a un momento passato.",
      };
    case "will-future":
      return {
        sentence: `${["I think", "Perhaps", "I am sure", "In my opinion"][variant]} ${subject.label} ___ ${verb.object} ${["tomorrow", "soon", "next week", "in the future"][variant]}. ${rootHint}`,
        answer: `will ${verb.base}`,
        distractors: [`will be ${verb.base}`, `will to ${verb.base}`],
        note: "L'espressione iniziale presenta una previsione o un'opinione sul futuro.",
      };
    case "be-going-to":
      return {
        sentence: `The plan has already been decided. ${sentenceSubject} ___ ${verb.object} ${["tomorrow", "next week", "this weekend", "next month"][variant]}. ${rootHint}`,
        answer: `${subject.bePresent} going to ${verb.base}`,
        distractors: [`going to ${verb.base}`, `${subject.bePresent} going to ${verb.past}`],
        note: "L'intenzione esiste già prima del momento in cui si parla.",
      };
    case "present-continuous-future":
      return {
        sentence: `${sentenceSubject} ___ ${verb.object} ${["tomorrow at ten", "on Friday", "this evening", "next Monday"][variant]}; the arrangement is confirmed. ${rootHint}`,
        answer: `${subject.bePresent} ${verb.ing}`,
        distractors: [`${subject.bePresent} ${verb.base}`, `will ${verb.ing}`],
        note: "Data precisa e accordo confermato rendono naturale il present continuous con valore futuro.",
      };
    case "future-continuous":
      return {
        sentence: `${["This time tomorrow", "At ten next Monday", "When you arrive", "Throughout the afternoon"][variant]}, ${subject.label} ___ ${verb.object}. ${rootHint}`,
        answer: `will be ${verb.ing}`,
        distractors: [`will have ${verb.participle}`, `will ${verb.base}`],
        note: "L'attività sarà in corso in un preciso momento o periodo futuro.",
      };
    case "future-perfect-simple":
      return {
        sentence: `${["By Friday", "Before the client arrives", "Within a week", "By the end of the month"][variant]}, ${subject.label} ___ ${verb.object}. ${rootHint}`,
        answer: `will have ${verb.participle}`,
        distractors: [`will be ${verb.ing}`, `will ${verb.base}`],
        note: "La frase indica un risultato che sarà completato entro una scadenza futura.",
      };
    case "future-perfect-continuous":
      return {
        sentence: `${["By noon", "By next Friday", "When the review begins", "By the end of the month"][variant]}, ${subject.label} ___ ${verb.object} ${["for three hours", "for two weeks", "since January", "for several months"][variant]}. ${rootHint}`,
        answer: `will have been ${verb.ing}`,
        distractors: [`will be ${verb.ing}`, `will have ${verb.participle}`],
        note: "L'enfasi è sulla durata accumulata fino a un momento futuro.",
      };
    case "used-to-would":
      return variant % 2 === 0
        ? {
            sentence: `${sentenceSubject} ___ ${verb.object}, but that is no longer true. ${rootHint}`,
            answer: `used to ${verb.base}`,
            distractors: [`would have ${verb.participle}`, `${subject.bePresent} used to ${verb.ing}`],
            note: "Used to descrive un'abitudine passata che non continua nel presente.",
          }
        : {
            sentence: `During that period, ${subject.label} ___ ${verb.object} every Friday. ${rootHint}`,
            answer: `would ${verb.base}`,
            distractors: [`used to ${verb.ing}`, `${subject.bePast} used to ${verb.base}`],
            note: "Would può descrivere un'azione ripetuta in un racconto passato.",
          };
    case "conditionals":
      if (variant === 0) return {
        sentence: `If ${subject.label} ___ ${verb.object}, the work usually becomes easier. ${rootHint}`,
        answer: present,
        distractors: [`will ${verb.base}`, `would ${verb.base}`],
        note: "È una conseguenza generale: entrambe le parti usano il present simple.",
      };
      if (variant === 1) return {
        sentence: `If there is enough time, ${subject.label} ___ ${verb.object} tomorrow. ${rootHint}`,
        answer: `will ${verb.base}`,
        distractors: [`would ${verb.base}`, verb.past],
        note: "È una possibilità reale nel futuro: first conditional.",
      };
      if (variant === 2) return {
        sentence: `If there were fewer interruptions, ${subject.label} ___ ${verb.object} more carefully. ${rootHint}`,
        answer: `would ${verb.base}`,
        distractors: [`will ${verb.base}`, `would have ${verb.participle}`],
        note: "È un'ipotesi irreale nel presente: second conditional.",
      };
      return {
        sentence: `If the information had arrived earlier, ${subject.label} ___ ${verb.object} before the deadline. ${rootHint}`,
        answer: `would have ${verb.participle}`,
        distractors: [`would ${verb.base}`, `will have ${verb.participle}`],
        note: "La condizione passata non si è realizzata: third conditional.",
      };
    default:
      return topic.seeds[verbIndex % topic.seeds.length];
  }
}

export const verbTenseTopics: VerbTenseTopic[] = definitions.map(
  ({ slug, title, italianTitle, category, formula, useCases, signals, examples, examplesIT, mistakes, youtubeId }) => ({
    slug,
    title,
    italianTitle,
    category,
    formula,
    useCases,
    signals,
    examples,
    examplesIT,
    mistakes,
    youtubeId,
  }),
);

const EXERCISE_TYPES = ["multiple-choice", "fill-gap", "error-correction", "verb-tense"] as const;

const coreVerbTenseExercises: Exercise[] = definitions.flatMap(
  (topic, topicIndex) =>
    topic.seeds.map((seed, seedIndex) => {
      // Each seed gets ONE exercise type, rotating through all 4 types across seeds.
      // This ensures all 8 sentences are different - no sentence is repeated.
      const typeIndex = (topicIndex + seedIndex) % EXERCISE_TYPES.length;
      const type = EXERCISE_TYPES[typeIndex];

      const labels = [seed.answer, ...seed.distractors];
      const offset = (topicIndex + seedIndex) % labels.length;
      const options = [...labels.slice(offset), ...labels.slice(0, offset)].map(
        (label, optionIndex) => ({ id: String(optionIndex), label }),
      );

      const incorrectSentence = seed.sentence.replace("___", seed.distractors[0]);
      const question = type === "error-correction" ? incorrectSentence : seed.sentence;

      const instructions =
        type === "multiple-choice"
          ? "Scegli la forma verbale corretta per il contesto."
          : type === "fill-gap"
            ? "Scrivi la forma verbale completa, senza abbreviazioni."
            : type === "error-correction"
              ? "La forma verbale nella frase non è adatta al contesto. Scrivi soltanto la forma corretta."
              : `Completa senza opzioni. Prima individua il rapporto temporale, poi applica ${topic.title}.`;

      const estimatedTime =
        type === "multiple-choice" ? 45 : type === "fill-gap" ? 60 : type === "error-correction" ? 65 : 75;

      const number = String(seedIndex + 1).padStart(2, "0");

      return {
        id: `verb-${topic.slug}-${number}-${type}`,
        type,
        section: "grammar" as const,
        topic: topic.title,
        difficulty: "b2" as const,
        level: "B2" as const,
        question,
        instructions,
        options: type === "multiple-choice" ? options : undefined,
        correctAnswer: seed.answer,
        explanation: seed.note,
        grammarRule: `${topic.formula}. ${topic.useCases.join("; ")}.`,
        examples: topic.examples.map((english) => ({ english })),
        tags: ["verbs", "b2", topic.slug],
        estimatedTime,
        source: "original" as const,
        createdAt,
      } satisfies Exercise;
    }),
);

const extendedVerbTenseExercises: Exercise[] = definitions.flatMap(
  (topic, topicIndex) =>
    practiceVerbs.flatMap((verb, verbIndex) =>
      Array.from({ length: 4 }, (_, variant) => {
        const seed = generatedVerbSeed(topic, verb, verbIndex, variant);
        const formatIndex = (verbIndex + variant) % 4;
        const type = [
          "multiple-choice",
          "fill-gap",
          "error-correction",
          "verb-tense",
        ][formatIndex] as Exercise["type"];
        const distractorPool = [
          ...seed.distractors,
          verb.base,
          verb.third,
          verb.past,
          `had ${verb.participle}`,
          `will ${verb.base}`,
          `is ${verb.ing}`,
        ];
        const distinctDistractors = distractorPool.filter(
          (label, labelIndex, allLabels) =>
            label.toLowerCase() !== seed.answer.toLowerCase() &&
            allLabels.findIndex(
              (candidate) => candidate.toLowerCase() === label.toLowerCase(),
            ) === labelIndex,
        ).slice(0, 2);
        const labels = [seed.answer, ...distinctDistractors];
        const offset = (topicIndex + verbIndex + variant) % labels.length;
        const options = [...labels.slice(offset), ...labels.slice(0, offset)].map(
          (label, optionIndex) => ({ id: String(optionIndex), label }),
        );
        const question =
          type === "error-correction"
            ? seed.sentence.replace("___", seed.distractors[0])
            : seed.sentence;
        const instructions =
          type === "multiple-choice"
            ? "Scegli la forma verbale corretta per il contesto."
            : type === "error-correction"
              ? "La forma verbale nella frase è sbagliata. Scrivi soltanto la forma corretta."
              : type === "verb-tense"
                ? `Completa senza opzioni applicando correttamente ${topic.title}.`
                : "Scrivi la forma verbale completa, senza abbreviazioni.";

        return {
          id: `verb-${topic.slug}-extra-${String(verbIndex + 1).padStart(2, "0")}-${variant + 1}`,
          type,
          section: "grammar",
          topic: topic.title,
          difficulty: "b2",
          level: "B2",
          question,
          instructions,
          options: type === "multiple-choice" ? options : undefined,
          correctAnswer: seed.answer,
          explanation: seed.note,
          grammarRule: `${topic.formula}. ${topic.useCases.join("; ")}.`,
          examples: topic.examples.map((english) => ({ english })),
          tags: ["verbs", "b2", topic.slug, "extended-practice"],
          estimatedTime: type === "multiple-choice" ? 45 : 65,
          source: "original",
          createdAt,
        } satisfies Exercise;
      }),
    ),
);

export const verbTenseExercises: Exercise[] = [
  ...coreVerbTenseExercises,
  ...extendedVerbTenseExercises,
];
