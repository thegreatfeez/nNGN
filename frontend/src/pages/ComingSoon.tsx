import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Sparkles } from "lucide-react";

const FEATURES = [
  { label: "Multi-collateral vaults", desc: "wBTC, stETH, ARB, and more" },
  { label: "Governance forum",        desc: "On-chain protocol governance" },
  { label: "Analytics dashboard",     desc: "Real-time collateral metrics" },
];

export const ComingSoon: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/8 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-teal-400/10 dark:bg-teal-500/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-emerald-300/5 dark:bg-emerald-400/5 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg text-center space-y-10"
      >
        {/* Logo + badge */}
        <div className="flex flex-col items-center gap-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "backOut" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl scale-150" />
            <img
              src="/nNGNlogo.png"
              alt="NairaStable"
              className="relative w-20 h-20 rounded-full object-cover ring-2 ring-emerald-500/20 dark:ring-emerald-400/25 shadow-[0_0_40px_-8px_rgba(16,185,129,0.4)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 dark:bg-emerald-400/10"
          >
            <Sparkles size={13} className="text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
              In Development
            </span>
          </motion.div>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Coming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              Soon
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
            We&apos;re building something great. This section of NairaStable is still under construction — check back soon.
          </p>
        </motion.div>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {FEATURES.map(({ label, desc }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 px-4 py-4 text-left space-y-1"
            >
              <p className="text-sm font-bold text-slate-700 dark:text-neutral-200">{label}</p>
              <p className="text-xs text-slate-500 dark:text-neutral-500">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Email notify */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          {submitted ? (
            <div className="flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-400/20">
              <Bell size={16} className="text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                You&apos;re on the list — we&apos;ll notify you when it&apos;s ready!
              </p>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for updates"
                required
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-slate-900 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:focus:ring-emerald-400/30 transition"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white text-sm font-bold transition-all duration-200 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.5)] hover:shadow-[0_4px_24px_-4px_rgba(16,185,129,0.7)] whitespace-nowrap"
              >
                <Bell size={14} /> Notify me
              </button>
            </form>
          )}
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-neutral-100 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Go back
          </button>
        </motion.div>
      </motion.div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-6 text-xs text-slate-400 dark:text-neutral-600"
      >
        © 2025 NairaStable Protocol
      </motion.p>
    </div>
  );
};
