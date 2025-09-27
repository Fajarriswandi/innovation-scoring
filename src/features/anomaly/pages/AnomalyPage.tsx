import { useEffect, useState, Fragment } from "react";
import { Row, Col } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";
import RealtimeLogScanner from "@/components/RealtimeLogScanner";
import PotentialProblems from "@/components/PotentialProblems";
import { Icon } from "@iconify/react";

const gutter = [16, { xs: 12, sm: 16, md: 20, lg: 24 }] as const;

export default function AnomalyPage() {
  const dispatch = useAppDispatch();
  const [widgetOpen, setWidgetOpen] = useState(false);

  useEffect(() => {
    dispatch(setSmallTitle("Anomaly Detection"));
    return () => {
      dispatch(setSmallTitle("Dashboard"));
    };
  }, [dispatch]);

  return (
    <div>
      <Helmet>
        <title>Anomaly Detection | AI Powered Call Center</title>
      </Helmet>

      {/* Widget */}
      <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 1000 }}>
        {/* Panel (card) */}
        <div
          style={{
            width: 400,
            maxWidth: "90vw",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            overflow: "hidden",
            border: "1px solid #eef2f7",
            transition:
              "opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1), max-height 0.35s cubic-bezier(.4,0,.2,1), margin-bottom 0.35s cubic-bezier(.4,0,.2,1)",
            opacity: widgetOpen ? 1 : 0,
            transform: widgetOpen ? "translateY(0)" : "translateY(8px)",
            maxHeight: widgetOpen ? 1000 : 0,
            marginBottom: widgetOpen ? 14 : 0,
            pointerEvents: widgetOpen ? undefined : "none",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              background:
                "linear-gradient(90deg, rgba(79,136,255,1) 0%, rgba(134,96,255,1) 100%)",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.2)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon icon="solar:shield-warning-bold-duotone" width={18} height={18} />
              </span>
              <strong>Potential Issue Detected</strong>
            </div>
            <button
              aria-label="close"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: 0,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => setWidgetOpen(false)}
            >
              <Icon icon="mi:close" width={16} height={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, color: "#2b2f33", marginBottom: 10 }}>
              Duplicate Payment Detected
            </div>

            {/* Timeline title */}
            <div style={{ fontWeight: 600, color: "#2b2f33", marginBottom: 8 }}>
              Cross-System Correlation Timeline
            </div>

            {/* Timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "20px 1fr", rowGap: 12, marginBottom: 16 }}>
              {[
                {
                  t: "11:05:33 – UAE PASS",
                  d: "Login successful from IP 94.200.21.45 – Dubai, AE",
                },
                {
                  t: "11:06:10 – Dubai Pay",
                  d: "Payment of AED 420.00 made for Traffic Fine ID: TF-2025-889",
                },
                {
                  t: "11:06:45 – Dubai Pay",
                  d: "Another payment of AED 420.00 detected for the same Traffic Fine ID: TF-2025-889",
                },
                {
                  t: "11:06:45 – Dubai Pay",
                  d: "Service confirmation failed for second transaction → possible double charge.",
                },
              ].map((it, i, arr) => (
                <Fragment key={`timeline-${i}`}>
                  <div style={{ position: "relative" }}>
                    {/* line */}
                    {i < arr.length - 1 && (
                      <span
                        style={{
                          position: "absolute",
                          left: 9,
                          top: 12,
                          bottom: -12,
                          width: 2,
                          background: "#e5eaf2",
                        }}
                      />
                    )}
                    {/* dot */}
                    <span
                      style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        background: "#4f86ff",
                        border: "2px solid #dfe8ff",
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#8c96a3" }}>{it.t}</div>
                    <div style={{ color: "#2b2f33" }}>{it.d}</div>
                  </div>
                </Fragment>
              ))}
            </div>

            <div style={{ height: 1, background: "#eef2f7", margin: "4px 0 14px" }} />

            {/* 360 View */}
            <div style={{ fontWeight: 700, color: "#2b2f33", marginBottom: 10 }}>
              360-Degree Customer View
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 10, columnGap: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: "#9aa7b2" }}>Event UID</div>
                <div style={{ color: "#2b2f33" }}>550e8400</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#9aa7b2" }}>Account Age</div>
                <div style={{ color: "#2b2f33" }}>4 years, 1 month</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#9aa7b2" }}>AVG. Transaction</div>
                <div style={{ color: "#2b2f33" }}>AED 380.00</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#9aa7b2" }}>Last Login</div>
                <div style={{ color: "#2b2f33" }}>2025-09-03 10:58:21</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating trigger button */}
        <button
          aria-label="widget"
          onClick={() => setWidgetOpen((v) => !v)}
          aria-expanded={widgetOpen}
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            border: 0,
            cursor: "pointer",
            background:
              "linear-gradient(135deg, rgba(79,136,255,1) 0%, rgba(134,96,255,1) 100%)",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(79,136,255,0.35)",
            display: "grid",
            placeItems: "center",
            marginLeft: "auto",
          }}
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
      {/* Widget */}

      <Row gutter={gutter}>
        <Col xs={24} lg={10} xl={12}>
          {/* Realtime Log Scanner */}
          <RealtimeLogScanner />
        </Col>

        {/* AI Suggestions (Potential Problems) */}
        <Col xs={24} lg={10} xl={12}>
          <PotentialProblems />
        </Col>
      </Row>
    </div>
  );
}
