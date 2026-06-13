import { type FC } from "react";
import { motion } from "framer-motion";

/** Items for the left vertical ticker (collateral types) */
const COLLATERAL = ["ETH", "wBTC", "stETH", "ARB", "USDC"];
/** Items for the right vertical ticker (use cases) */
const USE_CASES  = ["Pay in ₦", "Earn Yield", "Cross-border", "Commerce", "Savings"];

export const FlowSection: FC = () => (
  <section id="how-it-works" className="py-32 px-4">
    <div className="max-w-6xl mx-auto space-y-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-3"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">How It Works</p>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-neutral-50">
          Mint. Hold. <span className="text-primary dark:text-accent">Earn.</span>
        </h2>
        <p className="text-slate-600 dark:text-neutral-400 text-lg max-w-lg mx-auto leading-relaxed font-medium">
          Deposit collateral, mint nNGN instantly, and use it across the Naira ecosystem.
        </p>
      </motion.div>

      {/* Flow diagram */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8"
      >
        {/* INPUT NODE */}
        <FlowNode title="Deposit" accent="blue">
          <VerticalTicker items={COLLATERAL} color="blue" />
        </FlowNode>

        {/* Connector → engine */}
        <AnimatedConnector />

        {/* ENGINE NODE */}
        <EngineNode />

        {/* Connector → output */}
        <AnimatedConnector />

        {/* OUTPUT NODE */}
        <FlowNode title="Use nNGN" accent="emerald">
          <VerticalTicker items={USE_CASES} color="emerald" />
        </FlowNode>
      </motion.div>

      {/* Step labels below */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-24">
        {["01 — Deposit collateral", "02 — Protocol mints nNGN", "03 — Use anywhere"].map((step, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="text-[11px] font-bold text-slate-500 dark:text-neutral-600 uppercase tracking-[0.2em] text-center"
          >
            {step}
          </motion.p>
        ))}
      </div>
    </div>
  </section>
);

/** Boxed node that wraps a vertical ticker */
const FlowNode: FC<{ title: string; accent: "blue" | "emerald"; children: React.ReactNode }> = ({
  title, accent, children,
}) => {
  const border = accent === "blue" ? "border-blue-200 dark:border-blue-500/30"    : "border-primary-subtle dark:border-primary/30";
  const bg     = accent === "blue" ? "bg-white dark:bg-blue-500/5"         : "bg-white dark:bg-primary/5";
  const text   = accent === "blue" ? "text-blue-600 dark:text-blue-400"         : "text-primary dark:text-accent";

  return (
    <div className={`w-[140px] md:w-[148px] min-h-[160px] rounded-3xl border shadow-sm ${border} ${bg}
      flex flex-col items-center justify-center gap-3 p-4 shrink-0`}
    >
      <p className={`text-xs font-bold uppercase tracking-widest ${text}`}>{title}</p>
      {children}
    </div>
  );
};

/** The central protocol hub */
const EngineNode: FC = () => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="w-24 h-24 md:w-28 md:h-28 rounded-[2rem] border border-slate-200 dark:border-neutral-800 shrink-0 z-10
      bg-white dark:bg-[#0a0a0a] shadow-sm
      flex flex-col items-center justify-center"
  >
    <img src="/nNGNlogo.png" alt="NSEngine" className="w-10 h-10 object-contain" />
    <span className="text-[9px] text-slate-500 dark:text-neutral-500 font-bold tracking-wider uppercase">NSEngine</span>
  </motion.div>
);

/** Glowing line with three traveling particles */
const AnimatedConnector: FC = () => (
  <div className="relative w-[2px] h-12 md:h-[2px] md:w-auto md:flex-1 md:max-w-[110px] bg-slate-200 dark:bg-neutral-800 shrink-0 overflow-hidden">
    <motion.div
      className="absolute bg-primary dark:bg-accent
        w-[2px] h-full md:h-[2px] md:w-full top-0 left-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </div>
);

/** Seamless vertical text ticker (slot-machine style) */
const VerticalTicker: FC<{ items: string[]; color: "blue" | "emerald" }> = ({ items, color }) => {
  const ITEM_H = 36; // px per item
  const text   = color === "blue" ? "text-blue-700 dark:text-blue-300" : "text-primary dark:text-accent";

  return (
    <div className="relative overflow-hidden w-full" style={{ height: ITEM_H * 2.5 }}>
      {/* Top/bottom gradient masks - uses currentColor techniques since it sits on bg-white or dark bg */}
      <div className="absolute inset-x-0 top-0 h-6 z-10 pointer-events-none bg-gradient-to-b from-white dark:from-[#080808] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-6 z-10 pointer-events-none bg-gradient-to-t from-white dark:from-[#080808] to-transparent" />

      <motion.div
        animate={{ y: [0, -(ITEM_H * items.length)] }}
        transition={{
          duration: items.length * 1.6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        className="flex flex-col items-center"
      >
        {/* Items duplicated for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            style={{ height: ITEM_H }}
            className={`flex items-center justify-center text-sm font-bold tabular-nums ${text}`}
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
