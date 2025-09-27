import React from "react";
import { Card, List, Button, Tag } from "antd";
import { Icon } from "@iconify/react";


type Suggestion = {
  id: number;
  title: string;
  desc: string;
  confidence: number;
  impact: "High" | "Medium" | "Low";
  status: "New" | "In Review" | "Resolved";
};

const suggestions: Suggestion[] = [
  {
    id: 1,
    title: "Potential Duplicate Donation Detected",
    desc:
      "Two transactions of AED 420 were recorded within 5 minutes — one for a traffic ..., please review.",
    confidence: 95,
    impact: "High",
    status: "New",
  },
  {
    id: 2,
    title: "Unusual Transaction Amount",
    desc: "Transaction amount significantly higher than user's average",
    confidence: 95,
    impact: "High",
    status: "New",
  },
  {
    id: 3,
    title: "Multiple Failed Attempts",
    desc: "Several failed login attempts followed by a successful transaction.",
    confidence: 75,
    impact: "High",
    status: "New",
  },
  {
    id: 4,
    title: "Large Transaction to New Recipient",
    desc: "High-value transaction sent to a previously unknown recipient.",
    confidence: 95,
    impact: "High",
    status: "New",
  },
  {
    id: 5,
    title: "Multiple Failed Attempts",
    desc: "Several failed login attempts followed by a successful transaction.",
    confidence: 75,
    impact: "High",
    status: "New",
  },
  {
    id: 6,
    title: "Large Transaction to New Recipient",
    desc: "High-value transaction sent to a previously unknown recipient.",
    confidence: 95,
    impact: "High",
    status: "New",
  },
];

const PotentialProblems: React.FC = () => {
  return (
    <Card
      className="noborderHeader1"
      extra={
        <a href="#">
          <Icon icon="pepicons-pencil:dots-y" width={20} height={20} />
        </a>
      }
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon icon="lineicons:gemini" width={20} height={20} color="#40ACE2" />
          AI Suggestions (Potential Problems)
        </span>
      }
    >

      <div className="potentialProblems">
        <List
          itemLayout="vertical"
          className="listCostume"
          style={{ marginTop: 15 }}
          dataSource={suggestions}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className="aiSuggestItem"
              actions={[
                <Button
                  key="triage"
                  type="primary"
                  icon={<Icon icon="solar:flag-2-bold-duotone" width={16} height={16} />}
                  className="triageAction"
                  style={{ borderRadius: 999, width: "100%" }}
                >
                  Triage
                </Button>,
                <Button key="eye" type="text" icon={<Icon icon="solar:eye-bold-duotone" width={18} height={18} />} />,
                <Button key="close" type="text" icon={<Icon icon="mi:close" width={16} height={16} />} />,
              ]}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <strong style={{ fontSize: 14 }}>{item.title}</strong>
                <Tag color="green">{item.status}</Tag>
              </div>
              <div style={{ color: "#8c8c8c", marginTop: 4 }}>{item.desc}</div>

              <div style={{ display: "flex", gap: 24, marginTop: 10, marginBottom: 8, fontSize: 12 }}>
                <div>
                  <strong>Confidence :</strong> <span style={{ color: "#2f9e44" }}>{item.confidence}%</span>
                </div>
                <div>
                  <strong>Impact :</strong> <span style={{ color: "#cf1322" }}>{item.impact}</span>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>


    </Card>
  );
};

export default PotentialProblems;
