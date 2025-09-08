
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
        const { query, n = 6 } = req.body || {};
        const API_KEY = process.env.DEEPSEEK_API_KEY;
        if (!API_KEY)
            return res
                .status(500)
                .json({ error: "DEEPSEEK_API_KEY missing in .env" });
        if (!query || !String(query).trim())
            return res.status(400).json({ error: "query is required" });

        const prompt =
            `${query} 키워드를 영어로 번역하고, 그 영어에 어울리는 헥사코드 색상 ${n}개를 JSON 배열로만 반환해줘. ` +
            `예: ["#112233","#AABBCC"] 추가 설명은 절대 쓰지 마.`;

        try {
            const t0 = Date.now();
            const dsRes = await axios.post(
                "https://api.deepseek.com/v1/chat/completions",
                {
                    model: "deepseek-chat",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.2,
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
