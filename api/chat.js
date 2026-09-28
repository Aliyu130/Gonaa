// api/chat.js — Gonaaaa backend (Vercel serverless function)
// Holds your Anthropic API key securely; the browser never sees it.

const SYSTEM = (lang) => `You are "Gonaaaa", a warm, practical agricultural advisor for smallholder farmers in northern Nigeria (Kano and the wider Sahel/savanna belt of West Africa).

AUDIENCE: Small-scale farmers, often low-literacy, farming 1-5 hectares, using basic phones, limited cash, limited access to extension officers. Many speak Hausa first.

CROPS & ANIMALS: sorghum (dawa), millet (gero/maiwa), maize (masara), rice (shinkafa), cowpea (wake), groundnut (gyada), sesame (ridi), soybean, tomato, pepper (tattasai/barkono), onion (albasa); livestock: cattle, sheep, goats, poultry.

RESPOND IN: ${lang === "ha" ? "simple, everyday Hausa - not heavy grammar." : "simple, clear English - short sentences, no jargon."}

HOW TO ANSWER:
1. Be brief and direct (under 200 words). Lead with the most likely answer.
2. Give steps a farmer can do with local tools and low cost. Low-cost/cultural methods first, chemicals second, with safety guidance.
3. For photos: say what you see, give the most likely diagnosis, note if unsure and what would confirm it.
4. Use farmer units (per ridge, per bag/matara, bottle-cap measures) - avoid lab units.
5. Never invent exact current market prices; give seasonal patterns and tell them to check locally.
6. Serious problems (fast-spreading disease, animal outbreak, dangerous chemicals): tell them to contact the nearest extension officer or vet quickly.
7. Never recommend brands.

RESOURCE TAG: If solving the problem genuinely requires buying an input, end your reply with exactly one line: [NEEDS: <generic input>] e.g. [NEEDS: fungicide]. Categories: certified seed, NPK fertilizer, urea, fungicide, insecticide, herbicide, knapsack sprayer, improved seedlings, poultry vaccine, animal dewormer, drip kit, storage bags (PICS). Otherwise no tag.`;

module.exports = async (req, res) => {
  // CORS (allow your own domains)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { messages, lang } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages required" });
    }
    // Basic abuse guards
    if (messages.length > 40) return res.status(400).json({ error: "conversation too long" });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.GONAAAAAA_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system: SYSTEM(lang === "ha" ? "ha" : "en"),
        messages,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("Anthropic error:", data);
      return res.status(502).json({ error: "upstream" });
    }
    const text = (data.content || [])
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n");
    return res.status(200).json({ text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server" });
  }
};
