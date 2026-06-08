import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useQueryClient } from "@tanstack/react-query";
import { engineContract, ngnContract } from "../lib/contracts";
import { parseEther } from "viem";
import { displayToNngnBase } from "../lib/utils";
import { wagmiConfig } from "../lib/appkit";

export interface Vault {
  collateralWei: bigint;
  debtNgn: bigint;
}

export function useVault() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { data, isLoading, error, queryKey } = useReadContract({
    ...engineContract,
    functionName: "getVault",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  // getVault returns a named struct — viem decodes it as an object, not an array
  const vaultData = data as { collateralWei: bigint; debtNgn: bigint } | undefined;
  const vault: Vault | null = vaultData
    ? { collateralWei: vaultData.collateralWei, debtNgn: vaultData.debtNgn }
    : null;

  const isEmpty = !vault || (vault.collateralWei === 0n && vault.debtNgn === 0n);

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey });
  }

  return { vault: isEmpty ? null : vault, isLoading, error, invalidate };
}

export function useDeposit() {
  const { invalidate } = useVault();
  const { writeContractAsync, isPending } = useWriteContract();
  const [isConfirming, setIsConfirming] = useState(false);

  async function deposit(ethAmount: number) {
    const hash = await writeContractAsync({
      ...engineContract,
      functionName: "depositCollateral",
      value: parseEther(ethAmount.toString()),
    });
    setIsConfirming(true);
    try {
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await invalidate();
    } finally {
      setIsConfirming(false);
    }
    return hash;
  }

  return { deposit, isPending: isPending || isConfirming };
}

export function useWithdraw() {
  const { invalidate } = useVault();
  const { writeContractAsync, isPending } = useWriteContract();
  const [isConfirming, setIsConfirming] = useState(false);

  async function withdraw(ethAmount: number) {
    const hash = await writeContractAsync({
      ...engineContract,
      functionName: "withdrawCollateral",
      args: [parseEther(ethAmount.toString())],
    });
    setIsConfirming(true);
    try {
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await invalidate();
    } finally {
      setIsConfirming(false);
    }
    return hash;
  }

  return { withdraw, isPending: isPending || isConfirming };
}

export function useMintNgn() {
  const { invalidate } = useVault();
  const { writeContractAsync, isPending } = useWriteContract();
  const [isConfirming, setIsConfirming] = useState(false);

  async function mintNgn(ngnAmount: number) {
    const hash = await writeContractAsync({
      ...engineContract,
      functionName: "mintNgn",
      args: [displayToNngnBase(ngnAmount)],
    });
    setIsConfirming(true);
    try {
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await invalidate();
    } finally {
      setIsConfirming(false);
    }
    return hash;
  }

  return { mintNgn, isPending: isPending || isConfirming };
}

export function useBurnNgn() {
  const { address } = useAccount();
  const { invalidate } = useVault();
  const { writeContractAsync, isPending } = useWriteContract();
  const [isConfirming, setIsConfirming] = useState(false);

  const { data: allowance } = useReadContract({
    ...ngnContract,
    functionName: "allowance",
    args: address ? [address, engineContract.address] : undefined,
    query: { enabled: !!address },
  });

  async function burnNgn(ngnAmount: number) {
    const amount = displayToNngnBase(ngnAmount);
    if ((allowance as bigint | undefined) === undefined || (allowance as bigint) < amount) {
      const approveHash = await writeContractAsync({
        ...ngnContract,
        functionName: "approve",
        args: [engineContract.address, amount * 2n],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });
    }
    const hash = await writeContractAsync({
      ...engineContract,
      functionName: "burnNgn",
      args: [amount],
    });
    setIsConfirming(true);
    try {
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await invalidate();
    } finally {
      setIsConfirming(false);
    }
    return hash;
  }

  return { burnNgn, isPending: isPending || isConfirming };
}
