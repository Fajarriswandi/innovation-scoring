import { Fragment, useEffect, useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
import { useWidgetIssues } from "@/hooks/useWidgetIssues";
import { useAutoClose } from "@/hooks/useAutoClose";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  normalizeTimeline, 
  normalizeCustomer, 
  getCaseDetail, 
  formatTimestamp,
  type TimelineItem 
} from "@/utils/widgetUtils";
import { WIDGET_CONFIG, WIDGET_STYLES } from "@/constants/widget";

type WidgetAnomalyProps = {
  widgetOpen: boolean;
  setWidgetOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
};

export default function WidgetAnomaly({ widgetOpen, setWidgetOpen }: WidgetAnomalyProps) {
  const { data, isConnecting, connectionError } = useWidgetIssues();
  const { initializeDismissed, isDismissed, dismissCase, clearDismissed } = useLocalStorage();
  
  const lastCaseId = useRef<string | null>(null);

  // Auto-close handler
  const handleAutoClose = () => {
    if (currentCase?.id && !isDismissed(currentCase.id)) {
      setWidgetOpen(false);
    }
  };

  const { 
    scheduleAutoClose, 
    cancelAutoClose, 
    isAutoClosedCase, 
    resetAutoClosedCase,
    cleanup: cleanupAutoClose 
  } = useAutoClose(handleAutoClose);

  // Initialize dismissed cases from localStorage on mount
  useEffect(() => {
    initializeDismissed();
  }, [initializeDismissed]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      cleanupAutoClose();
    };
  }, [cleanupAutoClose]);

  const currentCase = data?.current_case;
  const timelineItems = useMemo(() => normalizeTimeline(currentCase), [currentCase]);
  const customerInfo = useMemo(() => normalizeCustomer(currentCase), [currentCase]);
  const caseDetail = getCaseDetail(currentCase);
  const hasIssueCase = Boolean(currentCase && data?.has_open_issues === true);
  const panelVisible = widgetOpen;
  const noIssue = !hasIssueCase;

  const formattedTimestamp = useMemo(() => formatTimestamp(data?.timestamp), [data?.timestamp]);

  // Handle case changes and auto-open/close logic
  useEffect(() => {
    const caseId = currentCase?.id ?? null;

    if (caseId && caseId !== lastCaseId.current) {
      // New case detected
      lastCaseId.current = caseId;
      clearDismissed();
      resetAutoClosedCase();
      
      if (hasIssueCase) {
        setWidgetOpen(true);
        scheduleAutoClose(caseId);
      }
    }

    if (hasIssueCase && caseId) {
      // Case is active
      if (isDismissed(caseId)) return;
      
      if (!widgetOpen && !isAutoClosedCase(caseId)) {
        setWidgetOpen(true);
        scheduleAutoClose(caseId);
      }
    } else {
      // No active issues
      resetAutoClosedCase();
      clearDismissed();
      if (widgetOpen) setWidgetOpen(false);
    }
  }, [
    hasIssueCase, 
    widgetOpen, 
    setWidgetOpen, 
    currentCase?.id, 
    isDismissed, 
    isAutoClosedCase, 
    clearDismissed, 
    resetAutoClosedCase, 
    scheduleAutoClose
  ]);

  // Cancel auto-close when widget is manually closed
  useEffect(() => {
    if (!widgetOpen) {
      cancelAutoClose();
    }
  }, [widgetOpen, cancelAutoClose]);

  const handleDismiss = () => {
    if (currentCase?.id) {
      dismissCase(currentCase.id);
    }
    setWidgetOpen(false);
  };

  const handleToggleWidget = () => {
    setWidgetOpen((prev) => {
      const next = !prev;
      if (next) {
        // User opens panel manually → clear dismissed & cancel any auto-close timer
        clearDismissed();
        cancelAutoClose();
        resetAutoClosedCase();
      } else {
        // User closes via FAB → treat as dismiss for current case
        if (currentCase?.id) {
          dismissCase(currentCase.id);
        }
        cancelAutoClose();
      }
      return next;
    });
  };

  const renderTimelineItems = (items: TimelineItem[]) => {
    const displayItems = items.length ? items : [
      {
        time: '--',
        description: 'No timeline data available',
        isFlagged: false
      },
    ];

    return displayItems.map((item, i, arr) => (
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
              background: item.isFlagged ? '#f97316' : '#4f86ff',
              border: '2px solid #dfe8ff',
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#8c96a3' }}>{item.time}</div>
          <div style={{ color: '#2b2f33' }}>{item.description}</div>
        </div>
      </Fragment>
    ));
  };

  const renderCustomerInfo = () => (
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
  );

  const renderRecommendedActions = () => {
    if (!currentCase?.available_actions?.length) return null;

    return (
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
              onClick={() => {
                // TODO: Implement action handler
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      position: "fixed", 
      right: WIDGET_CONFIG.POSITION.RIGHT, 
      bottom: WIDGET_CONFIG.POSITION.BOTTOM, 
      zIndex: 1000 
    }}>
      {/* Panel (card) */}
      <div
        style={{
          width: WIDGET_CONFIG.PANEL_WIDTH,
          maxWidth: "90vw",
          ...WIDGET_STYLES.panel,
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
            ...WIDGET_STYLES.header,
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
            <div>
              <strong>{noIssue ? "No Active Issues" : "Potential Issue Detected"}</strong>
              {isConnecting && (
                <div style={{ fontSize: 11, opacity: 0.8 }}>Connecting...</div>
              )}
              {connectionError && (
                <div style={{ fontSize: 11, opacity: 0.8 }}>Connection Error</div>
              )}
            </div>
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
            onClick={handleDismiss}
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
              <div>
                <div style={{ fontWeight: 700, color: '#2b2f33', marginBottom: 6 }}>No active issues</div>
                <div style={{ fontSize: 13 }}>You can keep this panel open. It will auto-populate here as soon as a new potential issue is detected.</div>
              </div>
            </div>
          ) : (
            <>
              {caseDetail && (
                <div style={{ fontWeight: 700, color: '#2b2f33', marginBottom: 12 }}>
                  {caseDetail}
                </div>
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
                {renderTimelineItems(timelineItems)}
              </div>

              <div style={{ height: 1, background: '#eef2f7', margin: '4px 0 14px' }} />

              {/* 360 View */}
              <div style={{ fontWeight: 700, color: '#2b2f33', marginBottom: 10 }}>
                360-Degree Customer View
              </div>
              {renderCustomerInfo()}

              {/* Recommended Actions */}
              {renderRecommendedActions()}
            </>
          )}
        </div>
      </div>

      {/* Floating trigger button */}
      <button
        aria-label="widget"
        onClick={handleToggleWidget}
        aria-expanded={widgetOpen}
        style={{
          width: WIDGET_CONFIG.BUTTON_SIZE,
          height: WIDGET_CONFIG.BUTTON_SIZE,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          border: 0,
          cursor: "pointer",
          ...WIDGET_STYLES.button,
          color: "#fff",
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
