export interface LiquidatableVault {
  owner: string;
  debtNgn: number;
  collateralEth: number;
  collateralWei: bigint;
  healthFactor: number;
  estimatedProfitNgn: number;
  crPercent: number;
}

export interface PricePoint {
  price: number;
  timestamp: number;
}

export interface ScoredVault {
  vault: LiquidatableVault;
  score: number;
  confidence: "low" | "medium" | "high";
  rationale: string;
}

export interface GroqScorerResponse {
  scores: Array<{
    owner: string;
    score: number;
    confidence: "low" | "medium" | "high";
    rationale: string;
  }>;
}
