import * as React from "react";
import { Users, MapPin, Building2, Layers, LayoutDashboard, LogOut, Menu, X, Shield } from "lucide-react";
import { toast } from "sonner";
import { tokenStore, type AdminUser } from "@/lib/adminApi";
import AdminUsersPage from "./AdminUsersPage";
import AdminZonesPage from "./AdminZonesPage";
import AdminStatesPage from "./AdminStatesPage";
import AdminDepartmentsPage from "./AdminDepartmentsPage";
import AdminUnitsPage from "./AdminUnitsPage";
import AdminOverview from "./AdminOverview";

type AdminView = "overview" | "users" | "zones" | "states" | "departments" | "units";

const NAV = [
  { id: "overview" as AdminView,     label: "Overview",     icon: LayoutDashboard },
  { id: "users" as AdminView,        label: "Users",        icon: Users },
  { id: "zones" as AdminView,        label: "Zonal Offices",icon: MapPin },
  { id: "states" as AdminView,       label: "State Offices",icon: Building2 },
  { id: "departments" as AdminView,  label: "Departments",  icon: Layers },
  { id: "units" as AdminView,        label: "Units",        icon: Layers },
];

interface Props { user: AdminUser; onLogout: () => void; }

export default function AdminDashboard({ user, onLogout }: Props) {
  const [view, setView] = React.useState<AdminView>("overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    tokenStore.clear();
    toast.success("Logged out");
    onLogout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">NHIA Admin</p>
          <p className="text-white/60 text-xs">Control Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setView(id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              view === id
                ? "bg-white/20 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user.name}</p>
            <p className="text-white/50 text-xs truncate">{user.staff_id}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-[#0f4c81] flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-[#0f4c81] flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-gray-800">
            {NAV.find(n => n.id === view)?.label ?? "Admin"}
          </h1>
          <span className="ml-auto text-xs text-gray-400 hidden sm:block">
            NHIA Underwriting & Risk Management System
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {view === "overview"    && <AdminOverview />}
          {view === "users"       && <AdminUsersPage />}
          {view === "zones"       && <AdminZonesPage />}
          {view === "states"      && <AdminStatesPage />}
          {view === "departments" && <AdminDepartmentsPage />}
          {view === "units"       && <AdminUnitsPage />}
        </main>
      </div>
    </div>
  );
}
