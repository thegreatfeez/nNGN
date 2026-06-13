import { type FC, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAccount } from "wagmi";
import { useVault } from "../hooks/useVault";
import { VaultCard } from "../components/vault/VaultCard";
import { DepositForm } from "../components/vault/DepositForm";
import { WithdrawForm } from "../components/vault/WithdrawForm";
import { MintForm } from "../components/vault/MintForm";
import { BurnForm } from "../components/vault/BurnForm";
import { Spinner } from "../components/shared/Spinner";
import {
  PackagePlus,
  PackageMinus,
  Zap,
  Gem,
  KeyRound,
} from "lucide-react";

type Tab = "deposit" | "mint" | "burn" | "withdraw";

const tabs: { id: Tab; label: string; icon: FC<{ size?: number; className?: string }> }[] = [
  { id: "deposit", label: "Deposit", icon: PackagePlus },
  { id: "mint", label: "Mint", icon: Gem },
  { id: "burn", label: "Repay", icon: Zap },
  { id: "withdraw", label: "Withdraw", icon: PackageMinus },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 200, damping: 24 } 
  },
};

export const VaultPage: FC = () => {
  const { isConnected } = useAccount();
  const { vault, isLoading } = useVault();
  const [activeTab, setActiveTab] = useState<Tab>("deposit");

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-500/10 flex items-center justify-center">
          <KeyRound size={28} className="text-teal-700 dark:text-teal-400" />
        </div>
        <p className="text-slate-900 dark:text-slate-100 text-lg font-bold">
          Connect your wallet
        </p>
        <p className="text-slate-600 dark:text-neutral-500 text-sm max-w-xs font-medium">
          Connect your wallet to manage your vault, deposit ETH, and mint nNGN.
        </p>
        <div className="mt-2">
           <appkit-button />
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Page header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Vault
        </h1>
        <p className="text-slate-600 dark:text-neutral-400 text-sm mt-1 font-medium">
          Manage collateral, mint and repay nNGN
        </p>
      </motion.div>

      {/* Vault card */}
      {vault && (
        <motion.div variants={itemVariants}>
          <VaultCard vault={vault} />
        </motion.div>
      )}

      {/* Tab panel */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden shadow-sm"
      >
        {/* Tab bar */}
        <div className="relative flex border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs sm:text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-teal-700 dark:text-teal-400"
                    : "text-slate-500 dark:text-neutral-500 hover:text-slate-800 dark:hover:text-neutral-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="vault-tab-pill"
                    className="absolute inset-0 bg-white dark:bg-neutral-800/80"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon
                  size={15}
                  className={`relative z-10 shrink-0 ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-slate-400 dark:text-neutral-600"
                  }`}
                />
                <span className="relative z-10">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="vault-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 dark:bg-teal-400 rounded-t-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "deposit" && <DepositForm />}
              {activeTab === "mint" &&
                (vault ? (
                  <MintForm vault={vault} />
                ) : (
                  <EmptyTabState message="Deposit ETH first to mint nNGN." />
                ))}
              {activeTab === "burn" &&
                (vault ? (
                  <BurnForm vault={vault} />
                ) : (
                  <EmptyTabState message="No outstanding debt to repay." />
                ))}
              {activeTab === "withdraw" &&
                (vault ? (
                  <WithdrawForm vault={vault} />
                ) : (
                  <EmptyTabState message="No collateral to withdraw." />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const EmptyTabState: FC<{ message: string }> = ({ message }) => (
  <p className="text-slate-500 dark:text-neutral-500 text-sm text-center py-6">
    {message}
  </p>
);
