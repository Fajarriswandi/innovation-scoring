import { useEffect } from "react";
import { Typography } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Card, Row, Col, Tooltip, Button, Flex } from "antd";
import { MoreOutlined, ReloadOutlined, PlusOutlined, CalendarOutlined, CoffeeOutlined } from "@ant-design/icons";

const gutter: any = [16, { xs: 12, sm: 16, md: 20, lg: 24 }];

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSmallTitle("Dashboard Agent"));
    // Reset title on component unmount
    return () => {
      dispatch(setSmallTitle("Dashboard"));
    };
  }, [dispatch]);

  return (
    <div className="dashboard-grid">
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
              <Card className="noborderHeader smallCard" extra={<a href="#"> <ReloadOutlined /> </a>} title="Total Calls">
                <span className="badge success">+ 4%</span>
                <Flex justify="space-between" align="end">
                  <div className="boxInfo">
                    <h3>526</h3>
                    <small>vs 325 prev. 7 days</small>
                  </div>
                  <div>
                    chart here
                  </div>
                </Flex>
              </Card>
            </Col>
            <Col xs={24} lg={8} xl={8}>
              <Card className="noborderHeader smallCard" extra={<a href="#"> <ReloadOutlined /> </a>} title="Missed Calls">
                <span className="badge success">+ 4%</span>
                <Flex justify="space-between" align="end">
                  <div className="boxInfo">
                    <h3>526</h3>
                    <small>vs 325 prev. 7 days</small>
                  </div>
                  <div>
                    chart here
                  </div>
                </Flex>
              </Card>
            </Col>
            <Col xs={24} lg={8} xl={8}>
              <Card className="noborderHeader smallCard" extra={<a href="#"> <ReloadOutlined /> </a>} title="AVG. Waiting Time">
                <span className="badge success">+ 4%</span>
                <Flex justify="space-between" align="end">
                  <div className="boxInfo">
                    <h3>526</h3>
                    <small>vs 325 prev. 7 days</small>
                  </div>
                  <div>
                    chart here
                  </div>
                </Flex>
              </Card>
            </Col>

            <Col xs={24} lg={12} xl={12}>
              <Card className="noborderHeader" extra={<a href="#"> <ReloadOutlined /> </a>} title="All My Case">
                ...
              </Card>
            </Col>
            <Col xs={24} lg={12} xl={12}>
              <Card className="noborderHeader" extra={<a href="#"> <ReloadOutlined /> </a>} title="Talk / Listen Ration">
                ....
              </Card>
            </Col>
          </Row>
        </Col>

      </Row>
    </div>
  );
}
