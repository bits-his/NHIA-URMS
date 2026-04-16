/**
 * Re-exports the canonical module list for use in AdminPrivilegesPage.
 * Keys must match ParentModule.title in moduleConfig.ts exactly.
 */
export { MODULE_CONFIG } from "./moduleConfig";

export const ALL_MODULES = [
  { key: "Dashboard",     label: "Dashboard"                     },
  { key: "Finance",       label: "Finance & Admin Dept"          },
  { key: "Standards",     label: "Standards & Quality Assurance" },
  { key: "ICT",           label: "Zonal ICT Support"             },
  { key: "Programmes",    label: "Programmes"                    },
  { key: "SDO",           label: "SDO"                           },
  { key: "Directives",    label: "Directives"                    },
  { key: "Reports",       label: "National Reports / Zonal"      },
  { key: "HQ Data",       label: "HQ Data"                       },
  { key: "Archive",       label: "Archive"                       },
  { key: "Notifications", label: "Notifications"                 },
  { key: "Settings",      label: "Settings (Admin only)"         },
];
