import React, { useState, useEffect } from "react";
import axios from "axios";
import ColorPicker from "./colorPicker.jsx";

// Props 정의
const SettingBoard = ({
    slots,
    setSlots,
    boardBgc,
    setBoardBgc,
    selectedSlotIndex,
    onPaletteChange,
}) => {
    // =========================================================================
    //                     설정 관련 상태                     
    // =========================================================================
    // emphasisAttr의 초기값을 0으로 설정하여 null로 전송되는 것을 방지
    const [emphasisAttr, setEmphasisAttr] = useState(0); // 강조 속성 수
    const [keyColor, setKeyColor] = useState("none");
    const [keyword, setKeyword] = useState("");
    const [colors, setColors] = useState([]); // 추천 받은 컬러 팔레트

    const [loading, setLoading] = useState(false); // 추천 컬러 로딩 상태
    const [tempBgc, settempBgc] = useState("none"); // 임시 차트 배경색
    const [tempBoardBg, setTempBoardBg] = useState("#none"); // 임시 보드 배경색
    const [tempKey, setTempKey] = useState("#none"); // 임시 키 컬러
    // 색상 히스토리 상태
    const [bgHistory, setBgHistory] = useState([
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
    ]);
    const [boardBgHistory, setBoardBgHistory] = useState([
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
    // 현재 선택된 슬롯의 설정값 편의 변수 (props 또는 기본값 사용)
    const currentAttributeCount =
        slots?.[selectedSlotIndex]?.settings?.attributeCount ?? 4;
    // currentChartBgc는 설정값이 없으면 'none'으로 기본값 유지
    const currentChartBgc =
        slots?.[selectedSlotIndex]?.settings?.chartBgc ?? "none"; 

    // =========================================================================
    //       선택된 슬롯 변경 시 상태 초기화/업데이트         
    // =========================================================================
    useEffect(() => {
        const currentSlot = slots?.[selectedSlotIndex];
        if (currentSlot && currentSlot.settings) {
            const { emphasisAttr, keyColor, colors, keyword } =
                currentSlot.settings;

            setEmphasisAttr(emphasisAttr ?? 0);
            setKeyColor(keyColor ?? "none");
            if (Array.isArray(colors) && colors.length > 0) {
                setColors(colors);
            }
            setKeyword(keyword ?? "");
        } else {
            // 선택된 슬롯이 없거나 설정이 없는 경우 초기값으로
            setBoardBgc("none");
            setEmphasisAttr(0);
            setKeyColor("none");
        }
    }, [selectedSlotIndex, slots]);

    // 추천 컬러(colors)가 변경될 때 onPaletteChange 콜백 호출
    useEffect(() => {
        onPaletteChange?.(colors || []);
    }, [colors, onPaletteChange]);

    // =========================================================================
    //          슬롯 설정 업데이트(배경색 등 자동 적용)       
    // =========================================================================
    const updateSlotSetting = (key, value) => {
        if (selectedSlotIndex == null) {
            console.warn("적용할 차트 슬롯을 선택하세요.");
            return;
        }
        setSlots((prev) => {
            const next = [...prev];
            if (next[selectedSlotIndex]) {
                next[selectedSlotIndex] = {
                    ...next[selectedSlotIndex],
                    settings: {
                        ...(next[selectedSlotIndex].settings || {}),
                        [key]: value, // 해당 슬롯의 특정 'key' 설정을 'value'로 업데이트
                    },
                };
            }
            return next;
        });
    };

    // =========================================================================
    //                      핸들러 함수                       
    // =========================================================================

    // 추천 컬러 호출
    const fetchPalette = async () => {
        if (!keyword.trim()) {
            alert("키워드를 입력해 주세요.");
            return;
        }
        setLoading(true);
        try {
            const text = (keyword || "").trim();
            
            // 수정된 부분: keyColor, emphasisAttr, boardBgc, chartBgc를 payload에 추가
            const payload = { 
                query: text, 
                n: 6,
                // 'none' 값이면 서버에서 null로 처리되도록 null로 전송
                keyColor: keyColor === 'none' ? null : keyColor, 
                emphasisAttr: emphasisAttr || 0, // 0이 null로 전송되는 것을 방지
                boardBgc: boardBgc === 'none' ? null : boardBgc,
                chartBgc: currentChartBgc === 'none' ? null : currentChartBgc,
            };
            
            const { data } = await axios.post(
                "http://localhost:5050/api/palette",
                payload // payload 전송
            );
            
            const list = Array.isArray(data?.colors)
                ? data.colors.slice(0, 6)
                : [];
            setColors(list);
            onPaletteChange?.(list);
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

    // 적용 버튼 클릭
    const handleApply = async () => {
        if (selectedSlotIndex == null) {
            alert("적용할 차트 슬롯을 선택하세요");
            return;
        }
        const payload = {
            attributeCount: currentAttributeCount,
            chartBgc: currentChartBgc,
            boardBgc,
            emphasisAttr: emphasisAttr ?? 1,
            keyColor,
            keyword,
            colors,
        };

        try {
            const res = await fetch("http://localhost:5050/api/apply-settings", { // 서버 포트 명시
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            setSlots((prev) => {
                const next = [...prev];
                if (next[selectedSlotIndex]) {
                    next[selectedSlotIndex].settings = {
                        ...payload,
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

    // 초기화 버튼 클릭
    const handleReset = () => {
        setEmphasisAttr(0);
        setBoardBgc("none");
        setKeyColor("none");
        setKeyword("");
        setColors([]);
    };

    // 보드배경색 실시간 변경
    const onChangeBoardBgcLive = (hex) => {
        setTempBoardBg(hex);
        setBoardBgc(hex);
    };

    const onBoardBgcPickerClose = () => {
        setBoardBgHistory((prev) => {
            if (prev[0] === tempBoardBg) return prev; // 같은 색이면 스킵
            const next = [
                tempBoardBg,
                ...prev.filter((c) => c !== tempBoardBg),
            ];
            return next.slice(0, 5);
        });
    };
    // 차트배경색 실시간 변경
    const onChangeBackgroundLive = (hex) => {
        settempBgc(hex);
        updateSlotSetting("chartBgc", hex);
    };

    const onBackgroundPickerClose = () => {
        setBgHistory((prev) => {
            if (prev[0] === tempBgc) return prev;
            const next = [tempBgc, ...prev.filter((c) => c !== tempBgc)];
            return next.slice(0, 5);
        });
    };
    // 키컬러 실시간 변경
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

    // =========================================================================
    //                         랜더링                         
    // =========================================================================
    return (
        <div className="setting-board">
            <div className="section attribute-count">
                <label>속성 수</label>
                <div className="attribute-options">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
                            type="button"
                            key={n}
                            onClick={() =>
                                updateSlotSetting("attributeCount", n)
                            }
                            className={
                                currentAttributeCount === n ? "selected" : ""
                            }
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            <div className="section backgrounds-color">
                <label>차트 배경색</label>
                <div className="color-options">
                    <ColorPicker
                        label="차트 배경색"
                        value={tempBgc}
                        onChange={onChangeBackgroundLive}
                        onClose={onBackgroundPickerClose}
                    />

                    {bgHistory.map((hex, i) => (
                        <button
                            key={i}
                            type="button"
                            className="history-swatch"
                            title={hex}
                            aria-label={`히스토리 색상 ${hex}`}
                            style={{ background: hex }}
                            onClick={() => onChangeBackgroundLive(hex)} // ★ 수정됨
                        />
                    ))}
                </div>
            </div>

            <div className="section backgrounds-color">
                <label>차트보드 배경색</label>
                <div className="color-options">
                    <ColorPicker
                        label="차트보드 배경색"
                        value={boardBgc}
                        onChange={onChangeBoardBgcLive}
                        onClose={onBoardBgcPickerClose}
                    />

                    {boardBgHistory.map((hex, i) => (
                        <button
                            key={i}
                            type="button"
                            className="history-swatch"
                            title={hex}
                            aria-label={`히스토리 색상 ${hex}`}
                            style={{ background: hex }}
                            onClick={() => onChangeBoardBgcLive(hex)} // ★ 수정됨
                        />
                    ))}
                </div>
            </div>

            <div className="suggestion-option">
                <div className="section keywords">
                    <label>키워드</label>
                    <input
                        type="text"
                        placeholder="  키워드를 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="keyword-input"
                    />
                </div>

                <div className="section keycolors">
                    <label>강조색상</label>
                    <div className="color-options">
                        <ColorPicker
                            value={keyColor}
                            onChange={onChangeKeyColorLive}
                            onClose={onKeyPickerClose}
                        />

                        {keyHistory.map((hex, i) => (
                            <button
                                key={i}
                                type="button"
                                className="history-swatch"
                                title={hex}
                                aria-label={`히스토리 색상 ${hex}`}
                                style={{ background: hex }}
                                onClick={() => onChangeKeyColorLive(hex)} // ★ 수정됨
                            />
                        ))}
                    </div>
                </div>

                <div className="section emphasis-attributes">
                    <label>강조속성 수</label>
                    <div className="attribute-options">
                        {[0, 1, 2, 3].map((n) => (
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

                <button
                    type="button"
                    className="recommend-btn"
                    onClick={fetchPalette}
                    disabled={loading || !keyword.trim()}
                >
                    {loading ? "추천 불러오는 중..." : "추천 받기"}
                </button>

                <div className="section recommend">
                    <label>추천 컬러</label>
                    <div className="result-color-wrap">
                        {colors.map((hex, i) => (
                            <button
                                key={i}
                                type="button"
                                className="results-color-btn"
                                title={hex}
                                style={{ background: hex }}
                                onClick={() =>
                                    navigator.clipboard.writeText(hex)
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="btn-wrap">
                <button
                    type="button"
                    className="apply-btn"
                    onClick={handleApply}
                >
                    적용
                </button>

                <button
                    type="button"
                    className="reset-btn"
                    onClick={handleReset}
                >
                    초기화
                </button>
            </div>
        </div>
    );
};

export default SettingBoard;