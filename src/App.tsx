/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import Login from "@/src/components/Login";
import Dashboard from "@/src/components/Dashboard";
import AdminLogin from "@/src/components/admin/AdminLogin";
import AdminDashboard from "@/src/components/admin/AdminDashboard";
import { Toaster } from "@/components/ui/sonner";
import { tokenStore, authApi, type AdminUser } from "@/lib/adminApi";

type Role = "state-officer" | "zonal-director" | "sdo" | "hq-department" | "audit";

// Detect if we're on the admin route
const isAdminRoute = () =>
  window.location.pathname.startsWith("/admin") ||
  window.location.search.includes("admin=1");

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState<Role>("state-officer");

  // Admin state
  const [adminMode] = React.useState(isAdminRoute);
  const [adminUser, setAdminUser] = React.useState<AdminUser | null>(null);
  const [adminChecking, setAdminChecking] = React.useState(adminMode);

  // On mount, try to restore admin session from stored token
  React.useEffect(() => {
    if (!adminMode) return;
    const token = tokenStore.get();
    if (!token) { setAdminChecking(false); return; }
    authApi.me()
      .then(r => { if (r.user.role === "admin") setAdminUser(r.user); })
      .catch(() => tokenStore.clear())
      .finally(() => setAdminChecking(false));
  }, [adminMode]);

  // ── Admin flow ────────────────────────────────────────────────────────────
  if (adminMode) {
    if (adminChecking) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      );
    }
    if (!adminUser) {
      return (
        <>
          <AdminLogin onLogin={setAdminUser} />
          <Toaster position="top-right" />
        </>
      );
    }
    return (
      <>
        <AdminDashboard user={adminUser} onLogout={() => setAdminUser(null)} />
        <Toaster position="top-right" />
      </>
    );
  }

  // ── Regular user flow ─────────────────────────────────────────────────────
  const handleLogin = (role: string) => {
    setUserRole(role as Role);
    setIsAuthenticated(true);
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard role={userRole} onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <Toaster position="top-right" />
    </>
  );
}
