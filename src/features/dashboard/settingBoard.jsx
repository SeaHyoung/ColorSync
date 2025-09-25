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
        "#ffffff",
    ]);
    const [keyHistory, setKeyHistory] = useState([
        "#ffffff",
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

    const [tempBg, setTempBg] = useState("#ffffff");
    const [tempKey, setTempKey] = useState("#000000");

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
            setAttributeCount(attributeCount ?? 0);
            setEmphasisAttr(emphasisAttr ?? 0);
            setBackgroundColor(backgroundColor ?? "#ffffff");
            setKeyColor(keyColor ?? "#ffffff");
            setColors(colors ?? []);
            setKeyword(keyword ?? "");
        } else {
            // 선택된 슬롯이 없거나 설정이 없는 경우 초기값으로
            setAttributeCount(0);
            setEmphasisAttr(0);
            setBackgroundColor("#ffffff");
            setKeyColor("#ffffff");
            setColors([]);
            setKeyword("");
        }
    }, [selectedSlotIndex, slots]);

    // 적용 버튼 클릭 핸들러
    const handleApply = async () => {
        if (selectedSlotIndex == null) {
            alert("적용할 차트 슬롯을 선택하세요");
            return;
        }
        const payload = {
            attributeCount: attributeCount ?? 1,
            emphasisAttr: emphasisAttr ?? 1,
            backgroundColor,
            keyColor,
            keyword,
            colors,
        };

        try {
            const res = await fetch("/api/apply-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            // console.log("서버 응답:", data);

            setSlots((prev) => {
                const next = [...prev];
                if (next[selectedSlotIndex]) {
                    next[selectedSlotIndex].settings = {
                        ...payload, // 서버에 보낸 전체 페이로드를 설정으로 저장
                    };
                }
                return next;
            });

            // alert("서버 응답: " + (data?.message || "OK"));
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

    // 실시간 미리보기만 반영(컬러피커 버튼에만 반영,히스토리는 추가 X)
    const onChangeBackgroundLive = (hex) => {
        setTempBg(hex);
        setBackgroundColor(hex);
    };

    // 컬러피커 닫힐 때 최종 선택만 히스토리에 1회 기록
    const onBackgroundPickerClose = () => {
        setBgHistory((prev) => {
            if (prev[0] === tempBg) return prev; // 같은 색이면 스킵
            const next = [tempBg, ...prev.filter((c) => c !== tempBg)];
            return next.slice(0, 5);
        });
    };

    const onChangeKeyColorLive = (hex) => {
        setTempKey(hex);
        setKeyColor(hex);
    };

    const onKeyPickerClose = () => {
        setKeyHistory((prev) => {
            if (prev[0] === tempKey) return prev;
            const next = [tempKey, ...prev.filter((c) => c !== tempKey)];
            return next.slice(0, 5);
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

    // 태그 삭제
    const removeTag = (id) => {
        setTags((prev) => prev.filter((t) => t.id !== id));
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
            </div>

            <div className="section emphasis-attributes">
                <label>강조속성 수</label>
                <div className="attribute-options">
                    {[1, 2, 3].map((n) => (
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

            <div className="section backgrounds-color">
                <label>배경색</label>
                <div className="color-options">
                    <input
                        type="color"
                        className="color-choicer"
                        aria-label="배경색 선택"
                        value={backgroundColor}
                        onChange={(e) => onChangeBackgroundLive(e.target.value)}
                        onBlur={onBackgroundPickerClose}
                    />

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

            <div className="section keycolors">
                <label>키 컬러</label>
                <div className="color-options">
                    <input
                        type="color"
                        className="color-choicer"
                        aria-label="키 컬러 선택"
                        value={keyColor}
                        onChange={(e) => onChangeKeyColorLive(e.target.value)}
                        onBlur={onKeyPickerClose}
                    />
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

            <div className="section keywords">
                <label>키워드</label>
                <input
                    type="text"
                    placeholder="  키워드를 입력하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    className="keyword-input"
                />
                <div className="tags">
                    {tags.map((t) => (
                        <span key={t.id} className="tag">
                            <span className="tag-text">{t.label}</span>
                            <button
                                type="button"
                                className="tag-remove"
                                aria-label={`${t.label} 삭제`}
                                onClick={() => removeTag(t.id)}
                                title="태그 삭제"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <button
                type="button"
                className="btn-recommend"
                onClick={fetchPalette}
                disabled={loading || !keyword.trim()}
            >
                {loading ? "추천 불러오는 중..." : "추천 받기"}
            </button>

            <div className="section recommend">
                <label>추천 컬러</label>
                <div className="result-color-wrap">
                    {/* {colors.length === 0 && (
                            <div style={{ opacity: 0.6 }}>
                                키워드 입력 후 Enter 또는 “추천 받기” 클릭
                            </div>
                        )} */}
                    {colors.map((hex, i) => (
                        <button
                            key={i}
                            type="button"
                            className="results-color-btn"
                            title={hex}
                            style={{
                                background: hex,
                            }}
                            onClick={() => navigator.clipboard.writeText(hex)}
                        />
                    ))}
                </div>
            </div>

            <button type="button" className="btn-apply" onClick={handleApply}>
                적용
            </button>
            <button type="button" className="btn-reset" onClick={handleReset}>
                초기화
            </button>
        </div>
    );
};

export default SettingBoard;
