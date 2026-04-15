import * as React from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { departmentsApi, type Department } from "@/lib/adminApi";
import AdminModal from "./AdminModal";

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function AdminDepartmentsPage() {
  const [depts, setDepts] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set());
  const [modal, setModal] = React.useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = React.useState<Department | null>(null);
  const [form, setForm] = React.useState({ department_code: "", name: "", description: "" });
  const [saving, setSaving] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await departmentsApi.list(); setDepts(r.data); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ department_code: "", name: "", description: "" }); setEditing(null); setModal("create"); };
  const openEdit = (d: Department) => { setEditing(d); setForm({ department_code: d.department_code, name: d.name, description: d.description || "" }); setModal("edit"); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === "create") { await departmentsApi.create(form); toast.success("Department created"); }
      else if (editing) { await departmentsApi.update(editing.id, form); toast.success("Department updated"); }
      setModal(null); load();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (d: Department) => {
    if (!confirm(`Delete department "${d.name}"?`)) return;
    try { await departmentsApi.delete(d.id); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  const toggleExpand = (id: number) => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] text-white text-sm font-medium rounded-lg hover:bg-[#0d3f6e]">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8" />
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Units</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : depts.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No departments yet</td></tr>
            ) : depts.map(d => (
              <React.Fragment key={d.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {(d.units?.length ?? 0) > 0 && (
                      <button onClick={() => toggleExpand(d.id)} className="p-0.5 text-gray-400 hover:text-gray-600">
                        {expanded.has(d.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{d.department_code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">{d.description || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{d.units?.length ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(d)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(d)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
                {expanded.has(d.id) && d.units?.map(u => (
                  <tr key={u.id} className="bg-blue-50/40">
                    <td className="px-4 py-2" />
                    <td className="px-4 py-2 pl-8 font-mono text-xs text-blue-700">{u.unit_code}</td>
                    <td className="px-4 py-2 text-xs text-gray-600" colSpan={4}>{u.name}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal title={modal === "create" ? "Add Department" : "Edit Department"} open={modal !== null} onClose={() => setModal(null)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Department Code <span className="text-red-500">*</span></label>
            <input className={inputCls} placeholder="e.g. DEPT-001" value={form.department_code} onChange={e => setForm(f => ({ ...f, department_code: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input className={inputCls} placeholder="e.g. Underwriting" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
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
