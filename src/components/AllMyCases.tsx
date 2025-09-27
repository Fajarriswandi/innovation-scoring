import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, List, Skeleton } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import {
  fetchCases,
  mapBECaseToUI,
  type CaseSummary,
  type FetchCasesParams,
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

  if (error) {
    return <Alert type="error" message="Failed to load cases" description={error} />;
  }

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
          <List.Item key={item.id}>
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
                onClick={() => onItemAction?.(item)}
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
    </div>
  );
};

export default AllMyCasesRemote;
