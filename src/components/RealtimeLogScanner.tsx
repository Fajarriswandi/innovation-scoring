import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Flex,
  Input,
  Table,
  Space,
  TableProps,
  Drawer,
  Descriptions,
  message,
} from "antd";
import { Icon } from "@iconify/react";
import { fetchLogsHistory, type BELogItem } from "@/api/handlers";

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

const getString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const getNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const numeric = Number(value.replace(/[^0-9.-]+/g, ""));
    if (Number.isFinite(numeric)) return numeric;
  }
  return undefined;
};

const getMetaValue = (
  meta: Record<string, unknown> | null | undefined,
  key: string
): unknown => {
  if (!meta || typeof meta !== "object") return undefined;
  return meta[key];
};

const getRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return undefined;
};

const getBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (/^(true|1)$/i.test(value.trim())) return true;
    if (/^(false|0)$/i.test(value.trim())) return false;
  }
  return undefined;
};

const appDisplayNames = {
  dubai_pay: "Dubai Pay",
  uae_pass: "UAE PASS",
  dubai_now: "Dubai Now",
} as const;

const normalizeAppKey = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.trim().toLowerCase().replace(/\s+/g, "_");
};

const formatAppName = (value?: string): string => {
  if (!value) return "—";
  const normalized = normalizeAppKey(value);
  return normalized ? appDisplayNames[normalized as keyof typeof appDisplayNames] ?? value : value;
};

const createColumns = (
  onShowDetails: (log: LogItem) => void
): TableProps<LogItem>["columns"] => [
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    width: 100,
    render: (text) => (
      <span style={{ fontSize: 11, fontWeight: 500 }}>
        {text}
      </span>
    ),
  },
  {
    title: "App",
    dataIndex: "app",
    key: "app",
    width: 85,
    render: (value?: string) => formatAppName(value),
  },
  { title: "Department", dataIndex: "department", key: "department", width: 110 },
  { title: "Services", dataIndex: "services", key: "services", ellipsis: false, width: 170 },
  { title: "Amount", dataIndex: "amount", key: "amount", width: 110, align: "right" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    fixed: 'right',
    width: 80,
    render: (s: LogStatus) => (
      <span className={`badge ${s === "success" ? "success" : "warning"}`}>
        {s === "success" ? "Success" : "Warning"}
      </span>
    ),
  },
  {
    title: "",
    key: "action",
    width: 80,
    fixed: 'right',
    render: (_, record) => (
      <Button size="small" className="btnLight" onClick={() => onShowDetails(record)}>
        Details
      </Button>
    ),
  },
];

const tabs = [
  { key: "all", label: "All" },
  { key: "dubai_pay", label: "Dubai Pay" },
  { key: "uae_pass", label: "UAE PASS" },
  { key: "dubai_now", label: "Dubai Now" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const csvColumns = [
  { header: "Time", accessor: (log: LogItem) => log.time },
  { header: "App", accessor: (log: LogItem) => formatAppName(log.app) },
  { header: "Department", accessor: (log: LogItem) => log.department },
  { header: "Services", accessor: (log: LogItem) => log.services },
  { header: "Amount", accessor: (log: LogItem) => log.amount },
  { header: "Status", accessor: (log: LogItem) => (log.status === "success" ? "Success" : "Warning") },
  { header: "Flagged", accessor: (log: LogItem) => (log.flagged ? "Yes" : "No") },
] as const;

const toCsv = (rows: LogItem[]): string => {
  const headerLine = csvColumns.map((col) => col.header).join(",");
  const escapeCell = (value: string): string => {
    const needsEscaping = /[",\n]/.test(value);
    const escaped = value.replace(/"/g, '""');
    return needsEscaping ? `"${escaped}"` : escaped;
  };
  const bodyLines = rows.map((row) =>
    csvColumns
      .map((col) => escapeCell(String(col.accessor(row) ?? "")))
      .join(",")
  );
  return [headerLine, ...bodyLines].join("\n");
};

const downloadCsv = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatDateTime = (value?: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = date.toLocaleString("en-GB", { day: "2-digit" });
  const month =
    date
      .toLocaleString("en-GB", { month: "short" })
      .replace(".", "");
  const year = date.getFullYear();
  const time =
    date
      .toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .replace(/,(?=\s)/, "")
      .replace(" am", " AM")
      .replace(" pm", " PM");

  return `${day}-${month}-${year} ${time}`;
};

const formatAmount = (log: BELogItem): string => {
  const meta = log.metadata;
  const data = getRecord(log.data);

  const formatted =
    getString(log.amount_formatted) ??
    getString(getMetaValue(meta, "amount_formatted")) ??
    getString(getMetaValue(meta, "amountFormatted")) ??
    getString(getMetaValue(data, "amount_formatted"));
  if (formatted) return formatted;

  const numeric =
    getNumber(log.amount_value) ??
    getNumber(log.amount) ??
    getNumber(getMetaValue(data, "amount")) ??
    getNumber(getMetaValue(meta, "amount"));

  const raw =
    getString(typeof log.amount === "string" ? log.amount : undefined) ??
    getString(getMetaValue(data, "amount_display")) ??
    getString(getMetaValue(meta, "amount_display"));
  if (raw) return raw;

  if (numeric !== undefined) {
    const currency =
      getString(log.currency) ??
      getString(getMetaValue(data, "currency")) ??
      getString(getMetaValue(meta, "currency")) ??
      "AED";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(numeric);
    } catch {
      return `${currency} ${numeric.toFixed(2)}`;
    }
  }

  return "—";
};

const deriveStatus = (log: BELogItem): LogStatus => {
  const data = getRecord(log.data);
  const candidate =
    getString(log.status) ??
    getString(log.outcome) ??
    getString(log.risk_level) ??
    getString(getMetaValue(data, "status")) ??
    getString(getMetaValue(log.metadata, "status"));

  if (candidate) {
    const value = candidate.toLowerCase();
    const warningTokens = [
      "warn",
      "fail",
      "error",
      "risk",
      "flag",
      "susp",
      "alert",
      "issue",
      "anomaly",
    ];

    if (warningTokens.some((token) => value.includes(token))) {
      return "warning";
    }
  }

  if (log.flagged || getBoolean(getMetaValue(data, "flagged"))) return "warning";
  const flags = Array.isArray(log.flags) && log.flags.length ? log.flags : getMetaValue(data, "flags");
  if (Array.isArray(flags) && flags.some(Boolean)) return "warning";
  if (getString(log.flag_reason) || getString(getMetaValue(data, "flag_reason"))) return "warning";

  return "success";
};

const isFlagged = (log: BELogItem, status: LogStatus): boolean => {
  const data = getRecord(log.data);
  if (status === "warning") return true;
  if (log.flagged || getBoolean(getMetaValue(data, "flagged"))) return true;
  const flags = Array.isArray(log.flags) && log.flags.length ? log.flags : getMetaValue(data, "flags");
  if (Array.isArray(flags) && flags.some(Boolean)) return true;
  if (getString(log.flag_reason) || getString(getMetaValue(data, "flag_reason"))) return true;
  return false;
};

const extractKey = (log: BELogItem, fallbackKey: string): string => {
  const data = getRecord(log.data);
  return (
    getString(log.id) ??
    getString(log.event_id) ??
    getString(getMetaValue(log.metadata, "id")) ??
    getString(getMetaValue(data, "event_id")) ??
    fallbackKey
  );
};

const mapBackendLogToRow = (log: BELogItem, fallbackKey: string): LogItem => {
  const data = getRecord(log.data);
  const meta = log.metadata;
  const timestamp =
    getString(log.timestamp) ??
    getString(log.created_at) ??
    getString(getMetaValue(data, "created_at")) ??
    getString(getMetaValue(data, "timestamp")) ??
    getString(getMetaValue(meta, "timestamp"));

  const app =
    getString(log.application) ??
    getString(log.app) ??
    getString(log.provider_name) ??
    getString(log.provider) ??
    getString(getMetaValue(data, "application")) ??
    getString(getMetaValue(data, "provider")) ??
    getString(getMetaValue(meta, "application")) ??
    "—";

  const department =
    getString(log.department) ??
    getString(getMetaValue(data, "department")) ??
    getString(getMetaValue(meta, "department")) ??
    "—";

  const serviceName =
    getString(log.service) ??
    getString(log.service_name) ??
    getString(getMetaValue(data, "service")) ??
    getString(getMetaValue(data, "service_name")) ??
    getString(getMetaValue(meta, "service"));

  const serviceDetail =
    getString(getMetaValue(data, "detail")) ??
    getString(getMetaValue(meta, "detail"));

  const service = (() => {
    if (serviceName && serviceDetail) return `${serviceName} — ${serviceDetail}`;
    if (serviceName) return serviceName;
    if (serviceDetail) return serviceDetail;
    return "";
  })();

  const status = deriveStatus(log);
  const key = extractKey(log, fallbackKey);

  return {
    key,
    time: formatDateTime(timestamp),
    app,
    department,
    services: service || "—",
    amount: formatAmount(log),
    status,
    flagged: isFlagged(log, status),
  };
};

const RealtimeLogScanner: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const fallbackCounterRef = React.useRef(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const streamControllerRef = React.useRef<AbortController | null>(null);
  const historyLoadedRef = React.useRef(false);

  const handleShowDetails = React.useCallback((log: LogItem) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = React.useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedLog(null);
  }, []);

  const columns = React.useMemo(() => createColumns(handleShowDetails), [handleShowDetails]);

  const filteredLogs = React.useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return logs.filter((log) => {
      if (activeTab !== "all") {
        const appKey = normalizeAppKey(log.app);
        if (appKey !== activeTab) return false;
      }

      if (!query) return true;

      const haystack = [
        log.time,
        formatAppName(log.app),
        log.department,
        log.services,
        log.amount,
        log.status,
      ];

      return haystack.some((value) =>
        typeof value === "string" && value.toLowerCase().includes(query)
      );
    });
  }, [logs, activeTab, searchTerm]);

  const handleToggleStreaming = React.useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleExportLogs = React.useCallback(() => {
    if (!filteredLogs.length) {
      message.info("Tidak ada data untuk diekspor.");
      return;
    }

    try {
      const csv = toCsv(filteredLogs);
      const timestamp = new Date().toISOString().replace(/[:.-]/g, "").slice(0, 15);
      downloadCsv(`realtime-logs-${timestamp}.csv`, csv);
      message.success("Logs berhasil diekspor.");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[RealtimeLogScanner] Failed to export logs", error);
      }
      message.error("Gagal mengekspor logs.");
    }
  }, [filteredLogs]);

  useEffect(() => {
    if (isPaused) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    streamControllerRef.current = controller;

    const startStreaming = async () => {
      setLoading(true);
      try {
        if (!historyLoadedRef.current) {
          try {
            const providers = ["dubai_pay", "uae_pass", "dubai_now"] as const;
            const historyResponses = await Promise.all(
              providers.map((provider) =>
                fetchLogsHistory(
                  { provider, page: 1, page_size: 25 },
                  { timeoutMs: 20000 }
                ).catch(() => [])
              )
            );

            const historicalLogs = historyResponses
              .flat()
              .filter((item): item is BELogItem => Boolean(item));

            historicalLogs.sort((a, b) => {
              const dataA = getRecord(a.data);
              const dataB = getRecord(b.data);
              const timeA = Date.parse(
                getString(a.timestamp) ??
                  getString(dataA?.timestamp) ??
                  getString(a.created_at) ??
                  getString(dataA?.created_at) ??
                  ""
              );
              const timeB = Date.parse(
                getString(b.timestamp) ??
                  getString(dataB?.timestamp) ??
                  getString(b.created_at) ??
                  getString(dataB?.created_at) ??
                  ""
              );
              return (Number.isNaN(timeB) ? 0 : timeB) - (Number.isNaN(timeA) ? 0 : timeA);
            });

            const prepared = historicalLogs.map((item) =>
              mapBackendLogToRow(item, `history-${Date.now()}-${fallbackCounterRef.current++}`)
            );
            setLogs((prev) => {
              if (!prev.length) {
                return prepared;
              }
              const map = new Map<string, LogItem>();
              [...prepared, ...prev].forEach((row) => map.set(row.key, row));
              return Array.from(map.values()).slice(0, 200);
            });
            historyLoadedRef.current = true;
          } catch (historyError) {
            if (import.meta.env.DEV) {
              console.error("[RealtimeLogScanner] Failed to load history", historyError);
            }
          }
        }

        const devBase = import.meta.env.VITE_API_DEV_BASE ?? "/__api";
        const prodBase = import.meta.env.VITE_API_BASE_URL ?? "";
        const baseUrl = (import.meta.env.DEV ? devBase : prodBase).replace(/\/$/, "");
        const token = import.meta.env.VITE_API_TOKEN as string | undefined;
        const url = `${baseUrl}/v1/logs/all`;

        const headers: Record<string, string> = {
          Accept: "text/event-stream, application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          headers,
          signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setLoading(false);

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get response reader");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        let reading = true;
        while (reading) {
          const { done, value } = await reader.read();
          if (done) {
            reading = false;
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || ""; // Keep the last partial line in the buffer

          for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed) {
              // blank line indicates event boundary
              continue;
            }

            if (trimmed.startsWith(":")) {
              // comment/ping
              continue;
            }

            if (trimmed.startsWith("data:")) {
              const payload = trimmed.slice(5).trim();
              if (!payload) continue;
              try {
                const newLog = JSON.parse(payload) as BELogItem;
                const fallbackKey = `log-${Date.now()}-${fallbackCounterRef.current++}`;
                const row = mapBackendLogToRow(newLog, fallbackKey);
                setLogs((prevLogs) => {
                  const deduped = prevLogs.filter((item) => item.key !== row.key);
                  return [row, ...deduped].slice(0, 200);
                });
              } catch (e) {
                if (import.meta.env.DEV) {
                  console.error(
                    "[RealtimeLogScanner] Failed to parse incoming log data:",
                    payload,
                    e
                  );
                }
              }
              continue;
            }

            // Ignore other SSE fields like id, event, retry
          }
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error(
            "[RealtimeLogScanner] Failed to fetch log stream:",
            error
          );
        }
        setLoading(false);
      }
    };

    startStreaming();

    return () => {
      controller.abort();
      streamControllerRef.current = null;
    };
  }, [isPaused]);

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
                {tabs.map((tab) => (
                  <Button
                    key={tab.key}
                    type="text"
                    className={`btnTab${activeTab === tab.key ? " active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </Col>

            {/* Filter */}
            <Col xs={24} md={24}>
              <Flex justify="center" gap={10}>
                <Input
                  allowClear
                  placeholder="Search Log"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
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
          dataSource={filteredLogs}
          pagination={false}
          className="realtimeTable"
          rowClassName={(r) => (r.flagged ? "row-flagged" : "")}
          loading={loading}
          scroll={{ y: 600, x: 'max-content' }}
        />

        {/* footer actions (user will style as fixed) */}
        <div className="cardFooter">
          <Space size={16}>
            <Button
              type={isPaused ? "primary" : "text"}
              icon={
                <Icon
                  icon={isPaused ? "solar:play-bold-duotone" : "solar:pause-bold-duotone"}
                  width={18}
                  height={18}
                />
              }
              onClick={handleToggleStreaming}
            >
              {isPaused ? "Play Stream" : "Pause Stream"}
            </Button>
          </Space>
          <Button
            type="primary"
            style={{ borderRadius: 50 }}
            icon={<Icon icon="ci:download" width={18} height={18} />}
            onClick={handleExportLogs}
            disabled={!filteredLogs.length}
          >
            Export Logs
          </Button>
        </div>
      </Card>
      <Drawer
        title="Log Details"
        placement="right"
        width={360}
        onClose={handleCloseDrawer}
        open={isDrawerOpen}
      >
        {selectedLog ? (
          <Descriptions bordered size="small" column={1} labelStyle={{ width: 120 }}>
            <Descriptions.Item label="Time">{selectedLog.time}</Descriptions.Item>
            <Descriptions.Item label="App">{formatAppName(selectedLog.app)}</Descriptions.Item>
            <Descriptions.Item label="Department">{selectedLog.department}</Descriptions.Item>
            <Descriptions.Item label="Services">{selectedLog.services}</Descriptions.Item>
            <Descriptions.Item label="Amount">{selectedLog.amount}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <span className={`badge ${selectedLog.status === "success" ? "success" : "warning"}`}>
                {selectedLog.status === "success" ? "Success" : "Warning"}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Flagged">{selectedLog.flagged ? "Yes" : "No"}</Descriptions.Item>
          </Descriptions>
        ) : (
          <span>No log selected.</span>
        )}
      </Drawer>
      {/* End Realtime Log Scanner */}
    </>
  );
};

export default RealtimeLogScanner;
