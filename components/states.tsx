import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";
export function LoadingState({ label = "Caricamento…" }: { label?: string }) { return <div className="state-box" role="status"><LoaderCircle className="spin" /><p>{label}</p></div>; }
export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) { return <div className="state-box"><Inbox /><h3>{title}</h3><p>{description}</p>{action}</div>; }
export function ErrorState({ message = "Qualcosa non ha funzionato. Riprova tra poco." }: { message?: string }) { return <div className="state-box error" role="alert"><AlertTriangle /><h3>Ops</h3><p>{message}</p></div>; }
