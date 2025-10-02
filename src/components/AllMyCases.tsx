import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Divider,
  Drawer,
  Empty,
  Descriptions,
  List,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import {
  fetchCases,
  fetchCaseDetail,
  mapBECaseToUI,
  type CaseSummary,
  type FetchCasesParams,
  type BECaseItem,
  type BECustomer,
} from "@/api/handlers";

export type CaseItem = CaseSummary;

const statusClassMap: Record<string, string> = {
  OPEN: "approved",
  PENDING: "pending",
  RESOLVED: "resolved",
  ESCALATED: "escalated",
  CLOSED: "closed",
  SUCCESS: "approved",
  FAILED: "pending",
};

const extractErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const maybeResponse = (error as {
      response?: { data?: { error?: { message?: string } } };
      message?: string;
    }).response;
    if (maybeResponse?.data?.error?.message) {
      return maybeResponse.data.error.message;
    }
    if ("message" in error && typeof (error as { message?: string }).message === "string") {
      return (error as { message: string }).message;
    }
  }
  return "Failed to fetch cases";
};

interface AllMyCasesRemoteProps {
  params?: FetchCasesParams;
  pageSize?: number;
  onItemAction?: (item: CaseItem) => void;
}

const DEFAULT_QUERY: Required<Pick<FetchCasesParams, "page" | "page_size">> = {
  page: 1,
  page_size: 20,
};

const FALLBACK_AVATAR = "https://ui-avatars.com/api/?background=E1ECFF&color=0B3C5D&name=Case";

const formatDateTime = (value?: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value?: number | null): string => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  try {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `AED ${value.toFixed(2)}`;
  }
};

const toLabelCase = (value?: string | null) => {
  if (!value) return undefined;
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\w/g, (match) => match.toUpperCase());
};

const getCustomerName = (customer?: BECustomer | null): string => {
  if (!customer) return "—";
  const parts = [customer?.first_name, customer?.last_name]
    .map((part) => (part ?? "").trim())
    .filter(Boolean);
  if (parts.length) return parts.join(" ");
  if (customer?.name && customer.name.trim()) return customer.name.trim();
  return "—";
};

const AllMyCasesRemote: React.FC<AllMyCasesRemoteProps> = ({
  params,
  pageSize,
  onItemAction,
}) => {
  const mergedParams = useMemo(() => {
    const base = { ...DEFAULT_QUERY };
    if (pageSize) base.page_size = pageSize;
    return params ? { ...base, ...params } : base;
  }, [params, pageSize]);

  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [caseDetail, setCaseDetail] = useState<BECaseItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const detailRequestRef = React.useRef(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const beCases = await fetchCases(mergedParams);
        if (cancelled) return;
        const mapped = (beCases ?? [])
          .map(mapBECaseToUI)
          .filter((item): item is CaseItem => Boolean(item && item.id));
        setItems(mapped);
      } catch (err: unknown) {
        if (cancelled) return;
        if (import.meta.env.DEV) {
          console.error("[AllMyCases] fetch error", err);
        }
        setError(extractErrorMessage(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [mergedParams]);

  const renderSkeletonList = () => (
    <List
      size="small"
      className="listCostume"
      dataSource={Array.from({ length: 5 }, (_, index) => index)}
      renderItem={(index) => (
        <List.Item key={`skeleton-${index}`}>
          <Skeleton.Avatar
            active
            size={40}
            shape="square"
            style={{ borderRadius: 10, marginRight: 8 }}
          />
          <div style={{ flex: 1 }}>
            <Skeleton.Input active size="small" style={{ width: "70%", marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: "55%" }} />
          </div>
          <div className="time" style={{ minWidth: 90 }}>
            <Skeleton.Input active size="small" style={{ width: 70 }} />
          </div>
          <div className="time" style={{ minWidth: 90 }}>
            <Skeleton.Input active size="small" style={{ width: 60, marginBottom: 4 }} />
            <Skeleton.Input active size="small" style={{ width: 50 }} />
          </div>
          <div>
            <Skeleton.Button active size="small" shape="round" />
          </div>
        </List.Item>
      )}
    />
  );

  const handleCloseDrawer = React.useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedCase(null);
    setCaseDetail(null);
    setDetailError(null);
  }, []);

  const loadCaseDetail = React.useCallback(async (item: CaseItem) => {
    const identifier = item.id ?? item.caseId;
    if (!identifier) {
      setDetailError("Case identifier is missing.");
      setCaseDetail(null);
      return;
    }

    const requestId = detailRequestRef.current + 1;
    detailRequestRef.current = requestId;
    setDetailLoading(true);
    setDetailError(null);
    setCaseDetail(null);
    try {
      const detail = await fetchCaseDetail(identifier);
      if (detailRequestRef.current !== requestId) return;
      setCaseDetail(detail);
    } catch (err: unknown) {
      if (detailRequestRef.current !== requestId) return;
      if (import.meta.env.DEV) {
        console.error("[AllMyCases] detail fetch error", err);
      }
      setDetailError(extractErrorMessage(err));
    } finally {
      if (detailRequestRef.current === requestId) {
        setDetailLoading(false);
      }
    }
  }, []);

  const handleItemClick = React.useCallback(
    (item: CaseItem) => {
      setSelectedCase(item);
      setIsDrawerOpen(true);
      loadCaseDetail(item);
      onItemAction?.(item);
    },
    [loadCaseDetail, onItemAction]
  );

  if (error) {
    return <Alert type="error" message="Failed to load cases" description={error} />;
  }

  const renderList = () => (
    <List
      size="small"
      className="listCostume"
      dataSource={items}
      rowKey={(item) => item?.id ?? item?.caseId}
      locale={{ emptyText: "No cases found" }}
      renderItem={(item) => {
        const statusKey = (item.status ?? "").toUpperCase();
        const badgeClass = statusClassMap[statusKey] ?? "";
        const imageUrl = item.profileImage || item.avatarUrl || FALLBACK_AVATAR;

        return (
          <List.Item
            key={item.id}
            onClick={() => handleItemClick(item)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={imageUrl}
              alt={item.title}
              width={40}
              height={40}
              style={{ borderRadius: "10px", marginRight: 8, objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <div>
                <small style={{ color: "#999" }}>Case ID: {item.caseId}</small>
              </div>
              <div>{item.title}</div>
            </div>
            <div className="time">
              <small>SLA Timer</small>
              {item.slaTimer ?? "—"}
            </div>
            <div className="time">
              <small>Status</small>
              <span className={`badge ${badgeClass}`}>{item.statusLabel ?? item.status}</span>
            </div>
            <div>
              <Button
                className="btnLight"
                icon={<ArrowRightOutlined />}
                onClick={(event) => {
                  event.stopPropagation();
                  handleItemClick(item);
                }}
              />
            </div>
          </List.Item>
        );
      }}
    />
  );

  return (
    <div className="allMyCase">
      {loading && !items.length ? renderSkeletonList() : renderList()}
      <Drawer
        title="Case Details"
        width={520}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        destroyOnClose
      >
        {!selectedCase ? (
          <Empty description="Select a case to view details" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <Typography.Title level={4} style={{ marginBottom: 8 }}>
                {selectedCase.title}
              </Typography.Title>
              <Space size={[8, 8]} wrap>
                {selectedCase.statusLabel && (
                  <Tag color="blue">{selectedCase.statusLabel}</Tag>
                )}
                {selectedCase.priorityLabel && (
                  <Tag color="gold">Priority: {selectedCase.priorityLabel}</Tag>
                )}
                <Tag>{selectedCase.caseId}</Tag>
                <Tag>{`${selectedCase.issueCount} Issue${selectedCase.issueCount === 1 ? "" : "s"}`}</Tag>
              </Space>
            </div>

            {detailLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : detailError ? (
              <Alert type="error" message="Failed to load case detail" description={detailError} />
            ) : caseDetail ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Case ID">{caseDetail.case_id}</Descriptions.Item>
                  <Descriptions.Item label="Overview">
                    {caseDetail.overview || "No overview provided."}
                  </Descriptions.Item>
                  <Descriptions.Item label="SLA Timer">{caseDetail.sla_timer ?? "—"}</Descriptions.Item>
                  <Descriptions.Item label="Priority">
                    {toLabelCase(caseDetail.priority) ?? selectedCase.priorityLabel ?? "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    {toLabelCase(caseDetail.status) ?? selectedCase.statusLabel ?? "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At">{formatDateTime(caseDetail.created_at)}</Descriptions.Item>
                  <Descriptions.Item label="Updated At">{formatDateTime(caseDetail.updated_at)}</Descriptions.Item>
                </Descriptions>

                <div>
                  <Typography.Title level={5} style={{ marginBottom: 8 }}>
                    Customer
                  </Typography.Title>
                  {caseDetail.customer ? (
                    <Descriptions column={1} size="small" bordered>
                      <Descriptions.Item label="Name">
                        {getCustomerName(caseDetail.customer)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone">
                        {caseDetail.customer.phone ?? selectedCase.customerPhone ?? "—"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {caseDetail.customer.email ?? selectedCase.customerEmail ?? "—"}
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <Empty description="No customer information" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>

                <div>
                  <Typography.Title level={5} style={{ marginBottom: 8 }}>
                    Issue Correlation
                  </Typography.Title>
                  {caseDetail.issue_correlation?.length ? (
                    <List
                      dataSource={caseDetail.issue_correlation}
                      split
                      renderItem={(issue) => (
                        <List.Item key={issue.log_id || issue.transaction_id || issue.provider_id}>
                          <div style={{ width: "100%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                              <Typography.Text strong>
                                {issue.service || "Untitled Service"}
                              </Typography.Text>
                              <Space size={[8, 8]} wrap>
                                {issue.status && <Tag color="blue">{toLabelCase(issue.status)}</Tag>}
                                {issue.flags && <Tag color="red">{issue.flags}</Tag>}
                              </Space>
                            </div>
                            <Descriptions
                              column={1}
                              size="small"
                              bordered
                              styles={{
                                content: { padding: "6px 12px" },
                                label: { width: 140, padding: "6px 12px" },
                              }}
                            >
                              <Descriptions.Item label="Provider">
                                {issue.provider_name ?? issue.provider_id ?? "—"}
                              </Descriptions.Item>
                              <Descriptions.Item label="Transaction ID">
                                {issue.transaction_id ?? "—"}
                              </Descriptions.Item>
                              <Descriptions.Item label="Amount">
                                {formatCurrency(issue.amount)}
                              </Descriptions.Item>
                              <Descriptions.Item label="Location">
                                {issue.location ?? "—"}
                              </Descriptions.Item>
                              <Descriptions.Item label="IP Address">
                                {issue.ip ?? "—"}
                              </Descriptions.Item>
                              <Descriptions.Item label="Flag Reason">
                                {issue.flag_reason ?? "—"}
                              </Descriptions.Item>
                              <Descriptions.Item label="Created At">
                                {formatDateTime(issue.created_at)}
                              </Descriptions.Item>
                            </Descriptions>
                          </div>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty
                      description="No issue correlation found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </div>

                <Divider style={{ margin: "8px 0 0" }} />
                <Typography.Text type="secondary">
                  Last updated: {formatDateTime(caseDetail.updated_at ?? caseDetail.created_at)}
                </Typography.Text>
              </div>
            ) : (
              <Empty description="Case detail unavailable" />
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AllMyCasesRemote;
