import { type FC, useState } from "react";
import { useAccount } from "wagmi";
import { useVault } from "../hooks/useVault";
import { VaultCard } from "../components/vault/VaultCard";
import { DepositForm } from "../components/vault/DepositForm";
import { WithdrawForm } from "../components/vault/WithdrawForm";
import { MintForm } from "../components/vault/MintForm";
import { BurnForm } from "../components/vault/BurnForm";
import { Spinner } from "../components/shared/Spinner";

type Tab = "deposit" | "mint" | "burn" | "withdraw";

const tabs: { id: Tab; label: string }[] = [
  { id: "deposit", label: "Deposit" },
  { id: "mint", label: "Mint" },
  { id: "burn", label: "Repay" },
  { id: "withdraw", label: "Withdraw" },
];

export const VaultPage: FC = () => {
  const { isConnected } = useAccount();
  const { vault, isLoading } = useVault();
  const [activeTab, setActiveTab] = useState<Tab>("deposit");

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-slate-300 text-lg font-medium">Connect your wallet to manage your vault</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Your Vault</h1>

      {vault && <VaultCard vault={vault} />}

      {/* Tabs */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 overflow-hidden">
        <div className="flex border-b border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-slate-700/60 text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "deposit" && <DepositForm />}
          {activeTab === "mint" && vault ? (
            <MintForm vault={vault} />
          ) : activeTab === "mint" ? (
            <p className="text-slate-400 text-sm">Deposit ETH first to mint nNGN.</p>
          ) : null}
          {activeTab === "burn" && vault ? (
            <BurnForm vault={vault} />
          ) : activeTab === "burn" ? (
            <p className="text-slate-400 text-sm">No outstanding debt to repay.</p>
          ) : null}
          {activeTab === "withdraw" && vault ? (
            <WithdrawForm vault={vault} />
          ) : activeTab === "withdraw" ? (
            <p className="text-slate-400 text-sm">No collateral to withdraw.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
