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
  Modal,
  Input,
  Rate,
  App,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Type definitions
type MetadataValue = string | number | boolean | string[] | null | undefined;

interface AIRequest {
  key: string;
  requestId: string;
  type: "STT" | "LLM" | "TTS";
  input: string;
  output: string;
  latency: number; // dalam milliseconds
  requestMetadata: Record<string, MetadataValue>;
  responseMetadata: Record<string, MetadataValue>;
}

// Sample data
const sampleAIRequests: AIRequest[] = [
  {
    key: "1",
    requestId: "REQ-001",
    type: "STT",
    input: "User audio input: 'Hello, I need help with my account'",
    output: "Transcribed text: 'Hello, I need help with my account'",
    latency: 245,
    requestMetadata: {
      audioFormat: "wav",
      sampleRate: 16000,
      duration: 2.5,
      language: "en-US",
    },
    responseMetadata: {
      confidence: 0.95,
      alternatives: ["Hello, I need help with my account"],
      processingTime: 245,
    },
  },
  {
    key: "2",
    requestId: "REQ-002",
    type: "LLM",
    input: "User query: 'I need help with my account'",
    output: "AI Response: 'I'd be happy to help you with your account. Could you please provide your account number or email address?'",
    latency: 1234,
    requestMetadata: {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 500,
      context: "customer_service",
    },
    responseMetadata: {
      tokensUsed: 45,
      finishReason: "stop",
      modelVersion: "gpt-4-0613",
    },
  },
  {
    key: "3",
    requestId: "REQ-003",
    type: "TTS",
    input: "Text to convert: 'I'd be happy to help you with your account. Could you please provide your account number or email address?'",
    output: "Audio output generated successfully",
    latency: 567,
    requestMetadata: {
      voice: "en-US-Neural2-A",
      speed: 1.0,
      pitch: 0,
    },
    responseMetadata: {
      audioFormat: "mp3",
      duration: 4.2,
      fileSize: 67200,
    },
  },
  {
    key: "4",
    requestId: "REQ-004",
    type: "STT",
    input: "User audio input: 'My email is john@example.com'",
    output: "Transcribed text: 'My email is john@example.com'",
    latency: 198,
    requestMetadata: {
      audioFormat: "wav",
      sampleRate: 16000,
      duration: 2.1,
      language: "en-US",
    },
    responseMetadata: {
      confidence: 0.98,
      alternatives: ["My email is john@example.com"],
      processingTime: 198,
    },
  },
  {
    key: "5",
    requestId: "REQ-005",
    type: "LLM",
    input: "User query: 'My email is john@example.com'",
    output: "AI Response: 'Thank you. I found your account. How can I assist you today?'",
    latency: 987,
    requestMetadata: {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 500,
      context: "customer_service",
    },
    responseMetadata: {
      tokensUsed: 38,
      finishReason: "stop",
      modelVersion: "gpt-4-0613",
    },
  },
  {
    key: "6",
    requestId: "REQ-006",
    type: "TTS",
    input: "Text to convert: 'Thank you. I found your account. How can I assist you today?'",
    output: "Audio output generated successfully",
    latency: 523,
    requestMetadata: {
      voice: "en-US-Neural2-A",
      speed: 1.0,
      pitch: 0,
    },
    responseMetadata: {
      audioFormat: "mp3",
      duration: 3.8,
      fileSize: 60800,
    },
  },
];

// Fungsi untuk mendapatkan color badge berdasarkan type
const getTypeColor = (type: string) => {
  switch (type) {
    case "STT":
      return "blue";
    case "LLM":
      return "purple";
    case "TTS":
      return "green";
    default:
      return "default";
  }
};

interface SessionDetailPageProps {
  params?: Promise<{ id: string }>;
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { message } = App.useApp();
  const resolvedParams = params ? use(params) : null;
  const sessionId = resolvedParams?.id || "SESS-2024-001";

  // State untuk form rating
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [metadataModalVisible, setMetadataModalVisible] = useState(false);
  const [metadataContent, setMetadataContent] = useState<{
    title: string;
    data: Record<string, MetadataValue>;
  } | null>(null);

  useEffect(() => {
    dispatch(setSmallTitle("Session Detail"));
    document.title = `Session Detail - ${sessionId} | AI Call Center`;
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Call Center";
    };
  }, [dispatch, sessionId]);

  // Handle view metadata
  const handleViewMetadata = (type: "request" | "response", record: AIRequest) => {
    const data = type === "request" ? record.requestMetadata : record.responseMetadata;
    setMetadataContent({
      title: `${type === "request" ? "Request" : "Response"} Metadata - ${record.requestId}`,
      data,
    });
    setMetadataModalVisible(true);
  };

  // Handle submit rating
  const handleSubmitRating = () => {
    if (!selectedRequestId) {
      message.warning("Pilih request terlebih dahulu untuk memberikan rating");
      return;
    }
    if (rating === 0) {
      message.warning("Berikan rating terlebih dahulu");
      return;
    }
    message.success(`Rating berhasil disubmit untuk request ${selectedRequestId}`);
    setRating(0);
    setNotes("");
    setSelectedRequestId(null);
  };

  // Handle select request untuk rating
  const handleSelectRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  // Kolom tabel
  const columns: ColumnsType<AIRequest> = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
      width: 120,
      render: (text: string, record: AIRequest) => (
        <Button
          type="link"
          onClick={() => handleSelectRequest(record.requestId)}
          style={{
            fontWeight: 600,
            color: selectedRequestId === record.requestId ? "#2563EB" : "#1e293b",
            padding: 0,
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag
          color={getTypeColor(type)}
          style={{
            padding: "4px 12px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 11,
            textTransform: "uppercase",
          }}
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Input",
      dataIndex: "input",
      key: "input",
      width: 300,
      ellipsis: true,
      render: (text: string) => (
        <Text
          style={{
            color: "#64748b",
            fontSize: 12,
            display: "block",
            maxWidth: 300,
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Output",
      dataIndex: "output",
      key: "output",
      width: 300,
      ellipsis: true,
      render: (text: string) => (
        <Text
          style={{
            color: "#64748b",
            fontSize: 12,
            display: "block",
            maxWidth: 300,
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Latency",
      dataIndex: "latency",
      key: "latency",
      width: 120,
      render: (latency: number) => (
        <Tag
          color={latency < 500 ? "green" : latency < 1000 ? "orange" : "red"}
          style={{
            padding: "4px 12px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 11,
          }}
        >
          {latency}ms
        </Tag>
      ),
    },
    {
      title: "Metadata",
      key: "metadata",
      width: 200,
      render: (_, record: AIRequest) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewMetadata("request", record)}
            style={{ padding: 0, fontSize: 12 }}
          >
            Request
          </Button>
          <Divider type="vertical" style={{ margin: "0 4px" }} />
          <Button
            type="link"
            size="small"
            onClick={() => handleViewMetadata("response", record)}
            style={{ padding: 0, fontSize: 12 }}
          >
            Response
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Helmet>
        <title>Session Detail - {sessionId} | AI Call Center</title>
      </Helmet>

      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space size={16}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/evaluation")}
              style={{ borderRadius: 8 }}
            >
              Back
            </Button>
            <div>
              <Title level={2} style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                Session Detail
              </Title>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                Session ID: {sessionId}
              </Text>
            </div>
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Left Content - AI Requests Table */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              border: "none",
            }}
          >
            <Title level={4} style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
              AI Requests
            </Title>
            <Table
              columns={columns}
              dataSource={sampleAIRequests}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} requests`,
                style: { marginTop: 16 },
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>

        {/* Right Sidebar - Rating Form */}
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              border: "none",
              position: "sticky",
              top: 100,
            }}
          >
            <Title level={4} style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
              Rating & Evaluation
            </Title>

            {selectedRequestId ? (
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                <div>
                  <Text strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
                    Selected Request
                  </Text>
                  <Tag
                    color="blue"
                    style={{
                      padding: "4px 12px",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {selectedRequestId}
                  </Tag>
                </div>

                <div>
                  <Text strong style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
                    Rating
                  </Text>
                  <Rate
                    value={rating}
                    onChange={setRating}
                    style={{ fontSize: 24 }}
                  />
                  {rating > 0 && (
                    <Text style={{ display: "block", marginTop: 8, color: "#64748b", fontSize: 12 }}>
                      {rating === 1 && "Sangat Buruk"}
                      {rating === 2 && "Buruk"}
                      {rating === 3 && "Cukup"}
                      {rating === 4 && "Baik"}
                      {rating === 5 && "Sangat Baik"}
                    </Text>
                  )}
                </div>

                <div>
                  <Text strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
                    Notes
                  </Text>
                  <TextArea
                    placeholder="Masukkan catatan evaluasi..."
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  />
                </div>

                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  block
                  size="large"
                  onClick={handleSubmitRating}
                  style={{
                    height: 48,
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  Submit Rating
                </Button>

                <Button
                  block
                  onClick={() => {
                    setSelectedRequestId(null);
                    setRating(0);
                    setNotes("");
                  }}
                  style={{
                    height: 40,
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Clear Selection
                </Button>
              </Space>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <StarOutlined
                  style={{
                    fontSize: 48,
                    color: "#cbd5e1",
                    marginBottom: 16,
                  }}
                />
                <Text
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: 14,
                    marginBottom: 8,
                  }}
                >
                  Pilih request dari tabel untuk memberikan rating
                </Text>
                <Text
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    fontSize: 12,
                  }}
                >
                  Klik pada Request ID untuk memilih
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Metadata Modal */}
      <Modal
        title={metadataContent?.title || "Metadata"}
        open={metadataModalVisible}
        onCancel={() => setMetadataModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setMetadataModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        <pre
          style={{
            backgroundColor: "#f8fafc",
            padding: 16,
            borderRadius: 8,
            overflow: "auto",
            maxHeight: 400,
            fontSize: 12,
            fontFamily: "monospace",
          }}
        >
          {JSON.stringify(metadataContent?.data || {}, null, 2)}
        </pre>
      </Modal>
    </div>
  );
}
