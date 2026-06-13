import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Lock } from "lucide-react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { Button } from "../../components/shared/Button";

export const AdminLogin: FC = () => {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/admin", { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(pin);
      navigate("/admin", { replace: true });
    } catch {
      setError("Invalid PIN. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-6 animate-fade-in-up">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl btn-gradient mx-auto shadow-lg shadow-violet-500/20">
            <Ticket size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">TicketNGN Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Enter your admin PIN to continue</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="password"
                placeholder="Admin PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 pl-9 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-sm transition-all"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5 text-sm text-rose-600 text-center font-medium">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-3" loading={loading} disabled={!pin}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
