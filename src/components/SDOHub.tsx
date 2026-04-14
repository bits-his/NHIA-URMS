import * as React from "react";
import { 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  Filter, 
  Layers, 
  LayoutDashboard, 
  MapPin, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Send, 
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Share2
} from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { NigeriaMap } from "./NigeriaMap";

// --- Mock Data ---

const ZONES = [
  { id: "SE", name: "South East", status: "red", compliance: 75, reports: "9/12" },
  { id: "SW", name: "South West", status: "green", compliance: 98, reports: "18/18" },
  { id: "NC", name: "North Central", status: "green", compliance: 92, reports: "14/15" },
  { id: "NW", name: "North West", status: "green", compliance: 95, reports: "19/20" },
  { id: "NE", name: "North East", status: "yellow", compliance: 88, reports: "10/12" },
  { id: "LZ", name: "Lagos Zone", status: "green", compliance: 96, reports: "5/5" },
];

const INCOMING_REPORTS = [
  { id: "REP-901", zone: "SW", state: "Lagos", type: "Monthly Ops", time: "10 mins ago", status: "New" },
  { id: "REP-902", zone: "NW", state: "Kano", type: "Financial", time: "25 mins ago", status: "New" },
  { id: "REP-903", zone: "NC", state: "Plateau", type: "Enrolment", time: "1 hour ago", status: "Processing" },
  { id: "REP-904", zone: "SE", state: "Enugu", type: "Monthly Ops", time: "2 hours ago", status: "New" },
  { id: "REP-905", zone: "NE", state: "Borno", type: "Emergency", time: "3 hours ago", status: "Flagged" },
  { id: "REP-906", zone: "LZ", state: "Lagos HQ", type: "Audit", time: "4 hours ago", status: "New" },
];

const DIRECTIVES = [
  { id: "DIR-042", title: "Q4 Enrolment Audit", status: "In Progress", progress: 65, zones: "All" },
  { id: "DIR-045", title: "Facility Accreditation", status: "Issued", progress: 10, zones: "SW, SS" },
  { id: "DIR-039", title: "Staff ID Harmonization", status: "Resolved", progress: 100, zones: "HQ" },
  { id: "DIR-048", title: "Emergency Fund Review", status: "In Progress", progress: 30, zones: "NE, NW" },
];

const DEPARTMENTS = [
  "Finance & Accounts",
  "Health Insurance",
  "ICT & Digital",
  "Audit & Compliance",
  "Human Resources"
];

// --- Components ---

const ZoneCard = ({ zone }: { zone: typeof ZONES[0] }) => (
  <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
    <div className={`absolute top-0 left-0 w-1 h-full ${
      zone.status === 'green' ? 'bg-emerald-500' : 
      zone.status === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'
    }`} />
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <Badge variant="outline" className="text-[10px] font-bold">{zone.id}</Badge>
        <div className={`w-2 h-2 rounded-full ${
          zone.status === 'green' ? 'bg-emerald-500' : 
          zone.status === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'
        } animate-pulse`} />
      </div>
      <h4 className="text-sm font-bold text-slate-900 truncate">{zone.name}</h4>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Compliance</p>
          <p className="text-lg font-bold text-slate-800">{zone.compliance}%</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Reports</p>
          <p className="text-xs font-medium text-slate-600">{zone.reports}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function SDOHub() {
  const [filterZone, setFilterZone] = React.useState<string>("All");

  const filteredReports = filterZone === "All" 
    ? INCOMING_REPORTS 
    : INCOMING_REPORTS.filter(r => r.zone === filterZone);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Zone Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {ZONES.map((zone, idx) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <ZoneCard zone={zone} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Incoming Reports Feed */}
        <Card className="lg:col-span-8 border-none shadow-md overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Incoming Zonal Reports
                </CardTitle>
                <CardDescription>Real-time stream of state submissions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search reports..." 
                    className="pl-9 h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="w-4 h-4" /> {filterZone}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterZone("All")}>All Zones</DropdownMenuItem>
                    {ZONES.map(z => (
                      <DropdownMenuItem key={z.id} onClick={() => setFilterZone(z.id)}>{z.name}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-slate-50/30 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Route To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="group hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-mono text-xs font-bold text-primary">{report.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{report.zone}</Badge>
                          <span className="text-sm font-medium">{report.state}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{report.type}</TableCell>
                      <TableCell className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {report.time}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={report.status === 'Flagged' ? 'destructive' : 'outline'} 
                          className={`text-[10px] ${report.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Send className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[200px]">
                            <p className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Department</p>
                            {DEPARTMENTS.map(dept => (
                              <DropdownMenuItem key={dept} className="text-xs">
                                {dept}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 3. Directive Tracking Widget */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Directive Tracking</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Status of strategic instructions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {DIRECTIVES.map((d) => (
                <div key={d.id} className="p-3 rounded-xl border bg-slate-50/30 hover:bg-slate-50 transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{d.title}</h5>
                      <p className="text-[10px] text-muted-foreground mt-0.5">ID: {d.id} • Zones: {d.zones}</p>
                    </div>
                    <Badge 
                      className={`text-[9px] px-1.5 py-0 ${
                        d.status === 'Resolved' ? 'bg-emerald-500' : 
                        d.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-500'
                      }`}
                    >
                      {d.status}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-slate-900">{d.progress}%</span>
                    </div>
                    <Progress value={d.progress} className="h-1" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs font-bold gap-2 mt-2">
                View All Directives <ArrowRight className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>

          {/* 4. Quick Links / Navigation */}
          <Card className="border-none shadow-md bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/70">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="ghost" className="justify-start text-xs h-9 gap-2 hover:bg-white">
                <LayoutDashboard className="w-4 h-4" /> HQ Dept. View
              </Button>
              <Button variant="ghost" className="justify-start text-xs h-9 gap-2 hover:bg-white">
                <ShieldAlert className="w-4 h-4" /> Audit Hub
              </Button>
              <Button variant="ghost" className="justify-start text-xs h-9 gap-2 hover:bg-white">
                <Layers className="w-4 h-4" /> Archive
              </Button>
              <Button variant="ghost" className="justify-start text-xs h-9 gap-2 hover:bg-white">
                <ExternalLink className="w-4 h-4" /> Tracker
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. Bottom Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-2xl border shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">National Aggregation Ready</h4>
            <p className="text-xs text-muted-foreground">All 6 zones have submitted at least 80% of their reports.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2">
            <Share2 className="w-4 h-4" /> Share Hub
          </Button>
          <Button className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 gap-2 shadow-lg shadow-slate-200">
            <Download className="w-4 h-4" /> Export All Reports
          </Button>
        </div>
      </div>
    </div>
  );
}
