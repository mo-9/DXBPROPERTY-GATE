"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  MODAL_CORE_UNIT_TYPES,
  MODAL_EXTRA_UNIT_TYPES,
  type LeadSource,
} from "@/lib/types";
import { markConverted } from "./leadGuards";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const OPTIONS = [...MODAL_CORE_UNIT_TYPES, ...MODAL_EXTRA_UNIT_TYPES];

interface Props {
  isOpen: boolean;
  source: LeadSource;
  getPageContext: () => { developer?: string; project?: string };
  onClose: () => void;
}

type FieldErrors = Partial<Record<"name" | "phone" | "interest", string>>;

export function LeadModal({ isOpen, source, getPageContext, onClose }: Props) {
  const t = useTranslations("modal");
  const tUnits = useTranslations("unitTypes");
  const locale = useLocale();
  const reducedMotion = useReducedMotion();

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const renderedAt = useRef(0);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  // Reset + autofocus + min-time-to-submit stamp on every open.
  useEffect(() => {
    if (isOpen) {
      renderedAt.current = Date.now();
      setErrors({});
      setStatus("idle");
      const id = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  // Focus trap + Esc (§8 a11y).
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  // Auto-close ~2.5s after a successful submit (§8).
  useEffect(() => {
    if (status === "success") {
      const id = window.setTimeout(onClose, 2500);
      return () => window.clearTimeout(id);
    }
  }, [status, onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const interest = String(data.get("interest") ?? "");

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = t("nameError");
    // Loose E.164-friendly check: at least 7 digits (§8).
    if (phone.replace(/\D/g, "").length < 7) nextErrors.phone = t("phoneError");
    if (!interest) nextErrors.interest = t("interestError");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    const ctx = getPageContext();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          interest,
          developerContext: ctx.developer,
          projectContext: ctx.project,
          locale,
          source,
          company: String(data.get("company") ?? ""), // honeypot
          renderedAt: renderedAt.current,
        }),
      });
      if (!res.ok) throw new Error(`lead failed: ${res.status}`);
      markConverted();
      window.gtag?.("event", "generate_lead", { source });
      window.fbq?.("track", "Lead");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-sm border border-line bg-bg px-4 py-3 text-bone placeholder:text-mute focus:border-gold focus-visible:outline-offset-0 transition-colors";
  const labelClass = "eyebrow !text-sand mb-2 block text-[11px]";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onKeyDown={onKeyDown}
        >
          {/* Dimmed backdrop — click to close */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            className="relative w-full max-w-md border border-line-strong bg-surface p-8 shadow-2xl sm:p-10"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="absolute end-4 top-4 p-2 text-mute transition-colors hover:text-bone"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {status === "success" ? (
              <div className="py-8 text-center" role="status">
                <p className="font-display text-3xl text-bone">{t("successTitle")}</p>
                <p className="mt-3 text-sand">{t("successBody")}</p>
              </div>
            ) : (
              <>
                <h2
                  id="lead-modal-title"
                  className="font-display text-3xl leading-tight text-bone"
                >
                  {t("heading")}
                </h2>
                <p className="mt-2 text-sm text-sand">{t("sub")}</p>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                  {/* Honeypot — invisible to humans, tempting to bots (§9) */}
                  <div className="absolute -start-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label>
                      Company
                      <input type="text" name="company" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <div>
                    <label htmlFor="lead-name" className={labelClass}>
                      {t("name")}
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="lead-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={t("namePlaceholder")}
                      className={inputClass}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "lead-name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="lead-name-error" className="mt-1.5 text-sm text-gold-bright">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className={labelClass}>
                      {t("phone")}
                    </label>
                    <input
                      id="lead-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      defaultValue="+971 "
                      placeholder={t("phonePlaceholder")}
                      className={inputClass}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "lead-phone-error" : undefined}
                    />
                    {errors.phone && (
                      <p id="lead-phone-error" className="mt-1.5 text-sm text-gold-bright">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-interest" className={labelClass}>
                      {t("interest")}
                    </label>
                    <select
                      id="lead-interest"
                      name="interest"
                      defaultValue=""
                      className={inputClass}
                      aria-invalid={Boolean(errors.interest)}
                      aria-describedby={errors.interest ? "lead-interest-error" : undefined}
                    >
                      <option value="" disabled>
                        {t("interestPlaceholder")}
                      </option>
                      {OPTIONS.map((unit) => (
                        <option key={unit} value={unit}>
                          {tUnits(unit)}
                        </option>
                      ))}
                    </select>
                    {errors.interest && (
                      <p id="lead-interest-error" className="mt-1.5 text-sm text-gold-bright">
                        {errors.interest}
                      </p>
                    )}
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-gold-bright" role="alert">
                      {t("genericError")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-gold px-6 py-3.5 font-medium text-bg transition-colors hover:bg-gold-bright disabled:opacity-60"
                  >
                    {status === "submitting" ? t("submitting") : t("submit")}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
