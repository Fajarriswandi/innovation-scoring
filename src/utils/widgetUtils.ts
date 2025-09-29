import type { WidgetIssuesResponse } from "@/api/handlers";

export type TimelineItem = {
  time: string;
  description: string;
  isFlagged: boolean;
};

export type CustomerInfo = {
  eventId: string;
  accountAge: string;
  avgTransaction: string;
  lastDevice: string;
};

export const formatTime = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date
    .toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/,(?=\s)/, "");
};

export const formatTimestamp = (timestamp?: string | null): string | null => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return `${date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}`;
};

export const normalizeTimeline = (caseData: WidgetIssuesResponse["current_case"]): TimelineItem[] => {
  if (!caseData?.issue_correlation?.length) return [];
  return caseData.issue_correlation.map((item) => ({
    time: item?.time ?? formatTime(caseData.created_at),
    description: item?.event
      ? `${item.event}${item.location ? ` — ${item.location}` : ""}`
      : item?.location ?? "",
    isFlagged: Boolean(item?.flag || (item?.status ?? "").toLowerCase().includes("susp")),
  }));
};

export const normalizeCustomer = (caseData: WidgetIssuesResponse["current_case"]): CustomerInfo => {
  const defaults: CustomerInfo = {
    eventId: "—",
    accountAge: "—",
    avgTransaction: "—",
    lastDevice: "—",
  };
  
  if (!caseData?.customer) return defaults;

  return {
    eventId: caseData.customer.event_id ?? "—",
    accountAge: caseData.customer.account_age ?? "—",
    avgTransaction: caseData.customer.avg_transaction ?? "—",
    lastDevice: caseData.customer.last_device ?? "—",
  };
};

export const getCaseTitle = (currentCase: WidgetIssuesResponse["current_case"]): string => {
  return currentCase?.overview ?? "Potential Issue Detected";
};

export const getCaseDetail = (currentCase: WidgetIssuesResponse["current_case"]): string => {
  return currentCase?.detail ?? currentCase?.overview ?? "";
};
