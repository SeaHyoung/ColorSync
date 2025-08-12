const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000; // 원하는 포트 번호

app.use(cors());
app.use(express.json()); // JSON 파싱 미들웨어

// 루트 경로에 GET 요청 처리 추가
app.get("/", (req, res) => {
    res.send("Colorsync 서버가 정상 작동 중입니다.");
});

// POST 요청 처리
app.post("/api/apply-settings", (req, res) => {
    const { attributeCount, emphasisAttr, backgroundColor, keyColor, keyword } =
        req.body;

    console.log("클라이언트로부터 받은 데이터:");
    console.log("속성 수:", attributeCount);
    console.log("강조속성:", emphasisAttr);
    console.log("배경색:", backgroundColor);
    console.log("키 컬러:", keyColor);
    console.log("키워드:", keyword);

    // 필요한 데이터 처리 로직 넣기

    // 응답
    res.json({ message: "설정이 성공적으로 적용되었습니다." });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
