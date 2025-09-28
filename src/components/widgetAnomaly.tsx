import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import type { WidgetIssuesResponse } from "@/api/handlers";

type WidgetAnomalyProps = {
  widgetOpen: boolean;
  setWidgetOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
};

type TimelineItem = {
  time: string;
  description: string;
  isFlagged?: boolean;
};

const DISMISS_STORAGE_KEY = "widget_anomaly_dismissed_case";
const AUTO_CLOSE_MS = 10_000;

const formatTime = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date
    .toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/,(?=\s)/, "");
};

const normalizeTimeline = (caseData: WidgetIssuesResponse["current_case"]): TimelineItem[] => {
  if (!caseData?.issue_correlation?.length) return [];
  return caseData.issue_correlation.map((item) => ({
    time: item?.time ?? formatTime(caseData.created_at),
    description: item?.event
      ? `${item.event}${item.location ? ` — ${item.location}` : ""}`
      : item?.location ?? "",
    isFlagged: Boolean(item?.flag || (item?.status ?? "").toLowerCase().includes("susp")),
  }));
};

const normalizeCustomer = (caseData: WidgetIssuesResponse["current_case"]) => {
  const defaults = {
    eventId: "—",
    accountAge: "—",
    avgTransaction: "—",
    lastDevice: "—",
  };
  if (!caseData?.customer) return defaults;

  return {
    eventId: caseData.customer.event_id ?? "—",
    accountAge: caseData.customer.account_age ?? "—",
    avgTransaction: caseData.customer.avg_transaction ?? "—",
    lastDevice: caseData.customer.last_device ?? "—",
  };
};

export default function WidgetAnomaly({ widgetOpen, setWidgetOpen }: WidgetAnomalyProps) {
  const [data, setData] = useState<WidgetIssuesResponse | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const dismissedCaseId = useRef<string | null>(null);
  const lastCaseId = useRef<string | null>(null);
  const retryDelayRef = useRef(2000);
  const autoCloseTimerRef = useRef<number | null>(null);
  const autoClosedCaseIdRef = useRef<string | null>(null);

  // --- [TESTING] Countdown helpers for console logging ---
  const consoleCountdownIntervalRef = useRef<number | null>(null);

  const clearConsoleCountdown = () => {
    if (consoleCountdownIntervalRef.current) {
      window.clearInterval(consoleCountdownIntervalRef.current);
      consoleCountdownIntervalRef.current = null;
    }
  };

  const startConsoleCountdown = (duration: number) => {
    clearConsoleCountdown();
    let remaining = duration / 1000;
    if (import.meta.env.DEV) {
      console.log(`[TESTING] Widget auto-close countdown started: ${remaining}s`);
    }
    consoleCountdownIntervalRef.current = window.setInterval(() => {
      remaining -= 1;
      if (import.meta.env.DEV) {
        console.log(`[TESTING] Widget auto-closing in: ${remaining}s`);
      }
      if (remaining <= 0) {
        clearConsoleCountdown();
      }
    }, 1000);
  };
  // --- End [TESTING] helpers ---

  const scheduleAutoClose = (caseId: string) => {
    if (autoCloseTimerRef.current) {
      window.clearTimeout(autoCloseTimerRef.current);
    }
    clearConsoleCountdown(); // Sync with UI timer

    autoCloseTimerRef.current = window.setTimeout(() => {
      autoCloseTimerRef.current = null;
      if (!dismissedCaseId.current && lastCaseId.current === caseId) {
        autoClosedCaseIdRef.current = caseId;
        setWidgetOpen(false);
      }
    }, AUTO_CLOSE_MS);

    startConsoleCountdown(AUTO_CLOSE_MS); // Start console log timer
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(DISMISS_STORAGE_KEY);
        if (stored) dismissedCaseId.current = stored;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[WidgetAnomaly] Unable to access localStorage", error);
        }
      }
    }

    let cancelled = false;
    const controller = new AbortController();
    const signal = controller.signal;

    const scheduleReconnect = (delay: number) => {
      if (cancelled) return;
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      reconnectTimer.current = window.setTimeout(() => {
        reconnectTimer.current = null;
        connect();
      }, delay);
    };

    const connect = async () => {
      const devBase = import.meta.env.VITE_API_DEV_BASE ?? "/__api";
      const prodBase = import.meta.env.VITE_API_BASE_URL ?? "";
      const baseUrl = (import.meta.env.DEV ? devBase : prodBase).replace(/\/$/, "");
      const token = import.meta.env.VITE_API_TOKEN as string | undefined;
      const url = `${baseUrl}/v1/logs/widget/issues`;

      const headers: Record<string, string> = {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      try {
        const response = await fetch(url, {
          headers,
          signal,
          cache: "no-store",
        });

        if (!response.ok) {
          const status = response.status;
          if (!cancelled && (status === 500 || status === 502)) {
            const delay = retryDelayRef.current;
            retryDelayRef.current = Math.min(delay * 2, 30000);
            scheduleReconnect(delay);
          }
          throw new Error(`Widget issues HTTP ${status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Widget issues stream reader unavailable");

        retryDelayRef.current = 2000;

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line || line.startsWith(":")) continue;
            if (!line.startsWith("data:")) continue;

            const payload = line.slice(5).trim();
            if (!payload) continue;

            try {
              const parsed = JSON.parse(payload) as WidgetIssuesResponse;
              if (!cancelled) setData(parsed);
            } catch (error) {
              if (import.meta.env.DEV) {
                console.error("[WidgetAnomaly] failed to parse update", error, payload);
              }
            }
          }
        }

        if (!cancelled) {
          const delay = retryDelayRef.current;
          retryDelayRef.current = Math.min(delay * 2, 30000);
          scheduleReconnect(delay);
        }
      } catch (error) {
        if (!cancelled && import.meta.env.DEV && (error as Error).name !== "AbortError") {
          console.error("[WidgetAnomaly] failed to load issues", error);
        }
        if (!cancelled) {
          const delay = retryDelayRef.current;
          retryDelayRef.current = Math.min(delay * 2, 30000);
          scheduleReconnect(delay);
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      controller.abort();
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      clearConsoleCountdown();
    };
  }, []);

  const currentCase = data?.current_case;
  const timelineItems = useMemo(() => normalizeTimeline(currentCase), [currentCase]);
  const customerInfo = useMemo(() => normalizeCustomer(currentCase), [currentCase]);
  const caseTitle = currentCase?.title ?? currentCase?.overview ?? "Potential Issue Detected";
  const caseDetail = currentCase?.detail ?? currentCase?.overview ?? "";
  const hasIssueCase = Boolean(currentCase && data?.has_open_issues === true);
  const panelVisible = widgetOpen;
  const noIssue = !hasIssueCase;

  useEffect(() => {
    const caseId = currentCase?.id ?? null;

    if (caseId && caseId !== lastCaseId.current) {
      lastCaseId.current = caseId;
      dismissedCaseId.current = null;
      autoClosedCaseIdRef.current = null;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(DISMISS_STORAGE_KEY);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("[WidgetAnomaly] Unable to clear dismissal", error);
          }
        }
      }
      if (autoCloseTimerRef.current) {
        window.clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
      clearConsoleCountdown();
      if (hasIssueCase) {
        setWidgetOpen(true);
        scheduleAutoClose(caseId);
      }
    }

    if (hasIssueCase) {
      if (caseId && dismissedCaseId.current === caseId) return;
      if (!widgetOpen && autoClosedCaseIdRef.current !== caseId) {
        setWidgetOpen(true);
        if (!autoCloseTimerRef.current) {
          scheduleAutoClose(caseId);
        }
      }
    } else {
      autoClosedCaseIdRef.current = null;
      dismissedCaseId.current = null;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(DISMISS_STORAGE_KEY);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("[WidgetAnomaly] Unable to remove dismissal", error);
          }
        }
      }
      if (widgetOpen) setWidgetOpen(false);
    }
  }, [hasIssueCase, widgetOpen, setWidgetOpen, currentCase?.id]);

  const formattedTimestamp = useMemo(() => {
    if (!data?.timestamp) return null;
    const date = new Date(data.timestamp);
    if (Number.isNaN(date.getTime())) return data.timestamp;
    return `${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`;
  }, [data?.timestamp]);

  const handleDismiss = (caseId?: string | null) => {
    if (!caseId) return;
    dismissedCaseId.current = caseId;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(DISMISS_STORAGE_KEY, caseId);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[WidgetAnomaly] Unable to persist dismissal", error);
        }
      }
    }
  };

  const clearDismissed = () => {
    dismissedCaseId.current = null;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(DISMISS_STORAGE_KEY);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[WidgetAnomaly] Unable to clear dismissal", error);
        }
      }
    }
  };

  useEffect(() => {
    if (!widgetOpen && autoCloseTimerRef.current) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
      clearConsoleCountdown();
    }
    return () => {
      if (autoCloseTimerRef.current) {
        window.clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
      clearConsoleCountdown();
    };
  }, [widgetOpen]);

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 1000 }}>
      {/* Panel (card) */}
      <div
        style={{
          width: 400,
          maxWidth: "90vw",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          overflow: "hidden",
          border: "1px solid #eef2f7",
          transition:
            "opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1), max-height 0.35s cubic-bezier(.4,0,.2,1), margin-bottom 0.35s cubic-bezier(.4,0,.2,1)",
          opacity: panelVisible ? 1 : 0,
          transform: panelVisible ? "translateY(0)" : "translateY(8px)",
          maxHeight: panelVisible ? 1000 : 0,
          marginBottom: panelVisible ? 14 : 0,
          pointerEvents: panelVisible ? undefined : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            background:
              "linear-gradient(90deg, rgba(79,136,255,1) 0%, rgba(134,96,255,1) 100%)",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(255,255,255,0.2)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon icon="solar:shield-warning-bold-duotone" width={18} height={18} />
            </span>
            <strong>{noIssue ? "No Active Issues" : "Potential Issue Detected"}</strong>
          </div>
          <button
            aria-label="close"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: 0,
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => {
              handleDismiss(currentCase?.id);
              setWidgetOpen(false);
            }}
          >
            <Icon icon="mi:close" width={16} height={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 16 }}>
          {noIssue ? (
            // Placeholder shown when there is no active issue but the panel is opened manually
            <div style={{
              display: 'grid',
              placeItems: 'center',
              minHeight: 160,
              color: '#667085',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 700, color: '#2b2f33', marginBottom: 6 }}>No active issues</div>
              <div style={{ fontSize: 13 }}>You can keep this panel open. It will auto-populate here as soon as a new potential issue is detected.</div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 10 }}>
                {caseTitle}
              </div>
              {caseDetail && (
                <div style={{ fontWeight: 700, color: '#2b2f33', marginBottom: 12 }}>{caseDetail}</div>
              )}
              {formattedTimestamp && (
                <div style={{ fontSize: 12, color: '#8c96a3', marginBottom: 12 }}>
                  Last updated: {formattedTimestamp}
                  {typeof data?.cached === 'boolean' && ` • ${data.cached ? 'cached' : 'live'}`}
                </div>
              )}

              {/* Timeline title */}
              <div style={{ fontWeight: 600, color: '#2b2f33', marginBottom: 8 }}>
                Cross-System Correlation Timeline
              </div>

              {/* Timeline */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr',
                  rowGap: 12,
                  marginBottom: 16,
                }}
              >
                {(timelineItems.length ? timelineItems : [
                  {
                    time: '--',
                    description: 'No timeline data available',
                  },
                ]).map((it, i, arr) => (
                  <Fragment key={`timeline-${i}`}>
                    <div style={{ position: 'relative' }}>
                      {i < arr.length - 1 && (
                        <span
                          style={{
                            position: 'absolute',
                            left: 9,
                            top: 12,
                            bottom: -12,
                            width: 2,
                            background: '#e5eaf2',
                          }}
                        />
                      )}
                      <span
                        style={{
                          display: 'inline-block',
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          background: it.isFlagged ? '#f97316' : '#4f86ff',
                          border: '2px solid #dfe8ff',
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#8c96a3' }}>{it.time}</div>
                      <div style={{ color: '#2b2f33' }}>{it.description}</div>
                    </div>
                  </Fragment>
                ))}
              </div>

              <div style={{ height: 1, background: '#eef2f7', margin: '4px 0 14px' }} />

              {/* 360 View */}
              <div style={{ fontWeight: 700, color: '#2b2f33', marginBottom: 10 }}>
                360-Degree Customer View
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  rowGap: 10,
                  columnGap: 16,
                  marginBottom: 18,
                }}
              > 
                <div>
                  <div style={{ fontSize: 12, color: '#9aa7b2' }}>Event UID</div>
                  <div style={{ color: '#2b2f33' }}>{customerInfo.eventId}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#9aa7b2' }}>Account Age</div>
                  <div style={{ color: '#2b2f33' }}>{customerInfo.accountAge}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#9aa7b2' }}>AVG. Transaction</div>
                  <div style={{ color: '#2b2f33' }}>{customerInfo.avgTransaction}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#9aa7b2' }}>Last Device</div>
                  <div style={{ color: '#2b2f33' }}>{customerInfo.lastDevice}</div>
                </div>
              </div>

              {/* available_actions code Here */}
              {currentCase?.available_actions?.length ? (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 600, color: '#2b2f33', marginBottom: 8 }}>
                    Recommended Actions
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: 8,
                    }}
                  >
                    {currentCase.available_actions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        style={{
                          border: '1px solid #dbe3f0',
                          background: '#f7faff',
                          color: '#2b2f33',
                          padding: '8px 10px',
                          borderRadius: 10,
                          fontSize: 12,
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease, transform 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          const target = e.currentTarget;
                          target.style.background = '#eef6ff';
                          target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          const target = e.currentTarget;
                          target.style.background = '#f7faff';
                          target.style.transform = 'translateY(0)';
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Floating trigger button */}
      <button
        aria-label="widget"
        onClick={() =>
          setWidgetOpen((prev) => {
            const next = !prev;
            if (next) {
              // User opens panel manually → clear dismissed & cancel any auto-close timer
              clearDismissed();
              if (autoCloseTimerRef.current) {
                window.clearTimeout(autoCloseTimerRef.current);
                autoCloseTimerRef.current = null;
              }
              autoClosedCaseIdRef.current = null;
              // [TESTING] user opened manually → stop countdown
              clearConsoleCountdown();
            } else {
              // User closes via FAB → treat as dismiss for current case
              if (currentCase?.id) {
                handleDismiss(currentCase.id);
              }
              // [TESTING] user closed manually → stop countdown
              clearConsoleCountdown();
            }
            return next;
          })
        }
        aria-expanded={widgetOpen}
        style={{
          width: 48,
          height: 48,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          border: 0,
          cursor: "pointer",
          background:
            "linear-gradient(135deg, rgba(79,136,255,1) 0%, rgba(134,96,255,1) 100%)",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(79,136,255,0.35)",
          display: "grid",
          placeItems: "center",
          marginLeft: "auto",
        }}
        title={widgetOpen ? "Hide details" : "Show details"}
      >
        {widgetOpen ? (
          <Icon icon="mi:close" width={22} height={22} />
        ) : (
          <img
            src="/src/assets/img/iconWidget.png"
            alt="widget icon"
            style={{ width: 22, height: 22 }}
          />
        )}
      </button>
    </div>
  );
}
