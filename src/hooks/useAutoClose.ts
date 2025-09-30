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

  }, [onClose]);

  const cancelAutoClose = useCallback(() => {
    if (autoCloseTimerRef.current) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
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
