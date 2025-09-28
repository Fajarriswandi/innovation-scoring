import api from "./browser";

// ===== Types from BE (GET /v1/cases/?page=&page_size=) =====
export interface IssueCorrelationItem {
  provider_id: number | string;
  provider_name: string;
  log_id: string;
  transaction_id: string | null;
  service: string | null;
  amount: number | null;
  ip: string | null;
  location: string | null;
  status: string | null;
  flags: string | null;
  flag_reason: string | null;
  created_at: string; // ISO datetime
}

export interface BECustomer {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  image_url?: string | null;
}

export interface BECaseItem {
  id: string; // internal uuid
  case_id: string; // human-readable id e.g. "#562018"
  overview: string | null;
  sla_timer: string | null;
  status: string | null; // e.g. "PENDING"
  priority?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  customer?: BECustomer | null;
  issue_correlation: IssueCorrelationItem[];
}

export interface BEPaginated<T> {
  data: T[];
  // BE may include other meta fields later (page, page_size, total, etc.)
  page?: number;
  page_size?: number;
  total?: number;
}

// ===== Client helpers =====
export type FetchCasesParams = {
  page?: number;
  page_size?: number;
  [key: string]: unknown;
};

export interface CaseSummary {
  id: string;
  caseId: string;
  title: string;
  status: string; // raw status from BE (usually uppercase)
  statusLabel: string;
  priority?: string | null;
  priorityLabel?: string;
  slaTimer?: string | null;
  createdAt?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  issueCount: number;
  primaryFlag?: string | null;
  avatarUrl?: string;
  profileImage?: string;
}

const toLabelCase = (value?: string | null) => {
  if (!value) return undefined;
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\w/g, (match) => match.toUpperCase());
};

const buildAvatarUrl = (name?: string | null) => {
  if (!name) return undefined;
  const encoded = encodeURIComponent(name.trim());
  return `https://ui-avatars.com/api/?background=E8F1FF&color=0B3C5D&name=${encoded}`;
};

export function mapBECaseToUI(item: BECaseItem): CaseSummary {
  const issue = item.issue_correlation?.[0];
  const statusRaw = item.status ?? "UNKNOWN";
  const priorityRaw = item.priority ?? undefined;
  return {
    id: item.id ?? item.case_id,
    caseId: item.case_id ?? item.id,
    title:
      item.overview?.trim() || issue?.flag_reason?.trim() || "Case without overview",
    status: statusRaw,
    statusLabel: toLabelCase(statusRaw) ?? "Unknown",
    priority: priorityRaw,
    priorityLabel: toLabelCase(priorityRaw),
    slaTimer: item.sla_timer ?? undefined,
    createdAt: item.created_at ?? issue?.created_at ?? undefined,
    customerName: item.customer?.name ?? undefined,
    customerPhone: item.customer?.phone ?? undefined,
    issueCount: item.issue_correlation?.length ?? 0,
    primaryFlag: issue?.flag_reason ?? undefined,
    avatarUrl: item.customer?.image_url ?? buildAvatarUrl(item.customer?.name),
    profileImage: item.customer?.image_url ?? buildAvatarUrl(item.customer?.name),
  };
}

/**
 * Fetch list of cases
 * GET /v1/cases/?page=&page_size=
 * Returns raw BE shape (array of cases) for flexibility at the call site.
 */
export async function fetchCases(params?: FetchCasesParams): Promise<BECaseItem[]> {
  const res = await api.get<BEPaginated<BECaseItem>>("/v1/cases/", { params });
  // Some gateways might return an array directly, so normalize it here
  const payload = res.data as BEPaginated<BECaseItem> | BECaseItem[];
  if (Array.isArray(payload)) return payload;
  return payload?.data ?? [];
}

/**
 * Fetch single case detail
 * GET /v1/cases/{case_id}/
 */
export async function fetchCaseDetail(caseId: string): Promise<BECaseItem> {
  const res = await api.get<BECaseItem>(`/v1/cases/${caseId}/`);
  return res.data;
}

// ===== Logs =====

export interface BELogItem {
  id: string;
  event_id?: string | null;
  timestamp?: string | null;
  created_at?: string | null;
  application?: string | null;
  app?: string | null;
  provider?: string | null;
  provider_name?: string | null;
  department?: string | null;
  service?: string | null;
  service_name?: string | null;
  amount?: number | string | null;
  amount_value?: number | null;
  amount_formatted?: string | null;
  currency?: string | null;
  status?: string | null;
  outcome?: string | null;
  risk_level?: string | null;
  flags?: Array<string | null> | null;
  flagged?: boolean | null;
  flag_reason?: string | null;
  metadata?: Record<string, unknown> | null;
  data?: Record<string, unknown> | null;
}

export type FetchRealtimeLogsParams = {
  page?: number;
  page_size?: number;
  [key: string]: unknown;
};

export type FetchRealtimeLogsOptions = {
  timeoutMs?: number;
};

export async function fetchRealtimeLogs(
  params?: FetchRealtimeLogsParams,
  options?: FetchRealtimeLogsOptions
): Promise<BELogItem[]> {
  const res = await api.get<BEPaginated<BELogItem>>("/v1/logs/all", {
    params,
    timeout: options?.timeoutMs ?? 60000,
  });
  const payload = res.data as BEPaginated<BELogItem> | BELogItem[];
  if (Array.isArray(payload)) return payload;
  return payload?.data ?? [];
}

// ===== Logs history =====

export interface BELogHistoryResponse {
  logs?: BELogItem[];
  total?: number;
  page?: number;
  page_size?: number;
  [key: string]: unknown;
}

export type FetchLogsHistoryParams = FetchRealtimeLogsParams & {
  provider?: string;
};

export async function fetchLogsHistory(
  params?: FetchLogsHistoryParams,
  options?: FetchRealtimeLogsOptions
): Promise<BELogItem[]> {
  const provider = params?.provider ? `/${params.provider}` : "";
  const res = await api.get<BELogHistoryResponse>(`/v1/logs/history${provider}`, {
    params,
    timeout: options?.timeoutMs ?? 15000,
  });
  if (Array.isArray(res.data)) return res.data as BELogItem[];
  if (Array.isArray(res.data?.logs)) return res.data.logs as BELogItem[];
  const unknownPayload: unknown = (res.data as Record<string, unknown>)?.data;
  if (Array.isArray(unknownPayload)) return unknownPayload as BELogItem[];
  return [];
}

// ===== Widget issues =====

export interface WidgetIssueCorrelationItem {
  time?: string | null;
  event?: string | null;
  status?: string | null;
  flag?: string | null;
  location?: string | null;
  ip?: string | null;
}

export interface WidgetIssueCustomer {
  event_id?: string | null;
  account_age?: string | null;
  phone?: string | null;
  last_device?: string | null;
  avg_transaction?: string | null;
  [key: string]: unknown;
}

export interface WidgetIssueCase extends BECaseItem {
  detail?: string | null;
  issue_correlation?: WidgetIssueCorrelationItem[];
  customer?: WidgetIssueCustomer | null;
  available_actions?: string[];
}

export interface WidgetIssuesResponse {
  has_open_issues?: boolean;
  count?: number;
  remaining_cases?: number;
  timestamp?: string | null;
  cached?: boolean;
  current_case?: WidgetIssueCase | null;
}

export type FetchWidgetIssuesOptions = {
  timeoutMs?: number;
};

export async function fetchWidgetIssues(
  options?: FetchWidgetIssuesOptions
): Promise<WidgetIssuesResponse> {
  const res = await api.get<WidgetIssuesResponse>("/v1/logs/widget/issues", {
    timeout: options?.timeoutMs ?? 60000,
  });
  return res.data ?? {};
}
