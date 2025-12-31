'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";
import {
  Typography,
  Avatar,
  Button,
  Space,
  Row,
  Col,
  Card,
  Progress,
  Tag,
  Dropdown,
  Table,
  Select,
} from "antd";
import {
  ShareAltOutlined,
  PlusOutlined,
  MoreOutlined,
  PaperClipOutlined,
  MessageOutlined,
  BulbOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  WarningOutlined,
  FastForwardOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

// Type definitions
type KanbanCardProps = {
  id?: number;
  priority?: { label: string; color: string; bg: string };
  title?: string;
  description?: string;
  avatars?: string[];
  attachments?: number;
  comments?: number;
  isStrikethrough?: boolean;
  isCustom?: boolean;
  customBody?: React.ReactNode;
  isRecommendation?: boolean;
  footer?: React.ReactNode;
  progress?: number;
  epoch?: string;
  status?: string;
};


export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeView, setActiveView] = useState("Board View");

  useEffect(() => {
    dispatch(setSmallTitle("Innovation Scoring Dashboard"));
    document.title = "Innovation Scoring Dashboard | AI Innovation Scoring Dashboard";
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Innovation Scoring Dashboard";
    };
  }, [dispatch]);

  const views = [
    { key: "Board View", label: "Board View", icon: <AppstoreOutlined /> },
    { key: "List", label: "List", icon: <UnorderedListOutlined /> },
    // { key: "Timeline", label: "Timeline", icon: <FieldTimeOutlined /> },
    // { key: "Analytics", label: "Analytics", icon: <BarChartOutlined /> },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Helmet>
        <title>Innovation Scoring Dashboard | AI Innovation Scoring Dashboard</title>
      </Helmet>

      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
        <Col>
          <Space size={12} align="center" style={{ marginBottom: 8 }}>
            <Title level={2} style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
              Innovation Scoring Dashboard
            </Title>
            {/* <Tag
              color="success"
              style={{
                backgroundColor: "#10b981",
                color: "#fff",
                border: "none",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Live System
            </Tag> */}
          </Space>
          {/* <Space size={16}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Project: <Text strong style={{ color: "#000" }}>Alpha AI Integration</Text>
            </Text>
            <Text type="secondary" style={{ fontSize: 13 }}>•</Text>
            <Text type="secondary" style={{ fontSize: 13 }}>Last updated: Just now</Text>
          </Space> */}
        </Col>
        <Col>
          <Space size={16} align="center">
            <Avatar.Group
              max={{ count: 3, style: { color: "#fff", backgroundColor: "#40ACE2", fontSize: 10 } }}
              size="default"
            >
              <Avatar src="https://i.pravatar.cc/150?u=user1" />
              <Avatar src="https://i.pravatar.cc/150?u=user2" />
              <Avatar src="https://i.pravatar.cc/150?u=user3" />
              <Avatar src="https://i.pravatar.cc/150?u=user4" />
              <Avatar src="https://i.pravatar.cc/150?u=user5" />
              <Avatar src="https://i.pravatar.cc/150?u=user6" />
            </Avatar.Group>
            <Button
              type="default"
              icon={<ShareAltOutlined />}
              style={{ borderRadius: 10 }}
            >
              Share
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                borderRadius: 10,
                backgroundColor: "#40ace2",
                borderColor: "#40ace2",
              }}
              onClick={() => router.push("/form-submission")}
            >
              New Innovation
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 15 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Innovations"
            value="142"
            trend="↑ 12%"
            trendColor="#10b981"
            icon={<BulbOutlined style={{ color: "#1890ff" }} />}
            iconBg="#E6F4FF"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="In AI Processing"
            value="4"
            trend="Active analysis"
            trendColor="#10b981"
            icon={<RobotOutlined style={{ color: "#1890ff" }} />}
            iconBg="#E6F4FF"
              />
            </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completed Reviews"
            value="89"
            trend="62% Approval Rate"
            trendColor="#10b981"
            icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            iconBg="#F6FFED"
              />
            </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Time Saved by AI"
            value="320 hrs"
            trend="Est. $15k saved"
            trendColor="#722ed1"
            icon={<ClockCircleOutlined style={{ color: "#722ed1" }} />}
            iconBg="#F9F0FF"
              />
            </Col>
      </Row>

      {/* Tabs View Switcher */}
      <Card
        style={{
          marginBottom: 15,
          borderRadius: 16,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(8px)",
          border: "1px solid #e5e7eb",
          padding: 4,
          width: "fit-content",
        }}
        styles={{ body: { padding: 4 } }}
      >
        <Space size={0}>
          {views.map((view) => (
            <Button
              key={view.key}
              type={activeView === view.key ? "primary" : "text"}
              icon={view.icon}
              onClick={() => setActiveView(view.key)}
              style={{
                borderRadius: 12,
                height: 40,
                fontWeight: 600,
                backgroundColor:
                  activeView === view.key ? "#F9F3EB" : "transparent",
                color: activeView === view.key ? "#A57843" : "#9ca3af",
                border: "none",
              }}
            >
              {view.label}
            </Button>
          ))}
        </Space>
      </Card>

      {/* Conditional Rendering: Board View or List View */}
      {activeView === "Board View" ? <KanbanBoard /> : <ListView />}
                </div>
  );
}

// Kanban Board Component
function KanbanBoard() {
  return (
    <div style={{ overflowX: "auto", width: "100%" }} className="hide-scrollbar">
      <Row gutter={[24, 24]} style={{ flexWrap: "nowrap" }}>
        {/* Column: Submitted Ideas */}
        <Col style={{ flex: "1 1 0", minWidth: 280, maxWidth: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ColumnHeader title="Submitted Ideas" color="#ef4444" count={3} />
          <KanbanCard
            id={1}
            title="AI-Powered Customer Service Chatbot"
            description="Proposal for automated customer support using NLP and machine learning to handle common inquiries."
            avatars={["https://i.pravatar.cc/150?u=ahmed"]}
            attachments={2}
            comments={0}
          />
          <KanbanCard
            id={2}
            title="Smart Energy Management System"
            description="IoT-based solution for office energy optimization with real-time monitoring and automated controls."
            avatars={[
              "https://i.pravatar.cc/150?u=omar",
              "https://i.pravatar.cc/150?u=layla",
            ]}
            attachments={3}
            comments={1}
          />
          <KanbanCard
            id={3}
            title="Automated Document Processing"
            description="AI system to automatically extract, classify, and process documents from various sources."
            avatars={["https://i.pravatar.cc/150?u=noor"]}
            attachments={1}
            comments={0}
          />
        </div>
            </Col>

      {/* Column: AI Processing */}
      <Col style={{ flex: "1 1 0", minWidth: 280, maxWidth: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ColumnHeader title="AI Processing" color="#FA8C16" count={3} />
          <Card
            style={{
              backgroundColor: "#FAF7F2",
              border: "1px dashed #e5e7eb",
              borderRadius: 16,
              marginBottom: 16,
            }}
            styles={{ body: { padding: 16 } }}
          >
            <KanbanCard
              id={4}
              isCustom
              customBody={
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Tag
                      color="blue"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 12px",
                      }}
                    >
                      Ingest
                    </Tag>
                    <ReloadOutlined style={{ fontSize: 12, color: "#9ca3af" }} />
                  </div>
                  <Title level={5} style={{ marginBottom: 8, fontSize: 14 }}>
                    Predictive Maintenance Platform
                  </Title>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#595959",
                      display: "block",
                      marginBottom: 12,
                    }}
                  >
                    Text extraction: 100% | Similarity check: 85% | Scoring: 60%
                  </Text>
                  <Progress
                    percent={60}
                    strokeColor="#FA8C16"
                    showInfo={false}
                    style={{ marginBottom: 8 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#9ca3af" }}>Processing...</Text>
                    <Text style={{ fontSize: 10, fontWeight: 700, color: "#595959" }}>
                      60%
                    </Text>
                  </div>
                </div>
              }
            />
            <KanbanCard
              id={5}
              isCustom
              customBody={
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Tag
                      color="blue"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 12px",
                      }}
                    >
                      Analyze
                    </Tag>
                    <ReloadOutlined style={{ fontSize: 12, color: "#9ca3af" }} />
                  </div>
                  <Title level={5} style={{ marginBottom: 8, fontSize: 14 }}>
                    Employee Wellness Mobile App
                  </Title>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#595959",
                      display: "block",
                      marginBottom: 12,
                    }}
                  >
                    Text extraction: 100% | Similarity check: 40% | Scoring: 40%
                  </Text>
                  <Progress
                    percent={40}
                    strokeColor="#FA8C16"
                    showInfo={false}
                    style={{ marginBottom: 8 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#9ca3af" }}>Processing...</Text>
                    <Text style={{ fontSize: 10, fontWeight: 700, color: "#595959" }}>
                      40%
                    </Text>
                  </div>
                </div>
              }
            />
              </Card>
        </div>
      </Col>

      {/* Column: Need Follow Up */}
      <Col style={{ flex: "1 1 0", minWidth: 280, maxWidth: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ColumnHeader title="Need Follow Up" color="#FA8C16" count={2} />
          <KanbanCard
            id={6}
            priority={{ label: "High Priority", color: "#ef4444", bg: "#FEE2E2" }}
            title="Virtual Reality Training Module"
            description="Requires clarification on implementation timeline and budget allocation."
            avatars={["https://i.pravatar.cc/150?u=omar"]}
            attachments={2}
            comments={4}
          />
          <KanbanCard
            id={7}
            priority={{ label: "Medium", color: "#FA8C16", bg: "#FFF7E6" }}
            title="Cloud Migration Strategy"
            description="Need revision: missing security compliance details and risk assessment."
            avatars={[
              "https://i.pravatar.cc/150?u=layla",
              "https://i.pravatar.cc/150?u=khalid",
            ]}
            attachments={1}
            comments={3}
          />
        </div>
            </Col>

      {/* Column: Committee Review */}
      <Col style={{ flex: "1 1 0", minWidth: 280, maxWidth: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ColumnHeader title="Committee Review" color="#1890ff" count={3} />
          <KanbanCard
            id={8}
            title="Data Analytics Dashboard"
            description="AI Recommendation: Fast Track | AI Score: 92/100"
            avatars={[
              "https://i.pravatar.cc/150?u=omar",
              "https://i.pravatar.cc/150?u=layla",
            ]}
            attachments={3}
            comments={6}
            footer={
              <div>
                <Tag
                  color="success"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 12px",
                    marginBottom: 8,
                  }}
                >
                  Fast Track
                </Tag>
                <Progress
                  percent={92}
                  strokeColor="#52c41a"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </div>
            }
          />
          <KanbanCard
            id={9}
            title="Cybersecurity Awareness Program"
            description="AI Recommendation: Proceed | AI Score: 78/100"
            avatars={[
              "https://i.pravatar.cc/150?u=khalid",
              "https://i.pravatar.cc/150?u=amina",
              "https://i.pravatar.cc/150?u=yusuf",
              "https://i.pravatar.cc/150?u=mariam",
            ]}
            attachments={4}
            comments={2}
            footer={
              <div>
                <Tag
                  color="blue"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 12px",
                    marginBottom: 8,
                  }}
                >
                  Proceed
                </Tag>
                <Progress
                  percent={78}
                  strokeColor="#1890ff"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </div>
            }
          />
          <KanbanCard
            id={10}
            title="Remote Work Collaboration Tool"
            description="AI Recommendation: Drop | AI Score: 45/100"
            avatars={[
              "https://i.pravatar.cc/150?u=zainab",
              "https://i.pravatar.cc/150?u=hamza",
              "https://i.pravatar.cc/150?u=leila",
            ]}
            attachments={2}
            comments={5}
            footer={
              <div>
                <Tag
                  color="error"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 12px",
                    marginBottom: 8,
                  }}
                >
                  Drop
                </Tag>
                <Progress
                  percent={45}
                  strokeColor="#ff4d4f"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </div>
            }
          />
        </div>
        </Col>

      {/* Column: Final Decision */}
      <Col style={{ flex: "1 1 0", minWidth: 280, maxWidth: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(114, 46, 209, 0.1)",
            padding: 16,
            borderRadius: 24,
            minHeight: 400,
          }}
        >
          <ColumnHeader title="Final Decision" color="#722ed1" count={3} />
          <KanbanCard
            id={11}
            title="Automated Invoice Processing"
            description="Decision: Accepted | AI Score: 88/100"
            avatars={[
              "https://i.pravatar.cc/150?u=omar",
              "https://i.pravatar.cc/150?u=layla",
            ]}
            attachments={3}
            comments={8}
            footer={
              <div>
                <Tag
                  color="success"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 12px",
                    marginBottom: 8,
                  }}
                >
                  Accepted
                </Tag>
                <Progress
                  percent={88}
                  strokeColor="#52c41a"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </div>
            }
          />
          <KanbanCard
            id={12}
            title="Mobile Payment Integration"
            description="Decision: Adjusted | AI Score: 72/100"
            avatars={[
              "https://i.pravatar.cc/150?u=ibrahim",
              "https://i.pravatar.cc/150?u=salma",
              "https://i.pravatar.cc/150?u=tariq",
              "https://i.pravatar.cc/150?u=hind",
            ]}
            attachments={4}
            comments={5}
            footer={
              <div>
                <Tag
                  color="warning"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 12px",
                    marginBottom: 8,
                  }}
                >
                  Adjusted
                </Tag>
                <Progress
                  percent={72}
                  strokeColor="#FA8C16"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </div>
            }
          />
          <KanbanCard
            id={13}
            isStrikethrough
            title="Legacy System Modernization"
            description="Decision: Rejected | AI Score: 55/100"
            avatars={[
              "https://i.pravatar.cc/150?u=nasir",
              "https://i.pravatar.cc/150?u=farah",
              "https://i.pravatar.cc/150?u=basil",
            ]}
            attachments={2}
            comments={4}
            footer={
              <div>
                <Tag
                  color="error"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 12px",
                    marginBottom: 8,
                  }}
                >
                  Rejected
                </Tag>
                <Progress
                  percent={55}
                  strokeColor="#ff4d4f"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </div>
            }
          />
        </div>
      </Col>
      </Row>
      </div>
  );
}

// Column Header Component
function ColumnHeader({ title, color, count }: { title: string; color: string; count?: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        padding: "0 4px",
      }}
    >
      <Space size={8}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
        <Text strong style={{ fontSize: 14, color: "#262626" }}>
          {title}
        </Text>
        {count !== undefined && (
          <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
            {count}
          </Text>
        )}
      </Space>
      <MoreOutlined style={{ fontSize: 16, color: "#9ca3af" }} />
    </div>
  );
}

// Kanban Card Component
function KanbanCard({
  id,
  priority,
  title,
  description,
  footer,
  avatars,
  attachments,
  comments,
  isStrikethrough,
  isCustom,
  customBody,
  isRecommendation,
}: KanbanCardProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on MoreOutlined or other interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('.anticon') || target.closest('button') || target.closest('a')) {
      return;
    }
    if (id) {
      router.push(`/detail/${id}`);
    } else {
      router.push("/detail");
    }
  };

  if (isCustom && customBody) {
    return (
      <Card
        size="small"
        style={{
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          marginBottom: 16,
          cursor: "pointer",
          position: "relative",
        }}
        styles={{ body: { padding: 16 } }}
        hoverable
        onClick={handleClick}
      >
        <MoreOutlined
          style={{
            fontSize: 16,
            color: "#d9d9d9",
            position: "absolute",
            top: 16,
            right: 16,
            cursor: "pointer",
          }}
          onClick={(e) => e.stopPropagation()}
        />
        {customBody}
      </Card>
    );
  }

  return (
    <Card
      size="small"
      style={{
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        marginBottom: 16,
        cursor: "pointer",
        backgroundColor: isRecommendation ? "#fff" : "#fff",
        position: "relative",
      }}
      styles={{ body: { padding: 16 } }}
      hoverable
      onClick={handleClick}
    >
      <MoreOutlined
        style={{
          fontSize: 16,
          color: "#d9d9d9",
          position: "absolute",
          top: 16,
          right: 16,
          cursor: "pointer",
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <div
        style={{
          marginBottom: 12,
        }}
      >
        {priority && (
          <Tag
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 1,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 12,
              border: "none",
              backgroundColor: priority.bg,
              color: priority.color,
            }}
          >
            {priority.label}
          </Tag>
        )}
      </div>
      <Title
        level={5}
        style={{
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 700,
          textDecoration: isStrikethrough ? "line-through" : "none",
          textDecorationColor: isStrikethrough ? "#9ca3af" : "transparent",
        }}
      >
        {title}
      </Title>
      {description && (
        <Text
          style={{
            fontSize: 12,
            color: "#595959",
            lineHeight: 1.6,
            display: "block",
            marginBottom: 16,
          }}
        >
          {description}
        </Text>
      )}
      {footer && <div style={{ marginTop: "auto" }}>{footer}</div>}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Avatar.Group
          max={{ count: 3, style: { color: "#fff", backgroundColor: "#40ACE2", fontSize: 10 } }}
          size="small"
        >
          {avatars?.map((src, i) => (
            <Avatar key={i} src={src} size="small" />
          ))}
        </Avatar.Group>
        <Space size={12} style={{ color: "#9ca3af" }}>
          {attachments !== undefined && (
            <Space size={4}>
              <PaperClipOutlined style={{ fontSize: 12 }} />
              <Text style={{ fontSize: 10 }}>{attachments}</Text>
            </Space>
          )}
          {comments !== undefined && (
            <Space size={4}>
              <MessageOutlined style={{ fontSize: 12 }} />
              <Text style={{ fontSize: 10 }}>{comments}</Text>
            </Space>
          )}
        </Space>
      </div>
    </Card>
  );
}

// List View Component
type ListViewDataItem = {
  key: string;
  id: number;
  title: string;
  description?: string;
  department: string;
  iconColor: string;
  iconBg: string;
  iconSymbol: string;
  submitter: {
    name: string;
    avatar: string;
  };
  date: string;
  aiScore: number;
  priority: {
    label: string;
    color: string;
  };
  recommendation?: "Fast Track" | "Proceed" | "Drop";
  similarity?: number;
  status?: "Under Review" | "Approved" | "New" | "In Progress";
};

// ProgressBar Component
const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const getProgressColor = (val: number) => {
    if (val >= 80) return "#4CAF50";
    if (val >= 50) return "#3F51B5";
    return "#F44336";
  };

  return (
    <div style={{ width: 128 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
        <Text strong style={{ fontSize: 14, color: "#262626" }}>
          {value}
        </Text>
        <Text style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>/ 100</Text>
      </div>
      <Progress
        percent={value}
        strokeColor={getProgressColor(value)}
        showInfo={false}
        size="small"
        style={{ margin: 0 }}
      />
    </div>
  );
};

// RecBadge Component
const RecBadge: React.FC<{ type: "Fast Track" | "Proceed" | "Drop" }> = ({ type }) => {
  const styles = {
    "Fast Track": { bg: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" },
    Proceed: { bg: "#E8EAF6", color: "#3F51B5", border: "#C5CAE9" },
    Drop: { bg: "#FFEBEE", color: "#C62828", border: "#FFCDD2" },
  };

  const icons = {
    "Fast Track": <FastForwardOutlined style={{ fontSize: 14 }} />,
    Proceed: <PlayCircleOutlined style={{ fontSize: 14 }} />,
    Drop: <CloseCircleOutlined style={{ fontSize: 14 }} />,
  };

  const style = styles[type];

  return (
    <Tag
      style={{
        backgroundColor: style.bg,
        color: style.color,
        borderColor: style.border,
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        border: `1px solid ${style.border}`,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icons[type]}
      {type.toUpperCase()}
    </Tag>
  );
};

// StatusBadge Component
const StatusBadge: React.FC<{ status: "Under Review" | "Approved" | "New" | "In Progress" }> = ({ status }) => {
  const colors = {
    "Under Review": "#FA8C16",
    Approved: "#52c41a",
    New: "#1890ff",
    "In Progress": "#FA8C16",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: colors[status],
        }}
      />
      <Text style={{ fontSize: 12, fontWeight: 600, color: "#595959" }}>{status}</Text>
    </div>
  );
};

function ListView() {
  const router = useRouter();
  
  const dataSource: ListViewDataItem[] = [
    {
      key: "1",
      id: 1,
      title: "AI-Powered Customer Service Chatbot",
      description: "Using AI to automate customer support interactions...",
      department: "Customer Support",
      iconColor: "#1890ff",
      iconBg: "#E6F7FF",
      iconSymbol: "robot",
      submitter: {
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?u=johndoe",
      },
      date: "Oct 24, 2023",
      aiScore: 92,
      priority: { label: "High", color: "#ef4444" },
      recommendation: "Fast Track",
      similarity: 12,
      status: "Under Review",
    },
    {
      key: "2",
      id: 2,
      title: "Smart Energy Management System",
      description: "IoT-based system for optimizing energy consumption...",
      department: "Operations",
      iconColor: "#FA8C16",
      iconBg: "#FFF7E6",
      iconSymbol: "house",
      submitter: {
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?u=janesmith",
      },
      date: "Oct 22, 2023",
      aiScore: 88,
      priority: { label: "Medium", color: "#FA8C16" },
      recommendation: "Proceed",
      similarity: 8,
      status: "In Progress",
    },
    {
      key: "3",
      id: 3,
      title: "Automated Document Processing",
      description: "Automated document classification and extraction...",
      department: "IT Department",
      iconColor: "#52c41a",
      iconBg: "#F6FFED",
      iconSymbol: "document",
      submitter: {
        name: "Mike Ross",
        avatar: "https://i.pravatar.cc/150?u=mikeross",
      },
      date: "Oct 20, 2023",
      aiScore: 76,
      priority: { label: "Low", color: "#1890ff" },
      recommendation: "Proceed",
      similarity: 15,
      status: "New",
    },
    {
      key: "4",
      id: 4,
      title: "Blockchain Supply Chain",
      description: "Transparent and secure supply chain tracking...",
      department: "Logistics Dept",
      iconColor: "#1890ff",
      iconBg: "#E6F7FF",
      iconSymbol: "cube",
      submitter: {
        name: "Rachel Zane",
        avatar: "https://i.pravatar.cc/150?u=rachelzane",
      },
      date: "Oct 19, 2023",
      aiScore: 95,
      priority: { label: "Critical", color: "#ef4444" },
      recommendation: "Fast Track",
      similarity: 5,
      status: "Approved",
    },
    {
      key: "5",
      id: 5,
      title: "Virtual Reality Training Module",
      description: "Immersive VR training for employee development...",
      department: "HR Department",
      iconColor: "#722ed1",
      iconBg: "#F3E8FF",
      iconSymbol: "vr",
      submitter: {
        name: "Harvey Specter",
        avatar: "https://i.pravatar.cc/150?u=harveyspecter",
      },
      date: "Oct 18, 2023",
      aiScore: 82,
      priority: { label: "High", color: "#ef4444" },
      recommendation: "Fast Track",
      similarity: 6,
      status: "Under Review",
    },
    {
      key: "6",
      id: 6,
      title: "Cloud Migration Strategy",
      description: "Comprehensive cloud infrastructure migration plan...",
      department: "IT Department",
      iconColor: "#13c2c2",
      iconBg: "#E0F7FA",
      iconSymbol: "cloud",
      submitter: {
        name: "Louis Litt",
        avatar: "https://i.pravatar.cc/150?u=louislitt",
      },
      date: "Oct 17, 2023",
      aiScore: 78,
      priority: { label: "Medium", color: "#FA8C16" },
      recommendation: "Proceed",
      similarity: 22,
      status: "In Progress",
    },
    {
      key: "7",
      id: 7,
      title: "Data Analytics Dashboard",
      description: "Real-time analytics and reporting dashboard...",
      department: "Analytics Team",
      iconColor: "#eb2f96",
      iconBg: "#FCE4EC",
      iconSymbol: "chart",
      submitter: {
        name: "Donna Paulsen",
        avatar: "https://i.pravatar.cc/150?u=donnapaulsen",
      },
      date: "Oct 16, 2023",
      aiScore: 92,
      priority: { label: "High", color: "#ef4444" },
      recommendation: "Fast Track",
      similarity: 3,
      status: "Approved",
    },
    {
      key: "8",
      id: 8,
      title: "Cybersecurity Awareness Program",
      description: "Employee training program for cybersecurity...",
      department: "Security Team",
      iconColor: "#fa541c",
      iconBg: "#FFF2E8",
      iconSymbol: "shield",
      submitter: {
        name: "Jessica Pearson",
        avatar: "https://i.pravatar.cc/150?u=jessicapearson",
      },
      date: "Oct 15, 2023",
      aiScore: 78,
      priority: { label: "Critical", color: "#ef4444" },
      recommendation: "Proceed",
      similarity: 18,
      status: "Under Review",
    },
    {
      key: "9",
      id: 9,
      title: "Remote Work Collaboration Tool",
      description: "Platform for remote team collaboration...",
      department: "Product Team",
      iconColor: "#2f54eb",
      iconBg: "#E6F0FF",
      iconSymbol: "collaboration",
      submitter: {
        name: "Robert Zane",
        avatar: "https://i.pravatar.cc/150?u=robertzane",
      },
      date: "Oct 14, 2023",
      aiScore: 45,
      priority: { label: "Low", color: "#1890ff" },
      recommendation: "Drop",
      similarity: 78,
      status: "New",
    },
    {
      key: "10",
      id: 10,
      title: "Automated Invoice Processing",
      description: "AI-powered invoice processing automation...",
      department: "Finance Dept",
      iconColor: "#52c41a",
      iconBg: "#F6FFED",
      iconSymbol: "invoice",
      submitter: {
        name: "Katrina Bennett",
        avatar: "https://i.pravatar.cc/150?u=katrinabennett",
      },
      date: "Oct 13, 2023",
      aiScore: 88,
      priority: { label: "High", color: "#ef4444" },
      recommendation: "Fast Track",
      similarity: 7,
      status: "Approved",
    },
    {
      key: "11",
      id: 11,
      title: "Mobile Payment Integration",
      description: "Seamless mobile payment solution integration...",
      department: "Product Team",
      iconColor: "#722ed1",
      iconBg: "#F3E8FF",
      iconSymbol: "payment",
      submitter: {
        name: "Alex Williams",
        avatar: "https://i.pravatar.cc/150?u=alexwilliams",
      },
      date: "Oct 12, 2023",
      aiScore: 72,
      priority: { label: "Medium", color: "#FA8C16" },
      recommendation: "Proceed",
      similarity: 25,
      status: "In Progress",
    },
    {
      key: "12",
      id: 12,
      title: "Legacy System Modernization",
      description: "Modernizing outdated legacy systems...",
      department: "IT Department",
      iconColor: "#595959",
      iconBg: "#F5F5F5",
      iconSymbol: "system",
      submitter: {
        name: "Sean Cahill",
        avatar: "https://i.pravatar.cc/150?u=seancahill",
      },
      date: "Oct 11, 2023",
      aiScore: 55,
      priority: { label: "Low", color: "#1890ff" },
      recommendation: "Drop",
      similarity: 92,
      status: "New",
    },
  ];

  const columns = [
    {
      title: "INNOVATION DETAILS",
      dataIndex: "title",
      key: "title",
      width: "40%",
      sorter: (a: ListViewDataItem, b: ListViewDataItem) => a.title.localeCompare(b.title),
      render: (_: string, record: ListViewDataItem) => (
        <div>
          <Title level={5} style={{ margin: 0, marginBottom: 4, fontSize: 14, fontWeight: 700 }}>
            {record.title}
          </Title>
          <Text style={{ fontSize: 12, color: "#9ca3af" }}>
            {record.description || record.department}
          </Text>
        </div>
      ),
    },
    {
      title: "DEPARTMENT",
      dataIndex: "department",
      key: "department",
      sorter: (a: ListViewDataItem, b: ListViewDataItem) => a.department.localeCompare(b.department),
      render: (department: string) => (
        <Tag
          style={{
            backgroundColor: "#F5F7F9",
            color: "#595959",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            padding: "4px 12px",
          }}
        >
          {department}
        </Tag>
      ),
    },
    {
      title: "AI SCORE",
      dataIndex: "aiScore",
      key: "aiScore",
      sorter: (a: ListViewDataItem, b: ListViewDataItem) => a.aiScore - b.aiScore,
      render: (score: number) => <ProgressBar value={score} />,
    },
    {
      title: "REC.",
      dataIndex: "recommendation",
      key: "recommendation",
      sorter: (a: ListViewDataItem, b: ListViewDataItem) => {
        if (!a.recommendation && !b.recommendation) return 0;
        if (!a.recommendation) return 1;
        if (!b.recommendation) return -1;
        return a.recommendation.localeCompare(b.recommendation);
      },
      render: (rec: ListViewDataItem["recommendation"]) =>
        rec ? <RecBadge type={rec} /> : <Text style={{ color: "#d9d9d9" }}>-</Text>,
    },
    {
      title: "SIMILARITY",
      dataIndex: "similarity",
      key: "similarity",
      align: "center" as const,
      sorter: (a: ListViewDataItem, b: ListViewDataItem) => {
        const aVal = a.similarity ?? 0;
        const bVal = b.similarity ?? 0;
        return aVal - bVal;
      },
      render: (similarity: number | undefined) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {similarity !== undefined ? (
            <>
              {similarity > 50 ? (
                <WarningOutlined style={{ fontSize: 14, color: "#FA8C16" }} />
              ) : (
                <CheckCircleOutlined style={{ fontSize: 14, color: "#52c41a" }} />
              )}
              <Text style={{ fontSize: 12, fontWeight: 700, color: "#595959" }}>{similarity}%</Text>
            </>
          ) : (
            <Text style={{ color: "#d9d9d9" }}>-</Text>
          )}
        </div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      sorter: (a: ListViewDataItem, b: ListViewDataItem) => {
        if (!a.status && !b.status) return 0;
        if (!a.status) return 1;
        if (!b.status) return -1;
        return a.status.localeCompare(b.status);
      },
      render: (status: ListViewDataItem["status"]) =>
        status ? <StatusBadge status={status} /> : <Text style={{ color: "#d9d9d9" }}>-</Text>,
    },
    {
      title: "ACTION",
      key: "action",
      align: "center" as const,
      fixed: "right" as const,
      width: 80,
      render: (_: unknown, record: ListViewDataItem) => {
        const menu = {
          onClick: (info: { key: string; domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> }) => {
            info.domEvent.stopPropagation();
            // Handle menu actions here
            if (info.key === "preview") {
              router.push(`/detail/${record.id}`);
            } else if (info.key === "edit") {
              console.log("Edit:", record.id);
            } else if (info.key === "reject") {
              console.log("Reject:", record.id);
            }
          },
          items: [
            {
              key: "preview",
              label: "Preview",
              icon: <EyeOutlined />,
            },
            {
              key: "edit",
              label: "Edit",
              icon: <EditOutlined />,
            },
            {
              key: "reject",
              label: "Reject",
              icon: <CloseCircleOutlined />,
              danger: true,
            },
          ],
        };

        return (
          <Dropdown menu={menu} trigger={["click"]} placement="bottomRight">
            <Button
              type="text"
              icon={<MoreOutlined />}
              style={{ color: "#d9d9d9" }}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Card
      style={{
        borderRadius: 24,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        border: "1px solid #f0f0f0",
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        style={{ borderRadius: 24 }}
        scroll={{ x: "max-content" }}
        components={{
          header: {
            cell: (props: React.ThHTMLAttributes<HTMLTableCellElement> & { style?: React.CSSProperties }) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #f5f5f5",
                  padding: "20px 24px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              />
            ),
          },
        }}
        rowClassName={(_, index) => (index % 2 === 0 ? "table-row-even" : "table-row-odd")}
        onRow={(record) => ({
          onClick: (e) => {
            // Prevent navigation if clicking on button or action column
            const target = e.target as HTMLElement;
            if (target.closest('button') || target.closest('.ant-btn') || target.closest('td:last-child') || target.closest('.ant-dropdown')) {
              return;
            }
            router.push(`/detail/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
      <div
        style={{
          padding: "20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderTop: "1px solid #f5f5f5",
          backgroundColor: "#FCFDFF",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500 }}>
              Showing <Text strong style={{ color: "#262626" }}>1</Text> to{" "}
              <Text strong style={{ color: "#262626" }}>12</Text> of{" "}
              <Text strong style={{ color: "#262626" }}>12</Text> results
            </Text>
          </Col>
          <Col>
            <Row gutter={24} align="middle">
              <Col>
                <Space size={12}>
                  <Text style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500 }}>
                    Rows per page:
                  </Text>
                  <Select
                    defaultValue="10"
                    style={{
                      width: 60,
                    }}
                    suffixIcon={<DownOutlined style={{ fontSize: 16, color: "#9ca3af" }} />}
                    styles={{ popup: { root: { borderRadius: 12 } } }}
                  >
                    <Option value="10">10</Option>
                    <Option value="20">20</Option>
                    <Option value="50">50</Option>
                    <Option value="100">100</Option>
                  </Select>
                </Space>
              </Col>
              <Col>
                <Space size={4}>
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    disabled
                    style={{ color: "#d9d9d9" }}
                  />
                  <Button
                    type="primary"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: "#2563EB",
                      borderColor: "#2563EB",
                      fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                    }}
                  >
                    1
                  </Button>
                  <Button
                    type="text"
                    icon={<RightOutlined />}
                    disabled
                    style={{ color: "#d9d9d9" }}
                  />
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Card>
  );
}

// Stat Card Component
type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
  iconBg: string;
};

function StatCard({
  title,
  value,
  icon,
  trend,
  trendColor,
  iconBg,
}: StatCardProps) {
  return (
    <Card
      style={{
        borderRadius: 16,
        // boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #f0f0f0",
        height: 128,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      styles={{ body: { padding: 20 } }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        {trend && (
          <Tag
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 12,
              backgroundColor: trendColor === "#10b981" ? "#D1FAE5" : trendColor === "#ef4444" ? "#FEE2E2" : "#f5f5f5",
              color: trendColor || "#9ca3af",
              border: "none",
            }}
          >
            {trend}
          </Tag>
        )}
      </div>
      <div>
        <Text
          style={{
            fontSize: 14,
            color: "#595959",
            fontWeight: 500,
            display: "block",
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Title
          level={3}
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: "#262626",
          }}
        >
          {value}
        </Title>
      </div>
    </Card>
  );
}
