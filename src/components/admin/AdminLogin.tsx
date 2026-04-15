import * as React from "react";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { authApi, tokenStore, type AdminUser } from "@/lib/adminApi";

interface Props { onLogin: (user: AdminUser) => void; }

export default function AdminLogin({ onLogin }: Props) {
  const [staffId, setStaffId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login(staffId, password);
      if (res.user.role !== "admin") {
        setError("Access denied. Admin credentials required.");
        return;
      }
      tokenStore.set(res.token);
      toast.success(`Welcome, ${res.user.name}`);
      onLogin(res.user);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f4c81] to-[#1a6bb5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0f4c81] flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">NHIA Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to the control panel</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Staff ID</label>
            <input
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
              placeholder="e.g. ADMIN001"
              value={staffId}
              onChange={e => setStaffId(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#0f4c81] text-white text-sm font-semibold rounded-lg hover:bg-[#0d3f6e] disabled:opacity-60 transition-colors mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          NHIA Underwriting & Risk Management System
        </p>
      </div>
    </div>
  );
}
