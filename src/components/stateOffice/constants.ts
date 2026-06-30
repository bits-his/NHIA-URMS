export type StateOfficeReportType =
  | "enrolment" | "migration" | "cemonc"
  | "complaints" | "accreditation" | "stakeholder" | "hmo-selection" | "challenges";

export const MONTHS = [
  { value: 1, label: "January" },   { value: 2, label: "February" },
  { value: 3, label: "March" },     { value: 4, label: "April" },
  { value: 5, label: "May" },       { value: 6, label: "June" },
  { value: 7, label: "July" },      { value: 8, label: "August" },
  { value: 9, label: "September" }, { value: 10, label: "October" },
  { value: 11, label: "November" }, { value: 12, label: "December" },
];

export const ENROLMENT_CATEGORIES = [
  { value: "mop_up", label: "Mop-up Registration" },
  { value: "gifship", label: "GIFSHIP" },
  { value: "tiship", label: "TISHIP" },
  { value: "extra_dependant", label: "Extra Dependant" },
  { value: "additional_dependant", label: "Additional Dependant" },
  { value: "ops", label: "OPS" },
  { value: "sshia", label: "SSHIA" },
];

export const MIGRATION_REQUEST_TYPES = [
  { value: "change_of_facility", label: "Change of Facility" },
  { value: "correction_of_data", label: "Correction of Data (Name/DOB)" },
  { value: "change_of_mda", label: "Change of MDA" },
];

export const CEMONC_INTERVENTIONS = [
  { value: "cemonc", label: "CEmONC" },
  { value: "ffp", label: "FFP" },
];

export const COMPLAINT_SUMMARY_CATEGORIES = [
  { value: "against_hmo", label: "Against HMO" },
  { value: "against_hcp", label: "Against HCP" },
];

export const COMPLAINT_STATUS_TYPES = [
  { value: "resolved", label: "Resolved" },
  { value: "unresolved", label: "Unresolved" },
  { value: "pending", label: "Pending" },
  { value: "escalated", label: "Escalated" },
];

export const ACCREDITATION_PROCESS_TYPES = [
  { value: "accreditation", label: "Accreditation" },
  { value: "reaccreditation", label: "Reaccreditation" },
];

export const ACCREDITATION_ENTRY_TYPES = [
  { value: "completed_forms_returned", label: "Completed Forms Returned" },
  { value: "facilities_awaiting", label: "Facilities Awaiting" },
];

/** @deprecated use process + entry types in form */
export const ACCREDITATION_INDICATORS = [
  { value: "accreditation_applications", label: "Applications Received (Accreditation)" },
  { value: "reaccreditation_applications", label: "Applications Received (Reaccreditation)" },
  { value: "completed_forms_returned", label: "Completed Forms Returned" },
  { value: "awaiting_accreditation", label: "Facilities Awaiting Accreditation" },
  { value: "awaiting_reaccreditation", label: "Facilities Awaiting Reaccreditation" },
];

export type AccreditationProcess = "accreditation" | "reaccreditation";
export type AccreditationEntry = "completed_forms_returned" | "facilities_awaiting";

export function accreditationRowKey(process: string, entry: string) {
  return `${process}:${entry}`;
}

export function accreditationToIndicator(process: AccreditationProcess, entry: AccreditationEntry) {
  if (entry === "completed_forms_returned") return "completed_forms_returned";
  return process === "accreditation" ? "awaiting_accreditation" : "awaiting_reaccreditation";
}

export function collapseAccreditationRows(
  rows: { process: AccreditationProcess; entry: AccreditationEntry; primary_count: number; secondary_count: number }[],
) {
  const map = new Map<string, { indicator: string; primary_count: number; secondary_count: number }>();
  rows.forEach((r) => {
    const indicator = accreditationToIndicator(r.process, r.entry);
    if (!map.has(indicator)) {
      map.set(indicator, { indicator, primary_count: 0, secondary_count: 0 });
    }
    const line = map.get(indicator)!;
    line.primary_count += Number(r.primary_count) || 0;
    line.secondary_count += Number(r.secondary_count) || 0;
  });
  return Array.from(map.values());
}

export function expandAccreditationLines(lines: any[]) {
  const rows: {
    process: AccreditationProcess;
    entry: AccreditationEntry;
    primary_count: number;
    secondary_count: number;
  }[] = [];

  lines.forEach((l) => {
    const primary = Number(l.primary_count) || 0;
    const secondary = Number(l.secondary_count) || 0;
    if (primary === 0 && secondary === 0) return;

    switch (l.indicator) {
      case "awaiting_accreditation":
        rows.push({ process: "accreditation", entry: "facilities_awaiting", primary_count: primary, secondary_count: secondary });
        break;
      case "awaiting_reaccreditation":
        rows.push({ process: "reaccreditation", entry: "facilities_awaiting", primary_count: primary, secondary_count: secondary });
        break;
      case "completed_forms_returned":
        rows.push({ process: "accreditation", entry: "completed_forms_returned", primary_count: primary, secondary_count: secondary });
        break;
      default:
        break;
    }
  });
  return rows;
}

export const REPORT_CONFIG: Record<StateOfficeReportType, {
  title: string;
  subtitle: string;
  refLabel: string;
  countLabel: string;
  totalLabel: string;
}> = {
  enrolment: {
    title: "Enrolment",
    subtitle: "",
    refLabel: "Category", countLabel: "No. of Enrolment", totalLabel: "Total Enrollment",
  },
  migration: {
    title: "Migration / Update Requests",
    subtitle: "",
    refLabel: "Type of Request", countLabel: "Number of Requests", totalLabel: "Total Requests",
  },
  cemonc: {
    title: "CEmONC & FFP Beneficiaries",
    subtitle: "",
    refLabel: "Intervention", countLabel: "Number of Beneficiaries", totalLabel: "Total Beneficiaries",
  },
  complaints: {
    title: "Complaints & Compliance Monitoring",
    subtitle: "",
    refLabel: "Category / Status", countLabel: "Number", totalLabel: "Total Complaints",
  },
  accreditation: {
    title: "Accreditation / Reaccreditation",
    subtitle: "",
    refLabel: "Indicator", countLabel: "Count", totalLabel: "Grand Total",
  },
  stakeholder: {
    title: "Stakeholder Engagement",
    subtitle: "",
    refLabel: "Activity", countLabel: "Audience Size", totalLabel: "Total Audience",
  },
  "hmo-selection": {
    title: "HMO Selection Process",
    subtitle: "",
    refLabel: "MDA", countLabel: "HMOs in Attendance", totalLabel: "Total Meetings",
  },
  challenges: {
    title: "Challenges & Recommendations",
    subtitle: "",
    refLabel: "Section", countLabel: "Content", totalLabel: "Sections",
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

export function reportLineCount(reportType: StateOfficeReportType, report: any) {
  if (reportType === "complaints") {
    return (report.summary_lines?.length ?? 0)
      + (report.status_lines?.length ?? 0)
      + (report.visit_lines?.length ?? 0)
      + (report.reconciliation_lines?.length ?? 0);
  }
  if (reportType === "challenges") {
    return (report.challenges ? 1 : 0) + (report.recommendations ? 1 : 0);
  }
  return report.lines?.length ?? 0;
}

export function reportLineTotal(reportType: StateOfficeReportType, report: any) {
  if (reportType === "enrolment") {
    return (report.lines ?? []).reduce((s: number, l: any) => s + (Number(l.enrolment_count) || 0), 0);
  }
  if (reportType === "migration") {
    return (report.lines ?? []).reduce((s: number, l: any) => s + (Number(l.request_count) || 0), 0);
  }
  if (reportType === "cemonc") {
    return (report.lines ?? []).reduce((s: number, l: any) => s + (Number(l.beneficiaries) || 0), 0);
  }
  if (reportType === "complaints") {
    const sum = (report.summary_lines ?? []).reduce((s: number, l: any) => s + (Number(l.complaint_count) || 0), 0);
    return sum;
  }
  if (reportType === "accreditation") {
    return (report.lines ?? []).reduce((s: number, l: any) =>
      s + (Number(l.primary_count) || 0) + (Number(l.secondary_count) || 0), 0);
  }
  if (reportType === "stakeholder") {
    return (report.lines ?? []).reduce((s: number, l: any) => s + (Number(l.audience_size) || 0), 0);
  }
  if (reportType === "hmo-selection") {
    return report.lines?.length ?? 0;
  }
  return 0;
}
