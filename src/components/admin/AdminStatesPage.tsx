import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { statesApi, zonesApi, type StateOffice, type ZonalOffice } from "@/lib/adminApi";
import AdminModal from "./AdminModal";

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function AdminStatesPage() {
  const [states, setStates] = React.useState<StateOffice[]>([]);
  const [zones, setZones] = React.useState<ZonalOffice[]>([]);
  const [filterZone, setFilterZone] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [modal, setModal] = React.useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = React.useState<StateOffice | null>(null);
  const [form, setForm] = React.useState({ code: "", description: "", zonal_id: "" });
  const [saving, setSaving] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await statesApi.list(filterZone ? Number(filterZone) : undefined); setStates(r.data); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { load(); }, [filterZone]);
  React.useEffect(() => { zonesApi.list().then(r => setZones(r.data)).catch(() => {}); }, []);

  const openCreate = () => { setForm({ code: "", description: "", zonal_id: "" }); setEditing(null); setModal("create"); };
  const openEdit = (s: StateOffice) => { setEditing(s); setForm({ code: s.code, description: s.description, zonal_id: String(s.zonal_id) }); setModal("edit"); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.zonal_id) { toast.error("Please select a zone"); return; }
    setSaving(true);
    try {
      const payload = { code: form.code, description: form.description, zonal_id: Number(form.zonal_id) };
      if (modal === "create") { await statesApi.create(payload); toast.success("State created"); }
      else if (editing) { await statesApi.update(editing.id, payload); toast.success("State updated"); }
      setModal(null); load();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (s: StateOffice) => {
    if (!confirm(`Delete state "${s.code}"?`)) return;
    try { await statesApi.delete(s.id); toast.success("State deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterZone}
          onChange={e => setFilterZone(e.target.value)}
        >
          <option value="">All Zones</option>
          {zones.map(z => <option key={z.id} value={z.id}>{z.zonal_code} – {z.description}</option>)}
        </select>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] text-white text-sm font-medium rounded-lg hover:bg-[#0d3f6e]">
          <Plus className="w-4 h-4" /> Add State
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Zone</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : states.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">No states found</td></tr>
            ) : states.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{s.code}</td>
                <td className="px-4 py-3 text-gray-700">{s.description}</td>
                <td className="px-4 py-3 text-gray-500">{s.zone?.zonal_code ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(s)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal title={modal === "create" ? "Add State Office" : "Edit State Office"} open={modal !== null} onClose={() => setModal(null)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">State Code <span className="text-red-500">*</span></label>
            <input className={inputCls} placeholder="e.g. LAGOS" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
            <input className={inputCls} placeholder="e.g. Lagos State Office" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Zone <span className="text-red-500">*</span></label>
            <select className={inputCls} value={form.zonal_id} onChange={e => setForm(f => ({ ...f, zonal_id: e.target.value }))} required>
              <option value="">— Select Zone —</option>
              {zones.map(z => <option key={z.id} value={z.id}>{z.zonal_code} – {z.description}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-[#0f4c81] text-white rounded-lg hover:bg-[#0d3f6e] disabled:opacity-60">
              {saving ? "Saving..." : modal === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
