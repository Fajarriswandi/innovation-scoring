import { useCallback, useRef } from "react";
import { WIDGET_CONFIG } from "@/constants/widget";

export const useAutoClose = (onClose: () => void) => {
  const autoCloseTimerRef = useRef<number | null>(null);
  const autoClosedCaseIdRef = useRef<string | null>(null);

  const scheduleAutoClose = useCallback((caseId: string) => {
    if (autoCloseTimerRef.current) {
      window.clearTimeout(autoCloseTimerRef.current);
    }

    autoCloseTimerRef.current = window.setTimeout(() => {
      autoCloseTimerRef.current = null;
      autoClosedCaseIdRef.current = caseId;
      onClose();
    }, WIDGET_CONFIG.AUTO_CLOSE_MS);

    if (import.meta.env.DEV) {
      console.log(`[WidgetAnomaly] Auto-close scheduled for case ${caseId} in ${WIDGET_CONFIG.AUTO_CLOSE_MS}ms`);
    }
  }, [onClose]);

  const cancelAutoClose = useCallback(() => {
    if (autoCloseTimerRef.current) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
      if (import.meta.env.DEV) {
        console.log("[WidgetAnomaly] Auto-close cancelled");
      }
    }
  }, []);

  const isAutoClosedCase = useCallback((caseId: string) => {
    return autoClosedCaseIdRef.current === caseId;
  }, []);

  const resetAutoClosedCase = useCallback(() => {
    autoClosedCaseIdRef.current = null;
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (autoCloseTimerRef.current) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  return {
    scheduleAutoClose,
    cancelAutoClose,
    isAutoClosedCase,
    resetAutoClosedCase,
    cleanup
  };
};
