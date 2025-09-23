import { useEffect } from "react";
import { Typography, List } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { cases } from "@/data/cases";
import SmallStatCard from "@/components/SmallStatCard";
import SentimentChart from "@/components/SentimentChart";
import TalkListenRatio from "@/components/TalkListenRatio";
import { setSmallTitle } from "@/store/layoutSlice";
import { Card, Row, Col, Tooltip, Button, Flex } from "antd";
import { MoreOutlined, ReloadOutlined, PlusOutlined, CalendarOutlined, CoffeeOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, LabelList } from "recharts";
import { Helmet } from "react-helmet-async";


const gutter: any = [16, { xs: 12, sm: 16, md: 20, lg: 24 }];

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSmallTitle("Dashboard Agent"));
    document.title = "Dashboard Agent | AI Powered Call Center";
    // Reset title on component unmount
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

      <Row gutter={gutter}>

        {/* First Column */}
        <Col xs={24} lg={10} xl={8}>
          <Card className="noborderHeader cardAgentProfile" extra={<a href="#"> <MoreOutlined /> </a>} title="My Profile">
            {/* Card Profile */}
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

            {/* Time Off Requests */}
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

            {/* Upcoming Paid Holidays */}
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
                {/* All My Cases */}
                <div className="allMyCase">
                  <List
                    size="small"
                    className="listCostume"
                    dataSource={cases}
                    renderItem={(item) => {
                      const statusMap: Record<string, string> = {
                        Open: "approved",
                        Pending: "pending",
                        Resolved: "resolved",
                        Escalated: "escalated",
                        Closed: "closed",
                      };

                      return (
                        <List.Item>
                          <img
                            src={item.profileImage}
                            alt={item.title}
                            width={40}
                            height={40}
                            style={{ borderRadius: "10px", marginRight: 8 }}
                          />
                          <div style={{ flex: 1 }}>
                            <div><small style={{ color: "#999" }}>Case ID: {item.caseId}</small></div>
                            <div>{item.title}</div>
                          </div>
                          <div className="time">
                            <small>SLA Timer</small>
                            {item.slaTimer}
                          </div>
                          <div className="time">
                            <small>Status</small>
                            <span className={`badge ${statusMap[item.status] || ""}`}>
                              {item.status}
                            </span>
                          </div>
                          <div>
                            <Button className="btnLight" icon={<ArrowRightOutlined />} />
                          </div>
                        </List.Item>
                      );
                    }}
                  />
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
                {/* Sentiment Chart */}
                <SentimentChart />
              </Card>
            </Col>
          </Row>

        </Col>

      </Row>
    </div>
  );
}
