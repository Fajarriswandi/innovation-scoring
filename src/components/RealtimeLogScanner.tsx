import React from "react";
import { Card, Row, Col, Button, Flex, Input, Table, Space, TableProps } from "antd";
import { Icon } from "@iconify/react";
import { realtimeLogs } from "@/data/RealtimeLogScanner";

type LogStatus = "success" | "warning";

interface LogItem {
  key: string;
  time: string;
  app: string;
  department: string;
  services: string;
  amount: string;
  status: LogStatus;
  flagged?: boolean;
}

const columns: TableProps<LogItem>["columns"] = [
  { title: "Time", dataIndex: "time", key: "time", width: 200 },
  { title: "App", dataIndex: "app", key: "app", width: 120 },
  { title: "Department", dataIndex: "department", key: "department", width: 200 },
  { title: "Services", dataIndex: "services", key: "services", ellipsis: true },
  { title: "Amount", dataIndex: "amount", key: "amount", width: 130, align: "right" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (s: LogStatus) => (
      <span className={`badge ${s === "success" ? "success" : "warning"}`}>
        {s === "success" ? "Success" : "Warning"}
      </span>
    ),
  },
  {
    title: "",
    key: "action",
    width: 100,
    render: () => (
      <Button size="small" className="btnLight">
        Details
      </Button>
    ),
  },
];

const RealtimeLogScanner: React.FC = () => {
  return (
    <>
      {/* Start Realtime Log Scanner */}
      <Card
        className="noborderHeader1 cardAgentProfile cardWithFooter"
        extra={
          <a href="#">
            <Icon icon="pepicons-pencil:dots-y" width={20} height={20} />
          </a>
        }
        title={
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon icon="ic:round-auto-mode" width={20} height={20} color="#40ACE2" />
            Realtime Log Scanner
          </span>
        }
      >
        {/* top controls: tabs + search + filter */}
        <div style={{ marginBottom: 12, paddingTop: 10 }}>
          <Row gutter={[10, 10]} align="middle">
            {/* Tabs */}
            <Col xs={24} md={24}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Button type="text" className="btnTab active">
                  All
                </Button>
                <Button type="text" className="btnTab">
                  Dubai Pay
                </Button>
                <Button type="text" className="btnTab">
                  UAE PASS
                </Button>
                <Button type="text" className="btnTab">
                  Dubai Now
                </Button>
              </div>
            </Col>

            {/* Filter */}
            <Col xs={24} md={24}>
              <Flex justify="center" gap={10}>
                <Input
                  allowClear
                  placeholder="Search Log"
                  suffix={<Icon icon="solar:magnifer-linear" width={14} height={14} />}
                />
                <Button icon={<Icon icon="mynaui:filter" width={14} height={14} />}>Filter</Button>
              </Flex>
            </Col>
          </Row>
        </div>

        {/* table */}
        <Table<LogItem>
          size="small"
          rowKey="key"
          columns={columns}
          dataSource={realtimeLogs as LogItem[]}
          pagination={false}
          className="realtimeTable"
          rowClassName={(r) => (r.flagged ? "row-flagged" : "")}
          scroll={{ y: 600 }}
        />

        {/* footer actions (user will style as fixed) */}
        <div className="cardFooter">
          <Space size={16}>
            <Button
              type="text"
              icon={<Icon icon="solar:pause-bold-duotone" width={18} height={18} />}
            >
              Pause
            </Button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7d8497" }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: "#e5e7eb",
                  display: "inline-block",
                }}
              />
              Auto-scroll
            </div>
          </Space>
          <Button
            type="primary"
            style={{ borderRadius: 50 }}
            icon={<Icon icon="ci:download" width={18} height={18} />}
          >
            Export Logs
          </Button>
        </div>
      </Card>
      {/* End Realtime Log Scanner */}
    </>
  );
};

export default RealtimeLogScanner;