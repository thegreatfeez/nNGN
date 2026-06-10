import { type FC } from "react";
import { motion } from "framer-motion";
import { Cpu, Globe, Zap, Shield, Coins, CheckCircle } from "lucide-react";

type IconFC = FC<{ size?: number; className?: string }>;

type OrbitItem = { Icon: IconFC; color: string; label: string; duration: number };

const ORBIT_ITEMS: OrbitItem[] = [
  { Icon: Cpu, color: "text-blue-500", label: "Arbitrum", duration: 20 },
  { Icon: Globe, color: "text-violet-500", label: "Ethereum", duration: 25 },
  { Icon: Zap, color: "text-yellow-500", label: "Chainlink", duration: 30 },
  { Icon: Shield, color: "text-emerald-500", label: "Uniswap", duration: 22 },
  { Icon: Coins, color: "text-pink-500", label: "Aave", duration: 28 },
];

const FEATURES = [
  "Over-collateralised and fully permissionless",
  "Chainlink oracle-secured price feeds",
  "Arbitrum L2 — fast, cheap, and secure",
  "Open-source smart contracts and governance",
];

export const EcosystemSection: FC = () => (
  <section className="py-32 px-4 relative overflow-hidden">
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">

      {/* Left: text */}
      <div className="lg:w-1/2 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">Ecosystem</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-neutral-50 leading-tight">
            Built on the world's <br />
            <span className="text-primary dark:text-accent">most trusted rails.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-neutral-400 leading-relaxed max-w-lg">
            nNGN runs on a battle-tested stack of decentralised infrastructure,
            delivering Ethereum security at Arbitrum speed.
          </p>
        </motion.div>

        <ul className="space-y-3.5">
          {FEATURES.map((feat, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 + i * 0.09, duration: 0.5 }}
              className="flex items-center gap-3 text-slate-700 dark:text-neutral-300 font-medium"
            >
              <CheckCircle size={18} className="text-primary dark:text-accent shrink-0" />
              {feat}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Right: orbit diagram */}
      <div className="lg:w-1/2 flex justify-center">
        <OrbitDiagram />
      </div>
    </div>
  </section>
);

const OrbitDiagram: FC = () => (
  <div className="relative w-[400px] h-[400px] flex items-center justify-center">
    {/* Concentric rings - Colored & Dynamic */}
    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 dark:border-neutral-800/40 animate-[pulse_6s_infinite]" />
    <div className="absolute rounded-full border border-blue-500/10 dark:border-neutral-800/30 animate-[pulse_8s_infinite]" style={{ inset: "-40px" }} />
    <div className="absolute rounded-full border border-teal-500/5 dark:border-neutral-800/20 animate-[pulse_10s_infinite]" style={{ inset: "-80px" }} />

    {/* Central hub with Hit Pulse */}
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        boxShadow: [
          "0 0 0px rgba(16,185,129,0)",
          "0 0 40px rgba(16,185,129,0.2)",
          "0 0 0px rgba(16,185,129,0)"
        ]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 w-28 h-28 rounded-full bg-primary-subtle dark:bg-primary/20 border border-primary-subtle dark:border-primary/30 flex flex-col items-center justify-center shadow-xl backdrop-blur-md"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 flex items-center justify-center"
      >
        <img src="/nNGNlogo.png" alt="NairaStable" className="w-full h-full object-contain" />
      </motion.div>
    </motion.div>

    {/* Orbiting icon chips - Rectangular Pill Shape */}
    {ORBIT_ITEMS.map(({ Icon, color, label, duration }, i) => {
      const startDeg = (360 / ORBIT_ITEMS.length) * i;
      return (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ rotate: startDeg }}
          animate={{ rotate: startDeg + 360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            animate={{ 
              y: [0, 10, 0, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
              px-4 py-2 rounded-full bg-white/95 dark:bg-[#0a0a0a]/95 border border-slate-200 dark:border-neutral-800
              flex items-center gap-2.5 shadow-lg backdrop-blur-md min-w-[130px] overflow-hidden`}
            style={{ 
              rotate: -startDeg,
              transformStyle: "preserve-3d",
              rotateX: 35 // More pronounced inward tilt
            }}
          >
            <Icon size={18} className={color} />
            <span className="text-[10px] font-black text-slate-700 dark:text-neutral-200 uppercase tracking-widest whitespace-nowrap">
              {label}
            </span>
          </motion.div>
        </motion.div>
      );
    })}
  </div>
);
