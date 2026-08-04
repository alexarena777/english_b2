export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text")?.trim();
  const lang = searchParams.get("lang")?.trim() ?? "en-GB";

  if (!text) {
    return new Response(JSON.stringify({ error: "Testo mancante" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Use British accent (en-GB) by default for Cambridge exam style
  const targetLang = "en-GB";
  const cleanText = text.slice(0, 200);

  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

  try {
    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`TTS HTTP ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800, s-maxage=604800",
      },
    });
  } catch (error) {
    console.error("Cambridge B2 Audio Stream API error:", error);
    return new Response(JSON.stringify({ error: "Audio non disponibile" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
