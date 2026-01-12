"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";
import {
  Typography,
  Table,
  Tag,
  Row,
  Col,
  Card,
  Input,
  Button,
  Drawer,
  Space,
  Radio,
  Checkbox,
  App,
  Divider,
  Select,
} from "antd";
import {
  SearchOutlined,
  MessageOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  UpOutlined,
  DownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  Colors,
  Spacing,
  Typography as Typo,
  BorderRadius,
  Shadows,
  GlobalStyles,
  combineStyles,
  getChannelTagStyle,
  getRequestTagStyle,
} from "@/styles/globalStyles";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

// Type definitions
interface Session {
  key: string;
  sessionId: string;
  channel: "Live Chat" | "Voice" | "Video" | "Email";
  startTime: string;
  lastActivity: string;
}

interface AIRequest {
  requestId: string;
  type: "STT" | "LLM" | "TTS";
  input: string;
  output: string;
  latency: number;
}

// Sample AI Requests data untuk drawer
const sampleAIRequests: AIRequest[] = [
  {
    requestId: "REQ-001",
    type: "STT",
    input: "User audio input: 'Hello, I need help with my account'",
    output: "Transcribed text: 'Hello, I need help with my account'",
    latency: 245,
  },
  {
    requestId: "REQ-002",
    type: "LLM",
    input: "User query: 'I need help with my account'",
    output:
      "AI Response: 'I'd be happy to help you with your account. Could you please provide your account number or email address?'",
    latency: 1234,
  },
  {
    requestId: "REQ-003",
    type: "TTS",
    input:
      "Text to convert: 'I'd be happy to help you with your account. Could you please provide your account number or email address?'",
    output: "Audio output generated successfully",
    latency: 567,
  },
];

// Sample data
const sampleSessions: Session[] = [
  {
    key: "1",
    sessionId: "SESS-2024-001",
    channel: "Live Chat",
    startTime: "2024-03-15 10:30:00",
    lastActivity: "2024-03-15 11:15:00",
  },
  {
    key: "2",
    sessionId: "SESS-2024-002",
    channel: "Voice",
    startTime: "2024-03-15 09:15:00",
    lastActivity: "2024-03-15 09:45:00",
  },
  {
    key: "3",
    sessionId: "SESS-2024-003",
    channel: "Video",
    startTime: "2024-03-15 14:20:00",
    lastActivity: "2024-03-15 15:10:00",
  },
  {
    key: "4",
    sessionId: "SESS-2024-004",
    channel: "Live Chat",
    startTime: "2024-03-15 16:00:00",
    lastActivity: "2024-03-15 16:30:00",
  },
  {
    key: "5",
    sessionId: "SESS-2024-005",
    channel: "Voice",
    startTime: "2024-03-15 11:00:00",
    lastActivity: "2024-03-15 11:25:00",
  },
  {
    key: "6",
    sessionId: "SESS-2024-006",
    channel: "Email",
    startTime: "2024-03-15 08:00:00",
    lastActivity: "2024-03-15 08:45:00",
  },
  {
    key: "7",
    sessionId: "SESS-2024-007",
    channel: "Live Chat",
    startTime: "2024-03-15 13:30:00",
    lastActivity: "2024-03-15 14:00:00",
  },
  {
    key: "8",
    sessionId: "SESS-2024-008",
    channel: "Video",
    startTime: "2024-03-15 15:00:00",
    lastActivity: "2024-03-15 15:50:00",
  },
];

// Fungsi untuk mendapatkan icon berdasarkan channel
const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "Live Chat":
      return <MessageOutlined />;
    case "Voice":
      return <PhoneOutlined />;
    case "Video":
      return <VideoCameraOutlined />;
    default:
      return <MessageOutlined />;
  }
};

// Fungsi untuk mendapatkan color badge berdasarkan channel (menggunakan helper function dari globalStyles)
const getChannelColor = (channel: string) => {
  switch (channel) {
    case "Live Chat":
      return "blue";
    case "Voice":
      return "green";
    case "Video":
      return "purple";
    case "Email":
      return "orange";
    default:
      return "default";
  }
};

export default function EvaluationListPage() {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [filteredSessions, setFilteredSessions] =
    useState<Session[]>(sampleSessions);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // State untuk drawer
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);

  // State untuk form evaluasi
  const [naturalness, setNaturalness] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [issues, setIssues] = useState<string[]>([]);
  const [comments, setComments] = useState<string>("");

  useEffect(() => {
    dispatch(setSmallTitle("Evaluation List"));
    document.title = "Evaluation List | AI Call Center";
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Call Center";
    };
  }, [dispatch]);

  // Handle search
  const handleSearch = (value: string) => {
    if (!value.trim()) {
      setFilteredSessions(sampleSessions);
      return;
    }
    const filtered = sampleSessions.filter(
      (session) =>
        session.sessionId.toLowerCase().includes(value.toLowerCase()) ||
        session.channel.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSessions(filtered);
  };

  // Handle buka drawer untuk evaluasi
  const handleOpenDrawer = (session: Session) => {
    setSelectedSession(session);
    setDrawerVisible(true);
    setCurrentRequestIndex(0);
    // Reset form
    setNaturalness(0);
    setAccuracy(null);
    setIssues([]);
    setComments("");
  };

  // Handle tutup drawer
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedSession(null);
    setCurrentRequestIndex(0);
    // Reset form
    setNaturalness(0);
    setAccuracy(null);
    setIssues([]);
    setComments("");
  };

  // Handle navigasi request (next/previous)
  const handleNextRequest = () => {
    if (currentRequestIndex < sampleAIRequests.length - 1) {
      setCurrentRequestIndex(currentRequestIndex + 1);
      // Reset form untuk request baru
      setNaturalness(0);
      setAccuracy(null);
      setIssues([]);
      setComments("");
    }
  };

  const handlePreviousRequest = () => {
    if (currentRequestIndex > 0) {
      setCurrentRequestIndex(currentRequestIndex - 1);
      // Reset form untuk request baru
      setNaturalness(0);
      setAccuracy(null);
      setIssues([]);
      setComments("");
    }
  };

  // Handle save evaluation
  const handleSaveEvaluation = () => {
    if (naturalness === 0) {
      message.warning("Pilih rating Naturalness terlebih dahulu");
      return;
    }
    if (!accuracy) {
      message.warning("Pilih Accuracy terlebih dahulu");
      return;
    }

    const currentRequest = sampleAIRequests[currentRequestIndex];
    message.success(
      `Evaluasi berhasil disimpan untuk ${currentRequest.requestId}`
    );

    // Reset form
    setNaturalness(0);
    setAccuracy(null);
    setIssues([]);
    setComments("");

    // Jika masih ada request berikutnya, pindah ke request berikutnya
    if (currentRequestIndex < sampleAIRequests.length - 1) {
      setCurrentRequestIndex(currentRequestIndex + 1);
    } else {
      // Jika sudah selesai semua request, tutup drawer
      handleCloseDrawer();
      message.success("Semua evaluasi untuk session ini telah disimpan");
    }
  };

  // Kolom tabel
  const columns: ColumnsType<Session> = [
    {
      title: "SESSION ID",
      dataIndex: "sessionId",
      key: "sessionId",
      width: 200,
      render: (text: string) => (
        <Text
          strong
          style={combineStyles(GlobalStyles.textPrimary, {
            fontSize: Typo.base,
            fontWeight: Typo.bold,
            color: Colors.textPrimary,
          })}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "CHANNEL",
      dataIndex: "channel",
      key: "channel",
      width: 180,
      render: (channel: string) => (
        <Tag
          color={getChannelColor(channel)}
          icon={getChannelIcon(channel)}
          style={combineStyles(getChannelTagStyle(channel), {
            padding: `${Spacing.xs}px ${Spacing.md}px`,
            borderRadius: BorderRadius.md,
            fontWeight: Typo.semibold,
            fontSize: Typo.sm,
          })}
        >
          {channel}
        </Tag>
      ),
    },
    {
      title: "START TIME",
      dataIndex: "startTime",
      key: "startTime",
      width: 200,
      render: (text: string) => (
        <Text
          style={combineStyles(GlobalStyles.textMuted, {
            color: Colors.textMuted,
            fontSize: Typo.sm,
          })}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "LAST ACTIVITY",
      dataIndex: "lastActivity",
      key: "lastActivity",
      width: 200,
      render: (text: string) => (
        <Text
          style={combineStyles(GlobalStyles.textMuted, {
            color: Colors.textMuted,
            fontSize: Typo.sm,
          })}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleOpenDrawer(record)}
          style={combineStyles(GlobalStyles.buttonPrimary, {
            borderRadius: BorderRadius.md,
            fontWeight: Typo.semibold,
            height: 32,
          })}
        >
          Evaluate
        </Button>
      ),
    },
  ];

  return (
    <div style={GlobalStyles.container}>
      <Helmet>
        <title>Evaluation List | Zafar Labs</title>
      </Helmet>

      {/* Table Card */}
      <Card
        style={combineStyles(GlobalStyles.card, {
          borderRadius: BorderRadius.lg,
          boxShadow: Shadows.sm,
          border: "none",
          padding: 0,
        })}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header */}
        <Row
          justify="space-between"
          align="middle"
          style={{
            ...GlobalStyles.marginBottomLg,
            padding: Spacing.md,
          }}
        >
          <Col>
            <Title
              level={2}
              style={combineStyles(GlobalStyles.heading4, {
                margin: 0,
                // fontSize: Typo.xxl,
                // fontWeight: Typo.bold,
              })}
            >
              Evaluation List
            </Title>
          </Col>
          <Col>
            <Search
              placeholder="Search by Session ID or Channel"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={combineStyles(GlobalStyles.input, {
                width: 300,
                padding: 0,
                border:0,
              })}
              onSearch={handleSearch}
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearch("");
                }
              }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredSessions.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          pagination={false}
          style={{ borderRadius: 0 }}
          scroll={{ x: "max-content" }}
          components={{
            header: {
              cell: (
                props: React.ThHTMLAttributes<HTMLTableCellElement> & {
                  style?: React.CSSProperties;
                }
              ) => (
                <th
                  {...props}
                  style={combineStyles(GlobalStyles.tableHeader, {
                    ...props.style,
                    padding: `${Spacing.md}px ${Spacing.md}px`,
                  })}
                />
              ),
            },
          }}
          rowClassName={(_, index) =>
            `table-row-${index % 2 === 0 ? "even" : "odd"}`
          }
        />
        <div
          style={combineStyles({
            padding: `${Spacing.lg}px ${Spacing.xl}px`,
            display: "flex",
            flexDirection: "column",
            gap: Spacing.md,
            borderTop: `1px solid ${Colors.borderLight}`,
            backgroundColor: Colors.backgroundLight,
            borderBottomLeftRadius: BorderRadius.lg,
            borderBottomRightRadius: BorderRadius.lg,
          })}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Text
                style={combineStyles(GlobalStyles.textMuted, {
                  fontSize: Typo.base,
                  fontWeight: Typo.medium,
                })}
              >
                Showing{" "}
                <Text strong style={{ color: Colors.primary }}>
                  {(currentPage - 1) * pageSize + 1}
                </Text>{" "}
                to{" "}
                <Text strong style={{ color: Colors.primary }}>
                  {Math.min(currentPage * pageSize, filteredSessions.length)}
                </Text>{" "}
                of{" "}
                <Text strong style={{ color: Colors.primary }}>
                  {filteredSessions.length}
                </Text>{" "}
                results
              </Text>
            </Col>
            <Col>
              <Row gutter={Spacing.lg} align="middle">
                <Col>
                  <Space size={Spacing.md}>
                    <Text
                      style={combineStyles(GlobalStyles.textMuted, {
                        fontSize: Typo.base,
                        fontWeight: Typo.medium,
                      })}
                    >
                      Rows per page:
                    </Text>
                    <Select
                      value={String(pageSize)}
                      onChange={(value) => {
                        setPageSize(Number(value));
                        setCurrentPage(1);
                      }}
                      style={{
                        width: 60,
                      }}
                      options={[
                        { value: "10", label: "10" },
                        { value: "20", label: "20" },
                        { value: "50", label: "50" },
                      ]}
                    />
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button
                      type="text"
                      icon={<UpOutlined />}
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      style={{
                        color:
                          currentPage === 1
                            ? Colors.borderDark
                            : Colors.textMuted,
                      }}
                    />
                    <Button
                      type="text"
                      icon={<DownOutlined />}
                      onClick={() =>
                        setCurrentPage(
                          Math.min(
                            Math.ceil(filteredSessions.length / pageSize),
                            currentPage + 1
                          )
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(filteredSessions.length / pageSize)
                      }
                      style={{
                        color:
                          currentPage >=
                          Math.ceil(filteredSessions.length / pageSize)
                            ? Colors.borderDark
                            : Colors.textMuted,
                      }}
                    />
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Evaluation Drawer */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Title
                level={4}
                style={combineStyles(GlobalStyles.heading4, {
                  margin: 0,
                  fontSize: Typo.xl,
                  fontWeight: Typo.bold,
                })}
              >
                Evaluate Request
              </Title>
              <Text
                style={combineStyles(GlobalStyles.textMuted, {
                  color: Colors.textMuted,
                  fontSize: Typo.sm,
                })}
              >
                Sequence #{String(currentRequestIndex + 1).padStart(2, "0")}
              </Text>
            </div>
            <Space>
              <Button
                type="text"
                icon={<UpOutlined />}
                onClick={handlePreviousRequest}
                disabled={currentRequestIndex === 0}
                style={{ color: Colors.textMuted }}
              />
              <Button
                type="text"
                icon={<DownOutlined />}
                onClick={handleNextRequest}
                disabled={currentRequestIndex === sampleAIRequests.length - 1}
                style={{ color: Colors.textMuted }}
              />
            </Space>
          </div>
        }
        placement="right"
        onClose={handleCloseDrawer}
        open={drawerVisible}
        width={480}
        styles={{
          body: {
            padding: Spacing.lg,
          },
        }}
      >
        {selectedSession && (
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* Session Info */}
            <div>
              <Text
                style={combineStyles(GlobalStyles.textUppercase, {
                  fontSize: Typo.sm,
                  color: Colors.textMuted,
                  fontWeight: Typo.semibold,
                })}
              >
                Session
              </Text>
              <div style={{ marginTop: Spacing.xs }}>
                <Text
                  strong
                  style={combineStyles(GlobalStyles.textPrimary, {
                    fontSize: Typo.base,
                  })}
                >
                  {selectedSession.sessionId}
                </Text>
                <Tag
                  color={getChannelColor(selectedSession.channel)}
                  icon={getChannelIcon(selectedSession.channel)}
                  style={combineStyles(
                    getChannelTagStyle(selectedSession.channel),
                    {
                      marginLeft: Spacing.sm,
                      fontSize: Typo.xs,
                    }
                  )}
                >
                  {selectedSession.channel}
                </Tag>
              </div>
            </div>

            {/* Current Request Info */}
            {sampleAIRequests[currentRequestIndex] &&
              (() => {
                const currentRequest = sampleAIRequests[currentRequestIndex];
                const requestType = currentRequest.type;
                return (
                  <div>
                    <Text
                      style={combineStyles(GlobalStyles.textUppercase, {
                        fontSize: Typo.sm,
                        color: Colors.textMuted,
                        fontWeight: Typo.semibold,
                      })}
                    >
                      Request Info
                    </Text>
                    <div
                      style={combineStyles({
                        marginTop: Spacing.sm,
                        padding: Spacing.md,
                        backgroundColor: Colors.backgroundLight,
                        borderRadius: BorderRadius.md,
                      })}
                    >
                      <div style={{ marginBottom: Spacing.sm }}>
                        <Tag
                          color={
                            requestType === "STT"
                              ? "blue"
                              : requestType === "LLM"
                              ? "purple"
                              : "green"
                          }
                          style={combineStyles(
                            getRequestTagStyle(requestType),
                            {
                              fontWeight: Typo.bold,
                              fontSize: Typo.xs,
                            }
                          )}
                        >
                          {requestType}
                        </Tag>
                        <Text
                          strong
                          style={combineStyles(GlobalStyles.textPrimary, {
                            marginLeft: Spacing.sm,
                            fontSize: Typo.sm,
                          })}
                        >
                          {currentRequest.requestId}
                        </Text>
                      </div>
                      <Text
                        style={combineStyles(GlobalStyles.textMuted, {
                          fontSize: Typo.xs,
                          color: Colors.textMuted,
                          display: "block",
                          marginBottom: Spacing.xs,
                        })}
                      >
                        Input: {currentRequest.input.substring(0, 50)}...
                      </Text>
                      <Text
                        style={combineStyles(GlobalStyles.textMuted, {
                          fontSize: Typo.xs,
                          color: Colors.textMuted,
                          display: "block",
                        })}
                      >
                        Latency: {currentRequest.latency}ms
                      </Text>
                    </div>
                  </div>
                );
              })()}

            <Divider style={{ margin: `${Spacing.sm}px 0` }} />

            {/* Naturalness */}
            <div>
              <Text
                strong
                style={combineStyles(GlobalStyles.textPrimary, {
                  display: "block",
                  marginBottom: Spacing.md,
                  fontSize: Typo.base,
                })}
              >
                Naturalness
              </Text>
              <Radio.Group
                value={naturalness}
                onChange={(e) => setNaturalness(e.target.value)}
                style={{ width: "100%" }}
              >
                <Space wrap>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Radio.Button
                      key={num}
                      value={num}
                      style={{
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: Typo.md,
                        fontWeight: Typo.bold,
                        borderRadius: BorderRadius.md,
                      }}
                    >
                      {num}
                    </Radio.Button>
                  ))}
                </Space>
              </Radio.Group>
            </div>

            {/* Accuracy */}
            <div>
              <Text
                strong
                style={combineStyles(GlobalStyles.textPrimary, {
                  display: "block",
                  marginBottom: Spacing.md,
                  fontSize: Typo.base,
                })}
              >
                Accuracy
              </Text>
              <Radio.Group
                value={accuracy}
                onChange={(e) => setAccuracy(e.target.value)}
                style={{ width: "100%" }}
              >
                <Space>
                  <Radio.Button
                    value="correct"
                    style={{
                      height: 40,
                      padding: `0 ${Spacing.lg}px`,
                      borderRadius: BorderRadius.md,
                      fontWeight: Typo.semibold,
                    }}
                  >
                    <CheckCircleOutlined style={{ marginRight: Spacing.sm }} />
                    Correct
                  </Radio.Button>
                  <Radio.Button
                    value="incorrect"
                    style={{
                      height: 40,
                      padding: `0 ${Spacing.lg}px`,
                      borderRadius: BorderRadius.md,
                      fontWeight: Typo.semibold,
                    }}
                  >
                    <CloseCircleOutlined style={{ marginRight: Spacing.sm }} />
                    Incorrect
                  </Radio.Button>
                </Space>
              </Radio.Group>
            </div>

            {/* Issues Identified */}
            <div>
              <Text
                strong
                style={combineStyles(GlobalStyles.textPrimary, {
                  display: "block",
                  marginBottom: Spacing.md,
                  fontSize: Typo.base,
                })}
              >
                Issues Identified
              </Text>
              <Checkbox.Group
                value={issues}
                onChange={(checkedValues) =>
                  setIssues(checkedValues as string[])
                }
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {[
                    "Robotic Voice",
                    "Hallucination",
                    "High Latency",
                    "Cut Off",
                  ].map((issue) => (
                    <Checkbox
                      key={issue}
                      value={issue}
                      style={{
                        padding: `${Spacing.sm}px ${Spacing.md}px`,
                        borderRadius: BorderRadius.md,
                        border: `1px solid ${Colors.borderLight}`,
                        width: "100%",
                        margin: 0,
                      }}
                    >
                      {issue}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </div>

            {/* Comments */}
            <div>
              <Text
                strong
                style={combineStyles(GlobalStyles.textPrimary, {
                  display: "block",
                  marginBottom: Spacing.md,
                  fontSize: Typo.base,
                })}
              >
                Comments
              </Text>
              <TextArea
                placeholder="Add specific notes about this interaction..."
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={combineStyles(GlobalStyles.input, {
                  borderRadius: BorderRadius.md,
                  fontSize: Typo.sm,
                })}
              />
            </div>

            {/* Save Button */}
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              block
              size="large"
              onClick={handleSaveEvaluation}
              style={combineStyles(GlobalStyles.buttonPrimary, {
                height: 48,
                borderRadius: BorderRadius.md,
                fontWeight: Typo.bold,
                fontSize: Typo.base,
                marginTop: Spacing.sm,
              })}
            >
              Save Evaluation
            </Button>

            {/* Navigation Hint */}
            <Text
              style={combineStyles(GlobalStyles.textMuted, {
                fontSize: Typo.xs,
                color: Colors.textMuted,
                textAlign: "center",
                display: "block",
              })}
            >
              Press Tab to navigate
            </Text>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
