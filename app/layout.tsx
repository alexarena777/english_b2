import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { AppProviders } from "@/components/providers";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return { metadataBase: new URL(origin), title: { default: "B2 Trainer", template: "%s · B2 Trainer" }, description: "Vocabolario, verbi, reading e listening per preparare seriamente un esame di inglese B2.", manifest: "/manifest.webmanifest", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/apple-icon.png" }, appleWebApp: { capable: true, statusBarStyle: "default", title: "B2 Trainer" }, openGraph: { type: "website", locale: "it_IT", url: origin, siteName: "B2 Trainer", title: "B2 Trainer · Quattro sezioni per arrivare al B2.", description: "240 parole B2, oltre 2.000 esercizi sui verbi, 14 reading e 14 listening originali.", images: [{ url: `${origin}/og-four-sections.png`, width: 1734, height: 907, alt: "B2 Trainer: vocabolario, verbi, reading e listening" }] }, twitter: { card: "summary_large_image", title: "B2 Trainer", description: "Quattro sezioni per costruire il tuo inglese B2.", images: [`${origin}/og-four-sections.png`] } };
}
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f5f4ee" }, { media: "(prefers-color-scheme: dark)", color: "#101713" }] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it" suppressHydrationWarning><body><AppProviders>{children}</AppProviders></body></html>;
}

/* Trigger new Vercel build */
