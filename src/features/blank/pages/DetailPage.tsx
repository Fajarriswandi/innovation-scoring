import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Card,
  Tag,
  Typography,
  Space,
  Avatar,
  Progress,
  Row,
  Col,
  Input,
  Divider,
} from "antd";
import {
  EditOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  CheckCircleFilled,
  QuestionCircleOutlined,
  ThunderboltOutlined,
  BookOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  UploadOutlined,
  EyeOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function DetailPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSmallTitle("Innovation Detail"));
    document.title = "Innovation Detail | AI Innovation Scoring Dashboard";
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Innovation Scoring Dashboard";
    };
  }, [dispatch]);

  return (
    <div style={{backgroundColor: "#F8FAFC", minHeight: "100vh", borderRadius: 10, padding: 24 }}>
      <Helmet>
        <title>Innovation Detail | AI Innovation Scoring Dashboard</title>
      </Helmet>

      <div>
        {/* Header Section */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
          <Col>
            <Title level={2} style={{ margin: 0, marginBottom: 8, fontSize: 28, fontWeight: 700, color: "#0F172A" }}>
              Project: AI-Powered Citizen Service Portal
            </Title>
            <Space split={<Divider type="vertical" style={{ backgroundColor: "#cbd5e1" }} />}>
              <Tag
                color="processing"
                style={{
                  backgroundColor: "#E0E7FF",
                  color: "#2563EB",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 10,
                  padding: "2px 8px",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                IN REVIEW
              </Tag>
              <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1 }}>
                ID: #INV-2024-089
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1 }}>
                Submitted 2 days ago
              </Text>
            </Space>
          </Col>
          <Col>
            <Button
              icon={<EditOutlined />}
              style={{
                height: 40,
                padding: "0 24px",
                fontWeight: 700,
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              Edit Project
            </Button>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Left Content Column */}
          <Col xs={24} lg={16}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {/* Innovation Overview Card */}
              <Card
                style={{
                  borderRadius: 10,
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  border: "none",
                  position: "relative",
                  overflow: "hidden",
                  paddingTop: 10,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 32,
                    right: 32,
                    color: "#e2e8f0",
                    fontSize: 120,
                    display: "none",
                  }}
                  className="detail-bulb-icon"
                >
                  <BulbOutlined />
                </div>
                <Title level={4} style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
                  Innovation Overview
                </Title>
                <Space size={[8, 8]} wrap style={{ marginBottom: 24 }}>
                  {["AI Lab", "Smart City", "Digital Inclusion"].map((t) => (
                    <Tag
                      key={t}
                      style={{
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        border: "none",
                        padding: "4px 16px",
                        borderRadius: 12,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {t}
                    </Tag>
                  ))}
                  <Tag
                    style={{
                      backgroundColor: "#EEF2FF",
                      color: "#2563EB",
                      border: "none",
                      padding: "4px 16px",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    Budget: AED 180k
                  </Tag>
                </Space>
                <Paragraph
                  style={{
                    color: "#64748b",
                    fontSize: 15,
                    lineHeight: 1.6,
                    marginBottom: 32,
                    maxWidth: "85%",
                  }}
                >
                  This innovation addresses Digital Dubai's mission to digitalize life in Dubai by deploying an AI-powered 
                  citizen service portal that integrates advanced language models with our government knowledge base. The 
                  system will automate citizen inquiries across multiple channels, reducing processing time by 60% while 
                  ensuring accurate, context-aware responses. This initiative directly supports our paperless government 
                  strategy and enhances digital inclusion by making services more accessible to all residents, regardless 
                  of technical proficiency. The solution leverages our existing blockchain infrastructure for secure data 
                  handling and aligns with the Dubai AI Lab's focus on practical AI applications that drive efficiency 
                  and improve quality of life.
                </Paragraph>

                {/* Attachments Section */}
                <div style={{ marginTop: 24 }}>
                  <Title level={4} style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
                    Attachments
                  </Title>
                  <Space size={16} style={{ width: "100%" }}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: 12,
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        width: "100%",
                        maxWidth: 300,
                      }}
                      bodyStyle={{ padding: 16 }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            backgroundColor: "#ef4444",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <FilePdfOutlined style={{ fontSize: 18, color: "#fff" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text
                            strong
                            style={{
                              display: "block",
                              fontSize: 12,
                              color: "#262626",
                              marginBottom: 4,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Technical_Spec_v2.pdf
                          </Text>
                          <Text style={{ fontSize: 11, color: "#9ca3af" }}>2.4 MB</Text>
                        </div>
                      </div>
                    </Card>
                    <Card
                      hoverable
                      style={{
                        borderRadius: 12,
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        width: "100%",
                        maxWidth: 300,
                      }}
                      bodyStyle={{ padding: 16 }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            backgroundColor: "#2563EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <FileImageOutlined style={{ fontSize: 18, color: "#fff" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text
                            strong
                            style={{
                              display: "block",
                              fontSize: 12,
                              color: "#262626",
                              marginBottom: 4,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Drone_Prototype.jpg
                          </Text>
                          <Text style={{ fontSize: 11, color: "#9ca3af" }}>1.1 MB</Text>
                        </div>
                      </div>
                    </Card>
                  </Space>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    paddingTop: 24,
                    borderTop: "1px solid #f8fafc",
                  }}
                >
                  <Avatar
                    src="https://i.pravatar.cc/150?u=sarah"
                    size={48}
                    style={{ border: "2px solid #fff", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: "block", fontSize: 14 }}>
                      Ahmed Al Mansouri
                    </Text>
                    <Text style={{ color: "#94a3b8", fontSize: 12 }}>Digital Services Director</Text>
                  </div>
                  <div style={{ paddingRight: 48 }}>
                    <Text
                      style={{
                        display: "block",
                        color: "#94a3b8",
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: 4,
                      }}
                    >
                      Department
                    </Text>
                    <Text strong style={{ fontSize: 14 }}>
                      Digital Dubai Authority
                    </Text>
                  </div>
                </div>
              </Card>

              {/* AI Generated Summary Card */}
              <Card
                style={{
                  borderRadius: 10,
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  border: "none",
                  borderLeft: "4px solid #A78BFA",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ marginTop: 4 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: "#F5F3FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ThunderboltOutlined style={{ color: "#8B5CF6", fontSize: 20 }} />
                    </div>
                  </div>
                  <div>
                    <Title level={4} style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                      AI Generated Summary
                    </Title>
                    <Paragraph style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      This innovation demonstrates <Text strong style={{ color: "#10b981" }}>strong alignment with Digital Dubai's 
                      strategic priorities</Text>, particularly in advancing AI adoption and enhancing citizen service delivery. 
                      The proposal shows significant potential for economic impact through reduced operational costs and improved 
                      service efficiency. However, the AI analysis has identified a <Text strong style={{ color: "#f59e0b" }}>moderate 
                      risk</Text> regarding data governance and privacy compliance when processing citizen personal information. 
                      Technical feasibility is rated high given Digital Dubai's existing smart infrastructure and API ecosystem. 
                      The initiative could position Dubai as a global leader in AI-powered government services while supporting 
                      the happiness agenda through faster, more accessible citizen interactions.
                    </Paragraph>
                  </div>
                </div>
              </Card>

              {/* Metrics Row */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <Card
                    style={{
                      borderRadius: 10,
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                      border: "none",
                      height: "100%",
                      paddingTop: 10,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                      <Title level={4} style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                        Score Breakdown
                      </Title>
                      <Button type="link" style={{ fontSize: 12, fontWeight: 700, padding: 0 }}>
                        View Details
                      </Button>
                    </div>
                    <Space direction="vertical" size={20} style={{ width: "100%" }}>
                      {[
                        { label: "Innovation Level", val: 92, color: "#8B5CF6", weight: "25%" },
                        { label: "Feasibility", val: 85, color: "#10B981", weight: "20%" },
                        { label: "Business Impact", val: 88, color: "#F59E0B", weight: "25%" },
                        { label: "Strategic Alignment", val: 90, color: "#3B82F6", weight: "15%" },
                        { label: "Implementation Cost", val: 78, color: "#EF4444", weight: "15%" },
                      ].map((m) => (
                        <div key={m.label} style={{ width: "100%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: m.color,
                                  flexShrink: 0,
                                }}
                              />
                              <Text
                                style={{
                                  color: "#1e293b",
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                              >
                                {m.label}
                              </Text>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <Text
                                style={{
                                  color: "#1e293b",
                                  fontSize: 14,
                                  fontWeight: 700,
                                }}
                              >
                                {m.val}%
                              </Text>
                              <Text
                                style={{
                                  color: "#94a3b8",
                                  fontSize: 11,
                                  fontWeight: 500,
                                }}
                              >
                                ({m.weight})
                              </Text>
                            </div>
                          </div>
                          <Progress
                            percent={m.val}
                            strokeColor={m.color}
                            showInfo={false}
                            style={{ margin: 0 }}
                            strokeWidth={8}
                          />
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card
                    style={{
                      borderRadius: 10,
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                      border: "none",
                      height: "100%",
                      paddingTop: 10,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                      <Title level={4} style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                        Similarity Analysis
                      </Title>
                      <InfoCircleOutlined style={{ color: "#cbd5e1" }} />
                    </div>
                    <Space direction="vertical" size={16} style={{ width: "100%" }}>
                      <div
                        style={{
                          padding: 16,
                          backgroundColor: "#f8fafc",
                          borderRadius: 16,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text strong style={{ display: "block", fontSize: 14 }}>
                            Dubai AI Lab - Service Bot Initiative
                          </Text>
                          <Text style={{ color: "#94a3b8", fontSize: 12 }}>Status: Completed</Text>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Text strong style={{ color: "#f59e0b", display: "block", fontSize: 14 }}>
                            82% <span style={{ color: "#94a3b8", fontWeight: 500 }}>match</span>
                          </Text>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: 16,
                          backgroundColor: "#f8fafc",
                          borderRadius: 16,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text strong style={{ display: "block", fontSize: 14 }}>
                            Paperless Government Portal
                          </Text>
                          <Text style={{ color: "#94a3b8", fontSize: 12 }}>Status: Active</Text>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Text strong style={{ color: "#1e293b", display: "block", fontSize: 14 }}>
                            58% <span style={{ color: "#94a3b8", fontWeight: 500 }}>match</span>
                          </Text>
                        </div>
                      </div>
                    </Space>
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f8fafc" }}>
                      <Text
                        style={{
                          color: "#94a3b8",
                          fontSize: 11,
                          fontWeight: 500,
                          lineHeight: 1.6,
                          display: "block",
                          fontStyle: "italic",
                        }}
                      >
                        This project shares <Text strong style={{ color: "#475569" }}>significant similarity</Text> with 
                        the completed AI Lab initiative. Review implementation patterns and data governance lessons learned.
                      </Text>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Space>
          </Col>

          {/* Right Sidebar Column */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {/* AI Recommendation Card */}
              <Card
                style={{
                  borderRadius: 10,
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  border: "none",
                  textAlign: "center",
                  padding: "24px 0",
                }}
              >
                <Text
                  style={{
                    color: "#94a3b8",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 24,
                    display: "block",
                  }}
                >
                  AI RECOMMENDATION
                </Text>
                <div style={{ marginBottom: 24, position: "relative", display: "inline-block" }}>
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      backgroundColor: "#D1FAE5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "4px solid #fff",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      margin: "0 auto",
                    }}
                  >
                    <CheckCircleFilled style={{ color: "#10b981", fontSize: 48 }} />
                  </div>
                </div>
                <Title level={3} style={{ fontSize: 24, fontWeight: 900, margin: 0, color: "#1e293b" }}>
                  Strongly Endorse
                </Title>
                <div style={{ marginTop: 32, padding: "0 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div
                      style={{
                        height: 6,
                        flex: 1,
                        backgroundColor: "#f1f5f9",
                        borderRadius: 3,
                        overflow: "hidden",
                        marginRight: 12,
                      }}
                    >
                      <div style={{ height: "100%", backgroundColor: "#10b981", width: "94%" }} />
                    </div>
                    <Text strong style={{ color: "#1e293b", fontSize: 12 }}>
                      94%
                    </Text>
                  </div>
                  <Text
                    style={{
                      color: "#94a3b8",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Confidence Score
                  </Text>
                </div>
              </Card>

              {/* Committee Action Card */}
              <Card
                style={{
                  borderRadius: 10,
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  border: "none",
                  paddingTop: 10,
                }}
              >
                <Title level={4} style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
                  Committee Action
                </Title>
                <Space direction="vertical" size={12} style={{ width: "100%", marginBottom: 24 }}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<CheckCircleFilled />}
                    style={{
                      height: 56,
                      fontSize: 15,
                      fontWeight: 700,
                      borderRadius: 16,
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                    }}
                  >
                    Approve for Pilot
                  </Button>
                  <Button
                    size="large"
                    block
                    icon={<QuestionCircleOutlined />}
                    style={{
                      height: 56,
                      fontSize: 15,
                      fontWeight: 700,
                      borderRadius: 16,
                      color: "#475569",
                    }}
                  >
                    Request More Info
                  </Button>
                  <div style={{ textAlign: "center", paddingTop: 8 }}>
                    <Button type="link" danger style={{ fontSize: 14, fontWeight: 700 }}>
                      Reject Proposal
                    </Button>
                  </div>
                </Space>

                <div style={{ paddingTop: 24, borderTop: "1px solid #f8fafc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 13 }}>
                      Committee Notes
                    </Text>
                    <Text style={{ color: "#94a3b8", fontSize: 11 }}>Visible to submitter</Text>
                  </div>
                  <TextArea
                    placeholder="Enter rationale for decision..."
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "none",
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 14,
                    }}
                    rows={4}
                  />
                </div>
              </Card>

              {/* Activity History Timeline */}
              <Card
                style={{
                  borderRadius: 10,
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  border: "none",
                  paddingTop: 10,
                }}
              >
                <Title level={4} style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
                  Activity History
                </Title>
                <div style={{ position: "relative", paddingLeft: 8 }}>
                  {[
                    {
                      type: "upload",
                      user: "Ahmed Al Mansouri",
                      action: "Uploaded proposal",
                      time: "2 days ago",
                      avatar: "https://i.pravatar.cc/150?u=ahmed",
                    },
                    {
                      type: "review",
                      user: "Fatima Al Zaabi",
                      action: "Reviewed proposal",
                      time: "1 day ago",
                      avatar: "https://i.pravatar.cc/150?u=fatima",
                    },
                    {
                      type: "assign",
                      user: "Mohammed Al Maktoum",
                      action: "Assigned to AI Lab team",
                      time: "20 hours ago",
                      avatar: "https://i.pravatar.cc/150?u=mohammed",
                    },
                    {
                      type: "approve",
                      user: "Sarah Al Suwaidi",
                      action: "Approved for committee review",
                      time: "5 hours ago",
                      avatar: "https://i.pravatar.cc/150?u=sarah",
                    },
                  ].map((activity, index, array) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: 16,
                        marginBottom: index < array.length - 1 ? 20 : 0,
                        position: "relative",
                      }}
                    >
                      {/* Timeline Line */}
                      {index < array.length - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            left: 20,
                            top: 40,
                            width: 2,
                            height: "calc(100% + 4px)",
                            backgroundColor: "#e5e7eb",
                            zIndex: 0,
                          }}
                        />
                      )}
                      
                      {/* Avatar Container */}
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <Avatar
                          src={activity.avatar}
                          size={40}
                          style={{
                            border: "2px solid #fff",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            flexShrink: 0,
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ fontSize: 13, color: "#1e293b", display: "block", marginBottom: 6 }}>
                          {activity.user}
                        </Text>
                        <Text 
                          style={{ 
                            fontSize: 12, 
                            color: "#475569", 
                            display: "block", 
                            marginBottom: 6,
                            lineHeight: 1.4,
                          }}
                        >
                          {activity.action}
                        </Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <ClockCircleOutlined style={{ fontSize: 11, color: "#94a3b8" }} />
                          <Text style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                            {activity.time}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Space>
          </Col>
        </Row>

        {/* Full-width Bottom Section */}
        {/* <div style={{ marginTop: 48 }}>
          <Space style={{ marginBottom: 24 }}>
            <BookOutlined style={{ color: "#2563EB", fontSize: 20 }} />
            <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              Similarity Analysis
            </Title>
          </Space>

          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {[
              {
                title: "Blockchain Document Verification",
                tag: "ACTIVE",
                desc: "Secure document authentication using blockchain for government services.",
                match: "78%",
              },
              {
                title: "Smart City Data Hub",
                tag: "ACTIVE",
                desc: "Centralized data platform for real-time city management and citizen insights.",
                match: "65%",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 24,
                  backgroundColor: "transparent",
                  borderRadius: 16,
                  borderBottom: "1px solid #f1f5f9",
                  transition: "background-color 0.2s",
                }}
                className="similarity-item"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Text strong style={{ fontSize: 15, color: "#1e293b" }}>
                      {item.title}
                    </Text>
                    <Tag
                      style={{
                        border: "none",
                        fontWeight: 700,
                        fontSize: 9,
                        padding: "2px 8px",
                        borderRadius: 4,
                        backgroundColor: item.tag === "LEGACY" ? "#e2e8f0" : "#D1FAE5",
                        color: item.tag === "LEGACY" ? "#64748b" : "#10b981",
                      }}
                    >
                      {item.tag}
                    </Tag>
                  </div>
                  <Text style={{ color: "#94a3b8", fontSize: 14 }}>{item.desc}</Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text strong style={{ color: "#2563EB", display: "block", fontSize: 16 }}>
                    {item.match} Match
                  </Text>
                  <Button type="link" style={{ padding: 0, height: "auto", color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>
                    View details
                  </Button>
                </div>
              </div>
            ))}
          </Space>
        </div> */}
      </div>
    </div>
  );
}

