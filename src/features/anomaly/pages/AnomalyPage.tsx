import { useEffect } from "react";
import { Row, Col } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";
import RealtimeLogScanner from "@/components/RealtimeLogScanner";
import PotentialProblems from "@/components/PotentialProblems";

const gutter: any = [16, { xs: 12, sm: 16, md: 20, lg: 24 }];

export default function AnomalyPage() {
  const dispatch = useAppDispatch();

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

      <Row gutter={gutter}>
        <Col xs={24} lg={10} xl={12}>
          <RealtimeLogScanner />
        </Col>

        {/* AI Suggestions (Potential Problems) */}
        <Col xs={24} lg={10} xl={12}>
          <PotentialProblems/>
        </Col>
      </Row>
    </div>
  );
}