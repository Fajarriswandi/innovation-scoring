import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import SmallStatCard from "@/components/SmallStatCard";
import TalkListenRatio from "@/components/TalkListenRatio";
import AllMyCasesRemote from "@/components/AllMyCases";
import { setSmallTitle } from "@/store/layoutSlice";
import WidgetAnomaly from "@/components/widgetAnomaly";
import { Card, Row, Col, Button, Flex } from "antd";
import { MoreOutlined, ReloadOutlined, PlusOutlined, CalendarOutlined, CoffeeOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet-async";
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";
import type { LabelProps } from "recharts";
import { Icon } from "@iconify/react";

const gutter = [16, { xs: 12, sm: 16, md: 20, lg: 24 }] as [number, object];
const sentimentValue = 83.79; // contoh; 0–100, bisa binding dari state/API
const sentimentClamped = Math.max(0, Math.min(100, sentimentValue));

// --- [REVISED] PieChartWithNeedle using user-provided example ---

const PieChartWithNeedle: React.FC<{ value: number }> = ({ value }) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  const pieProps = {
    startAngle: 180,
    endAngle: 0,
    innerRadius: 60,
    outerRadius: 95,
    dataKey: "value" as const,
    stroke: "none",
  };

  return (
    <ResponsiveContainer>
      <PieChart>

        {/* Animated value arc */}
        <Pie
          {...pieProps}
          data={[{ name: "value", value: clampedValue }, { name: "rest", value: 100 - clampedValue }]}
          isAnimationActive
        >
          <Cell fill="#69b1ff" />
          <Cell fill="#e9ecef" />
          <Label
            position="center"
            content={({ viewBox }: LabelProps) => {
              if (!viewBox) return null;

              const {
                cx,
                cy,
                x,
                y,
                width,
                height,
                outerRadius: viewBoxOuterRadius,
              } = viewBox as LabelProps["viewBox"] & {
                cx?: number;
                cy?: number;
                x?: number;
                y?: number;
                width?: number;
                height?: number;
                outerRadius?: number;
              };

              const centerX = typeof cx === "number"
                ? cx
                : typeof x === "number" && typeof width === "number"
                  ? x + width / 2
                  : undefined;
              const centerY = typeof cy === "number"
                ? cy
                : typeof y === "number" && typeof height === "number"
                  ? y + height / 2
                  : undefined;

              if (typeof centerX !== "number" || typeof centerY !== "number") {
                return null;
              }

              const outerRadius = typeof viewBoxOuterRadius === "number" ? viewBoxOuterRadius : pieProps.outerRadius;
              const startAngle = pieProps.startAngle;
              const endAngle = pieProps.endAngle;
              const RAD = Math.PI / 180;
              const angle = startAngle + ((endAngle - startAngle) * clampedValue) / 100;

              const tickAngles = [0, 25, 50, 75, 100].map(
                (tick) => startAngle + ((endAngle - startAngle) * tick) / 100
              );

              const ticks = tickAngles.map((tickAngle, index) => {
                const inner = outerRadius + 2;
                const outer = outerRadius + 10;
                const x1 = centerX + inner * Math.cos(tickAngle * RAD);
                const y1 = centerY - inner * Math.sin(tickAngle * RAD);
                const x2 = centerX + outer * Math.cos(tickAngle * RAD);
                const y2 = centerY - outer * Math.sin(tickAngle * RAD);
                return <line key={`tick-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#bfbfbf" strokeWidth={2} />;
              });

              const needleRadius = outerRadius + 8;
              const needleX = centerX + needleRadius * Math.cos(angle * RAD);
              const needleY = centerY - needleRadius * Math.sin(angle * RAD);

              return (
                <g>
                  {ticks}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={needleX}
                    y2={needleY}
                    stroke="#525B66"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <circle cx={centerX} cy={centerY} r={6} fill="#525B66" />
                </g>
              );
            }}
          />
        </Pie>

      </PieChart>
    </ResponsiveContainer>
  );
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [postCallNote, setPostCallNote] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setSmallTitle("Dashboard Agent"));
    document.title = "Dashboard Agent | AI Powered Call Center";
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Powered Call Center";
    };
  }, [dispatch]);

  useEffect(() => {
    const note = (location.state as { postCallMessage?: string } | null)?.postCallMessage;
    if (note) {
      setPostCallNote(note);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="dashboard-grid">
      <Helmet>
        <title>Dashboard Agent | AI Powered Call Center</title>
      </Helmet>

      <WidgetAnomaly widgetOpen={widgetOpen} setWidgetOpen={setWidgetOpen} />

      {postCallNote && (
        <div className="postCallBanner" role="status" aria-live="polite">
          <span className="postCallBanner__icon" aria-hidden="true">
            <Icon icon="mdi:check-circle" width={18} height={18} />
          </span>
          <span className="postCallBanner__message">{postCallNote}</span>
          <button
            type="button"
            className="postCallBanner__close"
            onClick={() => setPostCallNote(null)}
            aria-label="Tutup notifikasi"
          >
            <Icon icon="mdi:close" width={16} height={16} />
          </button>
        </div>
      )}

      <Row gutter={gutter}>

        {/* First Column */}
        <Col xs={24} lg={10} xl={8}>
          <Card className="noborderHeader cardAgentProfile" extra={<a href="#"> <MoreOutlined /> </a>} title="My Profile" >
            <div className="profileWrapper">
              <img src="/src/assets/img/agent-profile.png" alt="Agent Profile" />
              <h3>Reem Al Falasi</h3>
              <span>Care Agent</span>
              <span className="badge success">Available</span>

              <Flex justify={"center"} align={"center"}>
                <div className="time">
                  <small>Time</small>
                  8:00 am - 2 pm
                </div>
                <div className="time">
                  <small>Time</small>
                  8:00 am - 2 pm
                </div>
              </Flex>
            </div>

            <div className="secondaryTitleCard">
              <h4>Time Off Requests</h4>
              <div><Button className="btnLight" icon={<PlusOutlined />} /></div>
            </div>

            <div className="listItems">
              <div className="item">
                <div className="left">
                  <div><Button className="btnLight" icon={<CalendarOutlined />} /></div>
                  <div className="time">
                    <small>Paid Time Of (PTO)</small> Thur, 8/8/22
                  </div>
                </div>
                <div className="right"><span className="badge approved">Approved</span></div>
              </div>
              <div className="item">
                <div className="left">
                  <div><Button className="btnLight" icon={<CalendarOutlined />} /></div>
                  <div className="time">
                    <small>Paid Time Of (PTO)</small> Thur, 8/8/22
                  </div>
                </div>
                <div className="right"><span className="badge approved">Approved</span></div>
              </div>
              <div className="item">
                <div className="left">
                  <div><Button className="btnLight" icon={<CalendarOutlined />} /></div>
                  <div className="time">
                    <small>Paid Time Of (PTO)</small> Thur, 8/8/22
                  </div>
                </div>
                <div className="right"><span className="badge pending">Pending</span></div>
              </div>
            </div>

            <br />

            <div className="secondaryTitleCard">
              <h4>Upcoming Paid Holidays</h4>
            </div>

            <div className="listItems">
              <div className="item">
                <div className="left">
                  <div><Button className="btnLight" icon={<CoffeeOutlined />} /></div>
                  <div className="time">Mon, 1/1/23</div>
                </div>
                <div className="right">Western New Year</div>
              </div>
              <div className="item">
                <div className="left">
                  <div><Button className="btnLight" icon={<CoffeeOutlined />} /></div>
                  <div className="time">Fri, 1/4/23</div>
                </div>
                <div className="right">Arbor Day</div>
              </div>
            </div>

          </Card>
        </Col>

        {/* Second Column */}
        <Col xs={24} lg={14} xl={16}>
          <Row gutter={gutter}>
            <Col xs={24} lg={8} xl={8}>
              <SmallStatCard
                title="Total Calls"
                value={526}
                deltaLabel="+ 4%"
                subtitle="vs 325 prev. 7 days"
              />
            </Col>
            <Col xs={24} lg={8} xl={8}>
              <SmallStatCard
                title="Missed Calls"
                value={228}
                deltaLabel="+ 4%"
                subtitle="vs 203 prev. 7 days"
              />
            </Col>

            <Col xs={24} lg={8} xl={8}>
              <SmallStatCard
                title="AVG. Waiting Time"
                value={"01:14"}
                deltaLabel="+ 4%"
                subtitle="vs 01:25 prev. 7 days"
              />
            </Col>
          </Row>

          <Row gutter={gutter} style={{ marginTop: 15 }}>
            <Col xs={24} lg={12} xl={12}>
              <Card className="noborderHeader" extra={<a href="#"> <ReloadOutlined /> </a>} title="All My Case">
                <div className="allMyCase">
                  <AllMyCasesRemote />
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12} xl={12}>
              <Card extra={<a href="#"> <ReloadOutlined /> </a>} title="Talk / Listen Ration" style={{ marginBottom: 15, minHeight: "31vh" }} className="noborderHeader">
                <TalkListenRatio
                  headline={25}
                  deltaLabel="+12%"
                  barValue={25}
                  leftPercent={75}
                  rightPercent={25}
                  talkLabel="Talk: 10%"
                  listenLabel="Listen: -5%"
                />
              </Card>

              <Card extra={<a href="#"> <ReloadOutlined /> </a>} title="Sentiment" style={{ marginBottom: 15, minHeight: "31vh", height: 'auto', paddingBottom: 20 }}>
                <div style={{ width: "100%", height: 240, position: "relative" }}>
                  <PieChartWithNeedle value={sentimentClamped} />

                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 32,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      pointerEvents: "none",
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{sentimentClamped.toFixed(2)}%</div>
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                      Sentiment · {sentimentClamped >= 66 ? "Good" : sentimentClamped >= 33 ? "Neutral" : "Poor"}
                    </div>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: 6,
                      left: 0,
                      right: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 12px",
                      color: "#8c8c8c",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    <span>0%</span>
                    <span>100%</span>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 12,
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      fontSize: 12,
                      color: "#595959",
                    }}
                  >
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

        </Col>

      </Row>

      {/* Start dial call customer overlay components */}
      {/*
      <div className="bgDialCall">
        <div className="CallBox">Call Box</div>
      </div>
       */}

      {/* End dial call customer overlay components */}
    </div>
  );
}
