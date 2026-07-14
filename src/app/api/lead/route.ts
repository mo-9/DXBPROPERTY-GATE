import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { saveLead, notifySales } from "@/lib/leads";
import { UNIT_TYPES, type Lead } from "@/lib/types";

/**
 * POST /api/lead (§9) — server-side validation, spam traps, swappable
 * persistence and sales notifications. Never trusts the client.
 */

const leadPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine((v) => v.replace(/\D/g, "").length >= 7, "phone too short"),
  interest: z.enum(UNIT_TYPES),
  developerContext: z.string().trim().max(80).optional(),
  projectContext: z.string().trim().max(80).optional(),
  locale: z.enum(["en", "ar"]),
  source: z.enum(["timed-modal", "exit-intent", "scroll"]),
  // Spam traps (§8/§9)
  company: z.string().optional(), // honeypot — must be empty
  renderedAt: z.number(), // min-time-to-submit
});

/** Best-effort in-memory rate limit (per serverless instance). */
const hits = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/** Normalise toward E.164 where possible: keep digits, restore leading +. */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  let payload: z.infer<typeof leadPayloadSchema>;
  try {
    payload = leadPayloadSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }

  // Honeypot filled or submitted faster than a human plausibly could (<1.5s):
  // respond 200 so bots learn nothing, but store nothing.
  const tooFast = Date.now() - payload.renderedAt < 1500;
  if (payload.company || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const lead: Lead = {
    name: payload.name,
    phone: normalizePhone(payload.phone),
    interest: payload.interest,
    ...(payload.developerContext ? { developerContext: payload.developerContext } : {}),
    ...(payload.projectContext ? { projectContext: payload.projectContext } : {}),
    locale: payload.locale,
    source: payload.source,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveLead(lead);
  } catch (error) {
    // Storage failure: still notify so the lead is not lost. No PII in logs.
    console.error("saveLead failed:", String(error));
    await notifySales(lead);
    return NextResponse.json(
      { ok: false, error: "storage_failed" },
      { status: 500 }
    );
  }

  // Fire-and-forget semantics but awaited so serverless doesn't kill it.
  await notifySales(lead);

  return NextResponse.json({ ok: true });
}
