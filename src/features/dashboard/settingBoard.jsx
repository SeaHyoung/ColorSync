import React, { useState } from "react";
import axios from "axios";

const SettingBoard = () => {
  // 기본값 지정
  const [attributeCount, setAttributeCount] = useState(1);
  const [emphasisAttr, setEmphasisAttr] = useState(1);

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [keyColor, setKeyColor] = useState("#000000");
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showKeyColorPicker, setShowKeyColorPicker] = useState(false);
  const [keyword, setKeyword] = useState("");

  // 추천 컬러 상태
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  // 적용(기존 라우트)
  const handleApply = async () => {
    const payload = {
      attributeCount: attributeCount ?? 1,
      emphasisAttr: emphasisAttr ?? 1,
      backgroundColor,
      keyColor,
      keyword,
    };

    try {
      const res = await fetch("/api/apply-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("서버 응답:", data);
      alert("서버 응답: " + (data?.message || "OK"));
    } catch (err) {
      console.error("에러 발생:", err);
      alert("요청 실패: " + (err?.message || "unknown error"));
    }
  };

  const handleReset = () => {
    setAttributeCount(1);
    setEmphasisAttr(1);
    setBackgroundColor("#ffffff");
    setKeyColor("#000000");
    setKeyword("");
    setColors([]);
  };

  // 추천 컬러 호출
  const fetchPalette = async () => {
    if (!keyword.trim()) {
      alert("키워드를 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/palette", {
        query: keyword,
        n: 6,
      });
      setColors(data.colors || []);
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "요청 실패";
      alert("추천 실패: " + msg);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Enter로 추천 호출
  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter") fetchPalette();
  };

  const pickTag = (tag) => setKeyword(tag);

  return (
    <div className="setting-board">
      <div className="section attribute-count">
        <label>속성 수</label>
        <div className="attribute-options">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setAttributeCount(n)}
              className={attributeCount === n ? "selected" : ""}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="section emphasis-attributes">
        <label>강조속성</label>
        <div className="attribute-options">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setEmphasisAttr(n)}
              className={emphasisAttr === n ? "selected" : ""}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="section recent-backgrounds">
        <label>배경색</label>
        <div className="color-option">
          <button
            type="button"
            style={{ backgroundColor }}
            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
          />
          {showBgColorPicker && (
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="section recent-keycolors">
        <label>키 컬러</label>
        <div className="color-option">
          <button
            type="button"
            style={{ backgroundColor: keyColor }}
            onClick={() => setShowKeyColorPicker(!showKeyColorPicker)}
          />
          {showKeyColorPicker && (
            <input
              type="color"
              value={keyColor}
              onChange={(e) => setKeyColor(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="section keywords" style={{ position: "relative" }}>
        <label>키워드</label>
        <input
          type="text"
          placeholder="# 해시태그 자동완성"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeywordKeyDown}
        />
        <div className="tags">
          <span onClick={() => pickTag("# 시원한")}># 시원한</span>
          <span onClick={() => pickTag("# intellectual")}># intellectual</span>
          <span onClick={() => pickTag("# modern")}># modern</span>
        </div>
      </div>

      <div className="section buttons">
        <button type="button" className="apply" onClick={handleApply}>
          적용
        </button>
        <button type="button" className="reset" onClick={handleReset}>
          초기화
        </button>
        <button
          type="button"
          onClick={fetchPalette}
          disabled={loading || !keyword.trim()}
          style={{ marginLeft: 8 }}
        >
          {loading ? "추천 불러오는 중..." : "추천 받기"}
        </button>
      </div>

      <div className="section recommendations">
        <label>추천 컬러</label>
        <div className="color-option" style={{ display: "flex", alignItems: "center" }}>
          {colors.length === 0 && (
            <div style={{ opacity: 0.6 }}>키워드 입력 후 Enter 또는 “추천 받기” 클릭</div>
          )}
          {colors.map((hex, i) => (
            <button
              key={i}
              type="button"
              title={hex}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "1px solid #ddd",
                background: hex,
                marginRight: 8,
                cursor: "pointer",
              }}
              onClick={() => navigator.clipboard.writeText(hex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingBoard;
