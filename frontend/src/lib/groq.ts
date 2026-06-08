import type {
  LiquidatableVault,
  PricePoint,
  ScoredVault,
  GroqScorerResponse,
} from "../types/scorer";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

export async function scoreLiquidationOpportunities(
  vaults: LiquidatableVault[],
  priceHistory: PricePoint[]
): Promise<ScoredVault[]> {
  if (vaults.length === 0) return [];

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GROQ_API_KEY not set — scorer disabled");
    return [];
  }

  const prompt = buildPrompt(vaults, priceHistory);

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");

  const parsed: GroqScorerResponse = JSON.parse(content);
  return mergeScoresWithVaults(parsed.scores, vaults);
}

function buildPrompt(vaults: LiquidatableVault[], priceHistory: PricePoint[]): string {
  const priceTrend = computePriceTrend(priceHistory);

  return `You are a DeFi liquidation opportunity scorer for NairaStable, an over-collateralized stablecoin protocol on Arbitrum Sepolia pegged to the Nigerian Naira. IMPORTANT: Never mention USD, dollars, or $ in your response — all values are in NGN (Nigerian Naira) only.

PROTOCOL CONTEXT:
- Users deposit ETH as collateral and mint nNGN (Nigerian Naira stablecoin)
- Liquidation threshold: 150% collateral ratio
- Liquidator bonus: 10% of debt value in ETH
- Protocol fee: 2% of seized ETH collateral

ETH/NGN PRICE TREND:
${JSON.stringify(priceHistory.slice(-5), null, 2)}
Price change over last ${priceHistory.length} readings: ${priceTrend.toFixed(2)}%

LIQUIDATABLE VAULTS (all have health factor < 1.0):
${JSON.stringify(
    vaults.map((v) => ({
      owner: v.owner,
      debtNgn: v.debtNgn.toFixed(2),
      collateralEth: v.collateralEth.toFixed(6),
      healthFactor: v.healthFactor.toFixed(4),
      estimatedProfitNgn: v.estimatedProfitNgn.toFixed(2),
      crPercent: v.crPercent.toFixed(1),
    })),
    null,
    2
  )}

SCORING INSTRUCTIONS:
Score each vault from 0 to 100 using these weights:
- Net profit in NGN (35%): higher profit = higher score
- Health factor distance below 1.0 (25%): further below = higher urgency
- Absolute debt size (20%): larger debt = larger absolute bonus
- ETH price trend (20%): falling price = higher urgency to liquidate now

CONFIDENCE RULES:
- high: price data is recent (< 15s old) and full price history available
- medium: price data is 15-30s old or partial history
- low: price data is stale or only 1-2 history points

Respond ONLY with this exact JSON structure, no other text:
{
  "scores": [
    {
      "owner": "<exact owner address from input>",
      "score": <integer 0-100>,
      "confidence": "<low|medium|high>",
      "rationale": "<one sentence, max 15 words, explain WHY this score>"
    }
  ]
}`;
}

function computePriceTrend(history: PricePoint[]): number {
  if (history.length < 2) return 0;
  const first = history[0].price;
  const last = history[history.length - 1].price;
  return ((last - first) / first) * 100;
}

function mergeScoresWithVaults(
  scores: GroqScorerResponse["scores"],
  vaults: LiquidatableVault[]
): ScoredVault[] {
  return scores
    .map((s) => {
      const vault = vaults.find((v) => v.owner.toLowerCase() === s.owner.toLowerCase());
      if (!vault) return null;
      return { vault, score: s.score, confidence: s.confidence, rationale: s.rationale };
    })
    .filter((v): v is ScoredVault => v !== null)
    .sort((a, b) => b.score - a.score);
}
