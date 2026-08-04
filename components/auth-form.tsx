import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { chatGPTSignInPath } from "@/app/chatgpt-auth";
import { Brand } from "./brand";
import { Button } from "./ui/button";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const returnTo = isLogin ? "/dashboard" : "/assessment";
  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <Brand />
        <div>
          <span>STUDIA CON UN PIANO</span>
          <h1>
            Ogni errore indica
            <br />
            il prossimo passo.
          </h1>
          <p>
            B2 Trainer misura le aree da consolidare e organizza il ripasso al
            momento giusto.
          </p>
          <ul>
            <li>
              <CheckCircle2 /> Sessioni quotidiane adattive
            </li>
            <li>
              <CheckCircle2 /> Spiegazioni complete in italiano
            </li>
            <li>
              <CheckCircle2 /> Progressi sincronizzati tra dispositivi
            </li>
          </ul>
        </div>
        <small>Contenuti originali · Speaking privato sul dispositivo</small>
      </section>
      <section className="auth-form-panel">
        <div className="auth-mobile-brand">
          <Brand />
        </div>
        <div className="auth-form-wrap">
          <span>{isLogin ? "BENTORNATO" : "CREA IL TUO PERCORSO"}</span>
          <h1>{isLogin ? "Accedi a B2 Trainer" : "Inizia la preparazione"}</h1>
          <p>
            {isLogin
              ? "Riprendi i tuoi progressi su qualsiasi dispositivo."
              : "Il test iniziale richiede circa 40 minuti e genera il tuo piano."}
          </p>
          <div className="auth-sso-note">
            <ShieldCheck size={22} />
            <div>
              <b>Accesso sicuro con ChatGPT</b>
              <p>
                Non gestiamo password. Il sito riceve solo l’identità necessaria
                a salvare i tuoi progressi.
              </p>
            </div>
          </div>
          <Button asChild size="lg">
            <Link href={chatGPTSignInPath(returnTo)}>
              Continua con ChatGPT <ArrowRight size={18} />
            </Link>
          </Button>
          <div className="auth-divider">
            <span>oppure</span>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard?demo=1">Guarda la demo con dati di esempio</Link>
          </Button>
          <p className="auth-switch">
            {isLogin ? "Prima volta qui?" : "Hai già iniziato?"}{" "}
            <Link href={isLogin ? "/register" : "/login"}>
              {isLogin ? "Scopri come funziona" : "Accedi"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
