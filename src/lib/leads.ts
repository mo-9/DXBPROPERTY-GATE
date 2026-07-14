import "server-only";
import type { Lead } from "./types";

/**
 * Swappable lead persistence (§9). Priority:
 *  (a) LEAD_ENDPOINT_URL      — proxy to an existing FastAPI/MySQL service
 *  (b) SUPABASE_URL + key     — insert into a `leads` table via PostgREST
 *  (c) none                   — rely on the notification channels only
 * No PII is ever logged.
 */
export async function saveLead(lead: Lead): Promise<void> {
  const endpoint = process.env.LEAD_ENDPOINT_URL;
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_ENDPOINT_TOKEN
          ? { Authorization: `Bearer ${process.env.LEAD_ENDPOINT_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`Lead endpoint responded ${res.status}`);
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && supabaseKey) {
    const res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        interest: lead.interest,
        developer_context: lead.developerContext ?? null,
        project_context: lead.projectContext ?? null,
        locale: lead.locale,
        source: lead.source,
        created_at: lead.createdAt,
      }),
    });
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
    return;
  }

  // No storage backend configured — notifications below are the record.
  console.warn("saveLead: no storage backend configured (lead forwarded to notifications only)");
}

/** Email via Resend (RESEND_API_KEY, LEAD_EMAIL_TO, LEAD_EMAIL_FROM). */
async function notifyEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO;
  if (!apiKey || !to) return;

  const context = [
    lead.developerContext && `Developer: ${lead.developerContext}`,
    lead.projectContext && `Project: ${lead.projectContext}`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM ?? "leads@dxbpropertygate.com",
      to: to.split(","),
      subject: `New lead — ${lead.interest} (${lead.source})`,
      text: [
        `Name: ${lead.name}`,
        `Phone: ${lead.phone}`,
        `Interested in: ${lead.interest}`,
        `Locale: ${lead.locale}`,
        `Source: ${lead.source}`,
        context,
        `Received: ${lead.createdAt}`,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

/**
 * WhatsApp via Meta Business Cloud API — first-class channel for UAE sales (§9).
 * Sends a pre-approved template (WHATSAPP_TEMPLATE_NAME, default `new_lead`)
 * with name/phone/interest as body parameters.
 */
async function notifyWhatsApp(lead: Lead): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const salesTo = process.env.WHATSAPP_SALES_NUMBER;
  if (!token || !phoneId || !salesTo) return;

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: salesTo,
      type: "template",
      template: {
        name: process.env.WHATSAPP_TEMPLATE_NAME ?? "new_lead",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: lead.name },
              { type: "text", text: lead.phone },
              { type: "text", text: lead.interest },
            ],
          },
        ],
      },
    }),
  });
  if (!res.ok) throw new Error(`WhatsApp API responded ${res.status}`);
}

/** Notify all configured channels; a channel failure never loses the lead. */
export async function notifySales(lead: Lead): Promise<void> {
  const results = await Promise.allSettled([notifyEmail(lead), notifyWhatsApp(lead)]);
  for (const r of results) {
    if (r.status === "rejected") {
      // Log channel + error only — no lead PII (§9).
      console.error("Lead notification channel failed:", String(r.reason));
    }
  }
}
