import * as React from "react";
import { Users, MapPin, Building2, Layers } from "lucide-react";
import { usersApi, zonesApi, statesApi, departmentsApi, unitsApi } from "@/lib/adminApi";

interface Stat { label: string; value: number; icon: React.ReactNode; color: string; }

export default function AdminOverview() {
  const [stats, setStats] = React.useState<Stat[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.allSettled([
      usersApi.list(),
      zonesApi.list(),
      statesApi.list(),
      departmentsApi.list(),
      unitsApi.list(),
    ]).then(([users, zones, states, depts, units]) => {
      setStats([
        { label: "Total Users",    value: users.status === "fulfilled" ? users.value.total : 0,                          icon: <Users className="w-5 h-5" />,    color: "bg-blue-500"   },
        { label: "Zonal Offices",  value: zones.status === "fulfilled" ? zones.value.data.length : 0,                    icon: <MapPin className="w-5 h-5" />,   color: "bg-emerald-500"},
        { label: "State Offices",  value: states.status === "fulfilled" ? states.value.data.length : 0,                  icon: <Building2 className="w-5 h-5" />,color: "bg-amber-500"  },
        { label: "Departments",    value: depts.status === "fulfilled" ? depts.value.data.length : 0,                    icon: <Layers className="w-5 h-5" />,   color: "bg-purple-500" },
        { label: "Units",          value: units.status === "fulfilled" ? units.value.data.length : 0,                    icon: <Layers className="w-5 h-5" />,   color: "bg-rose-500"   },
      ]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading overview...</div>;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">System summary at a glance.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center text-white`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
