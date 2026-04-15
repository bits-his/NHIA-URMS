import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { zonesApi, type ZonalOffice } from "@/lib/adminApi";
import AdminModal from "./AdminModal";

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function AdminZonesPage() {
  const [zones, setZones] = React.useState<ZonalOffice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modal, setModal] = React.useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = React.useState<ZonalOffice | null>(null);
  const [form, setForm] = React.useState({ zonal_code: "", description: "" });
  const [saving, setSaving] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await zonesApi.list(); setZones(r.data); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ zonal_code: "", description: "" }); setEditing(null); setModal("create"); };
  const openEdit = (z: ZonalOffice) => { setEditing(z); setForm({ zonal_code: z.zonal_code, description: z.description }); setModal("edit"); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === "create") { await zonesApi.create(form); toast.success("Zone created"); }
      else if (editing) { await zonesApi.update(editing.id, form); toast.success("Zone updated"); }
      setModal(null); load();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (z: ZonalOffice) => {
    if (!confirm(`Delete zone "${z.zonal_code}"?`)) return;
    try { await zonesApi.delete(z.id); toast.success("Zone deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] text-white text-sm font-medium rounded-lg hover:bg-[#0d3f6e]">
          <Plus className="w-4 h-4" /> Add Zone
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">States</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : zones.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">No zones yet</td></tr>
            ) : zones.map(z => (
              <tr key={z.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{z.zonal_code}</td>
                <td className="px-4 py-3 text-gray-700">{z.description}</td>
                <td className="px-4 py-3 text-gray-500">{z.states?.length ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(z)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(z)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal title={modal === "create" ? "Add Zonal Office" : "Edit Zonal Office"} open={modal !== null} onClose={() => setModal(null)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Zonal Code <span className="text-red-500">*</span></label>
            <input className={inputCls} placeholder="e.g. ZONE-1" value={form.zonal_code} onChange={e => setForm(f => ({ ...f, zonal_code: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
            <input className={inputCls} placeholder="e.g. Northwest" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
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
