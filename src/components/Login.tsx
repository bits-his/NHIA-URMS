import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ShieldCheck, User, Lock, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ROLES = [
  { value: "state-officer", label: "State Officer" },
  { value: "zonal-director", label: "Zonal Director" },
  { value: "sdo", label: "SDO" },
  { value: "hq-department", label: "HQ Department" },
  { value: "dg-ceo", label: "DG-CEO" },
];

interface LoginProps {
  onLogin: (role: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [staffId, setStaffId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [role, setRole] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Mock auto-detection of role based on Staff ID prefix
  React.useEffect(() => {
    const id = staffId.toUpperCase();
    if (id.startsWith("HQ")) setRole("hq-department");
    else if (id.startsWith("SDO")) setRole("sdo");
    else if (id.startsWith("ZD")) setRole("zonal-director");
    else if (id.startsWith("SO")) setRole("state-officer");
    else if (id.startsWith("DG")) setRole("sdo");
    else if (id.startsWith("AUDIT")) setRole("audit");
  }, [staffId]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (staffId && password && role) {
      toast.success("Authentication successful", {
        description: `Welcome back, ${staffId}. Redirecting to ${ROLES.find(r => r.value === role)?.label} dashboard...`,
      });
      onLogin(role);
    } else {
      setError("Invalid credentials or role not selected.");
      toast.error("Sign in failed", {
        description: "Please check your Staff ID, password and role.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 z-10"
      >
        <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                NHIA URMS
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                Underwriting & Risk Management System
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="staffId" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Staff ID
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="staffId"
                    placeholder="Enter Staff ID (e.g. HQ-123)"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  <a href="#" className="text-[11px] font-medium text-primary hover:underline transition-all">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Access Role
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="h-11 bg-background/50 border-border/50 focus:border-primary/50 transition-all">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {role && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] text-primary font-medium flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    Auto-detected based on Staff ID
                  </motion.p>
                )}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-destructive/10 border border-destructive/20 rounded-md p-3 flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full h-11 font-semibold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  "Sign In to Portal"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-border/50 pt-6">
            <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
              This is a secure government system. Unauthorized access is strictly prohibited and subject to legal action.
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            National Health Insurance Authority
          </p>
        </div>
      </motion.div>
    </div>
  );
}
