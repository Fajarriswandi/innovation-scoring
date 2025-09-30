import { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";
import RealtimeLogScanner from "@/components/RealtimeLogScanner";
import PotentialProblems from "@/components/PotentialProblems";
import WidgetAnomaly from "@/components/widgetAnomaly";
const gutter = [16, { xs: 12, sm: 16, md: 20, lg: 24 }] as [number, object];

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

      {/* Widget here */}
      <WidgetAnomaly widgetOpen={widgetOpen} setWidgetOpen={setWidgetOpen} />

      <Row gutter={gutter}>
        <Col xs={24} lg={14} xl={14}>
          {/* Realtime Log Scanner */}
          <RealtimeLogScanner />
        </Col>

        {/* AI Suggestions (Potential Problems) */}
        <Col xs={24} lg={10} xl={10}>
          <PotentialProblems />
        </Col>
      </Row>
    </div>
  );
}
