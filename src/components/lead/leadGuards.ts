/** Session/cookie guards for the lead modal (§8). Client-side only. */

export const SEEN_KEY = "dxbgate_lead_seen";
const DONE_COOKIE = "dxbgate_lead_done";

export function hasConvertedCookie(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${DONE_COOKIE}=`));
}

export function markConverted(): void {
  // ~30 days — a converted visitor is never nagged again (§8).
  document.cookie = `${DONE_COOKIE}=1; max-age=${60 * 60 * 24 * 30}; path=/; samesite=lax`;
}
