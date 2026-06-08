const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

export interface VaultContext {
  collateralEth: number;
  debtNgn: number;
  crPercent: number;
  healthFactor: number;
}

export interface MarketInsight {
  summary: string;
  bullets: string[];
  sentiment: "bullish" | "neutral" | "bearish";
  vaultStatus: "safe" | "at_risk" | "liquidatable" | null;
  vaultAdvice: string | null;
  updatedAt: number;
}

export async function fetchMarketInsight(
  ethNgn: number,
  trendPct: number,
  vault?: VaultContext | null
): Promise<MarketInsight> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("VITE_GROQ_API_KEY not set");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a DeFi market analyst for a Nigerian Naira stablecoin protocol. Always respond with valid JSON only — no markdown, no explanation, just the JSON object. IMPORTANT: Never mention USD, dollars, or $ in your response. All amounts and prices must be in Nigerian Naira (NGN or ₦) only.",
        },
        {
          role: "user",
          content: buildPrompt(ethNgn, trendPct, vault),
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Groq ${response.status}: ${body}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Empty response from Groq");

  const parsed = extractJson(content);

  const rawSentiment = String(parsed.sentiment ?? "");
  const sentiment: MarketInsight["sentiment"] = ["bullish", "bearish"].includes(rawSentiment)
    ? (rawSentiment as MarketInsight["sentiment"])
    : "neutral";

  const rawStatus = String(parsed.vaultStatus ?? "");
  const vaultStatus: MarketInsight["vaultStatus"] = ["safe", "at_risk", "liquidatable"].includes(
    rawStatus
  )
    ? (rawStatus as NonNullable<MarketInsight["vaultStatus"]>)
    : null;

  return {
    summary: String(parsed.summary ?? ""),
    bullets: Array.isArray(parsed.bullets) ? (parsed.bullets as string[]).slice(0, 3) : [],
    sentiment,
    vaultStatus,
    vaultAdvice: parsed.vaultAdvice ? String(parsed.vaultAdvice) : null,
    updatedAt: Date.now(),
  };
}

function buildPrompt(ethNgn: number, trendPct: number, vault?: VaultContext | null): string {
  const priceFormatted = Math.round(ethNgn).toLocaleString("en-NG");
  const trendStr = `${trendPct >= 0 ? "+" : ""}${trendPct.toFixed(2)}%`;

  let vaultSection = "";
  let vaultJsonFields = "";

  if (vault && vault.debtNgn > 0) {
    const debtFormatted = Math.round(vault.debtNgn).toLocaleString("en-NG");
    const statusHint =
      vault.healthFactor >= 1.2
        ? "safe"
        : vault.healthFactor >= 1.0
        ? "at_risk"
        : "liquidatable";

    vaultSection = `

USER'S VAULT POSITION:
- Collateral: ${vault.collateralEth.toFixed(4)} ETH
- nNGN minted: ₦${debtFormatted}
- Collateral ratio: ${vault.crPercent.toFixed(1)}% (must stay above 150%)
- Health factor: ${vault.healthFactor.toFixed(3)} (liquidated when below 1.0)

Vault safety thresholds:
- "safe" = health factor >= 1.2 (ratio >= 180%)
- "at_risk" = health factor 1.0-1.2 (ratio 150%-180%)
- "liquidatable" = health factor < 1.0 (ratio < 150%)
Current status hint: ${statusHint} — verify with your own calculation.`;

    vaultJsonFields = `,"vaultStatus":"<safe|at_risk|liquidatable>","vaultAdvice":"<one sentence telling the vault owner exactly what to do right now, max 20 words, NGN only>"`;
  }

  return `Current market data for NairaStable (ETH-collateralized nNGN stablecoin on Arbitrum):
- ETH price in Naira: ₦${priceFormatted} per ETH
- Recent ETH/NGN trend: ${trendStr}
- Protocol liquidation threshold: 150% collateral ratio
- Users deposit ETH to mint nNGN (Nigerian Naira stablecoin)
${vaultSection}

Return exactly this JSON (no other text, no USD or $ anywhere):
{"summary":"<one sentence about current ETH/NGN conditions, max 20 words, NGN only>","bullets":["<insight 1 for nNGN users, max 15 words, NGN only>","<insight 2 for nNGN users, max 15 words, NGN only>","<insight 3 for nNGN users, max 15 words, NGN only>"],"sentiment":"<bullish|neutral|bearish>"${vaultJsonFields}}`;
}

function extractJson(text: string): Record<string, unknown> {
  const clean = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in response");
  return JSON.parse(clean.slice(start, end + 1));
}
