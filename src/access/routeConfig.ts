export interface RouteConfig {
  path: string;
  label: string;
  module: string;         // Parent module title
  functionality: string;  // Child functionality title
}

export const ROUTE_CONFIG: RouteConfig[] = [
  { path: "/dashboard",                   label: "Overview",                  module: "Dashboard",         functionality: "Overview"                  },
  { path: "/finance/expenditure",         label: "Expenditure Payments",      module: "Finance",           functionality: "Expenditure Payments"      },
  { path: "/finance/payments",            label: "Payments",                  module: "Finance",           functionality: "Payments"                  },
  { path: "/finance/reporting",           label: "Reporting",                 module: "Finance",           functionality: "Reporting"                 },
  { path: "/finance/financial-reporting", label: "Financial Reporting",       module: "Finance",           functionality: "Financial Reporting"       },
  { path: "/finance/facilities",          label: "Facilities",                module: "Finance",           functionality: "Facilities"                },
  { path: "/finance/hr-support",          label: "HR Support",                module: "Finance",           functionality: "HR Support"                },
  { path: "/standards/qa-officers",       label: "QA Officers",               module: "Standards",         functionality: "QA Officers"               },
  { path: "/standards/complaints",        label: "Enrollee Complaints",       module: "Standards",         functionality: "Enrollee Complaints"       },
  { path: "/ict/support-desk",            label: "ICT Support Desk",          module: "ICT",               functionality: "ICT Support Desk"          },
  { path: "/ict/systems",                 label: "Systems & Network",         module: "ICT",               functionality: "Systems & Network"         },
  { path: "/programmes/activities",       label: "Programme Activities",      module: "Programmes",        functionality: "Programme Activities"      },
  { path: "/sdo/coordination",            label: "State Office Coordination", module: "SDO",               functionality: "State Office Coordination" },
  { path: "/sdo/stock",                   label: "Stock Verification",        module: "SDO",               functionality: "Stock Verification"        },
  { path: "/sdo/servicom",                label: "Servicom",                  module: "SDO",               functionality: "Servicom"                  },
  { path: "/sdo/projects",                label: "Special Projects",          module: "SDO",               functionality: "Special Projects"          },
  { path: "/directives/issue",            label: "Issue Directive",           module: "Directives",        functionality: "Issue Directive"           },
  { path: "/directives/view",             label: "View Directives",           module: "Directives",        functionality: "View Directives"           },
  { path: "/reports/national",            label: "National Reports",          module: "Reports",           functionality: "National Reports"          },
  { path: "/reports/zonal",              label: "Zonal Performance",          module: "Reports",           functionality: "Zonal Performance"         },
  { path: "/hq-data/overview",            label: "Data Overview",             module: "HQ Data",           functionality: "Data Overview"             },
  { path: "/archive",                     label: "Document Archive",          module: "Archive",           functionality: "Document Archive"          },
  { path: "/notifications",               label: "All Notifications",         module: "Notifications",     functionality: "All Notifications"         },
  { path: "/settings/users",              label: "Users",                     module: "Settings",          functionality: "Users"                     },
  { path: "/settings/privileges",         label: "Privileges",                module: "Settings",          functionality: "Privileges"                },
];
