import * as React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  ArrowLeft, TrendingUp, TrendingDown, MapPin, FileText,
  CheckSquare, Clock, AlertCircle, ChevronRight, Users,
  BarChart3, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "motion/react";

// ─── Zone → States mapping ────────────────────────────────────────────────────
const ZONE_STATES: Record<string, string[]> = {
  "South West":   ["Ondo", "Oyo", "Ogun", "Osun", "Ekiti", "Yaba", "Ikeja"],
  "North West":   ["Kaduna", "Kebbi", "Sokoto", "Zamfara", "Jigawa", "Katsina", "Kano"],
  "North Central":["Kwara", "Kogi", "Niger", "Abuja", "Nasarawa", "Plateau", "Benue"],
  "South East":   ["Anambra", "Ebonyi", "Imo", "Abia", "Enugu"],
  "South South":  ["Akwa-Ibom", "Bayelsa", "Edo", "Cross River", "Delta", "Rivers"],
  "North East":   ["Adamawa", "Borno", "Taraba", "Yobe", "Gombe", "Bauchi"],
};

// ─── Mock per-state data generator ───────────────────────────────────────────
function mockStateData(state: string) {
  const seed = state.charCodeAt(0) + state.charCodeAt(state.length - 1);
  const rng = (min: number, max: number) => min + ((seed * 37 + state.length * 13) % (max - min));
  const compliance = rng(62, 99);
  const reports = rng(4, 24);
  const pending = rng(0, reports);
  const approved = reports - pending;
  const enrollees = rng(12000, 180000);
  const igr = rng(500000, 15000000);
  const trend = rng(0, 10) > 5;
  return { compliance, reports, pending, approved, enrollees, igr, trend };
}

// ─── Mock quarterly trend for a zone ─────────────────────────────────────────
function mockZoneTrend(zone: string) {
  const seed = zone.charCodeAt(0);
  return ["Q1", "Q2", "Q3", "Q4"].map((q, i) => ({
    quarter: q,
    reports: 30 + ((seed + i * 17) % 50),
    approved: 20 + ((seed + i * 11) % 40),
  }));
}

// ─── Colour helpers ───────────────────────────────────────────────────────────
function complianceColor(v: number) {
  if (v >= 90) return "text-emerald-600";
  if (v >= 75) return "text-amber-600";
  return "text-rose-600";
}
function complianceBg(v: number) {
  if (v >= 90) return "#25a872";
  if (v >= 75) return "#f59e0b";
  return "#ef4444";
}

// ─── KPI mini card ────────────────────────────────────────────────────────────
function MiniKPI({ label, value, sub, icon, tint, onClick }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; tint: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${tint} rounded-2xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all text-left w-full group ${onClick ? "cursor-pointer hover:scale-[1.02]" : "cursor-default"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
          {icon}
        </div>
        {onClick && <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#145c3f] transition-colors" />}
      </div>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-slate-700 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </button>
  );
}

// ─── State detail panel ───────────────────────────────────────────────────────
function StateDetailPanel({ state, zone, onBack }: { state: string; zone: string; onBack: () => void }) {
  const d = mockStateData(state);
  const quarterlyData = ["Q1", "Q2", "Q3", "Q4"].map((q, i) => ({
    quarter: q,
    reports: Math.max(1, d.reports - 2 + i),
    approved: Math.max(0, d.approved - 1 + i),
    igr: Math.round(d.igr * (0.8 + i * 0.1) / 1_000_000 * 10) / 10,
  }));

  return (
    <motion.div
      key={`state-${state}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#d4e8dc] hover:bg-[#e8f5ee] text-slate-600 hover:text-[#145c3f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-black text-slate-900">{state} State</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {zone} Zone
          </p>
        </div>
        <div className="ml-auto">
          <Badge className={`text-xs px-3 py-1 font-bold ${
            d.compliance >= 90 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
            d.compliance >= 75 ? "bg-amber-100 text-amber-700 border-amber-200" :
            "bg-rose-100 text-rose-700 border-rose-200"
          }`}>
            {d.compliance}% Compliance
          </Badge>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniKPI label="Total Reports" value={d.reports} sub="This year" icon={<FileText className="w-4 h-4 text-blue-600" />} tint="kpi-blue" />
        <MiniKPI label="Approved" value={d.approved} sub="Verified" icon={<CheckSquare className="w-4 h-4 text-emerald-600" />} tint="kpi-green" />
        <MiniKPI label="Pending Review" value={d.pending} sub="Awaiting action" icon={<Clock className="w-4 h-4 text-amber-600" />} tint="kpi-amber" />
        <MiniKPI label="Enrollees" value={d.enrollees.toLocaleString()} sub="Active" icon={<Users className="w-4 h-4 text-purple-600" />} tint="kpi-purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-[#d4e8dc] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Quarterly Reports</CardTitle>
            <CardDescription className="text-xs">Submitted vs Approved — 2025</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData} barSize={16} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8f5ee" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: "#5a7a6a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7a6a" }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={{ borderRadius: 12, border: "1px solid #d4e8dc", fontSize: 12 }} />
                <Bar dataKey="reports" fill="#d1f5e4" radius={[6, 6, 0, 0]} name="Submitted" />
                <Bar dataKey="approved" fill="#25a872" radius={[6, 6, 0, 0]} name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#d4e8dc] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">IGR Trend (₦M)</CardTitle>
            <CardDescription className="text-xs">Internally Generated Revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quarterlyData}>
                <defs>
                  <linearGradient id="igrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25a872" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#25a872" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8f5ee" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: "#5a7a6a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7a6a" }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={{ borderRadius: 12, border: "1px solid #d4e8dc", fontSize: 12 }} />
                <Area type="monotone" dataKey="igr" stroke="#25a872" strokeWidth={2} fill="url(#igrGrad)" name="IGR (₦M)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Directives table */}
      <Card className="rounded-2xl border-[#d4e8dc] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Recent Directives & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f0fdf7]">
                <TableHead className="text-xs font-bold text-slate-600">Directive</TableHead>
                <TableHead className="text-xs font-bold text-slate-600">Deadline</TableHead>
                <TableHead className="text-xs font-bold text-slate-600">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { title: "Q3 Enrollment Data Submission", deadline: "Oct 25, 2025", status: "Submitted" },
                { title: "Monthly Financial Reconciliation", deadline: "Oct 30, 2025", status: d.pending > 5 ? "Pending" : "Submitted" },
                { title: "BHCPF Utilisation Report", deadline: "Nov 5, 2025", status: "Pending" },
              ].map((row) => (
                <TableRow key={row.title} className="hover:bg-[#f0fdf7] transition-colors">
                  <TableCell className="text-sm font-medium">{row.title}</TableCell>
                  <TableCell className="text-sm text-slate-500">{row.deadline}</TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] ${
                      row.status === "Submitted" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                      "bg-amber-100 text-amber-700 border-amber-200"
                    }`}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main ZonalDirectorDashboard ──────────────────────────────────────────────
interface ZonalDirectorDashboardProps {
  /** Zone name from the logged-in user's profile. Falls back to "South West". */
  zoneName?: string;
  onReviewReports?: () => void;
}

export default function ZonalDirectorDashboard({ zoneName = "South West", onReviewReports }: ZonalDirectorDashboardProps) {
  const [selectedState, setSelectedState] = React.useState<string | null>(null);
  const [activeCard, setActiveCard] = React.useState<string | null>(null);

  const states = ZONE_STATES[zoneName] ?? ZONE_STATES["South West"];
  const stateDataList = states.map((s) => ({ state: s, ...mockStateData(s) }));

  const totalReports = stateDataList.reduce((a, s) => a + s.reports, 0);
  const totalPending = stateDataList.reduce((a, s) => a + s.pending, 0);
  const totalApproved = stateDataList.reduce((a, s) => a + s.approved, 0);
  const avgCompliance = Math.round(stateDataList.reduce((a, s) => a + s.compliance, 0) / stateDataList.length);
  const trendData = mockZoneTrend(zoneName);

  // Filtered states for card drill-down
  const filteredStates = activeCard === "pending"
    ? stateDataList.filter((s) => s.pending > 0)
    : activeCard === "approved"
    ? stateDataList.filter((s) => s.approved > 0)
    : stateDataList;

  if (selectedState) {
    return (
      <StateDetailPanel
        state={selectedState}
        zone={zoneName}
        onBack={() => setSelectedState(null)}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="zonal-dashboard"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Zone header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[#25a872]" />
              <span className="text-xs font-bold text-[#25a872] uppercase tracking-wider">{zoneName} Zone</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Zonal Performance Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">{states.length} states under your jurisdiction</p>
          </div>
          <div className="flex gap-2">
            {onReviewReports && (
              <Button
                onClick={onReviewReports}
                className="h-9 text-xs rounded-xl bg-[#145c3f] hover:bg-[#0f3d2e] text-white gap-1.5 shadow-md shadow-[#145c3f]/20"
              >
                <CheckSquare className="w-3.5 h-3.5" /> Review Reports
              </Button>
            )}
          </div>
        </div>

        {/* KPI cards — all clickable */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniKPI
            label="Total Reports"
            value={totalReports}
            sub="All states · 2025"
            icon={<FileText className="w-4 h-4 text-blue-600" />}
            tint="kpi-blue"
            onClick={() => { setActiveCard(activeCard === "all" ? null : "all"); }}
          />
          <MiniKPI
            label="Pending Review"
            value={totalPending}
            sub="Click to filter states"
            icon={<Clock className="w-4 h-4 text-amber-600" />}
            tint="kpi-amber"
            onClick={() => setActiveCard(activeCard === "pending" ? null : "pending")}
          />
          <MiniKPI
            label="Approved"
            value={totalApproved}
            sub="Click to filter states"
            icon={<CheckSquare className="w-4 h-4 text-emerald-600" />}
            tint="kpi-green"
            onClick={() => setActiveCard(activeCard === "approved" ? null : "approved")}
          />
          <MiniKPI
            label="Avg Compliance"
            value={`${avgCompliance}%`}
            sub="Zone average"
            icon={<Activity className="w-4 h-4 text-purple-600" />}
            tint="kpi-purple"
            onClick={() => setActiveCard(null)}
          />
        </div>

        {/* Active filter badge */}
        {activeCard && activeCard !== "all" && (
          <div className="flex items-center gap-2">
            <Badge className="bg-[#e8f5ee] text-[#145c3f] border-[#d4e8dc] text-xs px-3 py-1">
              Showing: {activeCard === "pending" ? "States with pending reports" : "States with approved reports"}
            </Badge>
            <button onClick={() => setActiveCard(null)} className="text-xs text-slate-400 hover:text-slate-600 underline">
              Clear filter
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: states table + chart */}
          <div className="xl:col-span-2 space-y-6">
            {/* Trend chart */}
            <Card className="rounded-2xl border-[#d4e8dc] shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800">Zonal Report Trend</CardTitle>
                  <CardDescription className="text-xs">Submitted vs Approved — 2025</CardDescription>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#d1f5e4] inline-block" />Submitted</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#25a872] inline-block" />Approved</span>
                </div>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} barSize={18} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8f5ee" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: "#5a7a6a" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#5a7a6a" }} axisLine={false} tickLine={false} />
                    <RTooltip contentStyle={{ borderRadius: 12, border: "1px solid #d4e8dc", fontSize: 12 }} />
                    <Bar dataKey="reports" fill="#d1f5e4" radius={[6, 6, 0, 0]} name="Submitted" />
                    <Bar dataKey="approved" fill="#25a872" radius={[6, 6, 0, 0]} name="Approved" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* States breakdown table */}
            <Card className="rounded-2xl border-[#d4e8dc] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-800">
                  State Breakdown
                  <span className="ml-2 text-[10px] font-normal text-slate-400">— click any row to drill down</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f0fdf7]">
                      <TableHead className="text-xs font-bold text-slate-600">State</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 text-center">Reports</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 text-center">Pending</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 text-center">Approved</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600">Compliance</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 text-right">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStates.map((s) => (
                      <TableRow
                        key={s.state}
                        className="hover:bg-[#f0fdf7] transition-colors cursor-pointer group"
                        onClick={() => setSelectedState(s.state)}
                      >
                        <TableCell className="text-sm font-semibold text-slate-800 group-hover:text-[#145c3f] transition-colors">
                          <span className="flex items-center gap-1.5">
                            {s.state}
                            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#25a872] transition-colors" />
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-center font-mono font-semibold">{s.reports}</TableCell>
                        <TableCell className="text-center">
                          {s.pending > 0 ? (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">{s.pending}</Badge>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">{s.approved}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#e8f5ee] rounded-full overflow-hidden w-20">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${s.compliance}%`, backgroundColor: complianceBg(s.compliance) }}
                              />
                            </div>
                            <span className={`text-xs font-bold ${complianceColor(s.compliance)}`}>{s.compliance}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {s.trend ? (
                            <span className="flex items-center justify-end gap-1 text-emerald-600 text-xs font-semibold">
                              <TrendingUp className="w-3 h-3" /> Up
                            </span>
                          ) : (
                            <span className="flex items-center justify-end gap-1 text-rose-500 text-xs font-semibold">
                              <TrendingDown className="w-3 h-3" /> Down
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Compliance ranking */}
            <Card className="rounded-2xl border-[#d4e8dc] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-800">Compliance Ranking</CardTitle>
                <CardDescription className="text-xs">Click a state to drill down</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {[...stateDataList]
                  .sort((a, b) => b.compliance - a.compliance)
                  .map((s, i) => (
                    <button
                      key={s.state}
                      onClick={() => setSelectedState(s.state)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#f0fdf7] border border-[#d4e8dc] hover:border-[#25a872] hover:bg-[#e8f5ee] transition-all group"
                    >
                      <span className={`w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shrink-0 ${
                        i === 0 ? "bg-[#25a872]" : i === 1 ? "bg-[#3b82f6]" : i === 2 ? "bg-[#f59e0b]" : "bg-slate-300"
                      }`}>{i + 1}</span>
                      <p className="text-xs font-semibold text-slate-800 flex-1 text-left truncate group-hover:text-[#145c3f]">{s.state}</p>
                      <span className={`text-xs font-black ${complianceColor(s.compliance)}`}>{s.compliance}%</span>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#25a872]" />
                    </button>
                  ))}
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="rounded-2xl border-[#d4e8dc] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" /> Attention Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {stateDataList
                  .filter((s) => s.compliance < 80 || s.pending > 5)
                  .slice(0, 4)
                  .map((s) => (
                    <button
                      key={s.state}
                      onClick={() => setSelectedState(s.state)}
                      className="w-full flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-100 hover:border-rose-300 transition-all text-left group"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-rose-700">{s.state}</p>
                        <p className="text-[10px] text-rose-500">
                          {s.compliance < 80 ? `${s.compliance}% compliance` : ""}
                          {s.compliance < 80 && s.pending > 5 ? " · " : ""}
                          {s.pending > 5 ? `${s.pending} pending` : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-rose-300 group-hover:text-rose-500 shrink-0 mt-0.5" />
                    </button>
                  ))}
                {stateDataList.filter((s) => s.compliance < 80 || s.pending > 5).length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-2">All states performing well ✓</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
