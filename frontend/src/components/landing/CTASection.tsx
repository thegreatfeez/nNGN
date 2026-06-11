import { type FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ShoppingCart } from "lucide-react";

export const CTASection: FC = () => (
  <section className="py-24 px-4">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <CTACard
        title="Start minting nNGN"
        body="Deposit ETH as collateral and mint your Naira stablecoin in seconds — no KYC, no middlemen."
        label="Launch App"
        to="/dashboard"
        variant="primary"
        Icon={ArrowRight}
      />
      <CTACard
        title="Read the docs"
        body="Understand collateral ratios, liquidation mechanics, and how to integrate nNGN into your project."
        label="View Documentation"
        href="/docs/index.html"
        variant="secondary"
        Icon={BookOpen}
      />
      <CTACard
        title="Test the Sandbox"
        body="Experience frictionless borderless commerce. Try our demo e-commerce website integrated natively with nNGN."
        label="Visit NairaMart"
        href="https://app.nairamart.xyz"
        variant="tertiary"
        Icon={ShoppingCart}
      />
    </div>
  </section>
);

const CTACard: FC<{
  title: string;
  body: string;
  label: string;
  variant: "primary" | "secondary" | "tertiary";
  Icon: FC<{ size?: number; className?: string }>;
} & ({ to: string; href?: never } | { href: string; to?: never })> = ({ title, body, label, to, href, variant, Icon }) => {
  const isPrimary = variant === "primary";
  const isTertiary = variant === "tertiary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={[
        "group relative overflow-hidden rounded-[2rem] p-8 md:p-10 flex flex-col gap-6",
        isPrimary
          ? " dark:bg-gradient-to-br dark:from-primary/20 dark:to-secondary/20 border border-slate-200 dark:border-primary/20 shadow-sm"
          : isTertiary
          ? "bg-blue-50 dark:bg-gradient-to-br dark:from-blue-950 dark:to-slate-900 border border-blue-200 dark:border-blue-800/40 shadow-sm"
          : "bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 shadow-sm",
      ].join(" ")}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
          backgroundSize: "200% 100%",
          animation: "shineMove 0.8s ease-out forwards",
        }}
      />

      <div className="space-y-2.5">
        <h3 className={`text-2xl font-bold ${isPrimary || isTertiary ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-neutral-50"}`}>{title}</h3>
        <p className={`text-sm leading-relaxed ${isPrimary ? "text-slate-600 dark:text-emerald-100/75" : isTertiary ? "text-slate-600 dark:text-blue-100/75" : "text-slate-500 dark:text-neutral-400"}`}>{body}</p>
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "inline-flex items-center gap-2 text-sm font-bold w-fit transition-all duration-200 mt-auto",
            isPrimary
              ? "text-primary dark:text-accent hover:text-primary-hover dark:hover:text-white hover:gap-3"
              : isTertiary
              ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white hover:gap-3"
              : "text-slate-600 dark:text-accent hover:text-slate-900 dark:hover:text-secondary hover:gap-3",
          ].join(" ")}
        >
          {label} <Icon size={16} />
        </a>
      ) : (
        <Link
          to={to!}
          className={[
            "inline-flex items-center gap-2 text-sm font-bold w-fit transition-all duration-200 mt-auto",
            isPrimary
              ? "text-primary dark:text-accent hover:text-primary-hover dark:hover:text-white hover:gap-3"
              : isTertiary
              ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white hover:gap-3"
              : "text-slate-600 dark:text-accent hover:text-slate-900 dark:hover:text-secondary hover:gap-3",
          ].join(" ")}
        >
          {label} <Icon size={16} />
        </Link>
      )}
    </motion.div>
  );
};
