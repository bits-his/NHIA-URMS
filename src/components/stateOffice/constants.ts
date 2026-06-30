export type StateOfficeReportType = "enrolment" | "migration" | "cemonc";

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

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" });
}
