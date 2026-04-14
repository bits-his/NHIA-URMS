/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import Login from "@/src/components/Login";
import Dashboard from "@/src/components/Dashboard";
import { Toaster } from "@/components/ui/sonner";

type Role = "state-officer" | "zonal-director" | "sdo" | "hq-department" | "audit";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState<Role>("state-officer");

  // Mock login handler
  const handleLogin = (role: string) => {
    setUserRole(role as Role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard role={userRole} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <Toaster position="top-right" />
    </>
  );
}
