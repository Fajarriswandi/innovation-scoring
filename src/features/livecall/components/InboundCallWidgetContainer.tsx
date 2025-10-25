import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import IncomingCallWidget from "@/components/IncomingCallWidget";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { joinInboundCall } from "@/api/inbound";
import { removeInboundCall } from "@/store/inboundSlice";
import { LIVE_CALL_SESSION_STORAGE_KEY, type LiveCallSession, type LiveCallDebugEntry } from "@/constants/liveCall";
import { appendLiveCallDebugEntry } from "@/utils/liveCallDebug";

const isHumanCaseId = (value?: string | null) => Boolean(value && value.startsWith("#"));

const createDebugEntryId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `inbound-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

const persistSession = (session: LiveCallSession) => {
  try {
    sessionStorage.setItem(LIVE_CALL_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[InboundCall] failed to persist session", error);
    }
  }
};

export default function InboundCallWidgetContainer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queue = useAppSelector((state) => state.inbound.queue);
  const callsByRoom = useAppSelector((state) => state.inbound.callsByRoom);
  const [acceptingRoom, setAcceptingRoom] = useState<string | null>(null);
  const [rejectingRoom, setRejectingRoom] = useState<string | null>(null);
  const activeCall = useMemo(() => {
    for (const room of queue) {
      const call = callsByRoom[room];
      if (call) return call;
    }
    return undefined;
  }, [queue, callsByRoom]);

  const handleReject = useCallback(() => {
    if (!activeCall) return;
    setRejectingRoom(activeCall.roomName);
    dispatch(removeInboundCall(activeCall.roomName));
    window.setTimeout(() => {
      setRejectingRoom((prev) => (prev === activeCall.roomName ? null : prev));
    }, 300);
  }, [activeCall, dispatch]);

  const handleAccept = useCallback(async () => {
    if (!activeCall) return;
    const roomName = activeCall.roomName;
    setAcceptingRoom(roomName);
    try {
      const response = await joinInboundCall(roomName);
      const responseCaseUuid = response.case_uuid ?? (response.case_id && !isHumanCaseId(response.case_id) ? response.case_id : undefined);
      const fallbackUuid =
        activeCall.caseUuid ??
        (activeCall.caseId && !isHumanCaseId(activeCall.caseId) ? activeCall.caseId : undefined);
      const caseId = responseCaseUuid ?? fallbackUuid;
      if (!caseId) {
        throw new Error("Case UUID missing from inbound session.");
      }

      const caseNumber =
        response.case_number ??
        (response.case_id && isHumanCaseId(response.case_id) ? response.case_id : undefined) ??
        activeCall.caseNumber ??
        (activeCall.caseId && isHumanCaseId(activeCall.caseId) ? activeCall.caseId : undefined);

      const session: LiveCallSession = {
        caseId,
        caseNumber,
        roomName: response.room_name,
        livekitToken: response.livekit_token,
        livekitUrl: response.livekit_url,
        customerName: response.customer_name ?? activeCall.customerName,
        customerAvatarUrl: response.customer_avatar_url ?? activeCall.avatarUrl,
        createdAt: response.created_at ?? new Date().toISOString(),
      };

      const debugEntry: LiveCallDebugEntry = {
        id: createDebugEntryId(),
        timestamp: new Date().toISOString(),
        caseId,
        action: "join-inbound-call",
        request: { roomName },
        response,
        notes: "Inbound call accepted via widget.",
      };

      persistSession(session);
      appendLiveCallDebugEntry(debugEntry);
      dispatch(removeInboundCall(roomName));
      navigate(`/live-call?case=${encodeURIComponent(caseId)}`, {
        state: { callSession: session, callDebugEntry: debugEntry },
      });
    } catch (error) {
      const messageText =
        (error as { response?: { data?: { detail?: string; message?: string } } })?.response?.data?.detail ??
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (error as { message?: string })?.message ??
        "Failed to join inbound call.";
      message.error(messageText);
      if (import.meta.env.DEV) {
        console.error("[InboundCall] join failed", error);
      }
    } finally {
      setAcceptingRoom((prev) => (prev === roomName ? null : prev));
    }
  }, [activeCall, dispatch, navigate]);

  if (!activeCall) return null;

  const isAccepting = acceptingRoom === activeCall.roomName;
  const isRejecting = rejectingRoom === activeCall.roomName;

  return (
    <IncomingCallWidget
      callerName={activeCall.customerName}
      callerStatus={activeCall.customerPhone ? `${activeCall.customerPhone} is calling...` : "is now calling..."}
      avatarUrl={activeCall.avatarUrl}
      visible
      onAccept={handleAccept}
      onReject={handleReject}
      isAccepting={isAccepting}
      isRejecting={isRejecting}
    />
  );
}
