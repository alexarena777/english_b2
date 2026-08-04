import { getChatGPTUser } from "@/app/chatgpt-auth";
import { writingPrompts } from "@/lib/data";
import { mockEvaluateWriting } from "@/lib/logic";
import { writingEvaluationSchema, writingSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

function localEvaluation(text: string, warning?: string) {
  return Response.json({
    evaluation: mockEvaluateWriting(text),
    mode: "local" as const,
    warning,
  });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = writingSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: "Testo non valido", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const prompt = writingPrompts.find((item) => item.id === parsed.data.promptId);
  if (!prompt) {
    return Response.json({ error: "Traccia non trovata" }, { status: 404 });
  }

  const apiUrl = process.env.WRITING_EVALUATION_API_URL?.trim();
  if (!apiUrl) return localEvaluation(parsed.data.text);

  const user = await getChatGPTUser();
  if (!user) {
    return localEvaluation(
      parsed.data.text,
      "Accedi con ChatGPT per usare la valutazione AI configurata.",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const apiKey = process.env.WRITING_EVALUATION_API_KEY?.trim();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        task: "evaluate-b2-writing",
        locale: "it-IT",
        level: "B2",
        prompt,
        text: parsed.data.text,
        expectedResponse: {
          overall: "number 0-100",
          scores: "record of criterion scores 0-100",
          strengths: "string[]",
          issues: "{ excerpt, explanation, suggestion }[]",
          improvedVersion: "string",
          advice: "string[]",
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return localEvaluation(
        parsed.data.text,
        "Il valutatore AI non ha risposto: è stata usata l’analisi locale.",
      );
    }

    const raw = (await response.json()) as { evaluation?: unknown } | unknown;
    const candidate =
      typeof raw === "object" && raw !== null && "evaluation" in raw
        ? (raw as { evaluation: unknown }).evaluation
        : raw;
    const evaluation = writingEvaluationSchema.safeParse(candidate);
    if (!evaluation.success) {
      return localEvaluation(
        parsed.data.text,
        "La risposta AI non era nel formato previsto: è stata usata l’analisi locale.",
      );
    }

    return Response.json({ evaluation: evaluation.data, mode: "ai" as const });
  } catch {
    return localEvaluation(
      parsed.data.text,
      "Il valutatore AI non è raggiungibile: è stata usata l’analisi locale.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
