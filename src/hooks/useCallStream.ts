import { useEffect, useRef, useState } from "react";

export type CallStreamTranscript = {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
  raw: unknown;
};

export type CallStreamSentiment = {
  id: string;
  overallSentiment: string;
  sentimentScore?: number;
  confidence?: number;
  lastUpdated?: string;
  timestamp: string;
  raw: unknown;
};

export type CallStreamMetadata = {
  customerName?: string;
  customerIdentifier?: string;
  operatorName?: string;
  operatorIdentifier?: string;
  raw: unknown;
};

export type UseCallStreamResult = {
  transcripts: CallStreamTranscript[];
  sentiments: CallStreamSentiment[];
  metadata: CallStreamMetadata | null;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
};

const parseStreamLine = (payload: string, caseId: string, seed: () => string): CallStreamTranscript | null => {
  if (!payload) return null;

  try {
    const parsed = JSON.parse(payload) as Record<string, unknown>;
    const eventType = typeof parsed.type === "string" ? parsed.type : undefined;

    const data =
      eventType && parsed.data && typeof parsed.data === "object"
        ? (parsed.data as Record<string, unknown>)
        : parsed;

    const rawText =
      typeof data.text === "string"
        ? data.text
        : typeof data.transcript === "string"
          ? data.transcript
          : typeof data.message === "string"
            ? data.message
            : undefined;

    // Has text content, treat as a transcript line
    if (rawText) {
      const speaker =
        typeof data.speaker === "string"
          ? data.speaker
          : typeof data.role === "string"
            ? data.role
            : typeof data.source === "string"
              ? data.source
              : "System";

      const timestamp =
        typeof data.timestamp === "string"
          ? data.timestamp
          : typeof data.time === "string"
            ? data.time
            : typeof parsed.timestamp === "string"
              ? parsed.timestamp
              : new Date().toISOString();

      const idCandidate =
        typeof data.id === "string" && data.id.trim()
          ? data.id
          : typeof data.sequence === "number"
            ? `${caseId}-seq-${data.sequence}`
            : undefined;
      const id = idCandidate ?? seed();

      return {
        id,
        speaker,
        text: rawText,
        timestamp,
        raw: parsed,
      };
    }

    // Handle specific system events without text
    if (eventType === "connected") {
      const timestamp =
        typeof parsed.timestamp === "string" ? parsed.timestamp : new Date().toISOString();
      return {
        id: seed(),
        speaker: "System",
        text: "Call connected.",
        timestamp,
        raw: parsed,
      };
    }

    // Ignore other event types without text content
    return null;
  } catch {
    // Fallback for non-JSON payloads
    const id = seed();
    return {
      id,
      speaker: "System",
      text: payload,
      timestamp: new Date().toISOString(),
      raw: payload,
    };
  }
};

export const useCallStream = (caseId: string | null | undefined): UseCallStreamResult => {
  const [transcripts, setTranscripts] = useState<CallStreamTranscript[]>([]);
  const [sentiments, setSentiments] = useState<CallStreamSentiment[]>([]);
  const [metadata, setMetadata] = useState<CallStreamMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  useEffect(() => {
    const caseUuid = caseId?.trim();
    if (!caseUuid) {
      setTranscripts([]);
      setSentiments([]);
      setMetadata(null);
      setIsLoading(false);
      setIsConnected(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const devBase = import.meta.env.VITE_API_DEV_BASE ?? "/__api";
    const prodBase = import.meta.env.VITE_API_BASE_URL ?? "";
    const baseUrl = (import.meta.env.DEV ? devBase : prodBase).replace(/\/$/, "");
    const token = import.meta.env.VITE_API_TOKEN as string | undefined;
    const url = `${baseUrl}/v1/cases/${caseUuid}/call-stream`;

    const run = async () => {
      setIsLoading(true);
      setIsConnected(false);
      setError(null);
      setTranscripts([]);
      setSentiments([]);
      setMetadata(null);

      try {
        const headers: Record<string, string> = {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
        };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Call stream HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Call stream reader unavailable");
        readerRef.current = reader;
        setIsConnected(true);
        setIsLoading(false);

        const decoder = new TextDecoder();
        let buffer = "";

        const seed = () => `${caseUuid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

        while (!cancelled) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line || line.startsWith(":")) continue;

            // If line starts with 'data:', slice it off. Otherwise, use the whole line.
            const payload = line.startsWith("data:") ? line.slice(5).trim() : line;
            if (!payload) continue;

            let parsed: Record<string, unknown> | null = null;
            try {
              parsed = JSON.parse(payload) as Record<string, unknown>;
            } catch {
              parsed = null;
            }

            if (parsed) {
              const eventType = typeof parsed.type === "string" ? parsed.type : undefined;
              const data =
                eventType && parsed.data && typeof parsed.data === "object"
                  ? (parsed.data as Record<string, unknown>)
                  : parsed;

              if (eventType === "sentiment") {
                const timestamp =
                  typeof data.last_updated === "string"
                    ? data.last_updated
                    : typeof parsed.timestamp === "string"
                      ? parsed.timestamp
                      : new Date().toISOString();

                const id = `${caseUuid}-sentiment-${timestamp}-${Math.random().toString(16).slice(2, 8)}`;

                setSentiments((prev) => [
                  ...prev,
                  {
                    id,
                    timestamp,
                    overallSentiment:
                      typeof data.overall_sentiment === "string"
                        ? data.overall_sentiment
                        : typeof data.sentiment === "string"
                          ? data.sentiment
                          : "unknown",
                    sentimentScore:
                      typeof data.sentiment_score === "number"
                        ? data.sentiment_score
                        : typeof data.score === "number"
                          ? data.score
                          : undefined,
                    confidence: typeof data.confidence === "number" ? data.confidence : undefined,
                    lastUpdated: typeof data.last_updated === "string" ? data.last_updated : undefined,
                    raw: parsed,
                  },
                ]);
                continue;
              }

              if (eventType === "metadata") {
                const customer = data.customer && typeof data.customer === "object"
                  ? (data.customer as Record<string, unknown>)
                  : undefined;
                const operator = data.operator && typeof data.operator === "object"
                  ? (data.operator as Record<string, unknown>)
                  : undefined;

                const customerNameCandidate =
                  (typeof customer?.name === "string" && customer.name.trim()) ||
                  (typeof customer?.full_name === "string" && customer.full_name.trim()) ||
                  (typeof customer?.display_name === "string" && customer.display_name.trim()) ||
                  undefined;

                const operatorNameCandidate =
                  (typeof operator?.name === "string" && operator.name.trim()) ||
                  (typeof operator?.full_name === "string" && operator.full_name.trim()) ||
                  (typeof operator?.display_name === "string" && operator.display_name.trim()) ||
                  undefined;

                setMetadata({
                  customerName: customerNameCandidate,
                  customerIdentifier:
                    (typeof customer?.id === "string" && customer.id.trim()) ||
                    (typeof customer?.identifier === "string" && customer.identifier.trim()) ||
                    undefined,
                  operatorName: operatorNameCandidate,
                  operatorIdentifier:
                    (typeof operator?.id === "string" && operator.id.trim()) ||
                    (typeof operator?.identifier === "string" && operator.identifier.trim()) ||
                    undefined,
                  raw: parsed,
                });
                continue;
              }
            }

            const transcript = parseStreamLine(payload, caseUuid, seed);
            if (!transcript) continue;

            setTranscripts((prev) => [...prev, transcript]);
          }
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Unknown call stream error";
        setError(message);
        setIsConnected(false);
        setIsLoading(false);
        if (import.meta.env.DEV) {
          console.error("[useCallStream]", err);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      abortControllerRef.current?.abort();
      readerRef.current?.cancel().catch(() => undefined);
      readerRef.current = null;
      setIsConnected(false);
    };
  }, [caseId]);

  return { transcripts, sentiments, metadata, isLoading, isConnected, error };
};
