import * as React from "react";
import { useAppSelector } from "@/src/store/hooks";
import { MODULE_CONFIG } from "./moduleConfig";
import { canAccessModule, canAccessFunctionality } from "./accessUtils";

interface Props {
  /** Parent module this route belongs to */
  module?: string;
  /** Specific child functionality required */
  functionality?: string;
  children: React.ReactNode;
}

/**
 * Guards a page/view.
 *
 * Auth only:
 *   <ProtectedRoute>...</ProtectedRoute>
 *
 * Module + functionality:
 *   <ProtectedRoute module="Zonal ICT Support" functionality="System Logs">
 *     <SystemLogsPage />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ module, functionality, children }: Props) {
  const user  = useAppSelector(s => s.auth.user);
  const token = useAppSelector(s => s.auth.token) ?? localStorage.getItem("nhia@token");

  if (!user || !token) return <Denied type="unauthenticated" />;

  if (module) {
    const mod = MODULE_CONFIG.find(m => m.title === module);
    const accessUser = { role: user.role, access: user.access };

    if (!mod || !canAccessModule(mod, accessUser)) {
      return <Denied type="unauthorized" />;
    }

    if (functionality && !canAccessFunctionality(module, functionality, accessUser)) {
      return <Denied type="unauthorized" />;
    }
  }

  return <>{children}</>;
}

function Denied({ type }: { type: "unauthenticated" | "unauthorized" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f5]">
      <div className="text-center space-y-2 p-8 bg-white rounded-2xl border border-[#d4e8dc] shadow-sm max-w-sm">
        <p className="text-3xl">{type === "unauthenticated" ? "🔑" : "🚫"}</p>
        <p className="text-sm font-bold text-slate-800">
          {type === "unauthenticated" ? "Sign in required" : "Access Denied"}
        </p>
        <p className="text-xs text-slate-400">
          {type === "unauthenticated"
            ? "Please log in to continue."
            : "You don't have permission to access this feature."}
        </p>
      </div>
    </div>
  );
}
