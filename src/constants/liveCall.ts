export const LIVE_CALL_SESSION_STORAGE_KEY = "livecall:session";

export type LiveCallSession = {
  caseId: string;
  roomName: string;
  livekitToken: string;
  livekitUrl: string;
  sipCallId?: string;
  participantIdentity?: string;
  customerName?: string;
  customerAvatarUrl?: string;
  createdAt: string;
};
