/**
 * Role helpers — roles are stored in the database and managed under Settings → Roles.
 * Use rolesApi.list() for the live role list; these helpers are for UI access checks.
 */
export function hasModuleAccess(
  access: { access_to: string; functionalities: string[] }[],
  moduleTitle: string,
  role?: string,
): boolean {
  if (role === "admin") return true;
  return access.some((e) => e.access_to === moduleTitle);
}
