import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";
import {
  Typography,
  Button,
  Space,
  Row,
  Col,
  Card,
  Tag,
  Input,
  Progress,
  Table,
  Select,
  Slider,
  Dropdown,
} from "antd";
import {
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  SearchOutlined,
  RobotOutlined,
  TruckOutlined,
  SoundOutlined,
  DatabaseOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  MoreOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  CloseOutlined,
  FastForwardOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";

const { Title, Text } = Typography;
const { Option } = Select;

// Type definitions
interface Innovation {
  key: string;
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  department: string;
  aiScore: number;
  recommendation: "Fast Track" | "Proceed" | "Drop";
  similarity: number;
  status: "Under Review" | "Approved" | "New" | "In Progress";
}

const innovations: Innovation[] = [
  {
    key: "1",
    id: "1",
    icon: <TruckOutlined />,
    iconBg: "#F0F2FF",
    iconColor: "#5C6BC0",
    title: "Automated Supply Chain Opt.",
    description: "Using predictive algorithms to reduce shipping...",
    department: "Logistics",
    aiScore: 92,
    recommendation: "Fast Track",
    similarity: 12,
    status: "Under Review",
  },
  {
    key: "2",
    id: "2",
    icon: <SoundOutlined />,
    iconBg: "#FFF0F5",
    iconColor: "#EC407A",
    title: "Customer Sentiment Analysis V2",
    description: "Real-time sentiment tracking on social channels.",
    department: "Marketing",
    aiScore: 78,
    recommendation: "Proceed",
    similarity: 4,
    status: "Approved",
  },
  {
    key: "3",
    id: "3",
    icon: <DatabaseOutlined />,
    iconBg: "#F5F7F9",
    iconColor: "#78909C",
    title: "Legacy System Patch 2.0",
    description: "Minor update to existing CRM database structure.",
    department: "IT",
    aiScore: 45,
    recommendation: "Drop",
    similarity: 95,
    status: "New",
  },
  {
    key: "4",
    id: "4",
    icon: <ReloadOutlined />,
    iconBg: "#FFF3E0",
    iconColor: "#FB8C00",
    title: "Predictive Maintenance Protocol",
    description: "Machine learning model for factory floor equipment.",
    department: "Operations",
    aiScore: 85,
    recommendation: "Fast Track",
    similarity: 8,
    status: "In Progress",
  },
  {
    key: "5",
    id: "5",
    icon: <ThunderboltOutlined />,
    iconBg: "#E8F5E9",
    iconColor: "#43A047",
    title: "Green Energy Data Hub",
    description: "Centralizing energy consumption metrics for ESG...",
    department: "Sustainability",
    aiScore: 89,
    recommendation: "Fast Track",
    similarity: 2,
    status: "New",
  },
];

// Components
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

const RecBadge: React.FC<{ type: Innovation["recommendation"] }> = ({ type }) => {
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

const StatusBadge: React.FC<{ status: Innovation["status"] }> = ({ status }) => {
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

export default function InnovationsPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSmallTitle("Innovations"));
    document.title = "Innovations | AI Innovation Scoring Dashboard";
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Innovation Scoring Dashboard";
    };
  }, [dispatch]);

  const columns = [
    {
      title: "INNOVATION DETAILS",
      dataIndex: "title",
      key: "title",
      width: "40%",
      sorter: (a: Innovation, b: Innovation) => a.title.localeCompare(b.title),
      render: (_: string, record: Innovation) => (
        <div>
          <Title level={5} style={{ margin: 0, marginBottom: 4, fontSize: 14, fontWeight: 700 }}>
            {record.title}
          </Title>
          <Text style={{ fontSize: 12, color: "#9ca3af" }}>{record.description}</Text>
        </div>
      ),
    },
    {
      title: "DEPARTMENT",
      dataIndex: "department",
      key: "department",
      sorter: (a: Innovation, b: Innovation) => a.department.localeCompare(b.department),
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
      sorter: (a: Innovation, b: Innovation) => a.aiScore - b.aiScore,
      render: (score: number) => <ProgressBar value={score} />,
    },
    {
      title: "REC.",
      dataIndex: "recommendation",
      key: "recommendation",
      sorter: (a: Innovation, b: Innovation) => a.recommendation.localeCompare(b.recommendation),
      render: (rec: Innovation["recommendation"]) => <RecBadge type={rec} />,
    },
    {
      title: "SIMILARITY",
      dataIndex: "similarity",
      key: "similarity",
      align: "center" as const,
      sorter: (a: Innovation, b: Innovation) => a.similarity - b.similarity,
      render: (similarity: number) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {similarity > 50 ? (
            <WarningOutlined style={{ fontSize: 14, color: "#FA8C16" }} />
          ) : (
            <CheckCircleOutlined style={{ fontSize: 14, color: "#52c41a" }} />
          )}
          <Text style={{ fontSize: 12, fontWeight: 700, color: "#595959" }}>{similarity}%</Text>
        </div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      sorter: (a: Innovation, b: Innovation) => a.status.localeCompare(b.status),
      render: (status: Innovation["status"]) => <StatusBadge status={status} />,
    },
    {
      title: "ACTION",
      key: "action",
      align: "center" as const,
      fixed: "right" as const,
      width: 80,
      render: (_: any, record: Innovation) => {
        const menu = {
          onClick: (info: { key: string; domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> }) => {
            info.domEvent.stopPropagation();
            // Handle menu actions here
            if (info.key === "preview") {
              navigate(`/detail/${record.id}`);
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

  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <title>Innovations | AI Innovation Scoring Dashboard</title>
      </Helmet>

      <div>
        {/* Top Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 40 }}>
          <Col>
            <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 800, color: "#0F172A" }}>
              Innovations
            </Title>
            <Text style={{ color: "#64748B", marginTop: 4, display: "block", fontWeight: 500 }}>
              All submitted ideas evaluated by AI agents
            </Text>
          </Col>
          <Col>
            <Space size={12}>
              <Button
                icon={<FilterOutlined />}
                style={{
                  borderRadius: 12,
                  height: 40,
                  fontWeight: 700,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                Filter
              </Button>
              <Button
                icon={<SortAscendingOutlined />}
                style={{
                  borderRadius: 12,
                  height: 40,
                  fontWeight: 700,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                Sort
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  borderRadius: 12,
                  height: 40,
                  fontWeight: 700,
                  backgroundColor: "#2563EB",
                  borderColor: "#2563EB",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                }}
              >
                New Innovation
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Filter Bar */}
        <Card
          style={{
            borderRadius: 24,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            border: "1px solid #f0f0f0",
            marginBottom: 24,
          }}
          bodyStyle={{ padding: 24 }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={24} md={12} lg={8} flex={1}>
              <Input
                prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
                placeholder="Search by keyword, ID, or submitte"
                style={{
                  borderRadius: 12,
                  height: 40,
                  backgroundColor: "#F5F7F9",
                  border: "transparent",
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                defaultValue="All Departments"
                style={{
                  width: "100%",
                  minWidth: 160,
                  height: 40,
                }}
                suffixIcon={<DownOutlined style={{ fontSize: 16, color: "#9ca3af" }} />}
                className="filter-select"
              >
                <Option value="All Departments">All Departments</Option>
                <Option value="Logistics">Logistics</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="IT">IT</Option>
                <Option value="Operations">Operations</Option>
                <Option value="Sustainability">Sustainability</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                defaultValue="Status: All"
                style={{
                  width: "100%",
                  minWidth: 160,
                  height: 40,
                }}
                suffixIcon={<DownOutlined style={{ fontSize: 16, color: "#9ca3af" }} />}
                className="filter-select"
              >
                <Option value="Status: All">Status: All</Option>
                <Option value="Under Review">Under Review</Option>
                <Option value="Approved">Approved</Option>
                <Option value="New">New</Option>
                <Option value="In Progress">In Progress</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                defaultValue="AI Rec: Any"
                style={{
                  width: "100%",
                  minWidth: 160,
                  height: 40,
                }}
                suffixIcon={<DownOutlined style={{ fontSize: 16, color: "#9ca3af" }} />}
                className="filter-select"
                placeholder={
                  <Space size={8}>
                    <RobotOutlined style={{ fontSize: 16, color: "#595959" }} />
                    <span>AI Rec: Any</span>
                  </Space>
                }
              >
                <Option value="AI Rec: Any">
                  <Space size={8}>
                    <RobotOutlined style={{ fontSize: 16, color: "#595959" }} />
                    <span>AI Rec: Any</span>
                  </Space>
                </Option>
                <Option value="Fast Track">Fast Track</Option>
                <Option value="Proceed">Proceed</Option>
                <Option value="Drop">Drop</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={12} lg={0} flex={1}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>
                  <span>Score</span>
                  <span>50 - 100</span>
                </div>
                <Slider
                  range
                  defaultValue={[50, 100]}
                  min={0}
                  max={100}
                  style={{ margin: 0 }}
                />
              </div>
            </Col>
          </Row>
          
          {/* Score Slider for Desktop */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={0} lg={24}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ height: 1, flex: 1, backgroundColor: "#e5e7eb", marginRight: 16 }} />
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>
                    <span>Score</span>
                    <span>50 - 100</span>
                  </div>
                  <Slider
                    range
                    defaultValue={[50, 100]}
                    min={0}
                    max={100}
                    style={{ margin: 0 }}
                    trackStyle={[{ backgroundColor: "#2563EB" }]}
                    handleStyle={[
                      { borderColor: "#2563EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" },
                      { borderColor: "#2563EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" },
                    ]}
                  />
                </div>
              </div>
            </Col>
          </Row>

          {/* Active Filters */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #f5f5f5" }}>
            <Row align="middle" gutter={[16, 8]}>
              <Col>
                <Text style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>
                  Active Filters:
                </Text>
              </Col>
              <Col>
                <Space size={8} wrap>
                  <Tag
                    closable
                    onClose={(e) => e.preventDefault()}
                    style={{
                      backgroundColor: "#F0F4FF",
                      color: "#2563EB",
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 12,
                      border: "1px solid #D1DBFF",
                      padding: "4px 12px",
                    }}
                  >
                    Score: &gt; 80
                  </Tag>
                  <Tag
                    closable
                    onClose={(e) => e.preventDefault()}
                    style={{
                      backgroundColor: "#F0F4FF",
                      color: "#2563EB",
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 12,
                      border: "1px solid #D1DBFF",
                      padding: "4px 12px",
                    }}
                  >
                    Dept: Logistics
                  </Tag>
                  <Button type="link" style={{ fontSize: 11, fontWeight: 700, padding: 0, height: "auto" }}>
                    Clear All
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Table */}
        <Card
          style={{
            borderRadius: 24,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            border: "1px solid #f0f0f0",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            dataSource={innovations}
            columns={columns}
            pagination={false}
            style={{ borderRadius: 24 }}
            scroll={{ x: "max-content" }}
            components={{
              header: {
                cell: (props: any) => (
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
                navigate("/detail");
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
                  <Text strong style={{ color: "#262626" }}>5</Text> of{" "}
                  <Text strong style={{ color: "#262626" }}>128</Text> results
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
                        dropdownStyle={{
                          borderRadius: 12,
                        }}
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
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          fontWeight: 700,
                          color: "#595959",
                        }}
                      >
                        2
                      </Button>
                      <Button
                        type="text"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          fontWeight: 700,
                          color: "#595959",
                        }}
                      >
                        3
                      </Button>
                      <Text style={{ padding: "0 8px", color: "#d9d9d9" }}>...</Text>
                      <Button
                        type="text"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          fontWeight: 700,
                          color: "#595959",
                        }}
                      >
                        8
                      </Button>
                      <Button
                        type="text"
                        icon={<RightOutlined />}
                        style={{ color: "#9ca3af" }}
                      />
                    </Space>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
}

