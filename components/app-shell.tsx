"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookType, BrainCircuit, ChevronRight, ClipboardCheck, Flame, Headphones, House, Languages, Moon, RefreshCcw, Settings, Sun } from "lucide-react";
import { Brand } from "./brand";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useProgress } from "./providers";
import { deriveLearningProfile } from "@/lib/learning-profile";
import { Button } from "./ui/button";

const studyNav = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/vocabulary", label: "Vocabolario", icon: Languages },
  { href: "/grammar", label: "Verbi e tempi", icon: BookType },
  { href: "/reading", label: "Reading", icon: BrainCircuit },
  { href: "/listening", label: "Listening", icon: Headphones },
];
const progressNav = [
  { href: "/assessment", label: "Test iniziale", icon: ClipboardCheck },
  { href: "/review", label: "Ripasso errori", icon: RefreshCcw },
  { href: "/statistics", label: "Progressi", icon: BarChart3 },
];
const mobile = studyNav;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const { state, storageMode, syncStatus, resetDemo } = useProgress(); const [dark, setDark] = useState(false);
  const learningProfile = deriveLearningProfile(state);
  const [now, setNow] = useState(0);
  const weeklyDays = useMemo(() => {
    const threshold = now - 6 * 86400000;
    const dates = [
      ...state.answers
        .filter((item) => ["grammar", "vocabulary", "reading", "listening"].includes(item.section))
        .map((item) => item.answeredAt),
      ...state.vocabularyProgress.flatMap((item) => item.lastReviewedAt ? [item.lastReviewedAt] : []),
    ];
    return new Set(dates.filter((date) => new Date(date).getTime() >= threshold).map((date) => date.slice(0, 10))).size;
  }, [state.answers, state.vocabularyProgress, now]);
  useEffect(() => { queueMicrotask(() => { setNow(Date.now()); const savedDark = localStorage.getItem("b2-theme") === "dark"; setDark(savedDark); document.documentElement.classList.toggle("dark", savedDark); document.documentElement.classList.toggle("high-contrast", localStorage.getItem("b2-contrast") === "high"); }); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  function toggleTheme() { const next = !dark; setDark(next); localStorage.setItem("b2-theme", next ? "dark" : "light"); document.documentElement.classList.toggle("dark", next); }
  function exitDemo() { resetDemo(); window.location.assign("/dashboard"); }
  const modeLabel = storageMode === "account" ? (syncStatus === "error" ? "Sincronizzazione sospesa" : "Account sincronizzato") : storageMode === "demo" ? "Modalità demo" : storageMode === "loading" ? "Caricamento…" : "Salvataggio locale";
  return <div className="app-frame">
    <aside className="sidebar">
      <div className="sidebar-brand"><Brand /></div>
      <nav className="sidebar-nav" aria-label="Sezioni di studio">
        <p>LE QUATTRO SEZIONI</p>
        {studyNav.map((item) => <NavItem key={item.href} {...item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />)}
        <p>VERIFICA E PROGRESSI</p>
        {progressNav.map((item) => <NavItem key={item.href} {...item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />)}
      </nav>
      <div className="sidebar-goal">
        <div><span>Obiettivo settimanale</span><b>{weeklyDays} / {state.weeklyGoal} giorni</b></div>
        <div className="tiny-progress"><i style={{ width: `${Math.min(100, weeklyDays / state.weeklyGoal * 100)}%` }} /></div>
        <small>{weeklyDays >= state.weeklyGoal ? "Obiettivo raggiunto" : `${state.weeklyGoal - weeklyDays} giorni ancora da completare`}</small>
      </div>
      <div className="sidebar-profile"><span className="avatar">{state.profileName.slice(0, 1).toUpperCase()}</span><div><b>{state.profileName}</b><small>{modeLabel}</small></div><Link href="/profile" aria-label="Apri profilo"><ChevronRight size={18} /></Link></div>
    </aside>
    <div className="app-main">
      <header className="topbar">
        <div className="mobile-brand"><Brand compact /></div>
        <span className="level-chip">{state.assessmentComplete ? <>Livello stimato <b>{learningProfile.level}</b></> : <>Livello <b>Da calcolare</b></>}</span>
        <div className="topbar-actions"><span className="streak"><Flame size={17} /> {state.streak} giorni</span><span className="xp">{state.xp.toLocaleString("it-IT")} XP</span><button className="icon-button" onClick={toggleTheme} aria-label={dark ? "Attiva tema chiaro" : "Attiva tema scuro"}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button><Link className="icon-button" href="/settings" aria-label="Impostazioni"><Settings size={18} /></Link></div>
      </header>
      <main className="page-content">
        {storageMode === "demo" && <div className="demo-notice" role="status"><div><b>Stai guardando dati di esempio</b><span>Questi non sono i tuoi progressi e non vengono salvati nel tuo account.</span></div><Button size="sm" variant="outline" onClick={exitDemo}>Torna ai miei progressi</Button></div>}
        {children}
      </main>
    </div>
    <nav className="mobile-nav" aria-label="Navigazione mobile">
      {mobile.map((item) => <NavItem key={item.href} {...item} active={pathname === item.href} mobile />)}
    </nav>
  </div>;
}

function NavItem({ href, label, icon: Icon, active, mobile = false }: { href: string; label: string; icon: typeof House; active: boolean; mobile?: boolean }) { return <Link className={cn(mobile ? "mobile-nav-item" : "nav-item", active && "active")} href={href} aria-current={active ? "page" : undefined}><Icon size={mobile ? 21 : 18} /><span>{mobile && label === "Verbi e tempi" ? "Verbi" : label}</span></Link>; }

export function AppPage({ children }: { children: React.ReactNode }) { return <AppShell>{children}</AppShell>; }
