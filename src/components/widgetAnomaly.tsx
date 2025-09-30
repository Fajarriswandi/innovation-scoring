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
import { WIDGET_CONFIG } from "@/constants/widget";

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
            <span className="timeline-line" />
          )}
          <span
            className="timeline-dot"
            style={{ background: item.isFlagged ? '#f97316' : '#4f86ff' }}
          />
        </div>
        <div>
          <div className="timeline-time">{item.time}</div>
          <div className="timeline-desc">{item.description}</div>
        </div>
      </Fragment>
    ));
  };

  const renderCustomerInfo = () => (
    <div className="customerInfo">
      <div>
        <div className="label">Event UID</div>
        <div className="value">{customerInfo.eventId}</div>
      </div>
      <div>
        <div className="label">Account Age</div>
        <div className="value">{customerInfo.accountAge}</div>
      </div>
      <div>
        <div className="label">AVG. Transaction</div>
        <div className="value">{customerInfo.avgTransaction}</div>
      </div>
      <div>
        <div className="label">Last Device</div>
        <div className="value">{customerInfo.lastDevice}</div>
      </div>
    </div>
  );

  const renderRecommendedActions = () => {
    if (!currentCase?.available_actions?.length) return null;

    return (
      <div style={{ marginBottom: 18 }}>
        <div className="sectionTitle">
          Recommended Actions
        </div>
        <div className="actionsGrid">
          {currentCase.available_actions.map((action) => (
            <button
              key={action}
              type="button"
              className="actionButton"
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
    <div 
      className="widgetAnomaly"
      style={{ 
        right: WIDGET_CONFIG.POSITION.RIGHT, 
        bottom: WIDGET_CONFIG.POSITION.BOTTOM, 
      }}
    >
      {/* Panel (card) */}
      <div
        className="widgetPanel"
        style={{
          opacity: panelVisible ? 1 : 0,
          transform: panelVisible ? "translateY(0)" : "translateY(8px)",
          maxHeight: panelVisible ? 1000 : 0,
          marginBottom: panelVisible ? 14 : 0,
          pointerEvents: panelVisible ? undefined : "none",
        }}
      >
        {/* Header */}
        <div className="widgetHeader">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="iconWrap">
              <Icon icon="solar:shield-warning-bold-duotone" width={18} height={18} />
            </span>
            <div>
              <strong>{noIssue ? "No Active Issues" : "Potential Issue Detected"}</strong>
              {isConnecting && (
                <div className="meta">Connecting...</div>
              )}
              {connectionError && (
                <div className="meta">Connection Error</div>
              )}
            </div>
          </div>
          <button
            aria-label="close"
            className="closeButton"
            onClick={handleDismiss}
          >
            <Icon icon="mi:close" width={16} height={16} />
          </button>
        </div>

        {/* Body */}
        <div className="widgetBody">
          {noIssue ? (
            // Placeholder shown when there is no active issue but the panel is opened manually
            <div className="placeholder">
              <div>
                <div className="title">No active issues</div>
                <div className="subtitle">You can keep this panel open. It will auto-populate here as soon as a new potential issue is detected.</div>
              </div>
            </div>
          ) : (
            <>
              {caseDetail && (
                <div className="sectionTitle">
                  {caseDetail}
                </div>
              )}
              
              {formattedTimestamp && (
                <div className="meta timestamp">
                  Last updated: {formattedTimestamp}
                  {typeof data?.cached === 'boolean' && ` • ${data.cached ? 'cached' : 'live'}`}
                </div>
              )}

              {/* Timeline title */}
              <div className="sectionTitle">
                Cross-System Correlation Timeline
              </div>

              {/* Timeline */}
              <div className="timeline">
                {renderTimelineItems(timelineItems)}
              </div>

              <div className="divider" />

              {/* 360 View */}
              <div className="sectionTitle">
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
        className="fab"
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