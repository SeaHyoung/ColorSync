import React, { useState } from "react";

const SettingBoard = () => {
    const [attributeCount, setAttributeCount] = useState(null);
    const [emphasisAttr, setEmphasisAttr] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [keyColor, setKeyColor] = useState("#000000");
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);
    const [showKeyColorPicker, setShowKeyColorPicker] = useState(false);
    const [keyword, setKeyword] = useState("");

    const handleApply = () => {
        const payload = {
            attributeCount,
            emphasisAttr,
            backgroundColor,
            keyColor,
            keyword,
        };

        console.log("보낼 데이터:", payload); // 디버깅용

        fetch("/api/apply-settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("서버 응답:", data);
            })
            .catch((error) => {
                console.error("에러 발생:", error);
            });
    };

    const handleReset = () => {
        setAttributeCount(null);
        setEmphasisAttr(null);
        setBackgroundColor("#ffffff");
        setKeyColor("#000000");
        setKeyword("");
    };

    return (
        <div className="setting-board">
            <div className="section attribute-count">
                <label>속성 수</label>
                <div className="attribute-options">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
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
                        style={{ backgroundColor: backgroundColor }}
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
                        style={{ backgroundColor: keyColor }}
                        onClick={() =>
                            setShowKeyColorPicker(!showKeyColorPicker)
                        }
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

            <div className="section keywords">
                <label>키워드</label>
                <input
                    type="text"
                    placeholder="# 해시태그 자동완성"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <div className="tags">
                    <span># 시원한</span>
                    <span># intellectual</span>
                    <span># modern</span>
                </div>
            </div>

            <div className="section buttons">
                <button className="apply" onClick={handleApply}>
                    적용
                </button>
                <button className="reset" onClick={handleReset}>
                    초기화
                </button>
            </div>

            <div className="section recommendations">
                <label>추천 컬러</label>
                <div className="color-option">
                    {[...Array(6)].map((_, i) => (
                        <button key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingBoard;
