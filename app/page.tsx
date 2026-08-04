import Link from "next/link";
import {
  ArrowRight,
  BookType,
  BrainCircuit,
  Check,
  Headphones,
  Languages,
  Sparkles,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  grammarExercises,
  listeningActivities,
  readingPassages,
  vocabularyItems,
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
    title: "Listening",
    detail: `${listeningActivities.length} prove audio con due ascolti`,
    href: "/listening",
    icon: Headphones,
    tone: "lilac",
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
            Un percorso concentrato su quattro aree: il lessico che serve davvero,
            tutti i tempi verbali, reading completi e listening in stile esame.
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

        <div className="four-path-preview" aria-label="Le quattro sezioni del percorso">
          <header>
            <span>IL PERCORSO COMPLETO</span>
            <b>4 sezioni</b>
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

      <section className="landing-four-pillars" aria-label="Contenuti del percorso">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link href={section.href} key={section.href}>
              <Icon />
              <span>{section.number}</span>
              <h2>{section.title}</h2>
              <p>{section.detail}</p>
              <b>Apri la sezione <ArrowRight size={15} /></b>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
