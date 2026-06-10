import { type FC } from "react";
import { motion } from "framer-motion";
import { Globe, Lock, Coins } from "lucide-react";

const FEATURES = [
  {
    Icon: Lock,
    title: "Over-collateralised Security",
    desc: "Every nNGN is backed by an excess of premium crypto assets (like ETH, ARB). You can always verify reserve ratios on-chain, eliminating the risk of bank runs or fractional reserves."
  },
  {
    Icon: Globe,
    title: "Unmatched Borderless Velocity",
    desc: "Move Naira locally or internationally in seconds without relying on FX bottlenecks. Perfect for remittances, treasury management, and everyday commerce."
  },
  {
    Icon: Coins,
    title: "Native High-Yield Engine",
    desc: "By holding nNGN in the protocol ecosystem, you automatically capture the Sky Savings Rate (SSR) equivalent, generating real, sustainable yield from institutional strategies."
  }
];

export const AboutSection: FC = () => (
  <section id="about" className="py-24 px-4 overflow-hidden relative">
    {/* Clean minimal background elements */}
    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/[0.03] dark:from-primary/[0.07] to-transparent pointer-events-none" />
    
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
      
      {/* Left side text */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="lg:w-5/12 space-y-6"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">About the Protocol</p>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-neutral-50 leading-[1.1]">
          Engineered for <br />
          <span className="text-primary dark:text-accent">African Commerce.</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-neutral-400 leading-relaxed max-w-lg font-medium">
          nNGN brings the stability of fiat money to the speed and openness of the blockchain. 
          We've built a trustless bridge allowing anyone in the world to tap into Nigeria's economy—saving, sending, and spending without traditional friction.
        </p>

        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-primary dark:text-accent hover:text-primary-hover dark:hover:text-secondary transition-colors group"
        >
          View our whitepaper 
          <motion.span
            className="inline-block"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            →
          </motion.span>
        </a>
      </motion.div>

      {/* Right side staggered cards */}
      <div className="lg:w-7/12 grid gap-5 w-full">
        {FEATURES.map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`flex gap-5 p-8 rounded-[2rem] border shadow-sm
              ${i % 2 === 1 ? 'lg:ml-12' : 'lg:mr-12'}
              bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-neutral-800/80 hover:shadow-md transition-shadow duration-300`}
          >
            <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-2xl bg-primary-subtle dark:bg-primary/10 border border-primary-subtle dark:border-primary/20 flex items-center justify-center">
              <feat.Icon size={20} className="text-primary dark:text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-neutral-50">{feat.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-neutral-400 font-medium">
                {feat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
