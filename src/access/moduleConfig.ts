export type UserRole =
  | "admin" | "state-officer" | "zonal-director"
  | "sdo"   | "hq-department" | "dg-ceo";

export interface ChildModule {
  title: string;   // Must match functionality name in user.access
  path: string;
}

export interface ParentModule {
  title: string;   // Must match access_to in user.access
  roles: UserRole[] | "all";
  children: ChildModule[];
}

export const MODULE_CONFIG: ParentModule[] = [
  {
    title: "Dashboard", roles: "all",
    children: [{ title: "Overview", path: "/dashboard" }],
  },
  {
    title: "Finance",
    roles: ["admin", "hq-department", "zonal-director"],
    children: [
      { title: "Expenditure Payments", path: "/finance/expenditure"        },
      { title: "Payments",             path: "/finance/payments"            },
      { title: "Reporting",            path: "/finance/reporting"           },
      { title: "Financial Reporting",  path: "/finance/financial-reporting" },
      { title: "Facilities",           path: "/finance/facilities"          },
      { title: "HR Support",           path: "/finance/hr-support"          },
    ],
  },
  {
    title: "Standards",
    roles: ["admin", "hq-department", "zonal-director", "state-officer"],
    children: [
      { title: "QA Officers",         path: "/standards/qa-officers" },
      { title: "Enrollee Complaints", path: "/standards/complaints"  },
    ],
  },
  {
    title: "ICT",
    roles: ["admin", "zonal-director", "sdo"],
    children: [
      { title: "ICT Support Desk",  path: "/ict/support-desk" },
      { title: "Systems & Network", path: "/ict/systems"       },
    ],
  },
  {
    title: "Programmes",
    roles: ["admin", "hq-department", "zonal-director", "state-officer"],
    children: [
      { title: "Programme Activities", path: "/programmes/activities" },
    ],
  },
  {
    title: "SDO",
    roles: ["admin", "sdo", "zonal-director"],
    children: [
      { title: "State Office Coordination", path: "/sdo/coordination" },
      { title: "Stock Verification",        path: "/sdo/stock"        },
      { title: "Servicom",                  path: "/sdo/servicom"     },
      { title: "Special Projects",          path: "/sdo/projects"     },
    ],
  },
  {
    title: "Directives",
    roles: ["admin", "dg-ceo"],
    children: [
      { title: "Issue Directive", path: "/directives/issue" },
      { title: "View Directives", path: "/directives/view"  },
    ],
  },
  {
    title: "Reports",
    roles: ["admin", "dg-ceo", "hq-department", "zonal-director"],
    children: [
      { title: "National Reports",  path: "/reports/national" },
      { title: "Zonal Performance", path: "/reports/zonal"    },
    ],
  },
  {
    title: "HQ Data",
    roles: ["admin", "hq-department", "dg-ceo"],
    children: [{ title: "Data Overview", path: "/hq-data/overview" }],
  },
  {
    title: "Archive", roles: "all",
    children: [{ title: "Document Archive", path: "/archive" }],
  },
  {
    title: "Notifications", roles: "all",
    children: [{ title: "All Notifications", path: "/notifications" }],
  },
  {
    title: "Settings", roles: ["admin"],
    children: [
      { title: "Users",       path: "/settings/users"      },
      { title: "Privileges",  path: "/settings/privileges" },
      { title: "Zones",       path: "/settings/zones"      },
      { title: "States",      path: "/settings/states"     },
      { title: "Departments", path: "/settings/departments"},
      { title: "Units",       path: "/settings/units"      },
    ],
  },
];
