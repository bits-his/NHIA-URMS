import { tokenStore } from "./adminApi";

const BASE_URL = (import.meta.env?.VITE_API_URL as string) || "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    const msg =
      json?.errors?.[0]?.msg || json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json;
}

// ─── Annual Reports ───────────────────────────────────────────────────────────

export interface AnnualReportPayload {
  general: {
    year: string;
    state: string;
    staffNo: string;
    totalVehicles: string;
    totalHCF: string;
    totalAccreditedHCF2025: string;
    approvedBudget2025: string;
    totalAmountUtilized2025: string;
  };
  clinical: {
    totalAccreditedCEmONC: string;
    totalCEmONCBeneficiaries: string;
    totalAccreditedFFP: string;
    totalFFPBeneficiaries: string;
  };
  quarterly: Record<string, { q1: string; q2: string; q3: string; q4: string }>;
  status?: "draft" | "submitted";
  submitted_by?: string;
}

export const annualReportApi = {
  create: (payload: AnnualReportPayload) =>
    request<{ success: boolean; data: any }>("/annual-reports", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  saveDraft: (payload: AnnualReportPayload) =>
    request<{ success: boolean; data: any }>("/annual-reports", {
      method: "POST",
      body: JSON.stringify({ ...payload, status: "draft" }),
    }),

  update: (referenceId: string, payload: AnnualReportPayload) =>
    request<{ success: boolean; data: any }>(`/annual-reports/${referenceId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  list: (filters?: { state?: string; year?: string; status?: string }) => {
    const params = new URLSearchParams(
      Object.entries(filters || {}).filter(([, v]) => !!v) as [string, string][]
    ).toString();
    return request<{ success: boolean; data: any[] }>(
      `/annual-reports${params ? `?${params}` : ""}`
    );
  },

  get: (referenceId: string) =>
    request<{ success: boolean; data: any }>(`/annual-reports/${referenceId}`),

  updateStatus: (referenceId: string, status: string) =>
    request<{ success: boolean; data: any }>(`/annual-reports/${referenceId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  /** State-coordinator, zonal-coordinator, or SDO approves a report */
  approve: (referenceId: string, note?: string) =>
    request<{ success: boolean; data: any; message: string }>(`/annual-reports/${referenceId}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ note }),
    }),

  /** State-coordinator, zonal-coordinator, or SDO rejects a report */
  reject: (referenceId: string, reason: string) =>
    request<{ success: boolean; data: any; message: string }>(`/annual-reports/${referenceId}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),

  delete: (referenceId: string) =>
    request<{ success: boolean; message: string }>(`/annual-reports/${referenceId}`, {
      method: "DELETE",
    }),

  /** Aggregated state operational data from monthly departmental reports */
  getOperationalData: (
    year: number,
    filters?: { state_id?: number; zone_id?: number }
  ) => {
    const params = new URLSearchParams({ year: String(year) });
    if (filters?.state_id) params.set("state_id", String(filters.state_id));
    if (filters?.zone_id) params.set("zone_id", String(filters.zone_id));
    return request<{ success: boolean; data: OperationalDataResponse }>(
      `/annual-reports/operational-data?${params}`
    );
  },
};

export interface OperationalDataResponse {
  year: number;
  title: string;
  zone_id: number | null;
  zone_name: string | null;
  state_id: number | null;
  state_name: string | null;
  rows: OperationalDataRow[];
  state_count: number;
  source: string;
}

export interface QuarterlyBlock {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  sub_total: number;
}

export interface OperationalDataRow {
  sn: number;
  state_id: number;
  state: string;
  zone_id: number;
  zone: string | null;
  reporting_year: number;
  staff_no: number | null;
  total_vehicles: number | null;
  total_hcf_under_nhia: number | null;
  total_accredited_hcf: number | null;
  approved_budget: number | null;
  total_amount_utilized: number;
  cemonc_accredited_hcf: number | null;
  cemonc_beneficiaries: number | null;
  ffp_accredited_facilities: number | null;
  ffp_beneficiaries: number | null;
  gifship_enrolments: QuarterlyBlock;
  gifship_premium: QuarterlyBlock;
  ops_count: QuarterlyBlock;
  fsship_new_enrolments: QuarterlyBlock;
  extra_dependants: QuarterlyBlock;
  extra_dependant_premium: QuarterlyBlock;
  additional_dependants: QuarterlyBlock;
  change_of_provider: QuarterlyBlock;
  bhcpf_beneficiaries: number | null;
  bhcpf_facilities: number | null;
  tiship_lives: number | null;
  mha_lives: number | null;
  sshia_lives: number | null;
  complaints_registered: number;
  complaints_resolved: number;
  complaints_escalated: number;
  igr: QuarterlyBlock;
  qa_conducted: QuarterlyBlock;
  accreditation_requests: QuarterlyBlock;
  accreditation_conducted: QuarterlyBlock;
  marketing_sensitization: QuarterlyBlock;
  stakeholder_meetings: number;
  media_appearances: number;
  reconciliation_meetings: number;
  total_indebtedness: number;
  amount_recovered: number;
  months_with_data: { finance: number; programmes: number; sqa: number };
}

// ─── Stock Verification ───────────────────────────────────────────────────────

export const stockApi = {
  getZones: () =>
    request<{ success: boolean; data: any[] }>("/stock/zones"),

  getStates: (zoneId?: number | string) =>
    request<{ success: boolean; data: any[] }>(
      `/stock/states${zoneId ? `?zone_id=${zoneId}` : ""}`
    ),

  getDepartments: (stateId?: number | string) =>
    request<{ success: boolean; data: any[] }>(
      `/stock/departments${stateId ? `?state_id=${stateId}` : ""}`
    ),

  getUnits: (departmentId?: number | string) =>
    request<{ success: boolean; data: any[] }>(
      `/stock/units${departmentId ? `?department_id=${departmentId}` : ""}`
    ),

  getAssets: (stateId?: number | string, unitId?: number | string) => {
    const params = new URLSearchParams();
    if (stateId) params.set("state_id", String(stateId));
    if (unitId)  params.set("unit_id",  String(unitId));
    const qs = params.toString();
    return request<{ success: boolean; data: any[] }>(`/stock/assets${qs ? `?${qs}` : ""}`);
  },

  createAsset: (payload: any) =>
    request<{ success: boolean; data: any }>("/stock/assets", {
      method: "POST", body: JSON.stringify(payload),
    }),

  updateAsset: (id: number | string, payload: any) =>
    request<{ success: boolean; data: any }>(`/stock/assets/${id}`, {
      method: "PUT", body: JSON.stringify(payload),
    }),

  deleteAsset: (id: number | string) =>
    request<{ success: boolean; message: string }>(`/stock/assets/${id}`, {
      method: "DELETE",
    }),

  listVerifications: (filters?: { zone_id?: string; state_id?: string; status?: string; type?: string }) => {
    const params = new URLSearchParams(
      Object.entries(filters || {}).filter(([, v]) => !!v) as [string, string][]
    ).toString();
    return request<{ success: boolean; data: any[] }>(
      `/stock/verifications${params ? `?${params}` : ""}`
    );
  },

  getVerification: (id: number | string) =>
    request<{ success: boolean; data: any }>(`/stock/verifications/${id}`),

  createVerification: (payload: any) =>
    request<{ success: boolean; data: any }>("/stock/verifications", {
      method: "POST", body: JSON.stringify(payload),
    }),

  updateVerification: (id: number | string, payload: any) =>
    request<{ success: boolean; data: any }>(`/stock/verifications/${id}`, {
      method: "PUT", body: JSON.stringify(payload),
    }),

  updateStatus: (id: number | string, status: string) =>
    request<{ success: boolean; data: any }>(`/stock/verifications/${id}/status`, {
      method: "PATCH", body: JSON.stringify({ status }),
    }),
};

// ─── Monthly Reports ──────────────────────────────────────────────────────────

export type MonthlyDept = "finance" | "programmes" | "sqa";

const monthlyBase = (dept: MonthlyDept) => `/monthly/${dept}`;

const makeDeptApi = (dept: MonthlyDept) => ({
  list: (filters?: { state_id?: string; year?: string; month?: string; status?: string; section?: string }) => {
    const p = new URLSearchParams(Object.entries(filters || {}).filter(([,v]) => !!v) as [string,string][]).toString();
    return request<{ success: boolean; data: any[] }>(`${monthlyBase(dept)}${p ? `?${p}` : ""}`);
  },
  aggregate: (state_id: string, year: string) =>
    request<{ success: boolean; data: any[] }>(`${monthlyBase(dept)}/aggregate?state_id=${state_id}&year=${year}`),
  get: (id: number | string) =>
    request<{ success: boolean; data: any }>(`${monthlyBase(dept)}/${id}`),
  create: (payload: any) =>
    request<{ success: boolean; data: any }>(monthlyBase(dept), { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number | string, payload: any) =>
    request<{ success: boolean; data: any }>(`${monthlyBase(dept)}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  updateStatus: (id: number | string, status: string) =>
    request<{ success: boolean; data: any }>(`${monthlyBase(dept)}/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  approve: (id: number | string, note?: string) =>
    request<{ success: boolean; data: any; message: string }>(`${monthlyBase(dept)}/${id}/approve`, { method: "PATCH", body: JSON.stringify({ note }) }),
  reject: (id: number | string, reason: string) =>
    request<{ success: boolean; data: any; message: string }>(`${monthlyBase(dept)}/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) }),
});

export const monthlyApi = {
  finance:    makeDeptApi("finance"),
  programmes: makeDeptApi("programmes"),
  sqa:        makeDeptApi("sqa"),
};
