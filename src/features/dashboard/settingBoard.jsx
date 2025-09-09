import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";

//props 추가됨(slot, setSlots, selectedSlotIndex)
const SettingBoard = ({ slots, setSlots, selectedSlotIndex }) => {
    // 기본값 지정
    // 속성 기본값 1에서 null 로 변경
    const [attributeCount, setAttributeCount] = useState(null);
    const [emphasisAttr, setEmphasisAttr] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [keyColor, setKeyColor] = useState("#000000");

    //배경색, 키컬러 히스토리 초기값
    const [bgHistory, setBgHistory] = useState([
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
    ]);
    const [keyHistory, setKeyHistory] = useState([
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
    ]);
    const [keyword, setKeyword] = useState("");

    // 해시태그 상태 (등장/퇴장 애니메이션용)
    const [tags, setTags] = useState([]);

    // 추천 컬러 상태
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);

    //selectedSlotIndex 변경 시 상태 초기화/업데이트
    useEffect(() => {
        const currentSlot = slots?.[selectedSlotIndex];
        if (currentSlot && currentSlot.settings) {
            const {
                attributeCount,
                emphasisAttr,
                backgroundColor,
                keyColor,
                colors,
                keyword,
            } = currentSlot.settings;
            setAttributeCount(attributeCount ?? 1);
            setEmphasisAttr(emphasisAttr ?? 1);
            setBackgroundColor(backgroundColor ?? "#ffffff");
            setKeyColor(keyColor ?? "#ffffff");
            setColors(colors ?? []);
            setKeyword(keyword ?? "");
        } else {
            // 선택된 슬롯이 없거나 설정이 없는 경우 초기값으로
            setAttributeCount(5);
            setEmphasisAttr(1);
            setBackgroundColor("#ffffff");
            setKeyColor("#ffffff");
            setColors([]);
            setKeyword("");
        }
    }, [selectedSlotIndex, slots]);

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
        setKeyColor("#ffffff");
        setKeyword("");
        setColors([]);
    };

    // 배경색을 바꾸면 히스토리에 반영
    const onChangeBackground = (hex) => {
        setBackgroundColor(hex);
        setBgHistory((prev) => {
            const next = [hex, ...prev.filter((c) => c !== hex)];
            return next.slice(0, 4); // 최대 4개 유지
        });
    };

    // 키 컬러를 바꾸면 히스토리에 반영
    const onChangeKeyColor = (hex) => {
        setKeyColor(hex);
        setKeyHistory((prev) => {
            const next = [hex, ...prev.filter((c) => c !== hex)];
            return next.slice(0, 4); // 최대 4개 유지
        });
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

    const handleKeywordKeyDown = (e) => {
        if (e.key === "Enter" && keyword.trim()) {
            const q = keyword.trim();
            addTag(q);
            fetchPalette(q);
            setKeyword("");
        }
    };

    // 태그 클릭 시: 앞의 '#'과 공백을 제거하고 입력창에 단어만 세팅
    const pickTag = (tag) => setKeyword(tag.replace(/^#\s?/, ""));

    // 해시태그 추가
    const addTag = (text) => {
        const clean = text.trim();
        if (!clean) return;

        const newTag = {
            id: Date.now() + Math.random(),
            label: `# ${clean}`,
            removing: false,
        };
        setTags((prev) => {
            const next = [...prev, newTag];
            // 최신 3개만 유지
            return next.slice(-3);
        });
    };

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

                    <div className="bg-picker-row">
                        <div className="color-option">
                            <input
                                type="color"
                                aria-label="배경색 선택"
                                value={backgroundColor}
                                onChange={(e) =>
                                    onChangeBackground(e.target.value)
                                }
                                className="color-btn"
                            />
                        </div>

                        <div className="bg-history-inline">
                            {bgHistory.map((hex, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className="history-swatch"
                                    title={hex}
                                    aria-label={`히스토리 색상 ${hex}`}
                                    style={{ background: hex }}
                                    onClick={() => setBackgroundColor(hex)} // 클릭하면 다시 적용 (선택)
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="section recent-keycolors">
                    <label>키 컬러</label>
                    <div className="key-picker-row">
                        <div className="color-option">
                            <input
                                type="color"
                                aria-label="키 컬러 선택"
                                value={keyColor}
                                onChange={(e) =>
                                    onChangeKeyColor(e.target.value)
                                } // 🔵 여기 연결
                                className="color-btn"
                            />
                        </div>
                        <div className="key-history-inline">
                            {keyHistory.map((hex, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className="history-swatch"
                                    title={hex}
                                    aria-label={`히스토리 색상 ${hex}`}
                                    style={{ background: hex }}
                                    onClick={() => setKeyColor(hex)}
                                />
                            ))}
                        </div>
                    </div>
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
                    {tags.map((t) => (
                        <span
                            key={t.id}
                            onClick={() => pickTag(t.label)}
                            className="tag"
                        >
                            {t.label}
                        </span>
                    ))}
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
                <div
                    className="color-option"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    {colors.length === 0 && (
                        <div style={{ opacity: 0.6 }}>
                            키워드 입력 후 Enter 또는 “추천 받기” 클릭
                        </div>
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
