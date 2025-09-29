import { useEffect, useRef, useState } from "react";
import type { WidgetIssuesResponse } from "@/api/handlers";
import { WIDGET_CONFIG } from "@/constants/widget";

export const useWidgetIssues = () => {
  const [data, setData] = useState<WidgetIssuesResponse | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const retryDelayRef = useRef<number>(WIDGET_CONFIG.RETRY_DELAY_MS);

  useEffect(() => {
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
      if (cancelled) return;
      setIsConnecting(true);
      setConnectionError(null);

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
            retryDelayRef.current = Math.min(delay * 2, WIDGET_CONFIG.MAX_RETRY_DELAY_MS);
            scheduleReconnect(delay);
          }
          throw new Error(`Widget issues HTTP ${status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Widget issues stream reader unavailable");

        retryDelayRef.current = WIDGET_CONFIG.RETRY_DELAY_MS;
        setIsConnecting(false);

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
                console.error("[useWidgetIssues] failed to parse update", error, payload);
              }
            }
          }
        }

        if (!cancelled) {
          const delay = retryDelayRef.current;
          retryDelayRef.current = Math.min(delay * 2, WIDGET_CONFIG.MAX_RETRY_DELAY_MS);
          scheduleReconnect(delay);
        }
      } catch (error) {
        setIsConnecting(false);
        if (!cancelled) {
          const errorMessage = error instanceof Error ? error.message : "Unknown connection error";
          setConnectionError(errorMessage);
          
          if (import.meta.env.DEV && (error as Error).name !== "AbortError") {
            console.error("[useWidgetIssues] failed to load issues", error);
          }
          
          const delay = retryDelayRef.current;
          retryDelayRef.current = Math.min(delay * 2, WIDGET_CONFIG.MAX_RETRY_DELAY_MS);
          scheduleReconnect(delay);
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      controller.abort();
      setIsConnecting(false);
      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };
  }, []);

  return {
    data,
    isConnecting,
    connectionError
  };
};
