import { useMemo } from "react";
import { useAllVaults } from "./useAllVaults";
import { LIQUIDATION_BONUS, PRECISION } from "../lib/constants";
import { weiToEth, nngnBaseToDisplay } from "../lib/utils";
import type { LiquidatableVault } from "../types/scorer";

const ONE_E18 = 10n ** 18n;

export function useLiquidatableVaults() {
  const { data: vaults, isLoading, error } = useAllVaults();

  const liquidatable = useMemo<LiquidatableVault[]>(() => {
    if (!vaults) return [];
    return vaults
      .filter((v) => v.debtNgn > 0n && v.healthFactor < ONE_E18)
      .map((v) => {
        const debtNgn = nngnBaseToDisplay(v.debtNgn);
        const collateralEth = weiToEth(v.collateralWei);
        const hfNum = Number(v.healthFactor) / 1e18;
        const estimatedProfitNgn = nngnBaseToDisplay((v.debtNgn * LIQUIDATION_BONUS) / PRECISION);
        const crPercent =
          v.debtNgn > 0n
            ? Number((v.collateralWei * ONE_E18) / v.debtNgn) / 1e16
            : Infinity;

        return {
          owner: v.owner,
          debtNgn,
          collateralEth,
          collateralWei: v.collateralWei,
          healthFactor: hfNum,
          estimatedProfitNgn,
          crPercent,
        } satisfies LiquidatableVault;
      });
  }, [vaults]);

  return { data: liquidatable, isLoading, error };
}
