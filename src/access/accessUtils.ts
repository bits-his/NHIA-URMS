import type { AccessEntry, AccessUser } from "./types";
import type { ParentModule } from "./moduleConfig";

export function findEntry(user: AccessUser, moduleTitle: string): AccessEntry | undefined {
  return (user.access ?? []).find(e => e.access_to === moduleTitle);
}

export function canAccessModule(mod: ParentModule, user: AccessUser): boolean {
  if (user.role === "admin") return true;
  if (mod.roles !== "all" && !(mod.roles as string[]).includes(user.role)) return false;
  return !!(user.access ?? []).find(e => e.access_to === mod.title);
}

export function canAccessFunctionality(moduleTitle: string, functionalityTitle: string, user: AccessUser): boolean {
  if (user.role === "admin") return true;
  const entry = findEntry(user, moduleTitle);
  if (!entry) return false;
  return entry.functionalities.includes(functionalityTitle);
}

/**
 * Build the visible sidebar from user.access — fully dynamic, no hardcoding.
 * Order follows the user's access array order.
 */
export function filterSidebar(
  config: ParentModule[],
  user: AccessUser
): Array<ParentModule & { visibleChildren: ParentModule["children"] }> {
  if (user.role === "admin") {
    return config.map(mod => ({ ...mod, visibleChildren: mod.children }));
  }

  const result: Array<ParentModule & { visibleChildren: ParentModule["children"] }> = [];

  for (const entry of (user.access ?? [])) {
    const mod = config.find(m => m.title === entry.access_to);
    if (!mod) continue;
    if (mod.roles !== "all" && !(mod.roles as string[]).includes(user.role)) continue;

    const visibleChildren = mod.children.filter(c =>
      entry.functionalities.includes(c.title)
    );
    if (visibleChildren.length > 0) {
      result.push({ ...mod, visibleChildren });
    }
  }

  return result;
}
