export const LIVE_CALL_SESSION_STORAGE_KEY = "livecall:session";

export type LiveCallSession = {
  caseId: string; // always BE case UUID
  caseNumber?: string; // human-readable case number (#xxxx)
  roomName: string;
  livekitToken: string;
  livekitUrl: string;
  sipCallId?: string;
  participantIdentity?: string;
  customerName?: string;
  customerAvatarUrl?: string;
  createdAt: string;
};

export const LIVE_CALL_DEBUG_LOG_STORAGE_KEY = "livecall:debug-log";
export const LIVE_CALL_DEBUG_MAX_ENTRIES = 20;

export type LiveCallDebugAction =
  | "initiate-call"
  | "join-inbound-call"
  | "dial-customer"
  | "end-call"
  | "error";

export type LiveCallDebugEntry = {
  id: string;
  timestamp: string;
  caseId?: string;
  action: LiveCallDebugAction;
  request?: Record<string, unknown>;
  response?: unknown;
  error?: string;
  notes?: string;
};
