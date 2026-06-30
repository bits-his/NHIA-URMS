export type StateOfficeReportType = "enrolment" | "migration" | "cemonc" | "igr" | "sshia-financial" | "expenditure-profile";

export const MONTHS = [
  { value: 1, label: "January" },   { value: 2, label: "February" },
  { value: 3, label: "March" },     { value: 4, label: "April" },
  { value: 5, label: "May" },       { value: 6, label: "June" },
  { value: 7, label: "July" },      { value: 8, label: "August" },
  { value: 9, label: "September" }, { value: 10, label: "October" },
  { value: 11, label: "November" }, { value: 12, label: "December" },
];

export const ENROLMENT_CATEGORIES = [
  { value: "mop_up",              label: "Mop-up Registration" },
  { value: "gifship",             label: "GIFSHIP" },
  { value: "tiship",              label: "TISHIP" },
  { value: "extra_dependant",     label: "Extra Dependant" },
  { value: "additional_dependant", label: "Additional Dependant" },
  { value: "ops",                 label: "OPS" },
  { value: "sshia",               label: "SSHIA" },
];

export const MIGRATION_REQUEST_TYPES = [
  { value: "change_of_facility",  label: "Change of Facility" },
  { value: "correction_of_data",  label: "Correction of Data (Name/DOB)" },
  { value: "change_of_mda",       label: "Change of MDA" },
];

export const CEMONC_INTERVENTIONS = [
  { value: "cemonc", label: "CEmONC" },
  { value: "ffp",    label: "FFP" },
];

export const IGR_SERVICE_TYPES = [
  { value: "enrollee_update",    label: "Enrollee Update" },
  { value: "application",       label: "Application" },
  { value: "accreditation",     label: "Accreditation" },
  { value: "change_of_provider", label: "Change of Provider" },
  { value: "reaccreditation",   label: "Reaccreditation" },
  { value: "extra_dependant",   label: "Extra Dependant" },
  { value: "gifship",           label: "GIFSHIP" },
  { value: "ops",               label: "OPS" },
];

export const SSHIA_SUB_HEADS = [
  { value: "capitation",      label: "Capitation" },
  { value: "fee_for_service", label: "Fee-For-Service" },
  { value: "reserve_funds",   label: "Reserve Funds" },
  { value: "admin_charge",    label: "Admin. Charge" },
  { value: "operations",      label: "Operations" },
];

export const EXPENDITURE_SUB_HEADS = [
  { value: "fuel_lub",               label: "FUEL & LUB" },
  { value: "newspapers_periodicals", label: "NEWSPAPERS & PERIODICALS" },
  { value: "ent_hosp",               label: "ENT & HOSP." },
  { value: "tel_postages",           label: "TEL & POSTAGES" },
  { value: "printing_stationery",    label: "PRINTING & STATIONERY" },
  { value: "transport_travel",       label: "TRANSPORT & TRAVEL" },
  { value: "maint_veh",              label: "MAINT. OF VEH" },
  { value: "maint_equip",            label: "MAINT. OF EQUIP" },
  { value: "utilities",              label: "UTILITIES" },
  { value: "bank_charges",           label: "BANK CHARGES" },
];

export const REPORT_CONFIG: Record<StateOfficeReportType, {
  title: string;
  subtitle: string;
  refLabel: string;
  countLabel: string;
  totalLabel: string;
}> = {
  enrolment: {
    title: "Enrolment",
    subtitle: "Section B — Unified Monthly Report",
    refLabel: "Category",
    countLabel: "No. of Enrolment",
    totalLabel: "Total Enrollment",
  },
  migration: {
    title: "Migration / Update Requests",
    subtitle: "Section C — Unified Monthly Report",
    refLabel: "Type of Request",
    countLabel: "Number of Requests",
    totalLabel: "Total Requests",
  },
  cemonc: {
    title: "CEmONC & FFP Beneficiaries",
    subtitle: "Section D — Unified Monthly Report (Per Facility)",
    refLabel: "Intervention",
    countLabel: "Number of Beneficiaries",
    totalLabel: "Total Beneficiaries",
  },
  igr: {
    title: "IGR",
    subtitle: "Section E — Internally Generated Revenue",
    refLabel: "Service Type",
    countLabel: "Amount (₦)",
    totalLabel: "Total IGR (₦)",
  },
  "sshia-financial": {
    title: "SSHIA Financial Report",
    subtitle: "FORM 07 — Financial Management Report (Quarterly)",
    refLabel: "Sub-head",
    countLabel: "Balance (₦)",
    totalLabel: "Total Balance (₦)",
  },
  "expenditure-profile": {
    title: "Expenditure Profile",
    subtitle: "Expenditure Profile Template — Budget Allocation",
    refLabel: "Sub-head",
    countLabel: "Amount (₦)",
    totalLabel: "Total Allocated (₦)",
  },
};

export function monthLabel(month: number | string) {
  const m = MONTHS.find(x => x.value === Number(month));
  return m?.label ?? String(month);
}

export function quarterFromMonth(month: number | string) {
  return Math.ceil(Number(month) / 3);
}

export function labelOf(
  options: { value: string; label: string }[],
  value: string,
  fallback = "—"
) {
  return value ? (options.find(o => o.value === value)?.label ?? fallback) : fallback;
}

export function formatCount(value: number | string | null | undefined) {
  return (Number(value) || 0).toLocaleString();
}

export function formatAmount(value: number | string | null | undefined) {
  return (Number(value) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Money display with Naira sign */
export function formatNaira(value: number | string | null | undefined) {
  return `₦${formatAmount(value)}`;
}

export function calcSshiaLine(opening: number, receipts: number, expenditure: number) {
  const A = Number(opening) || 0;
  const B = Number(receipts) || 0;
  const D = Number(expenditure) || 0;
  const C = A + B;
  const E = C - D;
  const F = D !== 0 ? (C / D) * 100 : 0;
  return { opening_balance: A, receipts: B, total_budget: C, actual_expenditure: D, balance: E, variance_pct: F };
}

export function calcExpenditurePct(amount: number, total: number) {
  return total !== 0 ? (Number(amount) / total) * 100 : 0;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" });
}
