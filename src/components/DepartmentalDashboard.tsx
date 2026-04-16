import * as React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import {
  ArrowLeft, ChevronRight, TrendingUp, TrendingDown,
  FileText, CheckSquare, Clock, AlertCircle, Users,
  Layers, MapPin, Activity, Building2, Target,
  ClipboardList, CheckCircle2, XCircle, Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "motion/react";
import type { AuthDepartment, AuthUnit } from "@/src/store/authSlice";

//  Department  Units map (mirrors seed data) 
const DEPT_UNITS: Record<string, { code: string; name: string; desc: string }[]> = {
  "Finance & Accounts": [
    { code: "FIN-REV",  name: "Revenue & IGR Unit",        desc: "Internally Generated Revenue tracking and reporting." },
    { code: "FIN-EXP",  name: "Expenditure & Budget Unit", desc: "Budget planning, monitoring and expenditure control." },
    { code: "FIN-ACC",  name: "Accounts & Reconciliation", desc: "Financial reconciliation, ledger management and audit support." },
    { code: "FIN-PAY",  name: "Payroll Unit",               desc: "Staff payroll processing and remittances." },
  ],
  "Health Insurance": [
    { code: "HI-ENR",  name: "Enrolment & Registration",  desc: "GIFSHIP, FSSHIP, BHCPF and other scheme enrolments." },
    { code: "HI-CLM",  name: "Claims Processing Unit",    desc: "Verification and processing of health insurance claims." },
    { code: "HI-HCF",  name: "HCF Accreditation Unit",   desc: "Accreditation and re-accreditation of healthcare facilities." },
    { code: "HI-QA",   name: "Quality Assurance Unit",   desc: "Mystery shopping, QA visits and compliance monitoring." },
  ],
  "ICT & Digital Services": [
    { code: "ICT-SYS",  name: "Systems & Infrastructure", desc: "Server management, network and IT infrastructure." },
    { code: "ICT-DATA", name: "Data Management Unit",     desc: "Database administration, data integrity and reporting." },
    { code: "ICT-DEV",  name: "Software Development",    desc: "Development and maintenance of NHIA digital platforms." },
    { code: "ICT-SUP",  name: "IT Support Unit",         desc: "End-user support, hardware and software troubleshooting." },
  ],
  "Audit & Compliance": [
    { code: "AUD-INT",  name: "Internal Audit Unit",      desc: "Periodic internal audits of financial and operational activities." },
    { code: "AUD-RISK", name: "Risk Management Unit",     desc: "Identification, assessment and mitigation of operational risks." },
    { code: "AUD-COMP", name: "Compliance & Enforcement", desc: "Regulatory compliance monitoring and enforcement actions." },
  ],
  "Human Resources": [
    { code: "HR-REC",  name: "Recruitment & Placement", desc: "Staff recruitment, onboarding and placement." },
    { code: "HR-TRN",  name: "Training & Development",  desc: "Capacity building, training programmes and staff development." },
    { code: "HR-WEL",  name: "Staff Welfare Unit",      desc: "Staff welfare, leave management and benefits administration." },
    { code: "HR-REC2", name: "Records & Documentation", desc: "Staff records, personnel files and HR documentation." },
  ],
  "Planning, Research & Statistics": [
    { code: "PLN-STR",  name: "Strategic Planning Unit", desc: "Corporate strategy, annual plans and performance targets." },
    { code: "PLN-RES",  name: "Research & Policy Unit",  desc: "Health insurance policy research and evidence generation." },
    { code: "PLN-STAT", name: "Statistics & Reporting",  desc: "National data aggregation, statistical analysis and reporting." },
  ],
  "SERVICOM": [
    { code: "SVC-CMP", name: "Complaints Management", desc: "Registration, tracking and resolution of customer complaints." },
    { code: "SVC-SAT", name: "Customer Satisfaction", desc: "Satisfaction surveys, feedback analysis and service improvement." },
    { code: "SVC-STD", name: "Service Standards Unit", desc: "Service charter development and compliance monitoring." },
  ],
  "Special Projects Division": [
    { code: "SPD-CEM",   name: "CEmONC Programme Unit",   desc: "Comprehensive Emergency Obstetric & Newborn Care programme." },
    { code: "SPD-FFP",   name: "FFP Programme Unit",      desc: "Free Family Planning programme coordination." },
    { code: "SPD-BHCPF", name: "BHCPF Coordination Unit", desc: "Basic Health Care Provision Fund programme management." },
    { code: "SPD-PROJ",  name: "Projects Monitoring Unit", desc: "Monitoring and evaluation of special projects and directives." },
  ],
  "Stock Verification Division": [
    { code: "STK-VER", name: "Stock Verification Unit", desc: "Periodic stock-taking and physical verification of assets." },
    { code: "STK-AST", name: "Asset Management Unit",   desc: "Asset register maintenance, tagging and disposal." },
    { code: "STK-INV", name: "Inventory Control Unit",  desc: "Inventory tracking, procurement support and store management." },
  ],
  "Legal Services": [
    { code: "LEG-ADV", name: "Legal Advisory Unit",    desc: "Legal opinions, regulatory interpretation and advisory services." },
    { code: "LEG-CON", name: "Contracts & Agreements", desc: "Drafting, review and management of contracts and MOUs." },
    { code: "LEG-LIT", name: "Litigation Unit",        desc: "Management of court cases and dispute resolution." },
  ],
  "Communications & Public Affairs": [
    { code: "COM-MED", name: "Media & Press Unit",        desc: "Press releases, media appearances and public communications." },
    { code: "COM-ADV", name: "Advocacy & Sensitization",  desc: "Community outreach, advocacy campaigns and sensitization." },
    { code: "COM-STK", name: "Stakeholder Relations Unit", desc: "Stakeholder meetings, partnerships and engagement management." },
  ],
};

//  Deterministic mock data 
function seed(str: string) {
  return str.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

function mockUnitStats(code: string) {
  const s = seed(code);
  const tasks      = 3  + (s % 12);
  const completed  = 1  + (s % tasks);
  const overdue    = s % 4 === 0 ? 1 : 0;
  const reports    = 2  + (s % 8);
  const pending    = s % Math.max(1, reports);
  const compliance = 60 + (s % 38);
  return { tasks, completed, overdue, reports, pending, compliance };
}

function mockDeptQuarterly(deptName: string) {
  const s = seed(deptName);
  return ["Q1","Q2","Q3","Q4"].map((q, i) => ({
    quarter: q,
    reports:  4 + ((s + i * 7)  % 14),
    approved: 2 + ((s + i * 5)  % 10),
    tasks:    5 + ((s + i * 3)  % 12),
  }));
}

function mockMonthlyTrend(deptName: string) {
  const s = seed(deptName);
  return ["Jan","Feb","Mar","Apr","May","Jun"].map((m, i) => ({
    month: m,
    submitted: 3 + ((s + i * 9) % 10),
    approved:  2 + ((s + i * 6) % 8),
  }));
}

function complianceColor(v: number) {
  if (v >= 85) return "text-emerald-600";
  if (v >= 70) return "text-amber-600";
  return "text-rose-600";
}
function complianceBg(v: number) {
  if (v >= 85) return "#25a872";
  if (v >= 70) return "#f59e0b";
  return "#ef4444";
}
