import { useEffect, useRef } from "react";
import {
  fetchPendingInboundCalls,
  normalizeInboundCall,
  buildInboundNotificationsUrl,
  type RawInboundCall,
  type InboundNotificationMessage,
} from "@/api/inbound";
import {
  setPendingCalls,
  setPendingLoading,
  upsertInboundCall,
  removeInboundCall,
  setSseStatus,
  setInboundError,
} from "@/store/inboundSlice";
import { useAppDispatch } from "./redux";

const REMOVE_EVENT_TYPES = new Set([
  "inbound_call_removed",
  "inbound_call_ended",
  "inbound_call_expired",
  "participant_left",
  "call_closed",
]);

const SHOULD_REMOVE_STATUS = new Set(["ended", "expired", "cancelled", "canceled"]);

const extractRoomName = (payload: RawInboundCall | null | undefined) => {
  if (!payload || typeof payload !== "object") return undefined;
  if (typeof payload.room_name === "string") return payload.room_name;
  if (typeof payload.roomName === "string") return payload.roomName;
  return undefined;
};

const shouldRemoveEvent = (eventType?: string, payload?: RawInboundCall | null) => {
  if (!eventType && !payload) return false;
  if (eventType) {
    const normalized = eventType.toLowerCase();
    if (REMOVE_EVENT_TYPES.has(normalized)) {
      return true;
    }
    if (normalized.includes("removed") || normalized.includes("ended") || normalized.includes("closed")) {
      return true;
    }
  }

  const status =
    typeof payload?.status === "string" ? payload.status : typeof payload?.state === "string" ? payload.state : undefined;
  if (status && SHOULD_REMOVE_STATUS.has(status.toLowerCase())) {
    return true;
  }

  return false;
};

export const useInboundNotifications = (enabled = true) => {
  const dispatch = useAppDispatch();
  const reconnectAttempt = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return undefined;

    let isMounted = true;

    const loadPending = async () => {
      dispatch(setPendingLoading(true));
      try {
        const calls = await fetchPendingInboundCalls();
        if (!isMounted) return;
        dispatch(setPendingCalls(calls));
        dispatch(setInboundError(null));
      } catch (error) {
        if (!isMounted) return;
        const message =
          (error as { response?: { data?: { detail?: string; message?: string } } })?.response?.data?.detail ??
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          (error as { message?: string })?.message ??
          "Failed to load pending inbound calls.";
        dispatch(setInboundError(message));
      } finally {
        if (isMounted) {
          dispatch(setPendingLoading(false));
        }
      }
    };

    const cleanupEventSource = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const scheduleReconnect = () => {
      if (!isMounted) return;
      if (reconnectTimerRef.current) return;
      const delay = Math.min(30000, 2000 * 2 ** reconnectAttempt.current);
      reconnectTimerRef.current = window.setTimeout(() => {
        reconnectTimerRef.current = null;
        reconnectAttempt.current += 1;
        connect();
      }, delay);
    };

    const connect = () => {
      cleanupEventSource();
      if (!enabled) return;
      dispatch(setSseStatus("connecting"));

      const url = buildInboundNotificationsUrl();
      try {
        eventSourceRef.current = new EventSource(url, { withCredentials: true });
      } catch (error) {
        dispatch(setInboundError((error as Error)?.message ?? "Cannot open inbound notifications stream."));
        dispatch(setSseStatus("closed"));
        scheduleReconnect();
        return;
      }

      const currentSource = eventSourceRef.current;

      currentSource.onopen = () => {
        reconnectAttempt.current = 0;
        dispatch(setSseStatus("open"));
      };

      currentSource.onerror = () => {
        dispatch(setSseStatus("closed"));
        dispatch(setInboundError("Connection to inbound notifications lost."));
        scheduleReconnect();
      };

      currentSource.onmessage = (event) => {
        if (!event.data || event.data === "ping") return;
        try {
          const parsed = JSON.parse(event.data) as InboundNotificationMessage | RawInboundCall;
          const eventType =
            (parsed as InboundNotificationMessage)?.type ??
            (typeof event.type === "string" && event.type !== "message" ? event.type : undefined);
          const payload =
            (parsed as InboundNotificationMessage)?.data ??
            (parsed as { payload?: RawInboundCall })?.payload ??
            ((parsed && "room_name" in (parsed as object)) ? (parsed as RawInboundCall) : undefined);

          if (!payload && !eventType) return;

          if (shouldRemoveEvent(eventType, payload)) {
            const normalizedPayload = normalizeInboundCall(payload);
            const roomName = extractRoomName(payload) ?? normalizedPayload?.roomName;
            if (roomName) {
              dispatch(removeInboundCall(roomName));
            }
            return;
          }

          if (eventType && eventType.toLowerCase() !== "inbound_call_incoming") {
            return;
          }

          const normalized = normalizeInboundCall(payload);
          if (normalized) {
            dispatch(upsertInboundCall(normalized));
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("[Inbound SSE] failed to parse event", error, event.data);
          }
        }
      };
    };

    loadPending();
    connect();

    return () => {
      isMounted = false;
      cleanupEventSource();
    };
  }, [dispatch, enabled]);
};
