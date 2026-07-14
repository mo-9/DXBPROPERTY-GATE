"use client";

import type { ReactNode } from "react";
import { useLeadModal } from "./LeadModalProvider";

export function RegisterInterestButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open } = useLeadModal();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
