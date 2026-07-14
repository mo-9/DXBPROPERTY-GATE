"use client";

import { useEffect } from "react";
import { useLeadModal } from "./LeadModalProvider";

/**
 * Mounted by developer/project pages to silently attach entity context
 * to any lead captured while the visitor is on that page (§8).
 */
export function LeadContext({
  developer,
  project,
}: {
  developer?: string;
  project?: string;
}) {
  const { setPageContext } = useLeadModal();

  useEffect(() => {
    setPageContext({ developer, project });
    return () => setPageContext({});
  }, [developer, project, setPageContext]);

  return null;
}
