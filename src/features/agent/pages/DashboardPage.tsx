import { useEffect } from "react";
import { Typography } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Card, Row, Col } from "antd";

const { Title, Paragraph } = Typography;
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
        {/* Kolom kiri besar (Profile + daftar kecil) */}
        <Col xs={24} lg={10} xl={8}>
          <Card className="card card--profile" />
          <Card className="card card--list mt" />
          <Card className="card card--list mt" />
        </Col>

        {/* Kolom tengah (stat kecil + list besar) */}
        <Col xs={24} lg={14} xl={10}>
          <Row gutter={gutter}>
            <Col xs={24} sm={8}>
              <Card className="card card--stat" />
            </Col>
            <Col xs={24} sm={8}>
              <Card className="card card--stat" />
            </Col>
            <Col xs={24} sm={8}>
              <Card className="card card--stat" />
            </Col>

            <Col xs={24} className="mt">
              <Card className="card card--listTall" />
            </Col>
          </Row>
        </Col>

        {/* Kolom kanan (chart besar + sentiment bawah) */}
        <Col xs={24} xl={6}>
          <Card className="card card--chartTall" />
          <Card className="card card--chart mt" />
        </Col>
      </Row>
    </div>
  );
}
