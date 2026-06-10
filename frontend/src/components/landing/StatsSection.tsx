import { type FC, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Shield, Zap } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";

type Color = "emerald" | "blue" | "violet";
type IconFC = FC<{ size?: number; className?: string }>;

const STATS: { Icon: IconFC; label: string; value: number; prefix: string; suffix: string; color: Color }[] = [
  { Icon: TrendingUp, label: "Total nNGN Supply",     value: 25_000_000, prefix: "₦", suffix: "",  color: "emerald" },
  { Icon: Shield,     label: "Min Collateral Ratio",  value: 200,        prefix: "",  suffix: "%", color: "blue"    },
  { Icon: Zap,        label: "Active Vaults",         value: 1_420,      prefix: "",  suffix: "+", color: "violet"  },
];

const COLORS: Record<Color, { icon: string; bg: string; border: string; glow: string }> = {
  emerald: { icon: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/25", glow: "group-hover:shadow-emerald-500/10" },
  blue:    { icon: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-500/25",    glow: "group-hover:shadow-blue-500/10"    },
  violet:  { icon: "text-violet-400",  bg: "bg-violet-400/10",  border: "border-violet-500/25",  glow: "group-hover:shadow-violet-500/10"  },
};

export const StatsSection: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="relative py-24 px-4">
      <div className="absolute inset-0 bg-transparent pointer-events-none" />
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, i) => (
          <StatCard key={i} {...stat} inView={inView} index={i} />
        ))}
      </div>
    </section>
  );
};

const StatCard: FC<(typeof STATS)[number] & { inView: boolean; index: number }> = ({
  Icon, label, value, prefix, suffix, color, inView, index,
}) => {
  const { value: count, ref } = useCountUp(value, 2000 + index * 200);
  const c = COLORS[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative p-8 rounded-[2rem] border ${c.border} bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-md transition-all duration-400 cursor-default`}
    >
      <div className="relative z-10 space-y-4">
        <div className={`inline-flex p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
          <Icon size={18} className={c.icon} />
        </div>
        <p className="text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-extrabold text-slate-900 dark:text-neutral-50 tabular-nums leading-none">
          <span className="text-slate-400 dark:text-neutral-500 text-xl font-bold mr-1">{prefix}</span>
          {inView ? count.toLocaleString() : "0"}
          <span className="text-slate-400 dark:text-neutral-500 text-xl font-bold ml-1">{suffix}</span>
        </p>
      </div>
    </motion.div>
  );
};
