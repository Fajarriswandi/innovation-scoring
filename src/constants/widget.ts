export const WIDGET_CONFIG = {
  AUTO_CLOSE_MS: 10_000,
  RETRY_DELAY_MS: 2000,
  MAX_RETRY_DELAY_MS: 30_000,
  DISMISS_STORAGE_KEY: "widget_anomaly_dismissed_case",
  PANEL_WIDTH: 400,
  BUTTON_SIZE: 48,
  POSITION: {
    RIGHT: 24,
    BOTTOM: 24
  }
} as const;

export const WIDGET_STYLES = {
  panel: {
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(20px)",
    borderRadius: 16,
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    border: "1px solid #eef2f7",
    transition: "opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1), max-height 0.35s cubic-bezier(.4,0,.2,1), margin-bottom 0.35s cubic-bezier(.4,0,.2,1)"
  },
  header: {
    background: "linear-gradient(90deg, rgba(79,136,255,1) 0%, rgba(134,96,255,1) 100%)",
    color: "#fff",
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
  },
  button: {
    background: "linear-gradient(135deg, rgba(79,136,255,1) 0%, rgba(134,96,255,1) 100%)",
    boxShadow: "0 10px 30px rgba(79,136,255,0.35)"
  }
} as const;
