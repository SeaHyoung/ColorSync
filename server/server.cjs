const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config(); //.env 파일을 읽기 위함

const app = express();
app.use(cors());
app.use(express.json());

// API 정상 연결 여부
app.get("/api/health", (_, res) => {
    res.send("Colorsync API OK");
});

//
app.post("/api/apply-settings", (req, res) => {
    const { attributeCount, emphasisAttr, backgroundColor, keyColor, keyword } =
        req.body;
    console.log("클라이언트로부터 받은 데이터:");
    console.log("속성 수:", attributeCount);
    console.log("강조속성:", emphasisAttr);
    console.log("배경색:", backgroundColor);
    console.log("키 컬러:", keyColor);
    console.log("키워드:", keyword);
    res.json({ message: "설정이 성공적으로 적용되었습니다." });
});

/* ───────────── palette (mock / real) ───────────── */
const USE_MOCK = String(process.env.MOCK_PALETTE).toLowerCase() === "true";

function extractHexColors(text, n = 6) {
    if (!text) return [];
    const cleaned = String(text)
        .replace(/```json/gi, "```")
        .replace(/```/g, "")
        .trim();
    try {
        const maybe = JSON.parse(cleaned);
        if (Array.isArray(maybe)) {
            const hex = maybe
                .map(String)
                .map((s) => s.trim())
                .filter((s) => /^#[0-9a-fA-F]{6}$/.test(s));
            if (hex.length) return hex.slice(0, n);
        }
    } catch (_) {}
    const hex = cleaned.match(/#[0-9a-fA-F]{6}\b/g) || [];
    return hex.slice(0, n);
}

if (USE_MOCK) {
    app.post("/api/palette", (req, res) => {
        const { n = 6 } = req.body || {};
        console.log("[MOCK] /api/palette called");
        const mock = [
            "#4F46E5",
            "#06B6D4",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
        ];
        return res.json({ colors: mock.slice(0, Number(n) || 6) });
    });
} else {
    app.post("/api/palette", async (req, res) => {
        try {
            const {
                query,
                n = 6,
                paletteType = "categorical",
                backgroundColor = "#0B0F1A",
                keyColor = null,
            } = req.body || {};

            const API_KEY = process.env.DEEPSEEK_API_KEY;
            if (!API_KEY) {
                return res
                    .status(500)
                    .json({ error: "DEEPSEEK_API_KEY missing in .env" });
            }
            if (!query || !String(query).trim()) {
                return res.status(400).json({ error: "query is required" });
            }

      // ── 새 프롬프트 ──
      const systemPrompt = `
You are a senior colorist for data-viz dashboards. 
Follow color theory rigorously and keep palettes semantically aligned to the given keyword.
Respond with ONLY a JSON array of HEX (e.g., ["#112233","#AABBCC"]) and nothing else. No prose.
`.trim();

      const userPrompt = `
Goal → Return a ${paletteType} palette of ${n} HEX colors for charts on a dark UI.

Context:
- Keyword (semantic theme): "${String(query)}"
- Dashboard background: "${backgroundColor}"
If background is unknown or invalid, assume dark gray (#111827).
- Preferred key color: "${keyColor ? String(keyColor) : "none"}"

Step 0 — Language normalization & domain mapping (execute BEFORE all other rules; this step has priority over later rules):
- Translate the keyword and any user text to English internally (do not print). Normalize by:
  * removing emojis/symbols, lowercasing, lemmatizing, and extracting the head noun.
  * mapping synonyms/compound nouns to a concise English concept (e.g., "기계설비" → "industrial equipment / plant machinery").
- Determine the domain archetype from the normalized concept:
  * industrial/plant/factory/machinery/equipment/production line → neutrals (gray/steel/navy/charcoal) with ≤1 safety accent (orange/yellow/green).
  * healthcare/medical → teal/blue/green (desaturated).
  * finance/corporate → blue/green (professional, muted).
  * technology → blue/cyan/purple; warms limited.
  * nature/forest/ocean/desert/sunset … follow conventional anchors as applicable.
- For industrial/mechanical/general nouns, prefer muted neutrals and suppress vivid multi-hue outputs by default.
- This Step 0 takes precedence over later exceptions unless the keyword explicitly conveys celebratory multi-color intent (see Vibrancy exception).

Semantic domain abstraction (execute BEFORE applying anchors):
- Do not map colors directly from the surface keyword.
- First, infer the keyword’s semantic domain (high-level category) from common knowledge and cultural defaults.
  * Examples: "잔디, 풀, 나무, 잎" → "forest/nature"; 
              "파도, 해양, 바닷물" → "ocean/sea"; 
              "사막, 모래, 황무지" → "desert/sand";
              "화산, 용암" → "magma/volcano".
- If no exact domain match exists, choose the nearest existing anchor category instead of free association.
- Once the domain is established, apply only the corresponding anchor hues and restrictions.

Hard requirements:
1) Output ONLY a JSON array of HEX strings (uppercase, 6 digits). No comments, no backticks, no names.
2) On dark UIs ensure legibility for bars/lines/areas and typical near-white labels:
   - Avoid pure black/white; avoid extreme neon.
   - Prefer saturation ~40–75% and lightness ~45–65% (HSL) for contrast + readability.
3) Semantic alignment is mandatory. Derive anchor hues from the keyword and stay on-theme.
   If the keyword is ambiguous, choose ONE nearest theme and stay consistent; do not mix unrelated anchors.
   At least ${Math.max(1, Math.min(4, Number(n)||6))} of ${n} colors must fall within the allowed hue anchors for the keyword.
   Do NOT include off-theme hues unless a provided keyColor requires a single harmonized accent.

   Semantic color filter & self-check:
   - Internally (do not print), infer the keyword’s closest 1–2 conventional color families (archetypes) from common usage and cultural defaults
     (e.g., nature→greens/blues, industrial→grays/navy with a small safety orange/yellow accent, technology→blue/cyan/purple, healthcare→teal/blue/green,
      finance→blue/green, luxury→black/gold, food→warm reds/oranges, ocean→navy/blue/teal, sky/ice→blue/cyan, earth/soil→brown/olive).
   - Generate candidates that stay within those 1–2 families; avoid rainbow mixes unless the Vibrancy exception applies.
     (Note: This Step 0 overrides the Semantic color filter when they conflict, unless the Vibrancy exception applies.)
   - Outlier suppression: if any swatch is clearly off-theme relative to the inferred families, replace it with a closer alternative.
   - Balance rule: prefer muted/neutral bases with limited vivid accents unless the keyword strongly implies vibrancy (e.g., “neon”, “festival”).
   - Safety rule for abstract/industrial/general nouns: bias toward neutrals (gray/steel/navy/charcoal) with at most one functional accent (orange/yellow/green) for clarity.
   - Self-check before final output (do not print the reasoning):
     1) Would a typical user expect these colors for the keyword? 
     2) Are there obvious cultural/industry defaults I ignored?
     3) Remove/replace any swatch that fails 1) or 2).

   Vibrancy exception:
   - If the keyword explicitly conveys diversity, vibrancy, joy, or multi-color symbolism 
     (e.g., rainbow, festival, carnival, neon lights, fireworks, pride, celebration),
     then allow a broad, multi-hue palette. 
   - In such cases, DO NOT collapse to 1–2 families; instead, span at least 5 distinct hue anchors 
     while keeping contrast and readability.
   - Ensure the palette feels lively and colorful in line with the keyword’s cultural meaning.

4) If keyColor is provided, include one tone near it, and harmonize the rest (complementary / split-complementary / triad) still consistent with the keyword anchors.
   Include exactly one swatch near keyColor even if slightly off-theme; keep the rest strictly within anchors.
5) No transparency, no gradients, HEX only.

Palette intent rules:
- "categorical": maximize distinguishability while staying on-theme.
- "sequential": single-hue ramp with monotonic lightness.
- "diverging": two arms with mirrored lightness around a muted center.
  If the requested count is even, approximate symmetry without a single center swatch.

Keyword → Allowed anchors (examples):
- ocean/sea/deep sea: navy/blue/teal (≈ 160°–230°). Avoid reds/oranges.
- forest/jungle: greens/olive/teal (≈ 90°–160°). Avoid magenta/pink.
- desert/sand: amber/tan/brown (≈ 20°–55°). Avoid cold cyans/purples.
- sunset/dawn: orange/coral/pink/violet (≈ 15°–40°, 300°–350°). Avoid strong greens.
- magma/volcano: red/orange/maroon (≈ 0°–30°). Avoid cyan/teal.
- aurora/northern lights: teal/green/violet (≈ 150°–220°, 280°–320°). Avoid browns.
- tech/neon city: blue/cyan/magenta/purple. Limit warm hues.

Anti-examples (what NOT to do):
- "ocean" → #EF4444 (red) is off-theme.
- "forest" → neon pink is off-theme.

Return ONLY the JSON array of ${n} HEX colors. If your draft contains anything else, regenerate silently and return only the array.
`.trim();

            const t0 = Date.now();
            const dsRes = await axios.post(
                "https://api.deepseek.com/v1/chat/completions",
                {
                    model: "deepseek-chat",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                    temperature: 0.2,
                    max_tokens: 256,
                },
                {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    timeout: 15000,
                    validateStatus: () => true,
                }
            );

            const ms = Date.now() - t0;
            const status = dsRes.status;
            const content = dsRes?.data?.choices?.[0]?.message?.content ?? "";
            console.log("[/api/palette] status:", status, `(${ms}ms)`);

            if (status >= 400) {
                console.error(
                    "[/api/palette] deepseek error body:",
                    dsRes.data
                );
                return res.status(status).json({
                    error: "deepseek_error",
                    status,
                    message:
                        dsRes.data?.error?.message ||
                        dsRes.data?.message ||
                        JSON.stringify(dsRes.data).slice(0, 300),
                });
            }

            const colors = extractHexColors(content, n);
            if (!colors.length) {
                console.warn("[/api/palette] parse_failed, raw:", content);
                return res.status(502).json({
                    error: "parse_failed",
                    message: "no valid hex in output",
                    raw: content.slice(0, 300),
                });
            }

            return res.json({ colors });
        } catch (err) {
            console.error("[/api/palette] exception:", err?.message);
            if (err?.response) {
                console.error("response.data:", err.response.data);
                return res.status(err.response.status || 500).json({
                    error: "deepseek_exception",
                    status: err.response.status,
                    message:
                        err.response.data?.error?.message ||
                        JSON.stringify(err.response.data).slice(0, 300),
                });
            }
            return res
                .status(500)
                .json({ error: "server_exception", message: err?.message });
        }
    });
}

/* ───────────── server ───────────── */
const PORT = Number(process.env.PORT || 5050);
const server = app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
server.on("error", (err) =>
    console.error("🚨 server.listen error:", err?.code, err?.message)
);
process.on("uncaughtException", (e) =>
    console.error("🚨 uncaughtException:", e)
);
process.on("unhandledRejection", (e) =>
    console.error("🚨 unhandledRejection:", e)
);
