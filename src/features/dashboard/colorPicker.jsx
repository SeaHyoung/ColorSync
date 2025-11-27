import React, { useState, memo } from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, Button } from "@mui/material";

function ColorPickerBase({ label, value, onChange, onClose }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [copied, setCopied] = useState(false);
    const hex = value ?? "none";
    const isNone = hex === "none";

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);

        if (hex === "none") {
            onChange?.("#ffffff");
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        onClose?.();
    };

    // 복사
    const handleCopy = () => {
        if (hex && hex !== "none") {
            navigator.clipboard.writeText(hex);
            setCopied(true);
            setTimeout(() => setCopied(false), 900); // 0.9초 후 사라짐
        }
    };

    return (
        <>
            <button
                type="button"
                className="color-choicer"
                onClick={handleOpen}
                style={{
                    background:
                        hex === "none"
                            ? "repeating-linear-gradient(45deg, #ccc 0, #ccc 10px, #fff 10px, #fff 20px)"
                            : hex,
                    border:
                        hex === "none" ? "2px dashed #666" : "1px solid #aaa",
                    cursor: "pointer",
                }}
            />

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <div
                    style={{
                        padding: "16px",
                        width: "235px",
                        position: "relative",
                        fontFamily: "system-ui",
                    }}
                >
                    {/* 토스트 애니메이션 CSS */}
                    <style>{`
                        .copy-toast {
                            position: absolute;
                            right: 8px;
                            bottom: 20px; 
                            padding: 6px 12px;
                            background: rgba(0,0,0,0.8);
                            color: #fff;
                            font-size: 12px;
                            border-radius: 6px;
                            opacity: 0;
                            animation: toast-pop 0.9s ease-out forwards;
                            pointer-events: none;
                            white-space: nowrap;
                            z-index: 20;
                        }

                        @keyframes toast-pop {
                            0% {
                                opacity: 0;
                                transform: translateY(6px);
                            }
                            20% {
                                opacity: 1;
                                transform: translateY(0);
                            }
                            80% {
                                opacity: 1;
                                transform: translateY(0);
                            }
                            100% {
                                opacity: 0;
                                transform: translateY(-4px);
                            }
                        }
                    `}</style>

                    <div style={{ marginBottom: "10px", fontSize: "14px" }}>
                        {label || "색상 선택"}
                    </div>

                    {isNone ? (
                        <div
                            style={{
                                marginBottom: "12px",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                textAlign: "center",
                                background: "#f7f7f7",
                            }}
                        >
                            현재 상태: 투명
                        </div>
                    ) : (
                        <>
                            <HexColorPicker
                                color={hex}
                                onChange={(color) => onChange?.(color)}
                            />

                            {/* input + 복사버튼 */}
                            <div
                                style={{
                                    marginTop: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                <input
                                    type="text"
                                    value={hex}
                                    onChange={(e) => onChange?.(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: "6px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        fontSize: "14px",
                                        textAlign: "center",
                                    }}
                                />

                                {/* 복사 버튼 */}
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "6px",
                                        border: "1px solid #ccc",
                                        background: "#f8f8f8",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    📋
                                </button>
                            </div>

                            {/* 복사 토스트 */}
                            {copied && (
                                <div className="copy-toast">Copied!</div>
                            )}
                        </>
                    )}

                    <div
                        style={{
                            marginTop: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button
                            onClick={() => {
                                onChange?.(null);
                                handleClose();
                            }}
                        >
                            투명
                        </Button>

                        <Button onClick={handleClose}>닫기</Button>
                    </div>
                </div>
            </Popover>
        </>
    );
}

const ColorPicker = memo(ColorPickerBase);
export default ColorPicker;
