import { useAppSelector } from "@/src/store/hooks";
import { canAccessModule, canAccessFunctionality } from "./accessUtils";
import { MODULE_CONFIG } from "./moduleConfig";

/**
 * Check access to a parent module only.
 *   const ok = useHasAccess("Finance");
 */
export function useHasModuleAccess(moduleName: string): boolean {
  const user = useAppSelector(s => s.auth.user);
  if (!user) return false;
  const mod = MODULE_CONFIG.find(m => m.title === moduleName);
  if (!mod) return false;
  return canAccessModule(mod, { role: user.role, access: user.access });
}

/**
 * Check access to a specific child functionality inside a module.
 *   const ok = useHasAccess("Zonal ICT Support", "System Logs");
 */
export function useHasAccess(moduleName: string, functionalityName: string): boolean {
  const user = useAppSelector(s => s.auth.user);
  if (!user) return false;
  return canAccessFunctionality(moduleName, functionalityName, {
    role: user.role,
    access: user.access,
  });
}
