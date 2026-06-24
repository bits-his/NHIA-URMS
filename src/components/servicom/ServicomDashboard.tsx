import * as React from "react";
import { ArrowLeft, RefreshCw, Loader2, TrendingUp, CheckCircle2, AlertTriangle, Star } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { toast } from "sonner";
import { servicomApi } from "@/lib/api";
import { COMPLIANCE_LABELS } from "./servicomConstants";

const COLORS = ["#25a872", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

interface Props {
  onBack: () => void;
  defaultStateId?: string | null;
  defaultZoneId?: string | null;
}

export default function ServicomDashboard({ onBack, defaultStateId, defaultZoneId }: Props) {
  const [data, setData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await servicomApi.getDashboard({
        state_id: defaultStateId ?? undefined,
        zone_id: defaultZoneId ?? undefined,
      });
      setData(res.data);
    } catch (err: any) {
      toast.error("Failed to load dashboard", { description: err.message });
    } finally { setLoading(false); }
  }, [defaultStateId, defaultZoneId]);

  React.useEffect(() => { load(); }, [load]);

  const scopeLabel = defaultStateId ? "State" : defaultZoneId ? "Zonal" : "National";

  return (
    <div className="flex flex-col h-full bg-slate-50/30">
      <div className="bg-white border-b border-border/50 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">SERVICOM M&E Dashboard</h2>
            <p className="text-xs text-muted-foreground">{scopeLabel} monitoring & evaluation overview</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="w-full px-4 md:px-6 py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" /><span>Loading dashboard...</span>
            </div>
          ) : !data ? null : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Assessments", value: data.total_assessments, icon: <TrendingUp className="w-5 h-5 text-[#25a872]" /> },
                  { label: "Compliance Rate", value: `${data.national_compliance_rate}%`, icon: <CheckCircle2 className="w-5 h-5 text-blue-600" /> },
                  { label: "Complaint Resolution", value: `${data.complaint_resolution_rate}%`, icon: <AlertTriangle className="w-5 h-5 text-amber-600" /> },
                  { label: "Avg Satisfaction", value: data.avg_satisfaction != null ? `${data.avg_satisfaction}/5` : "—", icon: <Star className="w-5 h-5 text-purple-600" /> },
                ].map((k) => (
                  <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-5 border bg-white border-[#d4e8dc]">
                    <div className="flex items-center justify-between mb-2">{k.icon}</div>
                    <p className="text-2xl font-black text-slate-800">{k.value}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{k.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="rounded-2xl border-[#d4e8dc]">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Monthly Assessments</CardTitle></CardHeader>
                  <CardContent className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.monthly_assessments}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#25a872" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-[#d4e8dc]">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Compliance Distribution</CardTitle></CardHeader>
                  <CardContent className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.rating_distribution.filter((d: any) => d.count > 0)} dataKey="count" nameKey="rating"
                          cx="50%" cy="50%" outerRadius={70} label={({ rating, count }) => `${COMPLIANCE_LABELS[rating] || rating}: ${count}`}>
                          {data.rating_distribution.map((_: any, i: number) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="rounded-2xl border-[#d4e8dc] overflow-hidden">
                  <CardHeader className="pb-2 border-b border-[#d4e8dc]">
                    <CardTitle className="text-sm font-bold">State Rankings</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f0fdf7]">
                          <TableHead className="text-xs">#</TableHead>
                          <TableHead className="text-xs">State</TableHead>
                          <TableHead className="text-xs text-right">Assessments</TableHead>
                          <TableHead className="text-xs text-right">Avg Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.state_rankings.slice(0, 10).map((s: any, i: number) => (
                          <TableRow key={s.state_id}>
                            <TableCell className="text-xs font-bold">{i + 1}</TableCell>
                            <TableCell className="text-sm font-semibold">{s.state}</TableCell>
                            <TableCell className="text-xs text-right">{s.total}</TableCell>
                            <TableCell className="text-xs text-right font-bold text-[#25a872]">{s.avg_score}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-[#d4e8dc]">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Complaint Categories</CardTitle></CardHeader>
                  <CardContent className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.complaint_categories} layout="vertical" margin={{ left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="rounded-2xl border-emerald-200 bg-emerald-50/30">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-emerald-800">Top Performing States</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {(data.top_states || []).map((s: any) => (
                      <div key={s.state_id} className="flex justify-between text-sm">
                        <span className="font-semibold">{s.state}</span>
                        <Badge variant="outline" className="text-emerald-700 border-emerald-300">{s.avg_score}%</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-rose-200 bg-rose-50/30">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-rose-800">Low Performing States</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {(data.low_states || []).map((s: any) => (
                      <div key={s.state_id} className="flex justify-between text-sm">
                        <span className="font-semibold">{s.state}</span>
                        <Badge variant="outline" className="text-rose-700 border-rose-300">{s.avg_score}%</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
