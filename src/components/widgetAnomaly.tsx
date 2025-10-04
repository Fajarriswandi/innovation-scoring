import { Fragment, useEffect, useMemo, useRef, useState, type AnimationEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { App } from "antd";
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
import type { WidgetIssuesResponse } from "@/api/handlers";
import {
  dialCaseCustomer,
  endCaseCall,
  initiateCaseCall,
  type CaseCallResponse,
} from "@/api/handlers";
import {
  LIVE_CALL_SESSION_STORAGE_KEY,
  type LiveCallSession,
  type LiveCallDebugEntry,
} from "@/constants/liveCall";
import {
  appendLiveCallDebugEntry,
  clearLiveCallDebugEntries,
} from "@/utils/liveCallDebug";

const CONTACT_CUSTOMER_VALUE = "contact customer";
const DEFAULT_CALL_STATUS = "Waiting for customer to pick up.";

const createDebugEntryId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `livecall-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

const extractRecommendation = (
  caseData: WidgetIssuesResponse["current_case"]
): string | null => {
  if (!caseData) return null;

  const caseAsRecord = caseData as unknown as Record<string, unknown>;
  const candidateKeys = ["recommendation", "Recommendation"] as const;

  for (const key of candidateKeys) {
    const raw = caseAsRecord[key];
    if (typeof raw === "string" && raw.trim()) {
      return raw.trim();
    }
  }

  const metadata = caseAsRecord["metadata"];
  if (metadata && typeof metadata === "object") {
    const metaRecord = metadata as Record<string, unknown>;
    for (const key of candidateKeys) {
      const raw = metaRecord[key];
      if (typeof raw === "string" && raw.trim()) {
        return raw.trim();
      }
    }
  }

  if (typeof caseData.detail === "string") {
    const match = caseData.detail.match(/Recommendation:?\s*([^\n]+)/i);
    if (match?.[1]) {
      const value = match[1].trim();
      if (value) return value;
    }
  }

  return null;
};

type WidgetAnomalyProps = {
  widgetOpen: boolean;
  setWidgetOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
};

export default function WidgetAnomaly({ widgetOpen, setWidgetOpen }: WidgetAnomalyProps) {
  const { data, isConnecting, connectionError } = useWidgetIssues();
  const { initializeDismissed, isDismissed, dismissCase, clearDismissed } = useLocalStorage();

  const lastCaseId = useRef<string | null>(null);
  const [showDialCallModal, setShowDialCallModal] = useState(false);
  const [dialCallModalRendered, setDialCallModalRendered] = useState(false);
  const [callStatus, setCallStatus] = useState(DEFAULT_CALL_STATUS);
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);
  const [isDialingCustomer, setIsDialingCustomer] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);
  type ActiveCallState = CaseCallResponse & { caseUuid: string };

  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);
  const [pendingCallSession, setPendingCallSession] = useState<LiveCallSession | null>(null);
  const [isCallWorkflowActive, setIsCallWorkflowActive] = useState(false);
  const [displayCaseId, setDisplayCaseId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { message } = App.useApp();

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
  const recommendation = useMemo(() => extractRecommendation(currentCase), [currentCase]);
  const customerName = useMemo(() => {
    const customer = currentCase?.customer;
    if (!customer) return "Customer";
    const parts = [customer.first_name, customer.last_name]
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean);
    if (parts.length) return parts.join(" ");
    if (typeof customer.name === "string" && customer.name.trim()) return customer.name.trim();
    return "Customer";
  }, [currentCase?.customer]);

  const customerAvatarUrl = useMemo(() => {
    const customer = currentCase?.customer;
    const explicit = typeof customer?.image_url === "string" && customer.image_url.trim()
      ? customer.image_url.trim()
      : typeof customer?.photo === "string" && customer.photo.trim()
        ? customer.photo.trim()
        : undefined;
    if (explicit) return explicit;
    const nameForAvatar = customerName.trim() || "Customer";
    const encoded = encodeURIComponent(nameForAvatar);
    return `https://ui-avatars.com/api/?background=E8F1FF&color=0B3C5D&name=${encoded}`;
  }, [currentCase?.customer, customerName]);

  const formattedTimestamp = useMemo(() => formatTimestamp(data?.timestamp), [data?.timestamp]);

  // Handle display case ID, preferring the human-readable one from activeCall when available
  useEffect(() => {
    if (currentCase?.id) {
      setDisplayCaseId(currentCase.id);
    }
  }, [currentCase?.id]);

  useEffect(() => {
    if (activeCall?.case_id) {
      setDisplayCaseId(activeCall.case_id);
    }
  }, [activeCall]);

  // Handle case changes and auto-open/close logic
  useEffect(() => {
    const caseId = currentCase?.id ?? null;

    if (caseId && caseId !== lastCaseId.current) {
      lastCaseId.current = caseId;

      if (!isCallWorkflowActive) {
        clearDismissed();
        resetAutoClosedCase();

        if (hasIssueCase) {
          setWidgetOpen(true);
          scheduleAutoClose(caseId);
          setActiveCall(null);
          setShowDialCallModal(false);
          setCallStatus(DEFAULT_CALL_STATUS);
        }
      }
    }

    if (hasIssueCase && caseId) {
      if (isDismissed(caseId)) return;

      if (!widgetOpen && !isAutoClosedCase(caseId) && !isCallWorkflowActive) {
        setWidgetOpen(true);
        scheduleAutoClose(caseId);
      }
    } else if (!isCallWorkflowActive) {
      resetAutoClosedCase();
      clearDismissed();
      if (widgetOpen) setWidgetOpen(false);
      setActiveCall(null);
      setShowDialCallModal(false);
      setCallStatus(DEFAULT_CALL_STATUS);
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
    scheduleAutoClose,
    isCallWorkflowActive
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
    setShowDialCallModal(false);
    setCallStatus(DEFAULT_CALL_STATUS);
    setActiveCall(null);
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
        setShowDialCallModal(false);
        setCallStatus(DEFAULT_CALL_STATUS);
        setActiveCall(null);
      }
      return next;
    });
  };

  useEffect(() => {
    if (isCallWorkflowActive) {
      return;
    }

    const caseId = currentCase?.id;
    if (!caseId) {
      setShowDialCallModal(false);
      setCallStatus(DEFAULT_CALL_STATUS);
      setActiveCall(null);
      return;
    }

    const isContactCustomer = recommendation?.toLowerCase() === CONTACT_CUSTOMER_VALUE;
    if (!isContactCustomer) {
      setShowDialCallModal(false);
      setCallStatus(DEFAULT_CALL_STATUS);
      setActiveCall(null);
    }
  }, [currentCase?.id, recommendation, isCallWorkflowActive]);

  useEffect(() => {
    if (showDialCallModal) {
      setDialCallModalRendered(true);
      setCallStatus(DEFAULT_CALL_STATUS);
    }
  }, [showDialCallModal]);

  const createLiveCallSession = (
    payload: CaseCallResponse,
    caseUuid: string,
    customerNameValue: string,
    avatarUrl: string,
    createdAt?: string
  ): LiveCallSession => ({
    caseId: caseUuid,
    roomName: payload.room_name,
    livekitToken: payload.livekit_token,
    livekitUrl: payload.livekit_url,
    sipCallId: payload.sip_call_id,
    participantIdentity: payload.participant_identity,
    customerName: customerNameValue,
    customerAvatarUrl: avatarUrl,
    createdAt: createdAt ?? new Date().toISOString(),
  });

  const persistCallSession = (session: LiveCallSession) => {
    try {
      sessionStorage.setItem(LIVE_CALL_SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("[WidgetAnomaly] failed to persist call session", err);
      }
    }
  };

  const clearCallSession = () => {
    setActiveCall(null);
    setPendingCallSession(null);
    setIsCallWorkflowActive(false);
    try {
      sessionStorage.removeItem(LIVE_CALL_SESSION_STORAGE_KEY);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("[WidgetAnomaly] failed to clear call session", err);
      }
    }
  };

  const handleCloseDialCallModal = async () => {
    if (activeCall?.caseUuid) {
      await handleHangup();
    }
    setShowDialCallModal(false);
    setCallStatus(DEFAULT_CALL_STATUS);
    if (!activeCall) {
      setIsCallWorkflowActive(false);
    }
  };

  const handleRecommendedAction = async (action: string) => {
    const normalized = action.trim().toLowerCase();
    if (normalized !== CONTACT_CUSTOMER_VALUE) {
      return;
    }

    if (!currentCase?.id) {
      message.error("Case information unavailable for call.");
      return;
    }

    if (isInitiatingCall) return;

    const caseUuid = currentCase.id;
    const requestPayload: Record<string, unknown> = { caseId: caseUuid };

    setIsCallWorkflowActive(true);
    setIsInitiatingCall(true);
    setCallStatus("Connecting to call room...");
    clearLiveCallDebugEntries();

    try {
      const response = await initiateCaseCall(caseUuid);
      const session = createLiveCallSession(response, caseUuid, customerName, customerAvatarUrl);
      const debugEntry: LiveCallDebugEntry = {
        id: createDebugEntryId(),
        timestamp: new Date().toISOString(),
        action: "initiate-call",
        caseId: caseUuid,
        request: requestPayload,
        response,
        notes: "Call session created from widget recommendation.",
      };

      setActiveCall({ ...response, caseUuid });
      setPendingCallSession(session);
      appendLiveCallDebugEntry(debugEntry);
      persistCallSession(session);
      setCallStatus("Call session created. Redirecting to live call...");
      message.success("Call session created. Redirecting...");

      navigate(`/live-call?case=${encodeURIComponent(caseUuid)}`, {
        state: { callSession: session, callDebugEntry: debugEntry },
      });
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to start call.";

      appendLiveCallDebugEntry({
        id: createDebugEntryId(),
        timestamp: new Date().toISOString(),
        action: "initiate-call",
        caseId: caseUuid,
        request: requestPayload,
        error: errorMessage,
        notes: "initiateCaseCall failed.",
      });

      setCallStatus("Unable to start call.");
      message.error(errorMessage);
      setIsCallWorkflowActive(false);
    } finally {
      setIsInitiatingCall(false);
    }
  };

  const handleHangup = async () => {
    const caseUuid = activeCall?.caseUuid;

    if (!caseUuid || isEndingCall) {
      setCallStatus("Call ended.");
      return;
    }

    setIsEndingCall(true);
    setCallStatus("Ending call...");

    try {
      await endCaseCall(caseUuid);
      message.success("Call ended.");
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to end call.";
      message.error(errorMessage);
    } finally {
      setIsEndingCall(false);
      setCallStatus("Call ended.");
      clearCallSession();
    }
  };

  const handleContactNow = async () => {
    const caseUuid = activeCall?.caseUuid;

    console.log(
      "[WidgetAnomaly] Contact Now clicked. Case ID from activeCall:",
      activeCall?.case_id,
      { activeCall }
    );

    if (!caseUuid) {
      message.error("Call session not initialized yet.");
      return;
    }
    if (isDialingCustomer) return;

    setIsDialingCustomer(true);
    setCallStatus("Dialing customer...");

    try {
      await dialCaseCustomer(caseUuid);
      const session =
        pendingCallSession ??
        (activeCall
          ? createLiveCallSession(activeCall, caseUuid, customerName, customerAvatarUrl)
          : null);

      if (session) {
        setPendingCallSession(session);
        persistCallSession(session);
      }

      setCallStatus("Dial request sent. Redirecting to live call...");
      message.success("Customer has been dialed.");
      navigate(`/live-call?case=${encodeURIComponent(caseUuid)}`, {
        state: session ? { callSession: session } : undefined,
      });
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to dial customer.";
      setCallStatus("Unable to reach customer. Try again.");
      message.error(errorMessage);
      setIsCallWorkflowActive(false);
    } finally {
      setIsDialingCustomer(false);
    }
  };

  const handleDialCallModalAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) return;
    if (!showDialCallModal) {
      setDialCallModalRendered(false);
    }
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
        <div className="label">Case ID</div>
        <div className="value">{displayCaseId ?? 'N/A'}</div>
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
              onClick={() => handleRecommendedAction(action)}
              disabled={
                action.trim().toLowerCase() === CONTACT_CUSTOMER_VALUE &&
                (isInitiatingCall || isDialingCustomer || isEndingCall)
              }
            >
              {isInitiatingCall && action.trim().toLowerCase() === CONTACT_CUSTOMER_VALUE
                ? "Connecting call..."
                : action}
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

      {dialCallModalRendered && (
        <div
          className={`widgetAnomalyModal ${showDialCallModal ? "widgetAnomalyModal--visible" : "widgetAnomalyModal--hidden"}`}
          role="dialog"
          aria-modal="true"
          onAnimationEnd={handleDialCallModalAnimationEnd}
        >
          <div className="widgetAnomalyModal__content">
            <div className="widgetAnomalyModal__header">
              <button
                type="button"
                className="widgetAnomalyModal__close"
                onClick={handleCloseDialCallModal}
                aria-label="Close recommendation modal"
              >
                <Icon icon="mi:close" width={16} height={16} />
              </button>
            </div>
            <div className="widgetAnomalyModal__body">
              <div className="widgetAnomalyModal__subtitle">Dialing Customer...</div>
              <div className="widgetAnomalyModal__title">{customerName}</div>
              <div className="widgetAnomalyModal__avatar">
                <img src={customerAvatarUrl} alt={`${customerName} avatar`} />
              </div>
              <div className="widgetAnomalyModal__controls">
                <button
                  type="button"
                  className="widgetAnomalyModal__control widgetAnomalyModal__control--hangup"
                  onClick={handleHangup}
                  disabled={isEndingCall}
                  aria-label="End call"
                >
                  {isEndingCall ? (
                    <Icon icon="eos-icons:three-dots-loading" width={24} height={24} />
                  ) : (
                    <Icon icon="mdi:phone-hangup" width={24} height={24} />
                  )}
                </button>
                <button
                  type="button"
                  className="widgetAnomalyModal__control widgetAnomalyModal__control--contact"
                  onClick={handleContactNow}
                  disabled={isDialingCustomer || isEndingCall}
                >
                  <span className="widgetAnomalyModal__controlIcon">
                    {isDialingCustomer ? (
                      <Icon icon="eos-icons:three-dots-loading" width={22} height={22} />
                    ) : (
                      <Icon icon="mdi:phone-in-talk" width={22} height={22} />
                    )}
                  </span>
                  <span className="widgetAnomalyModal__controlLabel">Contact now</span>
                </button>
              </div>
              <div className="widgetAnomalyModal__status">{callStatus}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
