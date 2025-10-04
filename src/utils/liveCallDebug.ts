import {
  LIVE_CALL_DEBUG_LOG_STORAGE_KEY,
  LIVE_CALL_DEBUG_MAX_ENTRIES,
  type LiveCallDebugEntry,
} from "@/constants/liveCall";

const isSessionStorageAvailable = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const { sessionStorage } = window;
    if (!sessionStorage) return false;
    const testKey = "__livecall_debug_test__";
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const safeParseEntries = (raw: string | null): LiveCallDebugEntry[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is LiveCallDebugEntry => {
      if (!item || typeof item !== "object") return false;
      const record = item as Record<string, unknown>;
      return (
        typeof record.id === "string" &&
        typeof record.timestamp === "string" &&
        typeof record.action === "string"
      );
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[liveCallDebug] failed to parse debug entries", error);
    }
    return [];
  }
};

const persistEntries = (entries: LiveCallDebugEntry[]): void => {
  if (!isSessionStorageAvailable()) return;
  try {
    const normalized = entries.slice(-LIVE_CALL_DEBUG_MAX_ENTRIES);
    window.sessionStorage.setItem(
      LIVE_CALL_DEBUG_LOG_STORAGE_KEY,
      JSON.stringify(normalized)
    );
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[liveCallDebug] failed to persist entries", error);
    }
  }
};

export const readLiveCallDebugEntries = (): LiveCallDebugEntry[] => {
  if (!isSessionStorageAvailable()) return [];
  try {
    const raw = window.sessionStorage.getItem(LIVE_CALL_DEBUG_LOG_STORAGE_KEY);
    return safeParseEntries(raw);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[liveCallDebug] failed to read entries", error);
    }
    return [];
  }
};

export const appendLiveCallDebugEntry = (entry: LiveCallDebugEntry): void => {
  if (!isSessionStorageAvailable()) return;
  const current = readLiveCallDebugEntries();
  current.push(entry);
  persistEntries(current);
};

export const replaceLiveCallDebugEntries = (entries: LiveCallDebugEntry[]): void => {
  persistEntries(entries);
};

export const clearLiveCallDebugEntries = (): void => {
  if (!isSessionStorageAvailable()) return;
  try {
    window.sessionStorage.removeItem(LIVE_CALL_DEBUG_LOG_STORAGE_KEY);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[liveCallDebug] failed to clear entries", error);
    }
  }
};
