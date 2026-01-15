"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";
import {
  Typography,
  Table,
  Tag,
  Space,
  Row,
  Col,
  Card,
  Button,
  Select,
  Drawer,
  Rate,
  Input,
  Divider,
} from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  DashboardOutlined,
  ExportOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  MoreOutlined,
  LinkOutlined,
  DislikeOutlined,
  LikeOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Colors, Spacing, Typography as Typo, BorderRadius, Shadows, GlobalStyles, combineStyles, getRequestTagStyle } from "@/styles/globalStyles";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Type definitions
interface EventLog {
  key: string;
  time: string;
  type: "STT" | "LLM" | "TTS";
  component: string;
  engine: string;
  event: string;
  level: "Info" | "Warning" | "Error";
}

// Sample data untuk event logs
const sampleEventLogs: EventLog[] = [
  {
    key: "1",
    time: "02:33:48",
    type: "STT",
    component: "Speech Recognition",
    engine: "Whisper v3",
    event: "Transcription completed",
    level: "Info",
  },
  {
    key: "2",
    time: "02:33:50",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Intent inferred",
    level: "Info",
  },
  {
    key: "3",
    time: "02:33:52",
    type: "TTS",
    component: "Speech Synthesis",
    engine: "ElevenLabs",
    event: "Audio generated",
    level: "Info",
  },
  {
    key: "4",
    time: "02:33:55",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Slot updated",
    level: "Info",
  },
  {
    key: "5",
    time: "02:33:58",
    type: "STT",
    component: "Speech Recognition",
    engine: "Whisper v3",
    event: "Low confidence",
    level: "Warning",
  },
  {
    key: "6",
    time: "02:34:00",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Clarification generated",
    level: "Info",
  },
  {
    key: "7",
    time: "02:34:03",
    type: "TTS",
    component: "Speech Synthesis",
    engine: "ElevenLabs",
    event: "Audio generated",
    level: "Info",
  },
  {
    key: "8",
    time: "02:34:06",
    type: "STT",
    component: "Speech Recognition",
    engine: "Whisper v3",
    event: "Transcription completed",
    level: "Info",
  },
  {
    key: "9",
    time: "02:34:08",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Response generated",
    level: "Info",
  },
  {
    key: "10",
    time: "02:34:10",
    type: "TTS",
    component: "Speech Synthesis",
    engine: "ElevenLabs",
    event: "Audio generated",
    level: "Info",
  },
  {
    key: "11",
    time: "02:34:12",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Intent inferred",
    level: "Info",
  },
  {
    key: "12",
    time: "02:34:15",
    type: "STT",
    component: "Speech Recognition",
    engine: "Whisper v3",
    event: "Transcription completed",
    level: "Info",
  },
  {
    key: "13",
    time: "02:34:18",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Response generated",
    level: "Info",
  },
  {
    key: "14",
    time: "02:34:20",
    type: "TTS",
    component: "Speech Synthesis",
    engine: "ElevenLabs",
    event: "Audio generated",
    level: "Info",
  },
  {
    key: "15",
    time: "02:34:22",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Slot updated",
    level: "Info",
  },
  {
    key: "16",
    time: "02:34:25",
    type: "STT",
    component: "Speech Recognition",
    engine: "Whisper v3",
    event: "Low confidence",
    level: "Warning",
  },
  {
    key: "17",
    time: "02:34:28",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Clarification generated",
    level: "Info",
  },
  {
    key: "18",
    time: "02:34:30",
    type: "TTS",
    component: "Speech Synthesis",
    engine: "ElevenLabs",
    event: "Audio generated",
    level: "Info",
  },
  {
    key: "19",
    time: "02:34:33",
    type: "STT",
    component: "Speech Recognition",
    engine: "Whisper v3",
    event: "Transcription completed",
    level: "Info",
  },
  {
    key: "20",
    time: "02:34:35",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Response generated",
    level: "Info",
  },
  {
    key: "21",
    time: "02:34:38",
    type: "TTS",
    component: "Speech Synthesis",
    engine: "ElevenLabs",
    event: "Audio generated",
    level: "Info",
  },
  {
    key: "22",
    time: "02:34:40",
    type: "LLM",
    component: "Dialogue Engine",
    engine: "LiveKit",
    event: "Session completed",
    level: "Info",
  },
];

interface SessionDetailPageProps {
  params?: Promise<{ id: string }>;
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const resolvedParams = params ? use(params) : null;
  const sessionId = resolvedParams?.id || "SESS-2024-001";

  // State untuk pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // State untuk drawer
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventLog | null>(null);

  // Sample session data
  const sessionData = {
    sessionId: sessionId,
    startTime: "10:00:05 AM",
    user: "Ahmed",
    totalLatency: "4.2s",
  };

  useEffect(() => {
    dispatch(setSmallTitle("Session Detail"));
    document.title = `Session Detail - ${sessionId} | Zafar Labs`;
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "Zafar Labs";
    };
  }, [dispatch, sessionId]);

  // Handle export logs
  const handleExportLogs = () => {
    // Implementasi export logs
    console.log("Export logs");
  };

  // Handle reload page
  const handleReload = () => {
    window.location.reload();
  };

  // Handle buka drawer detail event
  const handleOpenDetailDrawer = (event: EventLog) => {
    setSelectedEvent(event);
    setDrawerVisible(true);
  };

  // Handle tutup drawer
  const handleCloseDetailDrawer = () => {
    setDrawerVisible(false);
    setSelectedEvent(null);
  };

  // Fungsi untuk mendapatkan style level tag
  const getLevelTagStyle = (level: EventLog["level"]) => {
    switch (level) {
      case "Info":
        return {
          backgroundColor: Colors.infoLight,
          color: Colors.info,
          borderColor: Colors.infoLight,
        };
      case "Warning":
        return {
          backgroundColor: Colors.warningLight,
          color: Colors.warning,
          borderColor: Colors.warningLight,
        };
      case "Error":
        return {
          backgroundColor: Colors.errorLight,
          color: Colors.error,
          borderColor: Colors.errorLight,
        };
      default:
        return {
          backgroundColor: Colors.backgroundGray,
          color: Colors.textSecondary,
          borderColor: Colors.borderLight,
        };
    }
  };

  // Kolom tabel
  const columns: ColumnsType<EventLog> = [
    {
      title: "TIME",
      dataIndex: "time",
      key: "time",
      width: 120,
      sorter: (a: EventLog, b: EventLog) => a.time.localeCompare(b.time),
      render: (text: string) => (
        <Text
          style={combineStyles(GlobalStyles.textSecondary, {
            fontSize: Typo.sm,
            color: Colors.textSecondary,
          })}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      width: 100,
      sorter: (a: EventLog, b: EventLog) => a.type.localeCompare(b.type),
      render: (type: EventLog["type"]) => (
        <Tag
          style={combineStyles(getRequestTagStyle(type), {
            padding: `${Spacing.xs}px ${Spacing.sm}px`,
            borderRadius: BorderRadius.md,
            fontWeight: Typo.semibold,
            fontSize: Typo.xs,
            backgroundColor: Colors.backgroundGray,
            color: Colors.textSecondary,
            border: `1px solid ${Colors.borderLight}`,
          })}
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "COMPONENT",
      dataIndex: "component",
      key: "component",
      width: 200,
      sorter: (a: EventLog, b: EventLog) => a.component.localeCompare(b.component),
      render: (text: string) => (
        <Text
          style={combineStyles(GlobalStyles.textSecondary, {
            fontSize: Typo.sm,
            color: Colors.textSecondary,
          })}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "ENGINE",
      dataIndex: "engine",
      key: "engine",
      width: 150,
      sorter: (a: EventLog, b: EventLog) => a.engine.localeCompare(b.engine),
      render: (text: string) => (
        <Text
          style={combineStyles(GlobalStyles.textSecondary, {
            fontSize: Typo.sm,
            color: Colors.textSecondary,
          })}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "EVENT",
      dataIndex: "event",
      key: "event",
      width: 250,
      sorter: (a: EventLog, b: EventLog) => a.event.localeCompare(b.event),
      render: (text: string) => (
        <Text
          style={combineStyles(GlobalStyles.textSecondary, {
            fontSize: Typo.sm,
            color: Colors.textSecondary,
          })}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "LEVEL",
      dataIndex: "level",
      key: "level",
      width: 120,
      sorter: (a: EventLog, b: EventLog) => a.level.localeCompare(b.level),
      render: (level: EventLog["level"]) => {
        const tagStyle = getLevelTagStyle(level);
        return (
          <Tag
            style={combineStyles({
              ...tagStyle,
              padding: `${Spacing.xs}px ${Spacing.sm}px`,
              borderRadius: BorderRadius.md,
              fontWeight: Typo.semibold,
              fontSize: Typo.xs,
              border: `1px solid ${tagStyle.borderColor}`,
            })}
          >
            {level}
          </Tag>
        );
      },
    },
    {
      title: "DETAIL",
      key: "detail",
      width: 100,
      align: "center" as const,
      render: (_, record: EventLog) => (
        <Button
          type="text"
          icon={<FileSearchOutlined />}
          onClick={() => handleOpenDetailDrawer(record)}
          style={{
            color: Colors.primary,
            fontSize: Typo.lg,
          }}
        />
      ),
    },
  ];

  return (
    <div style={GlobalStyles.container}>
      <Helmet>
        <title>Session Detail - {sessionId} | Zafar Labs</title>
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
        <div
          style={{
            padding: Spacing.lg,
            borderBottom: `1px solid ${Colors.borderLight}`,
          }}
        >
          <Row justify="space-between" align="middle" style={{ marginBottom: Spacing.md }}>
            <Col>
              <Title
                level={2}
                style={combineStyles(GlobalStyles.heading2, {
                  margin: 0,
                  fontSize: Typo.xxl,
                  fontWeight: Typo.bold,
                })}
              >
                Session #{sessionData.sessionId}
              </Title>
            </Col>
            <Col>
              <Space size={Spacing.md}>
                <Button
                  icon={<ExportOutlined />}
                  onClick={handleExportLogs}
                  style={{
                    borderRadius: BorderRadius.md,
                    fontWeight: Typo.semibold,
                  }}
                >
                  Export Logs
                </Button>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={handleReload}
                  style={combineStyles(GlobalStyles.buttonPrimary, {
                    borderRadius: BorderRadius.md,
                    fontWeight: Typo.semibold,
                  })}
                >
                  Reload page
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Session Metadata */}
          <Row gutter={[Spacing.xl, Spacing.sm]}>
            <Col>
              <Space size={Spacing.sm}>
                <ClockCircleOutlined style={{ color: Colors.textMuted, fontSize: Typo.base }} />
                <Text style={combineStyles(GlobalStyles.textMuted, {
                  fontSize: Typo.sm,
                })}>
                  Started {sessionData.startTime}
                </Text>
              </Space>
            </Col>
            <Col>
              <Space size={Spacing.sm}>
                <UserOutlined style={{ color: Colors.textMuted, fontSize: Typo.base }} />
                <Text style={combineStyles(GlobalStyles.textMuted, {
                  fontSize: Typo.sm,
                })}>
                  User: {sessionData.user}
                </Text>
              </Space>
            </Col>
            <Col>
              <Space size={Spacing.sm}>
                <DashboardOutlined style={{ color: Colors.textMuted, fontSize: Typo.base }} />
                <Text style={combineStyles(GlobalStyles.textMuted, {
                  fontSize: Typo.sm,
                })}>
                  Total Latency: {sessionData.totalLatency}
                </Text>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={sampleEventLogs.slice(
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

        {/* Pagination */}
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
                  {Math.min(currentPage * pageSize, sampleEventLogs.length)}
                </Text>{" "}
                of{" "}
                <Text strong style={{ color: Colors.primary }}>
                  {sampleEventLogs.length}
                </Text>{" "}
                entries
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
                      suffixIcon={
                        <DownOutlined
                          style={{ color: Colors.textMuted, fontSize: Typo.md }}
                        />
                      }
                      options={[
                        { value: "10", label: "10" },
                        { value: "20", label: "20" },
                        { value: "50", label: "50" },
                      ]}
                    />
                  </Space>
                </Col>
                <Col>
                  <Space size={Spacing.xs}>
                    <Button
                      type="text"
                      icon={<LeftOutlined />}
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
                    >
                      Prev
                    </Button>
                    {(() => {
                      const totalPages = Math.ceil(sampleEventLogs.length / pageSize);
                      const pages: (number | string)[] = [];

                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        pages.push(1);
                        if (currentPage > 3) {
                          pages.push("ellipsis-start");
                        }
                        const start = Math.max(2, currentPage - 1);
                        const end = Math.min(totalPages - 1, currentPage + 1);
                        for (let i = start; i <= end; i++) {
                          if (i !== 1 && i !== totalPages) {
                            pages.push(i);
                          }
                        }
                        if (currentPage < totalPages - 2) {
                          pages.push("ellipsis-end");
                        }
                        pages.push(totalPages);
                      }

                      return pages.map((page, index) => {
                        if (page === "ellipsis-start" || page === "ellipsis-end") {
                          return (
                            <Text
                              key={`ellipsis-${index}`}
                              style={combineStyles(GlobalStyles.textMuted, {
                                padding: `0 ${Spacing.sm}px`,
                              })}
                            >
                              ...
                            </Text>
                          );
                        }
                        return (
                          <Button
                            key={page}
                            type={currentPage === page ? "primary" : "text"}
                            onClick={() => setCurrentPage(page as number)}
                            style={
                              currentPage === page
                                ? combineStyles({
                                    width: 36,
                                    height: 36,
                                    borderRadius: BorderRadius.md,
                                    backgroundColor: Colors.info,
                                    borderColor: Colors.info,
                                    fontWeight: Typo.bold,
                                    boxShadow: Shadows.primary,
                                  })
                                : combineStyles({
                                    width: 36,
                                    height: 36,
                                    borderRadius: BorderRadius.md,
                                    fontWeight: Typo.bold,
                                    color: Colors.textSecondary,
                                  })
                            }
                          >
                            {page}
                          </Button>
                        );
                      });
                    })()}
                    <Button
                      type="text"
                      icon={<RightOutlined />}
                      onClick={() =>
                        setCurrentPage(
                          Math.min(
                            Math.ceil(sampleEventLogs.length / pageSize),
                            currentPage + 1
                          )
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(sampleEventLogs.length / pageSize)
                      }
                      style={{
                        color:
                          currentPage >=
                          Math.ceil(sampleEventLogs.length / pageSize)
                            ? Colors.borderDark
                            : Colors.textMuted,
                      }}
                    >
                      Next
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Detail Event Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Space>
              <ReloadOutlined style={{ fontSize: Typo.lg, color: Colors.info }} />
              <Title
                level={4}
                style={combineStyles(GlobalStyles.heading4, {
                  margin: 0,
                  fontSize: Typo.lg,
                  fontWeight: Typo.bold,
                  color: Colors.textPrimary,
                })}
              >
                Detail Event
              </Title>
            </Space>
            <Button
              type="text"
              icon={<MoreOutlined />}
              style={{ color: Colors.textMuted }}
            />
          </div>
        }
        placement="right"
        onClose={handleCloseDetailDrawer}
        open={drawerVisible}
        width={350}
        styles={{
          body: {
            padding: Spacing.lg,
            backgroundColor: "#F8F7F9",
          },
          header: {
            backgroundColor: "#F8F7F9",
            borderBottom: `1px solid ${Colors.borderLight}`,
          },
        }}
      >
        {selectedEvent && (
          <Space direction="vertical" size={Spacing.xl} style={{ width: "100%" }}>
            {/* STT Event Detail Section */}
            <div>
              <Title
                level={5}
                style={combineStyles(GlobalStyles.heading5, {
                  marginBottom: Spacing.md,
                  fontSize: Typo.xxl,
                  fontWeight: Typo.extrabold,
                  color: Colors.textPrimary,
                  textAlign: "center",
                })}
              >
                {selectedEvent.type} Event Detail
              </Title>
              <Space direction="vertical" size={Spacing.sm} style={{ width: "100%" }}>
                <Space size={Spacing.sm}>
                  <ClockCircleOutlined style={{ color: Colors.textMuted, fontSize: Typo.base }} />
                  <Text style={combineStyles(GlobalStyles.textMuted, {
                    fontSize: Typo.sm,
                  })}>
                    {selectedEvent.time}
                  </Text>
                </Space>
                <Space size={Spacing.sm}>
                  <UserOutlined style={{ color: Colors.textMuted, fontSize: Typo.base }} />
                  <Text style={combineStyles(GlobalStyles.textMuted, {
                    fontSize: Typo.sm,
                  })}>
                    {selectedEvent.engine}
                  </Text>
                </Space>
                <Space size={Spacing.sm}>
                  <LinkOutlined style={{ color: Colors.textMuted, fontSize: Typo.base }} />
                  <Text style={combineStyles(GlobalStyles.textMuted, {
                    fontSize: Typo.sm,
                  })}>
                    {sessionData.sessionId}
                  </Text>
                </Space>
              </Space>
            </div>

            {/* Data History Section */}
            <div>
              <Space style={{ marginBottom: Spacing.md }}>
                <ThunderboltOutlined style={{ fontSize: Typo.lg, color: Colors.info }} />
                <Title
                  level={5}
                  style={combineStyles(GlobalStyles.heading5, {
                    margin: 0,
                    fontSize: Typo.lg,
                    fontWeight: Typo.bold,
                    color: Colors.textPrimary,
                  })}
                >
                  Data History
                </Title>
              </Space>

              <Card
                style={combineStyles({
                  backgroundColor: "#F0F0F0",
                  borderRadius: BorderRadius.md,
                  border: "none",
                  padding: Spacing.md,
                  marginBottom: Spacing.md,
                })}
              >
                <Space direction="vertical" size={Spacing.md} style={{ width: "100%" }}>
                  {/* Agent Information and Feedback Tags */}
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text style={combineStyles(GlobalStyles.textSecondary, {
                        fontSize: Typo.base,
                        fontWeight: Typo.medium,
                        color: Colors.textPrimary,
                      })}>
                        Agent - (00:30)
                      </Text>
                    </Col>
                    <Col>
                      <Space size={Spacing.xs}>
                        <Tag
                          icon={<DislikeOutlined />}
                          style={combineStyles({
                            padding: `${Spacing.xs}px ${Spacing.sm}px`,
                            borderRadius: BorderRadius.md,
                            backgroundColor: Colors.backgroundGray,
                            color: Colors.textSecondary,
                            border: `1px solid ${Colors.borderLight}`,
                            fontSize: Typo.sm,
                            fontWeight: Typo.medium,
                            margin: 0,
                          })}
                        >
                          Incorrect
                        </Tag>
                        <Tag
                          icon={<LikeOutlined />}
                          style={combineStyles({
                            padding: `${Spacing.xs}px ${Spacing.sm}px`,
                            borderRadius: BorderRadius.md,
                            backgroundColor: Colors.backgroundGray,
                            color: Colors.textSecondary,
                            border: `1px solid ${Colors.borderLight}`,
                            fontSize: Typo.sm,
                            fontWeight: Typo.medium,
                            margin: 0,
                          })}
                        >
                          Accuracy
                        </Tag>
                      </Space>
                    </Col>
                  </Row>

                  {/* Audio Player */}
                  <Space style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      style={combineStyles(GlobalStyles.buttonPrimary, {
                        borderRadius: BorderRadius.full,
                        width: 40,
                        height: 40,
                        minWidth: 40,
                      })}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: 40,
                        backgroundColor: Colors.background,
                        borderRadius: BorderRadius.md,
                        display: "flex",
                        alignItems: "center",
                        padding: `0 ${Spacing.sm}px`,
                        border: `1px solid ${Colors.borderLight}`,
                      }}
                    >
                      {/* Waveform visualization */}
                      <div
                        style={{
                          width: "100%",
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: 2,
                              height: Math.random() * 15 + 5,
                              backgroundColor: Colors.primary,
                              borderRadius: BorderRadius.xs,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <Text style={combineStyles(GlobalStyles.textMuted, {
                      fontSize: Typo.sm,
                      minWidth: 35,
                    })}>
                      1:23
                    </Text>
                    <Text style={combineStyles(GlobalStyles.textMuted, {
                      fontSize: Typo.sm,
                      minWidth: 45,
                    })}>
                      0.75x
                    </Text>
                  </Space>

                  {/* Conversion Result */}
                  <div>
                    <Text
                      strong
                      style={combineStyles(GlobalStyles.textPrimary, {
                        display: "block",
                        marginBottom: Spacing.sm,
                        fontSize: Typo.sm,
                        fontWeight: Typo.semibold,
                        color: Colors.textPrimary,
                      })}
                    >
                      Conversion result
                    </Text>
                    <TextArea
                      value="Good morning, this is the vehicle license extension service. How can I help you?"
                      readOnly
                      rows={3}
                      style={combineStyles({
                        borderRadius: BorderRadius.md,
                        fontSize: Typo.sm,
                        backgroundColor: Colors.background,
                        border: `1px solid ${Colors.borderLight}`,
                        color: Colors.textPrimary,
                      })}
                    />
                  </div>
                </Space>
              </Card>
            </div>

            {/* Final Rating Section */}
            <div>
              <Space style={{ marginBottom: Spacing.md }}>
                <ThunderboltOutlined style={{ fontSize: Typo.lg, color: Colors.info }} />
                <Title
                  level={5}
                  style={combineStyles(GlobalStyles.heading5, {
                    margin: 0,
                    fontSize: Typo.lg,
                    fontWeight: Typo.bold,
                    color: Colors.textPrimary,
                  })}
                >
                  Final Rating
                </Title>
                <Space align="center" style={{ marginLeft: "auto" }}>
                  <Text
                    style={combineStyles(GlobalStyles.textPrimary, {
                      fontSize: Typo.xxxl,
                      fontWeight: Typo.extrabold,
                      color: Colors.textPrimary,
                    })}
                  >
                    4.5
                  </Text>
                  <Rate
                    value={4.5}
                    allowHalf
                    disabled
                    style={{ fontSize: Typo.lg }}
                  />
                </Space>
              </Space>

              <Space direction="vertical" size={Spacing.lg} style={{ width: "100%" }}>
                {/* Individual Evaluation Criteria */}
                {/* Conversion result */}
                <div>
                  <Text
                    strong
                    style={combineStyles(GlobalStyles.textPrimary, {
                      display: "block",
                      marginBottom: Spacing.xs,
                      fontSize: Typo.base,
                      fontWeight: Typo.semibold,
                      color: Colors.textPrimary,
                    })}
                  >
                    Conversion result
                  </Text>
                  <Text
                    style={combineStyles(GlobalStyles.textMuted, {
                      display: "block",
                      marginBottom: Spacing.sm,
                      fontSize: Typo.sm,
                      lineHeight: Typo.lineHeightRelaxed,
                      color: Colors.textMuted,
                    })}
                  >
                    Did the AI understand the user's intent correctly? Was the answer factually accurate and contextually appropriate?
                  </Text>
                  <Space>
                    <Text style={combineStyles(GlobalStyles.textMuted, {
                      fontSize: Typo.sm,
                    })}>
                      Overall Rating :
                    </Text>
                    <Rate
                      value={4.5}
                      allowHalf
                      disabled
                      style={{ fontSize: Typo.lg }}
                    />
                  </Space>
                </div>

                {/* Relevance & Coherence */}
                <div>
                  <Text
                    strong
                    style={combineStyles(GlobalStyles.textPrimary, {
                      display: "block",
                      marginBottom: Spacing.xs,
                      fontSize: Typo.base,
                      fontWeight: Typo.semibold,
                      color: Colors.textPrimary,
                    })}
                  >
                    Relevance & Coherence
                  </Text>
                  <Text
                    style={combineStyles(GlobalStyles.textMuted, {
                      display: "block",
                      marginBottom: Spacing.sm,
                      fontSize: Typo.sm,
                      lineHeight: Typo.lineHeightRelaxed,
                      color: Colors.textMuted,
                    })}
                  >
                    Was the AI's response relevant to the user's request? Did the answer flow logically and remain consistent throughout?
                  </Text>
                  <Space>
                    <Text style={combineStyles(GlobalStyles.textMuted, {
                      fontSize: Typo.sm,
                    })}>
                      Overall Rating :
                    </Text>
                    <Rate
                      value={4.5}
                      allowHalf
                      disabled
                      style={{ fontSize: Typo.lg }}
                    />
                  </Space>
                </div>

                {/* Tone & Politeness */}
                <div>
                  <Text
                    strong
                    style={combineStyles(GlobalStyles.textPrimary, {
                      display: "block",
                      marginBottom: Spacing.xs,
                      fontSize: Typo.base,
                      fontWeight: Typo.semibold,
                      color: Colors.textPrimary,
                    })}
                  >
                    Tone & Politeness
                  </Text>
                  <Text
                    style={combineStyles(GlobalStyles.textMuted, {
                      display: "block",
                      marginBottom: Spacing.sm,
                      fontSize: Typo.sm,
                      lineHeight: Typo.lineHeightRelaxed,
                      color: Colors.textMuted,
                    })}
                  >
                    Was the AI's tone appropriate and respectful? Did the response feel professional and helpful?
                  </Text>
                  <Space>
                    <Text style={combineStyles(GlobalStyles.textMuted, {
                      fontSize: Typo.sm,
                    })}>
                      Overall Rating :
                    </Text>
                    <Rate
                      value={4.5}
                      allowHalf
                      disabled
                      style={{ fontSize: Typo.lg }}
                    />
                  </Space>
                </div>

                {/* Resolution Effectiveness */}
                <div>
                  <Text
                    strong
                    style={combineStyles(GlobalStyles.textPrimary, {
                      display: "block",
                      marginBottom: Spacing.xs,
                      fontSize: Typo.base,
                      fontWeight: Typo.semibold,
                      color: Colors.textPrimary,
                    })}
                  >
                    Resolution Effectiveness
                  </Text>
                  <Text
                    style={combineStyles(GlobalStyles.textMuted, {
                      display: "block",
                      marginBottom: Spacing.sm,
                      fontSize: Typo.sm,
                      lineHeight: Typo.lineHeightRelaxed,
                      color: Colors.textMuted,
                    })}
                  >
                    Did the response effectively address the user's need or problem? Was the solution clear and actionable?
                  </Text>
                  <Space>
                    <Text style={combineStyles(GlobalStyles.textMuted, {
                      fontSize: Typo.sm,
                    })}>
                      Overall Rating :
                    </Text>
                    <Rate
                      value={4.5}
                      allowHalf
                      disabled
                      style={{ fontSize: Typo.lg }}
                    />
                  </Space>
                </div>
              </Space>
            </div>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
