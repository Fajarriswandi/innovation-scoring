import { useEffect, useState } from "react";
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

const gutter = [16, { xs: 12, sm: 16, md: 20, lg: 24 }] as [number, object];
const sentimentValue = 72.35; // contoh; 0–100, bisa kamu binding dari state/API
const sentimentClamped = Math.max(0, Math.min(100, sentimentValue));

// --- [REVISED] PieChartWithNeedle using user-provided example ---

const PieChartWithNeedle: React.FC<{ value: number; label?: string }> = ({ value, label = "Sentiment" }) => {
  const v = Math.max(0, Math.min(100, value));

  const pieProps = {
    startAngle: 180,
    endAngle: 0,
    innerRadius: 70,
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
          data={[{ name: "value", value: v }, { name: "rest", value: 100 - v }]}
          isAnimationActive
        >
          <Cell fill="#69b1ff" />
          <Cell fill="#e9ecef" />
          <Label
            position="center"
            content={({ viewBox }) => {
              // @ts-ignore
              const { cx, cy, x, y, width, height, innerRadius, outerRadius } = viewBox || {};

              // Hitung pusat: pakai cx/cy jika ada; jika tidak, gunakan x + width/2, y + height/2
              const _cx = typeof cx === 'number' ? cx : (typeof x === 'number' && typeof width === 'number' ? x + width / 2 : 0);
              const _cy = typeof cy === 'number' ? cy : (typeof y === 'number' && typeof height === 'number' ? y + height / 2 : 0);

              // Radius: gunakan konstanta pieProps sebagai sumber kebenaran
              const iR = 70;
              const oR = 95;

              // Sudut gauge (180 → 0)
              const sA = 180;
              const eA = 0;
              const RAD = Math.PI / 180;
              const val = Math.max(0, Math.min(100, value));
              const angle = sA + ((eA - sA) * val) / 100;

              // Ticks 0/25/50/75/100
              const ticks = [0, 25, 50, 75, 100].map((t) => {
                const a = sA + ((eA - sA) * t) / 100;
                const rt1 = oR + 2;
                const rt2 = oR + 10;
                const tx1 = _cx + rt1 * Math.cos(a * RAD);
                const ty1 = _cy - rt1 * Math.sin(a * RAD);
                const tx2 = _cx + rt2 * Math.cos(a * RAD);
                const ty2 = _cy - rt2 * Math.sin(a * RAD);
                return <line key={t} x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#bfbfbf" strokeWidth={2} />;
              });

              // Jarum: dari pusat ke sedikit di luar outerRadius
              const r2 = oR + 8;
              const x2 = _cx + r2 * Math.cos(angle * RAD);
              const y2 = _cy - r2 * Math.sin(angle * RAD);

              return (
                <g>
                  {ticks}
                  <line x1={_cx} y1={_cy} x2={x2} y2={y2} stroke="#262626" strokeWidth={3} strokeLinecap="round" />
                  <circle cx={_cx} cy={_cy} r={6} fill="#262626" />
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
  const [widgetOpen, setWidgetOpen] = useState(false);

  useEffect(() => {
    dispatch(setSmallTitle("Dashboard Agent"));
    document.title = "Dashboard Agent | AI Powered Call Center";
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Powered Call Center";
    };
  }, [dispatch]);

  return (
    <div className="dashboard-grid">
      <Helmet>
        <title>Dashboard Agent | AI Powered Call Center</title>
      </Helmet>

      <WidgetAnomaly widgetOpen={widgetOpen} setWidgetOpen={setWidgetOpen} />

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
                  <PieChartWithNeedle value={sentimentClamped} label="Sentiment" />

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
    </div>
  );
}
