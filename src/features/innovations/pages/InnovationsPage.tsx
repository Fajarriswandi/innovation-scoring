"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FastForwardOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Colors, Spacing, Typography as Typo, BorderRadius, Shadows, GlobalStyles, combineStyles } from "@/styles/globalStyles";

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
    if (val >= 80) return Colors.success;
    if (val >= 50) return Colors.info;
    return Colors.error;
  };

  return (
    <div style={{ width: 128 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: Spacing.xs,
          marginBottom: Spacing.xs,
        }}
      >
        <Text strong style={combineStyles(GlobalStyles.textPrimary, {
          fontSize: Typo.base,
          color: Colors.textPrimary,
        })}>
          {value}
        </Text>
        <Text style={combineStyles(GlobalStyles.textMuted, {
          fontSize: Typo.xs,
          fontWeight: Typo.medium,
        })}>
          / 100
        </Text>
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

const RecBadge: React.FC<{ type: Innovation["recommendation"] }> = ({
  type,
}) => {
  const styles = {
    "Fast Track": { bg: Colors.successLight, color: Colors.success, border: Colors.successLight },
    Proceed: { bg: Colors.infoLight, color: Colors.info, border: Colors.infoLight },
    Drop: { bg: Colors.errorLight, color: Colors.error, border: Colors.errorLight },
  };

  const icons = {
    "Fast Track": <FastForwardOutlined style={{ fontSize: Typo.sm }} />,
    Proceed: <PlayCircleOutlined style={{ fontSize: Typo.sm }} />,
    Drop: <CloseCircleOutlined style={{ fontSize: Typo.sm }} />,
  };

  const style = styles[type];

  return (
    <Tag
      style={combineStyles({
        backgroundColor: style.bg,
        color: style.color,
        borderColor: style.border,
        borderRadius: BorderRadius.full,
        padding: `${Spacing.xs}px ${Spacing.sm}px`,
        fontSize: Typo.xs,
        fontWeight: Typo.bold,
        border: `1px solid ${style.border}`,
        display: "inline-flex",
        alignItems: "center",
        gap: Spacing.sm,
      })}
    >
      {icons[type]}
      {type.toUpperCase()}
    </Tag>
  );
};

const StatusBadge: React.FC<{ status: Innovation["status"] }> = ({
  status,
}) => {
  const colors = {
    "Under Review": Colors.warning,
    Approved: Colors.success,
    New: Colors.info,
    "In Progress": Colors.warning,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: Spacing.sm }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: BorderRadius.full,
          backgroundColor: colors[status],
        }}
      />
      <Text style={combineStyles(GlobalStyles.textSecondary, {
        fontSize: Typo.sm,
        fontWeight: Typo.semibold,
      })}>
        {status}
      </Text>
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
          <Title
            level={5}
            style={combineStyles(GlobalStyles.heading4, {
              margin: 0,
              marginBottom: Spacing.xs,
              fontSize: Typo.base,
              fontWeight: Typo.bold,
              color: Colors.textPrimary,
            })}
          >
            {record.title}
          </Title>
          <Text style={combineStyles(GlobalStyles.textMuted, {
            fontSize: Typo.sm,
            color: Colors.textMuted,
          })}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: "DEPARTMENT",
      dataIndex: "department",
      key: "department",
      sorter: (a: Innovation, b: Innovation) =>
        a.department.localeCompare(b.department),
      render: (department: string) => (
        <Tag
          style={combineStyles({
            fontSize: Typo.xs,
            fontWeight: Typo.semibold,
            borderRadius: BorderRadius.full,
            padding: `${Spacing.xs}px ${Spacing.md}px`,
            backgroundColor: Colors.backgroundGray,
            color: Colors.textSecondary,
            border: `1px solid ${Colors.borderLight}`,
          })}
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
      sorter: (a: Innovation, b: Innovation) =>
        a.recommendation.localeCompare(b.recommendation),
      render: (rec: Innovation["recommendation"]) => <RecBadge type={rec} />,
    },
    {
      title: "SIMILARITY",
      dataIndex: "similarity",
      key: "similarity",
      align: "center" as const,
      sorter: (a: Innovation, b: Innovation) => a.similarity - b.similarity,
      render: (similarity: number) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: Spacing.sm,
          }}
        >
          {similarity > 50 ? (
            <WarningOutlined style={{ fontSize: Typo.base, color: Colors.warning }} />
          ) : (
            <CheckCircleOutlined style={{ fontSize: Typo.base, color: Colors.success }} />
          )}
          <Text style={combineStyles(GlobalStyles.textSecondary, {
            fontSize: Typo.sm,
            fontWeight: Typo.bold,
          })}>
            {similarity}%
          </Text>
        </div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      sorter: (a: Innovation, b: Innovation) =>
        a.status.localeCompare(b.status),
      render: (status: Innovation["status"]) => <StatusBadge status={status} />,
    },
    {
      title: "ACTION",
      key: "action",
      align: "center" as const,
      fixed: "right" as const,
      width: 80,
      render: (_: unknown, record: Innovation) => {
        const menu = {
          onClick: (info: {
            key: string;
            domEvent:
              | React.MouseEvent<HTMLElement>
              | React.KeyboardEvent<HTMLElement>;
          }) => {
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
              style={{ color: Colors.borderDark }}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    },
  ];

  const router = useRouter();

  return (
    <div>
      <Helmet>
        <title>Innovations | AI Innovation Scoring Dashboard</title>
      </Helmet>

      <div>
        {/* Top Header */}
        <Row
          justify="space-between"
          align="middle"
          style={GlobalStyles.marginBottomMd}
        >
          <Col>
            <Title
              level={1}
              className="innovations-page-title"
              style={combineStyles(GlobalStyles.heading1, {
                margin: 0,
                fontSize: Typo.xxxl,
                fontWeight: Typo.extrabold,
              })}
            >
              Innovations
            </Title>
            <Text
              className="innovations-page-subtitle"
              style={combineStyles(GlobalStyles.textMuted, {
                marginTop: Spacing.xs,
                display: "block",
                fontSize: Typo.base,
              })}
            >
              All submitted ideas evaluated by AI agents
            </Text>
          </Col>
          <Col>
            <Space size={Spacing.md}>
              <Button
                icon={<FilterOutlined />}
                style={{
                  height: 38,
                  borderRadius: BorderRadius.md,
                }}
              >
                Filter
              </Button>
              <Button
                icon={<SortAscendingOutlined />}
                style={{
                  height: 38,
                  borderRadius: BorderRadius.md,
                }}
              >
                Sort
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={combineStyles(GlobalStyles.buttonPrimary, {
                  height: 38,
                  borderRadius: BorderRadius.md,
                })}
                onClick={() => router.push("/form-submission")}
              >
                New Innovation
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Filter Bar */}
        <Card
          className="innovations-filter-card"
          style={combineStyles(GlobalStyles.card, {
            borderRadius: BorderRadius.lg,
            marginBottom: Spacing.lg,
            padding:0,
            // backgroundColor: 'orange',
          })}
          styles={{ body: { padding: 0 } }}
        >
          <div
            style={{ 
              padding: `${Spacing.xl}px ${Spacing.xl}px`, 
              borderBottom: `1px solid ${Colors.borderLight}` 
            }}
          >
            <Row gutter={[Spacing.md, Spacing.md]} align="middle">
              <Col xs={24} sm={24} md={12} lg={8} flex={1}>
                <Input
                  prefix={<SearchOutlined style={{ color: Colors.textMuted }} />}
                  placeholder="Search by keyword, ID, or submitte"
                  style={combineStyles(GlobalStyles.input, {
                    borderRadius: BorderRadius.lg,
                    height: 38,
                  })}
                />
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  defaultValue="Status: All"
                  style={{
                    width: "100%",
                    minWidth: 160,
                    height: 38,
                  }}
                  suffixIcon={
                    <DownOutlined style={{ color: Colors.textMuted, fontSize: Typo.md }} />
                  }
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
                    height: 38,
                  }}
                  suffixIcon={
                    <DownOutlined style={{ color: Colors.textMuted, fontSize: Typo.md }} />
                  }
                  className="filter-select"
                  placeholder={
                    <Space size={8}>
                      <RobotOutlined
                        style={{ color: Colors.textSecondary, fontSize: Typo.md }}
                      />
                      <span>AI Rec: Any</span>
                    </Space>
                  }
                >
                  <Option value="AI Rec: Any">
                    <Space size={8}>
                      <RobotOutlined
                        style={{ color: Colors.textSecondary, fontSize: Typo.md }}
                      />
                      <span>AI Rec: Any</span>
                    </Space>
                  </Option>
                  <Option value="Fast Track">Fast Track</Option>
                  <Option value="Proceed">Proceed</Option>
                  <Option value="Drop">Drop</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <div style={{ display: "flex", alignItems: "center", gap: Spacing.md }}>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div
                      style={combineStyles(GlobalStyles.textUppercase, {
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: Spacing.sm,
                        fontSize: Typo.xs,
                        fontWeight: Typo.bold,
                        color: Colors.textMuted,
                      })}
                    >
                      <span>Score</span>
                      <span>50 - 100</span>
                    </div>
                    <Slider
                      range
                      defaultValue={[50, 100]}
                      min={0}
                      max={100}
                      style={{ margin: 0 }}
                      trackStyle={[{ backgroundColor: Colors.info }]}
                      handleStyle={[
                        {
                          borderColor: Colors.info,
                          boxShadow: Shadows.md,
                        },
                        {
                          borderColor: Colors.info,
                          boxShadow: Shadows.md,
                        },
                      ]}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={0} flex={1}>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <div
                    className="innovations-text-muted"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
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
          </div>

          {/* Active Filters */}
          {/* <div
            style={{
              marginTop: 0,
              paddingTop: 15,
            }}
          >
            <Row align="middle" gutter={[16, 8]}>
              <Col>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
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
                  <Button
                    type="link"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: 0,
                      height: "auto",
                    }}
                  >
                    Clear All
                  </Button>
                </Space>
              </Col>
            </Row>
          </div> */}

          <Table
            dataSource={innovations}
            columns={columns}
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
                    className="innovations-table-header"
                    style={combineStyles(GlobalStyles.tableHeader, {
                      ...props.style,
                      padding: `${Spacing.md}px ${Spacing.md}px`,
                    })}
                  />
                ),
              },
            }}
            rowClassName={(_, index) =>
              `innovations-table-row ${index % 2 === 0 ? "table-row-even" : "table-row-odd"}`
            }
            onRow={(record) => ({
              onClick: (e) => {
                // Prevent navigation if clicking on button or action column
                const target = e.target as HTMLElement;
                if (
                  target.closest("button") ||
                  target.closest(".ant-btn") ||
                  target.closest("td:last-child") ||
                  target.closest(".ant-dropdown")
                ) {
                  return;
                }
                router.push(`/detail/${record.id}`);
              },
              style: { cursor: "pointer" },
            })}
          />
          <div
            className="innovations-pagination-bg"
            style={combineStyles({
              padding: `${Spacing.lg}px ${Spacing.xl}px`,
              display: "flex",
              flexDirection: "column",
              gap: Spacing.md,
              borderTop: `1px solid ${Colors.borderLight}`,
              backgroundColor: Colors.backgroundLight,
              // backgroundColor: 'orange',
              borderBottomLeftRadius: BorderRadius.lg,
              borderBottomRightRadius: BorderRadius.lg,
            })}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Text style={combineStyles(GlobalStyles.textMuted, {
                  fontSize: Typo.base,
                  fontWeight: Typo.medium,
                })}>
                  Showing{" "}
                  <Text strong style={{ color: Colors.primary }}>
                    1
                  </Text>{" "}
                  to{" "}
                  <Text strong style={{ color: Colors.primary }}>
                    5
                  </Text>{" "}
                  of{" "}
                  <Text strong style={{ color: Colors.primary }}>
                    128
                  </Text>{" "}
                  results
                </Text>
              </Col>
              <Col>
                <Row gutter={Spacing.lg} align="middle">
                  <Col>
                    <Space size={Spacing.md}>
                      <Text style={combineStyles(GlobalStyles.textMuted, {
                        fontSize: Typo.base,
                        fontWeight: Typo.medium,
                      })}>
                        Rows per page:
                      </Text>
                      <Select
                        defaultValue="10"
                        style={{
                          width: 60,
                        }}
                        suffixIcon={
                          <DownOutlined
                            style={{ color: Colors.textMuted, fontSize: Typo.md }}
                          />
                        }
                        styles={{ popup: { root: { borderRadius: BorderRadius.lg } } }}
                      >
                        <Option value="10">10</Option>
                        <Option value="20">20</Option>
                        <Option value="50">50</Option>
                        <Option value="100">100</Option>
                      </Select>
                    </Space>
                  </Col>
                  <Col>
                    <Space size={Spacing.xs}>
                      <Button
                        type="text"
                        icon={<LeftOutlined />}
                        disabled
                        style={{ color: Colors.borderDark }}
                      />
                      <Button
                        type="primary"
                        style={combineStyles({
                          width: 36,
                          height: 36,
                          borderRadius: BorderRadius.md,
                          backgroundColor: Colors.info,
                          borderColor: Colors.info,
                          fontWeight: Typo.bold,
                          boxShadow: Shadows.primary,
                        })}
                      >
                        1
                      </Button>
                      <Button
                        type="text"
                        style={combineStyles({
                          width: 36,
                          height: 36,
                          borderRadius: BorderRadius.md,
                          fontWeight: Typo.bold,
                          color: Colors.textSecondary,
                        })}
                      >
                        2
                      </Button>
                      <Button
                        type="text"
                        style={combineStyles({
                          width: 36,
                          height: 36,
                          borderRadius: BorderRadius.md,
                          fontWeight: Typo.bold,
                          color: Colors.textSecondary,
                        })}
                      >
                        3
                      </Button>
                      <Text style={combineStyles(GlobalStyles.textMuted, {
                        padding: `0 ${Spacing.sm}px`,
                      })}>
                        ...
                      </Text>
                      <Button
                        type="text"
                        style={combineStyles({
                          width: 36,
                          height: 36,
                          borderRadius: BorderRadius.md,
                          fontWeight: Typo.bold,
                          color: Colors.textSecondary,
                        })}
                      >
                        8
                      </Button>
                      <Button
                        type="text"
                        icon={<RightOutlined />}
                        style={{ color: Colors.textMuted }}
                      />
                    </Space>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Table */}
        <Card
          style={{
            borderRadius: BorderRadius.lg,
            
            // boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            border: "1px solid #f0f0f0",
          }}
          styles={{ body: { padding: 0 } }}
        ></Card>
      </div>
    </div>
  );
}
