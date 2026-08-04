import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getD1 } from "@/db";
import { progressStateSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

function unavailable(error: unknown) {
  console.error("Progress storage unavailable", error);
  return Response.json(
    { error: "La sincronizzazione non è disponibile in questo momento." },
    { status: 503 },
  );
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Accesso richiesto" }, { status: 401 });
  }

  try {
    const db = await getD1();
    const row = await db
      .prepare("SELECT state_json FROM user_progress WHERE user_id = ?")
      .bind(user.userId)
      .first<{ state_json: string }>();

    let state: unknown = null;
    if (row?.state_json) {
      const parsed = progressStateSchema.safeParse(JSON.parse(row.state_json));
      state = parsed.success ? parsed.data : null;
    }

    return Response.json({
      state,
      user: { displayName: user.displayName, email: user.email },
    });
  } catch (error) {
    return unavailable(error);
  }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Accesso richiesto" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "JSON non valido" }, { status: 400 });
  }
  const parsed = progressStateSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: "Dati non validi", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const db = await getD1();
    await db
      .prepare(
        `INSERT INTO user_progress (user_id, state_json, created_at, updated_at)
         VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id) DO UPDATE SET
           state_json = excluded.state_json,
           updated_at = CURRENT_TIMESTAMP`,
      )
      .bind(user.userId, JSON.stringify(parsed.data))
      .run();
    return Response.json({ saved: true });
  } catch (error) {
    return unavailable(error);
  }
}

export async function DELETE() {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Accesso richiesto" }, { status: 401 });
  }

  try {
    const db = await getD1();
    await db
      .prepare("DELETE FROM user_progress WHERE user_id = ?")
      .bind(user.userId)
      .run();
    return Response.json({ deleted: true });
  } catch (error) {
    return unavailable(error);
  }
}
