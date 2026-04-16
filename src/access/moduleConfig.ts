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
  // ── Dashboard ──────────────────────────────────────────────────────────────
  {
    title: "Dashboard",
    roles: "all",
    children: [
      { title: "Overview",    path: "/dashboard"            },
      { title: "Statistics",  path: "/dashboard/statistics" },
    ],
  },

  // ── Annual Reports ─────────────────────────────────────────────────────────
  {
    title: "Annual Reports",
    roles: ["admin", "state-officer", "zonal-director", "sdo", "hq-department"],
    children: [
      { title: "New Annual Report",  path: "/annual-reports/new"       },
      { title: "My Submissions",     path: "/annual-reports/mine"      },
      { title: "Submit Report",      path: "/annual-reports/submit"    },
      { title: "Review Reports",     path: "/annual-reports/review"    },
      { title: "Approved Reports",   path: "/annual-reports/approved"  },
    ],
  },

  // ── Finance & Admin Department ─────────────────────────────────────────────
  {
    title: "Finance & Admin",
    roles: ["admin", "hq-department", "zonal-director", "state-officer"],
    children: [
      { title: "Expenditure Payments",  path: "/finance/expenditure"         },
      { title: "Payments",              path: "/finance/payments"             },
      { title: "Reporting",             path: "/finance/reporting"            },
      { title: "Financial Reporting",   path: "/finance/financial-reporting"  },
      { title: "Facilities",            path: "/finance/facilities"           },
      { title: "HR Support",            path: "/finance/hr-support"           },
    ],
  },

  // ── Standards & Quality Assurance ─────────────────────────────────────────
  {
    title: "Standards & Quality",
    roles: ["admin", "hq-department", "zonal-director", "state-officer"],
    children: [
      { title: "QA Officers",           path: "/standards/qa-officers"   },
      { title: "HMO/HCP Accreditation", path: "/standards/accreditation" },
      { title: "Enrollee Complaints",   path: "/standards/complaints"    },
      { title: "SHIA Liaison",          path: "/standards/shia"          },
    ],
  },

  // ── Zonal ICT Support ──────────────────────────────────────────────────────
  {
    title: "ICT Support",
    roles: ["admin", "zonal-director", "sdo", "hq-department"],
    children: [
      { title: "ICT Support Desk",  path: "/ict/support-desk" },
      { title: "Systems & Network", path: "/ict/systems"       },
      { title: "User Management",   path: "/ict/users"         },
      { title: "System Logs",       path: "/ict/logs"          },
    ],
  },

  // ── Programmes ─────────────────────────────────────────────────────────────
  {
    title: "Programmes",
    roles: ["admin", "hq-department", "zonal-director", "state-officer", "sdo"],
    children: [
      { title: "Programme Activities",  path: "/programmes/activities"  },
      { title: "GIFSHIP",               path: "/programmes/gifship"     },
      { title: "BHCPF",                 path: "/programmes/bhcpf"       },
      { title: "CEmONC",                path: "/programmes/cemonc"      },
      { title: "FFP",                   path: "/programmes/ffp"         },
      { title: "FSSHIP",                path: "/programmes/fsship"      },
    ],
  },

  // ── SDO ────────────────────────────────────────────────────────────────────
  {
    title: "SDO",
    roles: ["admin", "sdo", "zonal-director", "state-officer"],
    children: [
      { title: "State Office Coordination", path: "/sdo/coordination"        },
      { title: "Stock Verification",        path: "/sdo/stock-verification"  },
      { title: "My Verifications",          path: "/sdo/my-verifications"    },
      { title: "Asset Register",            path: "/sdo/assets"              },
      { title: "Servicom",                  path: "/sdo/servicom"            },
      { title: "Special Projects",          path: "/sdo/projects"            },
      { title: "SDO Performance",           path: "/sdo/performance"         },
    ],
  },

  // ── Directives ─────────────────────────────────────────────────────────────
  {
    title: "Directives",
    roles: ["admin", "dg-ceo", "hq-department", "zonal-director"],
    children: [
      { title: "Issue Directive",   path: "/directives/issue"   },
      { title: "View Directives",   path: "/directives/view"    },
      { title: "Pending Directives",path: "/directives/pending" },
      { title: "Completed",         path: "/directives/done"    },
    ],
  },

  // ── Reports ────────────────────────────────────────────────────────────────
  {
    title: "Reports",
    roles: ["admin", "dg-ceo", "hq-department", "zonal-director", "sdo"],
    children: [
      { title: "National Reports",   path: "/reports/national"    },
      { title: "Zonal Performance",  path: "/reports/zonal"       },
      { title: "State Performance",  path: "/reports/state"       },
      { title: "SDO Performance",    path: "/reports/sdo"         },
      { title: "Compliance Reports", path: "/reports/compliance"  },
    ],
  },

  // ── HQ Data ────────────────────────────────────────────────────────────────
  {
    title: "HQ Data",
    roles: ["admin", "hq-department", "dg-ceo", "zonal-director"],
    children: [
      { title: "Data Overview",    path: "/hq-data/overview"    },
      { title: "Data Entry",       path: "/hq-data/entry"       },
      { title: "Data Validation",  path: "/hq-data/validation"  },
      { title: "Export Data",      path: "/hq-data/export"      },
    ],
  },

  // ── Audit & Compliance ─────────────────────────────────────────────────────
  {
    title: "Audit & Compliance",
    roles: ["admin", "dg-ceo", "hq-department"],
    children: [
      { title: "Audit Log",          path: "/audit/log"          },
      { title: "Compliance Checks",  path: "/audit/compliance"   },
      { title: "Flagged Reports",    path: "/audit/flagged"      },
      { title: "Audit Reports",      path: "/audit/reports"      },
    ],
  },

  // ── Human Resources ────────────────────────────────────────────────────────
  {
    title: "Human Resources",
    roles: ["admin", "hq-department"],
    children: [
      { title: "Staff Records",     path: "/hr/staff"       },
      { title: "Leave Management",  path: "/hr/leave"       },
      { title: "Payroll",           path: "/hr/payroll"     },
      { title: "Training",          path: "/hr/training"    },
    ],
  },

  // ── Planning, Research & Statistics ───────────────────────────────────────
  {
    title: "Planning & Research",
    roles: ["admin", "hq-department", "dg-ceo"],
    children: [
      { title: "Strategic Plans",   path: "/planning/strategic"  },
      { title: "Research Reports",  path: "/planning/research"   },
      { title: "Statistics",        path: "/planning/statistics" },
    ],
  },

  // ── SERVICOM ───────────────────────────────────────────────────────────────
  {
    title: "SERVICOM",
    roles: ["admin", "hq-department", "zonal-director", "state-officer", "sdo"],
    children: [
      { title: "Service Charter",   path: "/servicom/charter"   },
      { title: "Complaints",        path: "/servicom/complaints"},
      { title: "Reports",           path: "/servicom/reports"   },
    ],
  },

  // ── Special Projects ───────────────────────────────────────────────────────
  {
    title: "Special Projects",
    roles: ["admin", "hq-department", "dg-ceo", "zonal-director"],
    children: [
      { title: "Active Projects",    path: "/projects/active"    },
      { title: "Project Reports",    path: "/projects/reports"   },
      { title: "Project Archive",    path: "/projects/archive"   },
    ],
  },

  // ── Communications & Public Affairs ───────────────────────────────────────
  {
    title: "Communications",
    roles: ["admin", "hq-department", "dg-ceo"],
    children: [
      { title: "Press Releases",    path: "/comms/press"        },
      { title: "Announcements",     path: "/comms/announcements"},
      { title: "Media Relations",   path: "/comms/media"        },
    ],
  },

  // ── Legal Services ─────────────────────────────────────────────────────────
  {
    title: "Legal Services",
    roles: ["admin", "hq-department", "dg-ceo"],
    children: [
      { title: "Legal Documents",   path: "/legal/documents"  },
      { title: "Contracts",         path: "/legal/contracts"  },
      { title: "Litigation",        path: "/legal/litigation" },
    ],
  },

  // ── Archive ────────────────────────────────────────────────────────────────
  {
    title: "Archive",
    roles: "all",
    children: [
      { title: "Document Archive",  path: "/archive/documents" },
      { title: "Report Archive",    path: "/archive/reports"   },
    ],
  },

  // ── Notifications ──────────────────────────────────────────────────────────
  {
    title: "Notifications",
    roles: "all",
    children: [
      { title: "All Notifications", path: "/notifications"        },
      { title: "Unread",            path: "/notifications/unread" },
    ],
  },

  // ── Settings (admin only) ──────────────────────────────────────────────────
  {
    title: "Settings",
    roles: ["admin"],
    children: [
      { title: "Users",       path: "/settings/users"       },
      { title: "Privileges",  path: "/settings/privileges"  },
      { title: "Zones",       path: "/settings/zones"       },
      { title: "States",      path: "/settings/states"      },
      { title: "Departments", path: "/settings/departments" },
      { title: "Units",       path: "/settings/units"       },
    ],
  },
];
