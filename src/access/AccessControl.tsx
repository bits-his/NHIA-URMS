import * as React from "react";
import { useHasAccess, useHasModuleAccess } from "./useHasAccess";

interface Props {
  /** Parent module title */
  module: string;
  /** Child functionality title — if omitted, only module-level access is checked */
  functionality?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the user has access.
 *
 * Module-level:
 *   <AccessControl module="Finance">...</AccessControl>
 *
 * Functionality-level:
 *   <AccessControl module="Zonal ICT Support" functionality="System Logs">
 *     <Button>View Logs</Button>
 *   </AccessControl>
 */
export default function AccessControl({ module, functionality, children, fallback = null }: Props) {
  const moduleOk = useHasModuleAccess(module);
  const funcOk   = useHasAccess(module, functionality ?? "");

  const allowed = functionality ? (moduleOk && funcOk) : moduleOk;
  return allowed ? <>{children}</> : <>{fallback}</>;
}
