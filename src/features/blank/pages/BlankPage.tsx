import { useEffect, useState } from "react";
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
  Tag,
  Select,
  Dropdown,
  Input,
  Progress,
} from "antd";
import {
  MoreOutlined,
  MessageOutlined,
  PaperClipOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  EyeOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";

const { Title, Text } = Typography;
const { Option } = Select;

// Type definitions
type Task = {
  id: number;
  title: string;
  description: string;
  assigned: Array<{ name: string; avatar?: string }>;
  tags: string[];
  comments: number;
  attachments: number;
};

type Column = {
  id: string;
  title: string;
  count: number;
  tasks: Task[];
};

type SuggestionCard = {
  id: number;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  priorityColor: string;
  aiScore: number;
  progress: number;
  assigned: Array<{ name: string; avatar?: string }>;
};

export default function BlankPage() {
  const dispatch = useAppDispatch();
  const [activeView, setActiveView] = useState("board");

  useEffect(() => {
    dispatch(setSmallTitle("Innovation Scoring Dashboard"));
    document.title = "Innovation Scoring Dashboard | AI Innovation Scoring Dashboard";
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Innovation Scoring Dashboard";
    };
  }, [dispatch]);

  const views = [
    { key: "board", label: "Board", icon: <AppstoreOutlined /> },
    { key: "list", label: "List", icon: <UnorderedListOutlined /> },
    { key: "overview", label: "Overview", icon: <EyeOutlined /> },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Helmet>
        <title>Innovation Scoring Dashboard | AI Innovation Scoring Dashboard</title>
      </Helmet>

      Blank Page
    </div>
  );
}

// Kanban Board Component
function KanbanBoard() {
  const columns: Column[] = [
    {
      id: "icebox",
      title: "Ice box",
      count: 3,
      tasks: [
        {
          id: 1,
          title: "Decompose the task of creating popups",
          description: "It is necessary to agree with the customer the required number of pop-ups",
          assigned: [
            { name: "Tom Pelosky", avatar: "/src/assets/img/agent-profile.png" },
            { name: "Lucy Meller", avatar: "/src/assets/img/agent-profile.png" },
          ],
          tags: ["Docs", "Prepare"],
          comments: 3,
          attachments: 2,
        },
        {
          id: 2,
          title: 'Draw icons for the "Advantages" block',
          description: "The color scheme should be in neutral tones, the size of each icon is 24x24 px",
          assigned: [{ name: "Mike Wilson", avatar: "/src/assets/img/agent-profile.png" }],
          tags: ["Illustrations"],
          comments: 1,
          attachments: 2,
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      count: 8,
      tasks: [
        {
          id: 3,
          title: 'Draw illustrations for the "About Us" block',
          description: "The color scheme should be in neutral tones, the size of each image is 700x700 px",
          assigned: [{ name: "Mike Wilson", avatar: "/src/assets/img/agent-profile.png" }],
          tags: ["Illustrations"],
          comments: 8,
          attachments: 3,
        },
        {
          id: 4,
          title: 'Creating a prototype for the section "Doctors"',
          description: "It is necessary to develop a card design, which will include a photo of a doctor, name, line of work, experience",
          assigned: [{ name: "Wi Young", avatar: "/src/assets/img/agent-profile.png" }],
          tags: ["Prototype"],
          comments: 24,
          attachments: 14,
        },
      ],
    },
    {
      id: "discussion",
      title: "Discussion",
      count: 3,
      tasks: [
        {
          id: 5,
          title: "Authorization page",
          description: "It is necessary to agree with the customer the required number of pop-ups",
          assigned: [{ name: "Jenny Rood", avatar: "/src/assets/img/agent-profile.png" }],
          tags: ["Coding"],
          comments: 36,
          attachments: 14,
        },
        {
          id: 6,
          title: "Request a price list from the client",
          description: "The price list is required to fill the Services block",
          assigned: [{ name: "Tom Pelosky", avatar: "/src/assets/img/agent-profile.png" }],
          tags: ["Docs", "Prepare"],
          comments: 0,
          attachments: 2,
        },
        {
          id: 7,
          title: "Home page design",
          description: "Create a modern and user-friendly home page design",
          assigned: [
            { name: "Lucy Meller", avatar: "/src/assets/img/agent-profile.png" },
            { name: "Mike Wilson", avatar: "/src/assets/img/agent-profile.png" },
          ],
          tags: ["Design"],
          comments: 12,
          attachments: 5,
        },
      ],
    },
  ];

  return (
    <div
      style={{
        overflowX: "auto",
        width: "100%",
      }}
      className="hide-scrollbar"
    >
      <Row gutter={[16, 16]} style={{ flexWrap: "nowrap", minWidth: "max-content" }}>
        {columns.map((column) => (
          <Col key={column.id} style={{ minWidth: 350, maxWidth: 350 }}>
            <KanbanColumn column={column} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

// Kanban Column Component
function KanbanColumn({ column }: { column: Column }) {
  const menuItems = [
    { key: "1", label: "Edit" },
    { key: "2", label: "Delete" },
  ];

  return (
    <Card
      style={{
        height: "calc(100vh - 350px)",
        display: "flex",
        flexDirection: "column",
        padding: 0,
      }}
      bodyStyle={{ padding: 0, display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Column Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Text strong style={{ fontSize: 16 }}>
                {column.title}
              </Text>
              <Text type="secondary" style={{ fontSize: 14 }}>
                ({column.count})
              </Text>
            </Space>
          </Col>
          <Col>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <Button
                type="text"
                icon={<MoreOutlined />}
                size="small"
                style={{ color: "#7D8497" }}
              />
            </Dropdown>
          </Col>
        </Row>
      </div>

      {/* Tasks */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
        }}
        className="hide-scrollbar"
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </Space>
      </div>
    </Card>
  );
}

// Task Card Component
function TaskCard({ task }: { task: Task }) {
  return (
    <Card
      size="small"
      style={{
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      bodyStyle={{ padding: 16 }}
      hoverable
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
      }}
    >
      {/* Header with Menu */}
      <Row justify="space-between" align="top" style={{ marginBottom: 12 }}>
        <Col flex="auto">
          <Title level={5} style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>
            {task.title}
          </Title>
        </Col>
        <Col>
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Edit" },
                { key: "2", label: "Delete" },
                { key: "3", label: "Archive" },
              ],
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              style={{ color: "#7D8497" }}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </Col>
      </Row>

      {/* Description */}
      <Text
        type="secondary"
        style={{
          display: "block",
          fontSize: 13,
          marginBottom: 12,
          lineHeight: 1.5,
        }}
      >
        {task.description}
      </Text>

      {/* Tags */}
      <div style={{ marginBottom: 12 }}>
        <Space size={8} wrap>
          {task.tags.map((tag, index) => (
            <Tag
              key={index}
              style={{
                borderRadius: 6,
                fontSize: 12,
                padding: "2px 8px",
                margin: 0,
              }}
            >
              {tag}
            </Tag>
          ))}
        </Space>
      </div>

      {/* Footer */}
      <Row justify="space-between" align="middle">
        <Col>
          <Avatar.Group
            maxCount={3}
            size="small"
            maxStyle={{ color: "#fff", backgroundColor: "#40ACE2", fontSize: 10 }}
          >
            {task.assigned.map((person, index) => (
              <Avatar
                key={index}
                src={person.avatar}
                size="small"
                title={person.name}
              />
            ))}
          </Avatar.Group>
        </Col>
        <Col>
          <Space size={16}>
            {task.comments > 0 && (
              <Space size={4}>
                <MessageOutlined style={{ fontSize: 14, color: "#7D8497" }} />
                <Text style={{ fontSize: 12, color: "#7D8497" }}>
                  {task.comments}
                </Text>
              </Space>
            )}
            {task.attachments > 0 && (
              <Space size={4}>
                <PaperClipOutlined style={{ fontSize: 14, color: "#7D8497" }} />
                <Text style={{ fontSize: 12, color: "#7D8497" }}>
                  {task.attachments}
                </Text>
              </Space>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
}

// Suggestion Sidebar Component
function SuggestionSidebar() {
  const suggestions: SuggestionCard[] = [
    {
      id: 1,
      title: "AI-Powered Customer Service Chatbot",
      description: "Automated customer support using NLP and machine learning",
      priority: "High",
      priorityColor: "#ff4d4f",
      aiScore: 92,
      progress: 85,
      assigned: [
        { name: "Tom Pelosky", avatar: "/src/assets/img/agent-profile.png" },
        { name: "Lucy Meller", avatar: "/src/assets/img/agent-profile.png" },
      ],
    },
    {
      id: 2,
      title: "Smart Energy Management System",
      description: "IoT-based solution for office energy optimization",
      priority: "Medium",
      priorityColor: "#faad14",
      aiScore: 78,
      progress: 60,
      assigned: [{ name: "Mike Wilson", avatar: "/src/assets/img/agent-profile.png" }],
    },
    {
      id: 3,
      title: "Automated Document Processing",
      description: "Streamline document workflows with AI automation",
      priority: "Low",
      priorityColor: "#1890ff",
      aiScore: 65,
      progress: 45,
      assigned: [{ name: "Wi Young", avatar: "/src/assets/img/agent-profile.png" }],
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
        AI Reviewed Ideas
      </Title>
      {suggestions.map((suggestion) => (
        <SuggestionCard key={suggestion.id} suggestion={suggestion} />
      ))}
    </Space>
  );
}

// Suggestion Card Component
function SuggestionCard({ suggestion }: { suggestion: SuggestionCard }) {
  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
      bodyStyle={{ padding: 16 }}
    >
      {/* Priority Badge */}
      <Tag
        color={suggestion.priorityColor}
        style={{
          marginBottom: 12,
          borderRadius: 6,
          border: "none",
          padding: "2px 8px",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {suggestion.priority} Priority
      </Tag>

      {/* Title */}
      <Title level={5} style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
        {suggestion.title}
      </Title>

      {/* Description */}
      <Text
        type="secondary"
        style={{
          display: "block",
          fontSize: 12,
          marginBottom: 12,
          lineHeight: 1.5,
        }}
      >
        {suggestion.description}
      </Text>

      {/* AI Score */}
      <div style={{ marginBottom: 12 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: "#7D8497" }}>AI Score</Text>
          <Text style={{ fontSize: 12, fontWeight: 600 }}>
            {suggestion.aiScore}/100
          </Text>
        </Row>
        <Progress
          percent={suggestion.aiScore}
          strokeColor={
            suggestion.aiScore >= 80
              ? "#52c41a"
              : suggestion.aiScore >= 60
              ? "#1890ff"
              : "#faad14"
          }
          showInfo={false}
          size="small"
        />
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 12 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: "#7D8497" }}>Progress</Text>
          <Text style={{ fontSize: 12, fontWeight: 600 }}>
            {suggestion.progress}%
          </Text>
        </Row>
        <Progress
          percent={suggestion.progress}
          strokeColor="#722ed1"
          showInfo={false}
          size="small"
        />
      </div>

      {/* Assigned */}
      <div>
        <Text
          type="secondary"
          style={{ fontSize: 12, display: "block", marginBottom: 8 }}
        >
          Assigned to
        </Text>
        <Avatar.Group
          maxCount={3}
          size="small"
          maxStyle={{ color: "#fff", backgroundColor: "#40ACE2", fontSize: 10 }}
        >
          {suggestion.assigned.map((person, index) => (
            <Avatar
              key={index}
              src={person.avatar}
              size="small"
              title={person.name}
            />
          ))}
        </Avatar.Group>
      </div>
    </Card>
  );
}
