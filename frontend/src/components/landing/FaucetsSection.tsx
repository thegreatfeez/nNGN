import { type FC } from "react";
import { motion } from "framer-motion";
import { Droplets, ArrowRightLeft, ExternalLink } from "lucide-react";

const DIRECT_FAUCETS = [
  {
    name: "QuickNode",
    note: "No sign-up. ~0.001 ETH per request.",
    url: "https://faucet.quicknode.com/arbitrum/sepolia",
  },
  {
    name: "Alchemy",
    note: "Free account required. Larger drips.",
    url: "https://www.alchemy.com/faucets/arbitrum-sepolia",
  },
  {
    name: "Chainlink",
    note: "Requires a small mainnet wallet balance.",
    url: "https://faucets.chain.link/arbitrum-sepolia",
  },
];

const SEPOLIA_FAUCETS = [
  {
    name: "Google Cloud Sepolia",
    note: "No sign-up. No mainnet balance required. Truly free.",
    url: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
    recommended: true,
  },
  {
    name: "Alchemy Sepolia",
    note: "Free account, most reliable.",
    url: "https://www.alchemy.com/faucets/ethereum-sepolia",
  },
  {
    name: "QuickNode Sepolia",
    note: "No sign-up needed.",
    url: "https://faucet.quicknode.com/ethereum/sepolia",
  },
  {
    name: "Chainlink Sepolia",
    note: "Requires mainnet balance.",
    url: "https://faucets.chain.link/sepolia",
  },
];

export const FaucetsSection: FC = () => (
  <section id="faucets" className="py-20 px-4 border-t border-slate-100 dark:border-neutral-800/60">
    <div className="max-w-6xl mx-auto space-y-12">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
          Testnet
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-neutral-50">
          Get free ETH to start testing
        </h2>
        <p className="text-slate-500 dark:text-neutral-400 text-base max-w-xl mx-auto leading-relaxed">
          NairaStable runs on <strong className="text-slate-700 dark:text-neutral-300">Arbitrum Sepolia</strong> — a free test network.
          Grab testnet ETH from a faucet and start minting nNGN in minutes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Route A */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-7 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0">
              <Droplets size={18} className="text-primary dark:text-accent" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-neutral-50 text-base">Direct Arbitrum Sepolia faucets</p>
              <p className="text-xs text-slate-500 dark:text-neutral-500">Fastest route — ETH lands on Arbitrum directly</p>
            </div>
          </div>

          <ul className="space-y-3">
            {DIRECT_FAUCETS.map((f) => (
              <li key={f.name}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl px-4 py-3 border border-slate-100 dark:border-neutral-800 hover:border-primary/30 dark:hover:border-accent/30 hover:bg-primary/5 dark:hover:bg-accent/5 transition-all duration-200"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-neutral-200">{f.name}</p>
                    <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">{f.note}</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 dark:text-neutral-600 group-hover:text-primary dark:group-hover:text-accent shrink-0 transition-colors" />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Route B */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-7 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <ArrowRightLeft size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-neutral-50 text-base">Get Sepolia ETH → bridge to Arbitrum</p>
              <p className="text-xs text-slate-500 dark:text-neutral-500">Use when direct faucets are rate-limited</p>
            </div>
          </div>

          <ul className="space-y-3">
            {SEPOLIA_FAUCETS.map((f) => (
              <li key={f.name}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between gap-4 rounded-xl px-4 py-3 border transition-all duration-200 ${
                    f.recommended
                      ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600"
                      : "border-slate-100 dark:border-neutral-800 hover:border-blue-500/30 hover:bg-blue-500/5"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800 dark:text-neutral-200">{f.name}</p>
                      {f.recommended && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-blue-500 text-white">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">{f.note}</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 dark:text-neutral-600 group-hover:text-blue-500 shrink-0 transition-colors" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="https://bridge.arbitrum.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-xl px-4 py-3 border-2 border-dashed border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
          >
            <div>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-400">Then bridge via bridge.arbitrum.io</p>
              <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">Enable Testnet mode → Sepolia → Arbitrum Sepolia (~10 min)</p>
            </div>
            <ExternalLink size={14} className="text-blue-400 dark:text-blue-600 group-hover:text-blue-600 shrink-0 transition-colors" />
          </a>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center text-xs text-slate-400 dark:text-neutral-600"
      >
        A few transactions cost less than 0.001 ETH in gas on Arbitrum Sepolia — any faucet drip is enough to explore the full protocol.
      </motion.p>

    </div>
  </section>
);
