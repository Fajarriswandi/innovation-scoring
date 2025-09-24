import { useEffect } from "react";
import { Typography } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";
import { Card, Row, Col, Tooltip, Button, Flex } from "antd";

const gutter: any = [16, { xs: 12, sm: 16, md: 20, lg: 24 }];

export default function AnomalyPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSmallTitle("Anomaly Detection"));
    document.title = "Anomaly Detection | AI Powered Call Center";

    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Powered Call Center";
    };
  }, [dispatch]);

  return (
    <div>
      <Helmet>
        <title>Anomaly Detection | AI Powered Call Center</title>
      </Helmet>

      <Row gutter={gutter}>

        {/* Realtime Log Scanner */}
        <Col xs={24} lg={10} xl={12}>
          <Card>asd</Card>
        </Col>

        {/* AI Suggestions (Potential Problems) */}
        <Col xs={24} lg={10} xl={12}>
          <Card>asd</Card>
        </Col>

      </Row>


    </div>
  );
}