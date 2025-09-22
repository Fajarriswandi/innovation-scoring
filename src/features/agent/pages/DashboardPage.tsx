import { useEffect } from "react";
import { Typography } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Card, Row, Col, Tooltip, Button } from "antd";
import { MoreOutlined, ReloadOutlined } from "@ant-design/icons";

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

        <Col xs={24} lg={10} xl={8}>
          <Card className="noborderHeader" extra={<a href="#"> <MoreOutlined /> </a>} title="My Profile">
            Profile
          </Card>
        </Col>

        <Col xs={24} lg={14} xl={16}>
          <Row gutter={gutter}>
            <Col xs={24} lg={8} xl={8}>
              <Card className="noborderHeader" extra={<a href="#"> <ReloadOutlined /> </a>} title="Total Calls">
                ...
              </Card>
            </Col>
            <Col xs={24} lg={8} xl={8}>
              <Card className="noborderHeader" extra={<a href="#"> <ReloadOutlined /> </a>} title="Missed Calls">
                ...
              </Card>
            </Col>
            <Col xs={24} lg={8} xl={8}>
              <Card className="noborderHeader" extra={<a href="#"> <ReloadOutlined /> </a>} title="AVG. Waiting Time">
                ...
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
