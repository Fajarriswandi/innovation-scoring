import api, { API_BASE_URL, getApiAuthToken } from "./browser";

export type RawInboundCall = {
  room_name?: string;
  roomName?: string;
  room_sid?: string;
  case_id?: string;
  case_uuid?: string;
  case_number?: string;
  caseId?: string;
  customer_name?: string;
  customerName?: string;
  customer_phone?: string;
  customerPhone?: string;
  caller_name?: string;
  caller_phone?: string;
  avatar_url?: string;
  customer_avatar_url?: string;
  customerAvatarUrl?: string;
  created_at?: string;
  expires_at?: string;
  status?: string;
  participant_count?: number;
  [key: string]: unknown;
};

export type InboundCall = {
  roomName: string;
  roomSid?: string;
  caseId?: string; // prefer UUID when available
  caseUuid?: string;
  caseNumber?: string;
  customerName: string;
  customerPhone?: string;
  avatarUrl?: string;
  createdAt?: string;
  expiresAt?: string;
  status?: string;
  participantCount?: number;
  raw?: RawInboundCall;
};

export const normalizeInboundCall = (input?: RawInboundCall | null): InboundCall | null => {
  if (!input || typeof input !== "object") return null;

  const roomName =
    typeof input.room_name === "string"
      ? input.room_name
      : typeof input.roomName === "string"
        ? input.roomName
        : undefined;

  if (!roomName) return null;

  const rawCaseId = typeof input.case_id === "string" && input.case_id.trim() ? input.case_id.trim() : undefined;
  const rawCaseUuid =
    typeof input.case_uuid === "string" && input.case_uuid.trim() ? input.case_uuid.trim() : undefined;
  const rawCaseNumber =
    typeof input.case_number === "string" && input.case_number.trim() ? input.case_number.trim() : undefined;

  const looksLikeHumanId = (value?: string) => Boolean(value && value.startsWith("#"));

  const caseUuid = rawCaseUuid ?? (rawCaseId && !looksLikeHumanId(rawCaseId) ? rawCaseId : undefined);
  const caseNumber = rawCaseNumber ?? (rawCaseId && looksLikeHumanId(rawCaseId) ? rawCaseId : undefined);
  const caseId = caseUuid ?? caseNumber ?? rawCaseId ?? undefined;

  const customerName =
    typeof input.customer_name === "string"
      ? input.customer_name
      : typeof input.customerName === "string"
        ? input.customerName
        : typeof input.caller_name === "string"
          ? input.caller_name
          : "Unknown caller";

  const customerPhone =
    typeof input.customer_phone === "string"
      ? input.customer_phone
      : typeof input.customerPhone === "string"
        ? input.customerPhone
        : typeof input.caller_phone === "string"
          ? input.caller_phone
          : undefined;

  const avatarUrl =
    typeof input.customer_avatar_url === "string"
      ? input.customer_avatar_url
      : typeof input.avatar_url === "string"
        ? input.avatar_url
        : typeof input.customerAvatarUrl === "string"
          ? input.customerAvatarUrl
          : undefined;

  const createdAt =
    typeof input.created_at === "string"
      ? input.created_at
      : typeof input.createdAt === "string"
        ? input.createdAt
        : undefined;

  const expiresAt =
    typeof input.expires_at === "string"
      ? input.expires_at
      : typeof input.expiresAt === "string"
        ? input.expiresAt
        : undefined;

  const status = typeof input.status === "string" ? input.status : undefined;
  const roomSid = typeof input.room_sid === "string" ? input.room_sid : undefined;
  const participantCount =
    typeof input.participant_count === "number" ? input.participant_count : undefined;

  return {
    roomName,
    roomSid,
    caseId,
    caseUuid,
    caseNumber,
    customerName,
    customerPhone,
    avatarUrl,
    createdAt,
    expiresAt,
    status,
    participantCount,
    raw: input,
  };
};

export type InboundNotificationMessage = {
  type?: string;
  data?: RawInboundCall;
  timestamp?: string;
};

export type JoinInboundCallRequest = {
  operator_id?: string;
  agent_name?: string;
  metadata?: Record<string, unknown>;
};

export type JoinInboundCallResponse = {
  room_name: string;
  case_id: string;
  case_uuid?: string;
  case_number?: string;
  livekit_url: string;
  livekit_token: string;
  customer_name?: string;
  customer_avatar_url?: string;
  created_at?: string;
};

export async function fetchPendingInboundCalls(): Promise<InboundCall[]> {
  const res = await api.get<RawInboundCall[]>("/v1/inbound/pending");
  const items = Array.isArray(res.data) ? res.data : [];
  return items
    .map((item) => normalizeInboundCall(item))
    .filter((item): item is InboundCall => Boolean(item));
}

export async function joinInboundCall(
  roomName: string,
  payload?: JoinInboundCallRequest
): Promise<JoinInboundCallResponse> {
  const trimmed = roomName.trim();
  if (!trimmed) {
    throw new Error("Room name is required");
  }
  const res = await api.post<JoinInboundCallResponse>(`/v1/inbound/${encodeURIComponent(trimmed)}/join`, payload ?? {});
  return res.data;
}

export const buildInboundNotificationsUrl = () => {
  const base = API_BASE_URL ?? "";
  const token = getApiAuthToken();
  const origin =
    typeof window !== "undefined" && window.location
      ? window.location.origin
      : "http://localhost";
  try {
    const url = new URL(base, origin);
    const normalizedPath = `${url.pathname.replace(/\/$/, "")}/v1/inbound/notifications`;
    url.pathname = normalizedPath;
    if (token) {
      url.searchParams.set("auth", token.replace(/^Bearer\s+/i, ""));
    }
    return url.toString();
  } catch {
    const path = `${base?.replace(/\/$/, "")}/v1/inbound/notifications`;
    if (token) {
      const separator = path.includes("?") ? "&" : "?";
      return `${path}${separator}auth=${encodeURIComponent(token.replace(/^Bearer\s+/i, ""))}`;
    }
    return path;
  }
};
