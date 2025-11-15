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
    const {
        attributeCount,
        emphasisAttr,
        chartBgc,
        boardBgc,
        keyColor,
        keyword,
    } = req.body;
    console.log("클라이언트로부터 받은 데이터:");
    console.log("속성 수:", attributeCount);
    console.log("강조속성:", emphasisAttr);
    console.log("차트배경색:", chartBgc);
    console.log("보드배경색:", boardBgc);
    console.log("키 컬러:", keyColor);
    console.log("키워드:", keyword);
    return res.json({ message: "설정이 성공적으로 적용되었습니다." });
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
                chartBgc = "#0B0F1A",
                boardBgc = "#0B0F1A",
                emphasisAttr = 0, // 기본값 0으로 설정
                keyColor = null,
            } = req.body || {};

            // 요청 수신 및 주요 값 로그 추가
            console.log("--- /api/palette 요청 수신 ---");
            console.log("키 컬러 수신 값 (keyColor):", keyColor);
            console.log("강조 속성 수 (emphasisAttr):", emphasisAttr);
            console.log("키워드 (query):", query);
            
            const GEMINI_KEY = process.env.GEMINI_API_KEY;
            if (!GEMINI_KEY) {
                return res
                    .status(500)
                    .json({ error: "GEMINI_API_KEY missing in .env" });
            }
            if (!query || !String(query).trim()) {
                return res.status(400).json({ error: "query is required" });
            }
            
            // ──────────────────────────────────────────────────────────────────────────────────

            const systemPrompt = `
You are a senior colorist and data-viz designer.
Your job is to design dashboard color palettes that are:

- Semantically aligned with an image-like keyword (e.g., "감귤", "바다", "숲").
- Beautiful and readable on UI backgrounds provided by the user.
- Returned ONLY as a JSON array of HEX codes (e.g., ["#112233","#AABBCC"]).

Never return explanations, prose, comments, markdown, or keys. 
Output must be a bare JSON array of uppercase 6-digit HEX color strings.
`.trim();

            const userPrompt = `
Goal → Return a ${paletteType} palette of ${n} HEX colors for a data-viz dashboard.

Context
- Keyword (visual theme, like 감귤/tangerine, 바다/ocean, 숲/forest, 노을/sunset, 벚꽃/cherry blossom, 말차/matcha, 나무/wood, 무지개/rainbow): "${String(
                query
            )}"
- Chart background color: "${chartBgc}"
- Board background color: "${boardBgc}"
- Preferred key color (optional): "${
                keyColor ? String(keyColor) : "none"
            }"

The keyword should work like "감귤" → people naturally imagine orange peel, yellow flesh, green leaves.
Your palette must make normal users intuitively feel "Yes, this looks like that keyword."

Hard requirements
1) Output ONLY a JSON array of ${n} HEX strings (uppercase, 6 digits, e.g., "#FFAA33").
   - No backticks, no object wrapper, no comments, no extra text.
2) Colors must be legible on dark or mid-tone UIs:
   - Avoid pure black (#000000) and pure white (#FFFFFF).
   - Avoid extreme neon colors.
   - Prefer mid-range saturation and lightness for charts with near-white labels.
3) Palette must stay tightly on-theme with the keyword's visual image.
   Think about what colors ordinary people imagine when they hear the word.

Semantic anchor examples (do NOT output these literally, just follow the ideas)
- "감귤", "tangerine", "citrus":
  - Warm oranges and yellow-oranges for peel and flesh.
  - A few fresh greens for leaves.
  - Avoid cold blues and purples.
- "바다", "ocean", "sea":
  - Blues, blue-greens, teals, seafoam.
  - Optional very light aqua for foam.
  - Avoid strong reds/oranges.
- "숲", "forest", "jungle":
  - Deep greens, fresh greens, muted olive, brown trunk/soil.
  - Avoid neon pinks and magentas.
- "노을", "sunset":
  - Reds, oranges, peach, soft yellows, warm violets.
  - Avoid strong greens.
- "벚꽃", "cherry blossom":
  - Soft pinks, mid pinks, a little lavender, very light off-white pink.
  - Avoid heavy dark tones.
- "말차", "matcha", "녹차":
  - Muted yellow-greens, matcha powder greens, creamy milk tones, warm neutrals.
- "나무", "wood", "warm wood":
  - Browns, tans, beiges with warm undertones.
- "무지개", "rainbow":
  - A balanced set of red, orange, yellow, green, blue, purple with similar lightness.

4) If a keyColor is provided: //
   - Include at least one color close to that keyColor.
   - Harmonize the rest using complementary / split-complementary / triad relationships,
     BUT still keep the overall keyword image (e.g., 감귤 → warm + green feeling).

5) Palette intent rules:
   - "categorical": maximize distinguishability between colors while staying on-theme.
   - "sequential": one main hue (or very tight range) with monotonic lightness.
   - "diverging": two related hue families with mirrored lightness around a neutral center.

Return ONLY the JSON array of ${n} HEX colors, nothing else.
`.trim();

            const combinedPrompt = `### System
${systemPrompt}

### User
${userPrompt}
`;

            const t0 = Date.now();
            const gmRes = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                {
                    contents: [
                      { parts: [{ text: combinedPrompt }] }
                    ],
              // 필요시 온도/안전설정 등 추가 가능
              // generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
                },
                {
                  headers: {
                    "X-goog-api-key": GEMINI_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                timeout: 15000,
                validateStatus: () => true,
              }
            );

            const ms = Date.now() - t0;
            const status = gmRes.status;
            const content = gmRes?.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            console.log("[/api/palette] status:", status, `(${ms}ms)`);

            if (status >= 400) {
                console.error(
                    "[/api/palette] gemini error body:",
                    gmRes.data
                );
                return res.status(status).json({
                    error: "gemini_error",
                    status,
                    message:
                        gmRes.data?.error?.message ||
                        gmRes.data?.message ||
                        JSON.stringify(gmRes.data).slice(0, 300),
                });
            }

            let colors = extractHexColors(content, n);

            if (!colors.length) {
                console.warn("[/api/palette] parse_failed, raw:", content);
                return res.status(502).json({
                    error: "parse_failed",
                    message: "no valid hex in output",
                    raw: content.slice(0, 300),
                });
            }

            // =========================================================================
            // 키 컬러 대체 로직
            // =========================================================================

            const inputKeyColor = keyColor; // 사용자가 선택한 키 컬러 (HEX)
            const emphasizeCount = Number(emphasisAttr) || 0; // 강조 속성 수

            // AND 조건 확인: 키 컬러 값이 있고 강조 속성 수가 1 이상일 경우
            if (inputKeyColor && emphasizeCount >= 1) {
                // 강조할 개수(emphasizeCount)가 전체 색상 개수를 넘지 않도록 제한
                const finalCount = Math.min(emphasizeCount, colors.length);
                
                // 랜덤하게 인덱스를 선택하여 키 컬러로 대체
                const indicesToEmphasize = new Set();
                
                // finalCount만큼 고유한 랜덤 인덱스를 선택
                while (indicesToEmphasize.size < finalCount) {
                    const randomIndex = Math.floor(Math.random() * colors.length);
                    indicesToEmphasize.add(randomIndex);
                }

                // 선택된 인덱스의 색상을 키 컬러로 대체
                indicesToEmphasize.forEach(index => {
                    colors[index] = inputKeyColor;
                });
                
                console.log(`[KeyColor Override] ${finalCount}개의 색상을 ${inputKeyColor}로 대체함.`);
            }

            // =========================================================================

            return res.json({ colors });
        } catch (err) {
            console.error("[/api/palette] exception:", err?.message);
            if (err?.response) {
                console.error("response.data:", err.response.data);
                return res.status(err.response.status || 500).json({
                    error: "gemini_exception",
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
    console.error("server.listen error:", err?.code, err?.message)
);
process.on("uncaughtException", (e) =>
    console.error("uncaughtException:", e)
);
process.on("unhandledRejection", (e) =>
    console.error("unhandledRejection:", e)
);