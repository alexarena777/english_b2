import Link from "next/link";
import {
  ArrowRight,
  BookType,
  BrainCircuit,
  Check,
  Headphones,
  Languages,
  PenTool,
  Sparkles,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  grammarExercises,
  listeningActivities,
  readingPassages,
  vocabularyItems,
  useOfEnglishExercises,
} from "@/lib/data";

const sections = [
  {
    number: "01",
    title: "Vocabolario",
    detail: `${vocabularyItems.length} parole ed espressioni B2`,
    href: "/vocabulary",
    icon: Languages,
    tone: "mint",
  },
  {
    number: "02",
    title: "Verbi e tempi",
    detail: `${grammarExercises.length} esercizi di coniugazione e uso`,
    href: "/grammar",
    icon: BookType,
    tone: "amber",
  },
  {
    number: "03",
    title: "Reading",
    detail: `${readingPassages.length} testi completi di livello B2`,
    href: "/reading",
    icon: BrainCircuit,
    tone: "blue",
  },
  {
    number: "04",
    title: "Use of English",
    detail: `${useOfEnglishExercises.length} test Cambridge (Cloze, Word Formation)`,
    href: "/use-of-english",
    icon: Sparkles,
    tone: "purple",
  },
  {
    number: "05",
    title: "Listening",
    detail: `${listeningActivities.length} prove audio con due ascolti`,
    href: "/listening",
    icon: Headphones,
    tone: "lilac",
  },
  {
    number: "06",
    title: "Writing",
    detail: `Bozze e valutazione AI su temi ed essay B2`,
    href: "/writing",
    icon: PenTool,
    tone: "amber",
  },
];

export default function Home() {
  return (
    <main className="landing-shell new-landing">
      <nav className="landing-nav" aria-label="Navigazione principale">
        <Brand />
        <div className="landing-links">
          <Link href="/vocabulary">Vocabolario</Link>
          <Link href="/grammar">Verbi</Link>
          <Link href="/reading">Reading</Link>
          <Link href="/listening">Listening</Link>
          <Button asChild size="sm">
            <Link href="/assessment">Test iniziale</Link>
          </Button>
        </div>
      </nav>

      <section className="hero-section new-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={15} /> Preparazione B2 per studenti italiani
          </div>
          <h1>
            Il B2 si costruisce
            <br />
            <span>una competenza alla volta.</span>
          </h1>
          <p>
            Un percorso concentrato su sei aree: il lessico che serve davvero,
            tutti i tempi verbali, Use of English Cambridge, reading, listening e writing in stile esame.
          </p>
          <div className="hero-actions">
            <Button asChild size="lg">
              <Link href="/assessment">
                Fai il test senza writing <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Apri il percorso</Link>
            </Button>
          </div>
          <div className="hero-checks">
            <span><Check size={15} /> Esercizi originali B2</span>
            <span><Check size={15} /> Spiegazioni in italiano</span>
            <span><Check size={15} /> Progressi solo da attività reali</span>
          </div>
        </div>

        <div className="four-path-preview" aria-label="Le sei sezioni del percorso">
          <header>
            <span>IL PERCORSO COMPLETO</span>
            <b>6 sezioni</b>
          </header>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link href={section.href} key={section.href} className={section.tone}>
                <span>{section.number}</span>
                <i><Icon /></i>
                <div>
                  <b>{section.title}</b>
                  <small>{section.detail}</small>
                </div>
                <ArrowRight size={17} />
              </Link>
            );
          })}
          <footer>
            Il risultato del test compare solo dopo le tue 28 risposte.
          </footer>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 py-10" aria-label="Contenuti del percorso">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link href={section.href} key={section.href} className="relative flex flex-col justify-between min-h-[190px] p-5 border border-[var(--line)] rounded-[20px] bg-[var(--card)] transition-all hover:-translate-y-1 hover:border-[var(--green)] hover:shadow-lg">
              <Icon className="text-[var(--green)]" size={28} />
              <span className="absolute right-4 top-4 text-[var(--muted)] text-[10px] font-extrabold">{section.number}</span>
              <div>
                <h2 className="font-serif text-[18px] mb-2 leading-tight">{section.title}</h2>
                <p className="text-[var(--muted)] text-[11px] leading-snug">{section.detail}</p>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
