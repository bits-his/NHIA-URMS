import * as React from "react";
import { ArrowLeft, Plus, RefreshCw, Loader2, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { servicomApi, stockApi } from "@/lib/api";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUS, pickGeoLabel, pickLabel } from "./servicomConstants";

interface Props {
  onBack: () => void;
  defaultStateId?: string | null;
  defaultZoneId?: string | null;
}

const emptyForm = (defaultZoneId?: string | null, defaultStateId?: string | null) => ({
  zone_id: defaultZoneId ?? "",
  state_id: defaultStateId ?? "",
  facility_name: "",
  complaint_date: new Date().toISOString().slice(0, 10),
  category: "others",
  description: "",
  assigned_officer: "",
});

export default function ServicomComplaintsPage({ onBack, defaultStateId, defaultZoneId }: Props) {
  const [mode, setMode] = React.useState<"list" | "form">("list");
  const [complaints, setComplaints] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [zones, setZones] = React.useState<any[]>([]);
  const [states, setStates] = React.useState<any[]>([]);
  const [f, setF] = React.useState(emptyForm(defaultZoneId, defaultStateId));

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await servicomApi.listComplaints({
        status: filterStatus !== "all" ? filterStatus : undefined,
        state_id: defaultStateId ?? undefined,
        zone_id: defaultZoneId ?? undefined,
      });
      setComplaints(res.data);
    } catch (err: any) {
      toast.error("Failed to load complaints", { description: err.message });
    } finally { setLoading(false); }
  }, [filterStatus, defaultStateId, defaultZoneId]);

  React.useEffect(() => { if (mode === "list") load(); }, [load, mode]);
  React.useEffect(() => { stockApi.getZones().then((r) => setZones(r.data)).catch(() => {}); }, []);
  React.useEffect(() => {
    if (!f.zone_id) return;
    stockApi.getStates(f.zone_id).then((r) => setStates(r.data)).catch(() => {});
  }, [f.zone_id]);

  const openForm = () => {
    setF(emptyForm(defaultZoneId, defaultStateId));
    setMode("form");
  };

  const closeForm = () => {
    setMode("list");
    load();
  };

  const handleCreate = async () => {
    if (!f.facility_name || !f.description) {
      toast.error("Facility name and description are required.");
      return;
    }
    setSaving(true);
    try {
      await servicomApi.createComplaint({
        ...f,
        zone_id: f.zone_id ? Number(f.zone_id) : null,
        state_id: f.state_id ? Number(f.state_id) : null,
      });
      toast.success("Complaint registered");
      closeForm();
    } catch (err: any) {
      toast.error("Failed to register complaint", { description: err.message });
    } finally { setSaving(false); }
  };

  const catLabel = (v: string) => COMPLAINT_CATEGORIES.find((c) => c.value === v)?.label ?? v;

  if (mode === "form") {
    return (
      <div className="flex flex-col h-full bg-slate-50/30">
        <div className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={closeForm} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Register Complaint</h2>
              <p className="text-xs text-muted-foreground">Create a new enrollee complaint record</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="w-full px-4 md:px-6 py-4 pb-24">
            <Card className="rounded-2xl border-[#d4e8dc] w-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">New Complaint</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Zone</Label>
                  <Select value={f.zone_id} onValueChange={(v) => setF((p) => ({ ...p, zone_id: v, state_id: "" }))}>
                    <SelectTrigger className="w-full" displayValue={pickGeoLabel(zones, f.zone_id, "Zone")}>
                      <SelectValue placeholder="Zone" />
                    </SelectTrigger>
                    <SelectContent>{zones.map((z) => <SelectItem key={z.id} value={String(z.id)}>{z.description}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={f.state_id} onValueChange={(v) => setF((p) => ({ ...p, state_id: v }))}>
                    <SelectTrigger className="w-full" displayValue={pickGeoLabel(states, f.state_id, "State")}>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>{states.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.description}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Facility *</Label><Input className="w-full" value={f.facility_name} onChange={(e) => setF((p) => ({ ...p, facility_name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Date</Label><Input className="w-full" type="date" value={f.complaint_date} onChange={(e) => setF((p) => ({ ...p, complaint_date: e.target.value }))} /></div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={f.category} onValueChange={(v) => setF((p) => ({ ...p, category: v }))}>
                    <SelectTrigger className="w-full" displayValue={pickLabel(COMPLAINT_CATEGORIES, f.category, "Category")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>{COMPLAINT_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Assigned Officer</Label><Input className="w-full" value={f.assigned_officer} onChange={(e) => setF((p) => ({ ...p, assigned_officer: e.target.value }))} /></div>
                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                  <Label>Description *</Label>
                  <Input className="w-full" value={f.description} onChange={(e) => setF((p) => ({ ...p, description: e.target.value }))} />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 z-30 bg-white border-t border-border/50 px-4 md:px-6 py-3 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={closeForm}>Cancel</Button>
          <Button onClick={handleCreate} disabled={saving} className="bg-orange-action hover:bg-orange-600 gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Complaint
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/30">
      <div className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Complaint Management</h2>
            <p className="text-xs text-muted-foreground">Track and resolve enrollee complaints</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button className="bg-orange-action hover:bg-orange-600 gap-2" onClick={openForm}>
            <Plus className="w-4 h-4" /> Register Complaint
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="w-full px-4 md:px-6 py-4 space-y-4">
          <Card className="rounded-2xl border-[#d4e8dc]">
            <CardContent className="pt-4 pb-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full"
                  displayValue={
                    filterStatus === "all"
                      ? "All Statuses"
                      : pickLabel(COMPLAINT_STATUS, filterStatus, "All Statuses")
                  }>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {COMPLAINT_STATUS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#d4e8dc] overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {loading ? "Loading..." : `${complaints.length} complaint(s)`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f0fdf7]">
                        <TableHead className="text-xs font-bold">Number</TableHead>
                        <TableHead className="text-xs font-bold">Facility</TableHead>
                        <TableHead className="text-xs font-bold">Category</TableHead>
                        <TableHead className="text-xs font-bold">Date</TableHead>
                        <TableHead className="text-xs font-bold">Status</TableHead>
                        <TableHead className="text-xs font-bold">Officer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints.map((c, i) => (
                        <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                          className="border-b border-slate-100">
                          <TableCell className="font-mono text-xs font-bold text-primary">{c.complaint_number}</TableCell>
                          <TableCell className="text-sm">{c.facility_name}</TableCell>
                          <TableCell className="text-xs">{catLabel(c.category)}</TableCell>
                          <TableCell className="text-xs text-slate-500">{c.complaint_date}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{pickLabel(COMPLAINT_STATUS, c.status, c.status)}</Badge></TableCell>
                          <TableCell className="text-xs">{c.assigned_officer || "—"}</TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
