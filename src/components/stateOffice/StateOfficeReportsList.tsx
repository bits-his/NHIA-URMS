import * as React from "react";
import {
  ArrowLeft, Plus, Loader2, RefreshCw, Eye,
  FileText, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { stateOfficeApi } from "@/lib/api";
import StateOfficeReportPage from "./StateOfficeReportPage";
import StateOfficeReportDetail from "./StateOfficeReportDetail";
import IgrReportPage from "./IgrReportPage";
import IgrReportDetail from "./IgrReportDetail";
import SshiaFinancialReportPage from "./SshiaFinancialReportPage";
import SshiaFinancialReportDetail from "./SshiaFinancialReportDetail";
import ExpenditureProfileReportPage from "./ExpenditureProfileReportPage";
import ExpenditureProfileReportDetail from "./ExpenditureProfileReportDetail";
import { REPORT_CONFIG, type StateOfficeReportType } from "./constants";

interface Report {
  id: number;
  reference_id: string;
  reporting_year: number;
  reporting_month: number;
  submission_date: string | null;
  status: "draft" | "submitted" | "approved";
  createdAt?: string;
  zone?: { description: string };
  state?: { description: string };
  lines?: unknown[];
}

interface Props {
  reportType: StateOfficeReportType;
  onBack: () => void;
  defaultZoneId?: string | null;
  defaultStateId?: string | null;
}

const STATUS_CONFIG = {
  draft:     { label: "Draft",     cls: "bg-slate-100 text-slate-600 border-slate-200",       icon: <FileText className="w-3 h-3" /> },
  submitted: { label: "Submitted", cls: "bg-blue-100 text-blue-700 border-blue-200",          icon: <Clock className="w-3 h-3" /> },
  approved:  { label: "Approved",  cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
};

function safeDate(v: string | null | undefined) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

export default function StateOfficeReportsList({
  reportType, onBack, defaultZoneId, defaultStateId,
}: Props) {
  const cfg = REPORT_CONFIG[reportType];
  const api = stateOfficeApi[reportType];

  const [mode, setMode] = React.useState<"list" | "create" | "view" | "edit">("list");
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState("all");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.list({
        status: filterStatus !== "all" ? filterStatus : undefined,
        zone_id: defaultZoneId ?? undefined,
        state_id: defaultStateId ?? undefined,
      });
      setReports(res.data as Report[]);
    } catch (err: any) {
      toast.error("Failed to load", { description: err.message });
    } finally { setLoading(false); }
  }, [api, filterStatus, defaultZoneId, defaultStateId]);

  React.useEffect(() => { load(); }, [load]);

  const counts = React.useMemo(() => ({
    total:     reports.length,
    draft:     reports.filter(r => r.status === "draft").length,
    submitted: reports.filter(r => r.status === "submitted").length,
    approved:  reports.filter(r => r.status === "approved").length,
  }), [reports]);

  if (mode === "view" && selectedId) {
    if (reportType === "igr") {
      return (
        <IgrReportDetail
          reportId={selectedId}
          onBack={() => { setSelectedId(null); setMode("list"); }}
          onEdit={() => setMode("edit")}
        />
      );
    }
    if (reportType === "sshia-financial") {
      return (
        <SshiaFinancialReportDetail
          reportId={selectedId}
          onBack={() => { setSelectedId(null); setMode("list"); }}
          onEdit={() => setMode("edit")}
        />
      );
    }
    if (reportType === "expenditure-profile") {
      return (
        <ExpenditureProfileReportDetail
          reportId={selectedId}
          onBack={() => { setSelectedId(null); setMode("list"); }}
          onEdit={() => setMode("edit")}
        />
      );
    }
    return (
      <StateOfficeReportDetail
        reportType={reportType}
        reportId={selectedId}
        onBack={() => { setSelectedId(null); setMode("list"); }}
        onEdit={() => setMode("edit")}
      />
    );
  }

  if (mode === "create" || mode === "edit") {
    if (reportType === "igr") {
      return (
        <IgrReportPage
          reportId={mode === "edit" ? selectedId : null}
          onBack={() => { setSelectedId(null); setMode("list"); load(); }}
          defaultZoneId={defaultZoneId}
          defaultStateId={defaultStateId}
        />
      );
    }
    if (reportType === "sshia-financial") {
      return (
        <SshiaFinancialReportPage
          reportId={mode === "edit" ? selectedId : null}
          onBack={() => { setSelectedId(null); setMode("list"); load(); }}
          defaultZoneId={defaultZoneId}
          defaultStateId={defaultStateId}
        />
      );
    }
    if (reportType === "expenditure-profile") {
      return (
        <ExpenditureProfileReportPage
          reportId={mode === "edit" ? selectedId : null}
          onBack={() => { setSelectedId(null); setMode("list"); load(); }}
          defaultZoneId={defaultZoneId}
          defaultStateId={defaultStateId}
        />
      );
    }
    return (
      <StateOfficeReportPage
        reportType={reportType}
        reportId={mode === "edit" ? selectedId : null}
        onBack={() => { setSelectedId(null); setMode("list"); load(); }}
        defaultZoneId={defaultZoneId}
        defaultStateId={defaultStateId}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/30">
      <div className="bg-white border-b border-border/50 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{cfg.title}</h2>
            <p className="text-xs text-muted-foreground">{cfg.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button
            className="bg-orange-action hover:bg-orange-600 gap-2 shadow-lg shadow-orange-500/20"
            onClick={() => { setSelectedId(null); setMode("create"); }}
          >
            <Plus className="w-4 h-4" /> New Report
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="w-full px-4 md:px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total",     value: counts.total,     color: "bg-slate-50 border-slate-200",     text: "text-slate-700"  },
              { label: "Draft",     value: counts.draft,     color: "bg-slate-50 border-slate-200",     text: "text-slate-600"  },
              { label: "Submitted", value: counts.submitted, color: "bg-blue-50 border-blue-200",       text: "text-blue-700"   },
              { label: "Approved",  value: counts.approved,  color: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
            ].map(c => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-5 border ${c.color}`}>
                <p className={`text-3xl font-black ${c.text}`}>{c.value}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">{c.label}</p>
              </motion.div>
            ))}
          </div>

          <Card className="rounded-2xl border-[#d4e8dc]">
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-row items-center gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full max-w-xs"
                    displayValue={filterStatus === "all" ? "All Statuses" : STATUS_CONFIG[filterStatus as keyof typeof STATUS_CONFIG]?.label}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
                {filterStatus !== "all" && (
                  <Button variant="ghost" size="sm" className="text-slate-500 gap-1"
                    onClick={() => setFilterStatus("all")}>
                    <XCircle className="w-3.5 h-3.5" /> Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#d4e8dc] shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-[#d4e8dc]">
              <CardTitle className="text-sm font-bold">
                {loading ? "Loading..." : `${reports.length} report(s)`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading...</span>
                </div>
              ) : reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                  <FileText className="w-8 h-8 opacity-30" />
                  <p className="text-sm font-medium">No reports found</p>
                  <Button variant="outline" size="sm" className="mt-2 gap-2"
                    onClick={() => { setSelectedId(null); setMode("create"); }}>
                    <Plus className="w-4 h-4" /> New Report
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f0fdf7] hover:bg-[#f0fdf7]">
                      <TableHead className="text-xs font-bold text-slate-600">Reference</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600">Zone</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600">State</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600">Period</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600">Lines</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600">Submitted</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600">Status</TableHead>
                      <TableHead className="text-right text-xs font-bold text-slate-600">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((r, i) => {
                      const sc = STATUS_CONFIG[r.status];
                      return (
                        <motion.tr key={r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="hover:bg-[#f8fdfb] transition-colors border-b border-slate-100 last:border-0">
                          <TableCell>
                            <span className="font-mono text-xs font-bold text-primary">{r.reference_id}</span>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">{r.zone?.description || "—"}</TableCell>
                          <TableCell className="text-sm font-semibold text-slate-800">{r.state?.description || "—"}</TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {r.reporting_month}/{r.reporting_year}
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">{r.lines?.length ?? 0}</TableCell>
                          <TableCell className="text-xs text-slate-400">{safeDate(r.submission_date || r.createdAt)}</TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] px-2 py-0.5 flex items-center gap-1 w-fit border ${sc.cls}`}>
                              {sc.icon} {sc.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-primary hover:bg-primary/10"
                              onClick={() => { setSelectedId(r.id); setMode("view"); }}>
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
