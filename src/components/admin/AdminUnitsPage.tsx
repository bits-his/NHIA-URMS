import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { unitsApi, departmentsApi, type Unit, type Department } from "@/lib/adminApi";
import AdminModal from "./AdminModal";

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function AdminUnitsPage() {
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [depts, setDepts] = React.useState<Department[]>([]);
  const [filterDept, setFilterDept] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [modal, setModal] = React.useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = React.useState<Unit | null>(null);
  const [form, setForm] = React.useState({ unit_code: "", name: "", description: "", department_id: "" });
  const [saving, setSaving] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await unitsApi.list(filterDept ? Number(filterDept) : undefined); setUnits(r.data); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { load(); }, [filterDept]);
  React.useEffect(() => { departmentsApi.list().then(r => setDepts(r.data)).catch(() => {}); }, []);

  const openCreate = () => { setForm({ unit_code: "", name: "", description: "", department_id: "" }); setEditing(null); setModal("create"); };
  const openEdit = (u: Unit) => { setEditing(u); setForm({ unit_code: u.unit_code, name: u.name, description: u.description || "", department_id: String(u.department_id) }); setModal("edit"); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.department_id) { toast.error("Please select a department"); return; }
    setSaving(true);
    try {
      const payload = { unit_code: form.unit_code, name: form.name, description: form.description, department_id: Number(form.department_id) };
      if (modal === "create") { await unitsApi.create(payload); toast.success("Unit created"); }
      else if (editing) { await unitsApi.update(editing.id, payload); toast.success("Unit updated"); }
      setModal(null); load();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (u: Unit) => {
    if (!confirm(`Delete unit "${u.name}"?`)) return;
    try { await unitsApi.delete(u.id); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {depts.map(d => <option key={d.id} value={d.id}>{d.department_code} – {d.name}</option>)}
        </select>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] text-white text-sm font-medium rounded-lg hover:bg-[#0d3f6e]">
          <Plus className="w-4 h-4" /> Add Unit
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Description</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : units.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">No units found</td></tr>
            ) : units.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{u.unit_code}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.department?.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{u.description || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(u)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal title={modal === "create" ? "Add Unit" : "Edit Unit"} open={modal !== null} onClose={() => setModal(null)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Unit Code <span className="text-red-500">*</span></label>
            <input className={inputCls} placeholder="e.g. UNIT-001" value={form.unit_code} onChange={e => setForm(f => ({ ...f, unit_code: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input className={inputCls} placeholder="e.g. Claims Processing" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
            <select className={inputCls} value={form.department_id} onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))} required>
              <option value="">— Select Department —</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.department_code} – {d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea className={inputCls} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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
