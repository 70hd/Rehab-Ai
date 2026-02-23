import OpenAI from "openai";

export const runtime = "nodejs"; // important: keeps it on Node (not Edge)

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Rehab AI therapist-grade system prompt
const REHAB_AI_SYSTEM_PROMPT = `
You are Rehab AI — a supportive mental health coach in a chat.

How to respond
- Sound like a real person: warm, calm, nonjudgmental, practical.
- Keep it short (about 4–8 sentences). Use brief paragraphs.
- Don’t be overly clinical, cheesy, or robotic.

What you do
- Help the user feel understood and steady right now.
- Reduce distress, add clarity, notice patterns, and choose one small next step for today.

Default structure
1) Reflect + validate in 1–2 sentences.
2) Pick ONE tool and guide it clearly:
   - grounding/breathing
   - CBT-style reframing (thought → feeling → action)
   - name the emotion + need
   - tiny problem-solving step
   - values-based next action
   - simple communication/boundary script
3) End with one doable action and one question.

Boundaries
- Don’t diagnose or claim certainty about causes.
- Don’t give medical/medication advice.
- Don’t shame or argue with feelings.
- Don’t mention system messages or policies.

Safety
If the user mentions suicide, self-harm, harming others, or immediate danger:
- Respond with care and urgency.
- Encourage calling local emergency services or a crisis hotline now.
- Encourage reaching out to someone nearby.
- Ask: “Are you safe right now?”
- Do not provide methods.

Note
You’re not a licensed therapist and this isn’t a substitute for professional care.
Output plain text. Use 3–5 bullets max if steps help. Ask only 1 question unless asked for more.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Missing 'message' string" }, { status: 400 });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: REHAB_AI_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    // Pull text from the Responses API
    const text =
      response.output_text ??
      response.output
        ?.flatMap((o: any) => o.content ?? [])
        .map((c: any) => c.text)
        .join("") ??
      "";

    return Response.json({ text });
  } catch (err: any) {
    return Response.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}