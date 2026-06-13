import { type FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const WORDS = "Efficient capital for the Naira Ecosystem.".split(" ");

export const HeroSection: FC = () => (
  <section className="relative min-h-[110vh] flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
    <HeroBg />

    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center gap-10"
    >     

      {/* Hero Content Wrapper with Perspective */}
      <motion.div
        style={{ perspective: 1000 }}
        className="flex flex-col items-center gap-8 px-4"
      >
        {/* Cinematic Headline - Moderated Size */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-slate-50 filter drop-shadow-2xl">
          {WORDS.map((word, i) => {
            const isLast = i >= WORDS.length - 2;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: 0.3 + i * 0.08, 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className={[
                  "inline-block mr-[0.25em] origin-bottom",
                  isLast ? "gradient-brand-text" : "",
                ].join(" ")}
              >
                {word}
              </motion.span>
            );
          })}
        </h1>

        {/* Animated Divider */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 1, duration: 1 }}
          className="h-1 gradient-brand rounded-full"
        />

        {/* Subtext - More airy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: "anticipate" }}
          className="text-lg md:text-2xl text-slate-600 dark:text-neutral-400 max-w-3xl leading-relaxed font-medium px-4 opacity-90"
        >
          The first decentralised, over-collateralised <br className="hidden md:block" />
          Naira stablecoin. Mint <span className="text-primary dark:text-accent font-extrabold underline decoration-primary/30 dark:decoration-accent/30 underline-offset-4">nNGN</span>, hold value, and earn yield.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto mt-4"
        >
          <Link
            to="/dashboard"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-3 md:px-8 md:py-3.5 bg-primary dark:bg-accent text-white font-black rounded-full transition-all shadow-[0_20px_50px_rgba(var(--primary-rgb),0.25)] hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.45)] active:scale-95"
          >
            <span className="absolute inset-0 gradient-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Launch App <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <a
            href="#how-it-works"
            className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-3 md:px-8 md:py-3.5 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            How it works
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-emerald-500 transition-colors" />
          </a>
        </motion.div>
      </motion.div>
    </motion.div>

    {/* Scroll Cue - Dynamic */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 1 }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
    >
      <div className="relative flex flex-col items-center">
        <motion.span 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 mb-2"
        >
          {/* Discover */}
        </motion.span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-emerald-500/50 to-transparent" />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
        />
      </div>
    </motion.div>
  </section>
);

/** Decorative background: dot grid + ambient glows */
const HeroBg: FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
      style={{
        backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
    
    {/* Light mode gradient mask */} 
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 dark:hidden" />
    
    {/* Dark mode gradient mask */}
    <div
      className="absolute inset-0 hidden dark:block"
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 50% 20%, rgba(16,185,129,0.08) 0%, rgba(3,3,3,1) 50%, rgba(3,3,3,1) 100%)",
      }}
    />
    <motion.div
      animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0], scale: [1, 1.1, 0.9, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-[15%] -left-[5%] w-[55%] h-[55%] bg-teal-500/10 blur-[130px] rounded-full"
    />
    <motion.div
      animate={{ x: [0, -50, 50, 0], y: [0, 40, -40, 0], scale: [1, 0.9, 1.1, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[5%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[140px] rounded-full"
    />
    <motion.div
      animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0], scale: [1, 1.15, 0.85, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[10%] left-[30%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"
    />
    {/* Floating Decorative Shapes */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ 
          y: [-20, 20, -20],
          rotate: [0, 10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [20, -20, 20],
          rotate: [0, -15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] right-[15%] w-48 h-48 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl"
      />
    </div>
  </div>
);

