"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LeadSource } from "@/lib/types";
import { LeadModal } from "./LeadModal";
import { SEEN_KEY, hasConvertedCookie } from "./leadGuards";

interface PageContext {
  developer?: string;
  project?: string;
}

interface LeadModalApi {
  /** Open manually (CTA buttons). Manual opens bypass the once-per-session guard. */
  open: () => void;
  setPageContext: (ctx: PageContext) => void;
}

const LeadModalContext = createContext<LeadModalApi | null>(null);

export function useLeadModal(): LeadModalApi {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal must be used within LeadModalProvider");
  return ctx;
}

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<LeadSource>("timed-modal");
  const pageContext = useRef<PageContext>({});
  const triggerElement = useRef<HTMLElement | null>(null);
  const autoFired = useRef(false);

  const openWith = useCallback((src: LeadSource, auto: boolean) => {
    if (auto) {
      if (autoFired.current) return;
      if (sessionStorage.getItem(SEEN_KEY)) return;
      if (hasConvertedCookie()) return;
      autoFired.current = true;
      sessionStorage.setItem(SEEN_KEY, "1");
    }
    triggerElement.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSource(src);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Return focus to whatever triggered the dialog (§8 a11y).
    triggerElement.current?.focus();
  }, []);

  // Auto triggers — first one wins, once per session (§8):
  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY) || hasConvertedCookie()) return;

    // 1. 7s after first meaningful paint (mount ≈ hydration of first view).
    const timer = window.setTimeout(() => openWith("timed-modal", true), 7000);

    // 2. Exit intent — pointer leaves through the viewport top (desktop).
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) openWith("exit-intent", true);
    };

    // 3. Scroll depth ≥ 60%.
    const onScroll = () => {
      const doc = document.documentElement;
      const depth = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (depth >= 0.6) openWith("scroll", true);
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [openWith]);

  const api: LeadModalApi = {
    open: () => openWith("timed-modal", false),
    setPageContext: (ctx) => {
      pageContext.current = ctx;
    },
  };

  return (
    <LeadModalContext.Provider value={api}>
      {children}
      <LeadModal
        isOpen={isOpen}
        source={source}
        getPageContext={() => pageContext.current}
        onClose={close}
      />
    </LeadModalContext.Provider>
  );
}
