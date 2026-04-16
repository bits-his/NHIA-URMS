import * as React from "react";
import {
  ChevronDown, ChevronRight, Settings, Home, BarChart3, FileText,
  CheckSquare, DollarSign, ShieldCheck, Wifi, LayoutGrid, Briefcase,
  Flag, Database, Archive, Bell, Users, ClipboardList, PackageSearch,
  FolderKanban, Radio, Wrench, MapPin, Scale, Megaphone, BookOpen,
  Activity, TrendingUp,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AccessEntry } from "@/src/access/types";

type View = string;

interface SidebarNavProps {
  role: string;
  access: AccessEntry[];
  view: View;
  setView: (v: View) => void;
  sidebarOpen: boolean;
}

// ─── Icon map — matches MODULE_CONFIG titles ──────────────────────────────────
const MODULE_ICONS: Record<string, React.ReactNode> = {
  "Dashboard":            <Home className="w-4 h-4" />,
  "Annual Reports":       <FileText className="w-4 h-4" />,
  "Finance & Admin":      <DollarSign className="w-4 h-4" />,
  "Standards & Quality":  <ShieldCheck className="w-4 h-4" />,
  "ICT Support":          <Wifi className="w-4 h-4" />,
  "Programmes":           <LayoutGrid className="w-4 h-4" />,
  "SDO":                  <Briefcase className="w-4 h-4" />,
  "Directives":           <Flag className="w-4 h-4" />,
  "Reports":              <BarChart3 className="w-4 h-4" />,
  "HQ Data":              <Database className="w-4 h-4" />,
  "Audit & Compliance":   <ClipboardList className="w-4 h-4" />,
  "Human Resources":      <Users className="w-4 h-4" />,
  "Planning & Research":  <TrendingUp className="w-4 h-4" />,
  "SERVICOM":             <Activity className="w-4 h-4" />,
  "Special Projects":     <FolderKanban className="w-4 h-4" />,
  "Communications":       <Megaphone className="w-4 h-4" />,
  "Legal Services":       <Scale className="w-4 h-4" />,
  "Archive":              <Archive className="w-4 h-4" />,
  "Notifications":        <Bell className="w-4 h-4" />,
  "Settings":             <Settings className="w-4 h-4" />,
};

// ─── Path → view key map for known routed views ───────────────────────────────
const PATH_TO_VIEW: Record<string, string> = {
  "/dashboard":                   "home",
  "/annual-reports/new":          "annual-report",
  "/annual-reports/mine":         "annual-reports-list",
  "/annual-reports/submit":       "report-entry",
  "/annual-reports/review":       "zonal-review",
  "/sdo/stock-verification":      "stock-verification",
  "/sdo/my-verifications":        "stock-verifications-list",
  "/sdo/assets":                  "stock-assets",
  "/settings/users":              "settings",
  "/settings/privileges":         "settings",
  "/settings/zones":              "settings",
  "/settings/states":             "settings",
  "/settings/departments":        "settings",
  "/settings/units":              "settings",
};

// ─── Single child link ────────────────────────────────────────────────────────
function ChildLink({ title, path, view, setView, sidebarOpen }: {
  title: string; path: string; view: View;
  setView: (v: View) => void; sidebarOpen: boolean;
}) {
  const mappedView = PATH_TO_VIEW[path];
  const active = mappedView ? view === mappedView : false;

  return (
    <button
      onClick={() => mappedView && setView(mappedView)}
      className={`w-full flex items-center gap-2.5 pl-7 pr-3 py-2 rounded-xl text-left transition-all group ${
        active
          ? "bg-[#25a872] text-white shadow-md shadow-[#25a872]/30"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      } ${!mappedView ? "opacity-60 cursor-default" : "cursor-pointer"}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
        active ? "bg-white" : "bg-white/30 group-hover:bg-white/60"
      }`} />
      {sidebarOpen && <span className="text-xs font-semibold truncate flex-1">{title}</span>}
      {sidebarOpen && active && <ChevronRight className="w-3 h-3 ml-auto text-white/70 shrink-0" />}
    </button>
  );
}

// ─── Parent module group ──────────────────────────────────────────────────────
function ModuleGroup({ entry, view, setView, sidebarOpen }: {
  entry: AccessEntry;
  view: View;
  setView: (v: View) => void;
  sidebarOpen: boolean;
}) {
  // Auto-open if any child is active
  const hasActiveChild = entry.functionalities.some(funcTitle => {
    const path = `/${entry.access_to.toLowerCase().replace(/\s+/g, "-")}/${funcTitle.toLowerCase().replace(/\s+/g, "-")}`;
    return PATH_TO_VIEW[path] === view;
  });

  const [open, setOpen] = React.useState(hasActiveChild);
  const hasChildren = entry.functionalities.length > 0;
  const icon = MODULE_ICONS[entry.access_to];

  return (
    <div>
      <button
        onClick={() => sidebarOpen && hasChildren && setOpen((o: boolean) => !o)}
        className="w-full flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-xl text-left transition-all group text-white/60 hover:bg-white/10 hover:text-white"
      >
        <span className="shrink-0 text-white/50 group-hover:text-white">
          {icon ?? (
            <span className="w-4 h-4 flex items-center justify-center text-[10px] font-black opacity-70">
              {entry.access_to.slice(0, 2).toUpperCase()}
            </span>
          )}
        </span>
        {sidebarOpen && (
          <>
            <span className="text-xs font-semibold truncate flex-1">{entry.access_to}</span>
            {hasChildren && (
              <span className="shrink-0 text-white/40">
                {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </span>
            )}
          </>
        )}
      </button>

      {sidebarOpen && open && hasChildren && (
        <div className="mt-0.5 space-y-0.5 relative">
          <div className="absolute top-0 bottom-0 w-px bg-white/10 left-[22px]" />
          <div className="space-y-0.5">
            {entry.functionalities.map((funcTitle, i) => {
              const path = `/${entry.access_to.toLowerCase().replace(/\s+/g, "-")}/${funcTitle.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <ChildLink
                  key={i}
                  title={funcTitle}
                  path={path}
                  view={view}
                  setView={setView}
                  sidebarOpen={sidebarOpen}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings leaf (admin only) ───────────────────────────────────────────────
function SettingsLeaf({ view, setView, sidebarOpen }: {
  view: View; setView: (v: View) => void; sidebarOpen: boolean;
}) {
  const active = view === "settings";
  return (
    <button
      onClick={() => setView("settings")}
      className={`w-full flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-xl text-left transition-all group ${
        active
          ? "bg-[#25a872] text-white shadow-md shadow-[#25a872]/30"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className={`shrink-0 ${active ? "text-white" : "text-white/50 group-hover:text-white"}`}>
        <Settings className="w-4 h-4" />
      </span>
      {sidebarOpen && <span className="text-xs font-semibold truncate flex-1">Settings</span>}
      {sidebarOpen && active && <ChevronRight className="w-3 h-3 ml-auto text-white/70 shrink-0" />}
    </button>
  );
}

// ─── Main SidebarNav ──────────────────────────────────────────────────────────
export default function SidebarNav({ role, access, view, setView, sidebarOpen }: SidebarNavProps) {
  return (
    <ScrollArea className="flex-1 px-2 py-2 scrollbar-thin">
      <nav className="space-y-0.5">
        {/* Empty state */}
        {access.length === 0 && role !== "admin" && sidebarOpen && (
          <p className="text-[10px] text-white/30 px-3 py-2 italic">No modules assigned</p>
        )}

        {/* Render modules from user.access */}
        {access.map((entry, i) => (
          <ModuleGroup
            key={i}
            entry={entry}
            view={view}
            setView={setView}
            sidebarOpen={sidebarOpen}
          />
        ))}

        {/* Admin always sees Settings */}
        {role === "admin" && (
          <SettingsLeaf view={view} setView={setView} sidebarOpen={sidebarOpen} />
        )}
      </nav>
    </ScrollArea>
  );
}
