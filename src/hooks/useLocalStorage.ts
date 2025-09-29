import { useCallback, useRef } from "react";
import { WIDGET_CONFIG } from "@/constants/widget";

export const useLocalStorage = () => {
  const dismissedCaseIdRef = useRef<string | null>(null);

  // Initialize dismissed case from localStorage
  const initializeDismissed = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(WIDGET_CONFIG.DISMISS_STORAGE_KEY);
        if (stored) {
          dismissedCaseIdRef.current = stored;
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[useLocalStorage] Unable to access localStorage", error);
        }
      }
    }
  }, []);

  const isDismissed = useCallback((caseId: string) => {
    return dismissedCaseIdRef.current === caseId;
  }, []);

  const dismissCase = useCallback((caseId: string) => {
    dismissedCaseIdRef.current = caseId;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(WIDGET_CONFIG.DISMISS_STORAGE_KEY, caseId);
        if (import.meta.env.DEV) {
          console.log(`[useLocalStorage] Case ${caseId} dismissed`);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[useLocalStorage] Unable to persist dismissal", error);
        }
      }
    }
  }, []);

  const clearDismissed = useCallback(() => {
    dismissedCaseIdRef.current = null;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(WIDGET_CONFIG.DISMISS_STORAGE_KEY);
        if (import.meta.env.DEV) {
          console.log("[useLocalStorage] Dismissed case cleared");
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[useLocalStorage] Unable to clear dismissal", error);
        }
      }
    }
  }, []);

  return {
    initializeDismissed,
    isDismissed,
    dismissCase,
    clearDismissed
  };
};
