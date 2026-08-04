import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "B2 Trainer",
    short_name: "B2 Trainer",
    description: "Vocabolario, verbi, reading e listening per l’inglese B2",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f5f4ee",
    theme_color: "#195c49",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    shortcuts: [
      { name: "Vocabolario", short_name: "Vocab", url: "/vocabulary" },
      { name: "Verbi e tempi", short_name: "Verbi", url: "/grammar" },
      { name: "Reading B2", short_name: "Reading", url: "/reading" },
      { name: "Listening B2", short_name: "Listening", url: "/listening" },
    ],
  };
}
