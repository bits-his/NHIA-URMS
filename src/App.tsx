import * as React from "react";
import Login from "@/src/components/Login";
import Dashboard from "@/src/components/Dashboard";
import { Toaster } from "@/components/ui/sonner";
import type { AccessEntry } from "@/src/access/types";

type Role = "state-officer" | "zonal-director" | "sdo" | "hq-department" | "audit" | "dg-ceo" | "admin";

export interface UserContext {
  role: Role;
  staffId: string;
  // These come from the backend in real auth; for mock we leave them null
  zoneId: string | null;
  stateId: string | null;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState<Role>("state-officer");
  const [access, setAccess] = React.useState<AccessEntry[]>([]);

  const handleLogin = (role: string, accessArr: AccessEntry[]) => {
    setUserRole(role as Role);
    setAccess(accessArr);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccess([]);
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard role={userRole} access={access} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <Toaster position="top-right" />
    </>
  );
}
