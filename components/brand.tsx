import Link from "next/link";
export function Brand({ compact = false }: { compact?: boolean }) { return <Link className="brand" href="/" aria-label="B2 Trainer, home"><span className="brand-mark">B2</span>{!compact && <span>B2 Trainer</span>}</Link>; }
