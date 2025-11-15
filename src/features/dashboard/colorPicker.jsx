import React, { useState, useEffect, useRef, memo } from "react";
import {
    Button,
    Popover,
    TextField,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { HexColorPicker } from "react-colorful";

// HEX 정규화
function normalizeHex(s) {
    if (!s) return "";
    let t = s.trim().toLowerCase();
    if (!t.startsWith("#")) t = "#" + t;
    // #RGB -> #RRGGBB 변환
    if (t.length === 4) t = `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}`;
    return t;
}

// #RRGGBB 유효성 검사
function isValidHex6(s) {
    return /^#[0-9a-f]{6}$/.test(s);
}

// 배경색 기준 가독성 좋은 텍스트 색상
function getContrastColor(hx) {
    const n = normalizeHex(hx);
    if (!isValidHex6(n)) return "#000";
    const r = parseInt(n.slice(1, 3), 16);
    const g = parseInt(n.slice(3, 5), 16);
    const b = parseInt(n.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000" : "#fff";
}

function ColorPickerBase({
                             value = "#ffffff",
                             onChange,
                             onClose,
                             disabled = false,
                         }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [hex, setHex] = useState(value);
    const inputRef = useRef(null);

    // 마우스 커서 옆 “복사되었습니다!” 말풍선 상태
    const [copyToast, setCopyToast] = useState({
        visible: false,
        x: 0,
        y: 0,
    });

    const open = Boolean(anchorEl);
    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => {
        setAnchorEl(null);
        onClose?.();
    };

    // 외부에서 value가 바뀌었을 때 동기화
    useEffect(() => {
        if (typeof value === "string" && value !== hex) setHex(value);
    }, [value]);

    // 팝오버 열릴 때 HEX 인풋 자동 포커스
    useEffect(() => {
        if (open && inputRef.current) {
            const id = setTimeout(() => {
                inputRef.current.focus();
                inputRef.current.select();
            }, 80);
            return () => clearTimeout(id);
        }
    }, [open]);

    const applyHex = (raw) => {
        const n = normalizeHex(raw);
        setHex(n);
        if (isValidHex6(n)) onChange?.(n);
    };

    const displayHex = normalizeHex(hex);

    return (
        <>
            <style>{`
                .cs-swatch {
                    transition: all 0.25s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.12);
                }
                .cs-swatch:hover {
                    transform: translateY(-1px) scale(1.04);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.22);
                    filter: brightness(1.05);
                }

                .picker-fade {
                    animation: popInSoft 0.25s cubic-bezier(.25,.8,.25,1) forwards;
                    border-radius: 16px !important;
                    background: rgba(255,255,255,0.9) !important;
                    backdrop-filter: blur(8px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.16);
                }

                @keyframes popInSoft {
                    from {
                        opacity: 0;
                        transform: translateY(6px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .cs-container {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 260px;
                }

                .hex-field input {
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 16px;

                }

                .copy-btn {
                    transition: transform 0.2s ease;
                }
                .copy-btn:hover {
                    transform: scale(1.15);
                }

                /* 커서 왼쪽 아래에 뜨는 말풍선 */
                .copy-tooltip {
                    position: fixed;
                    z-index: 9999;
                    background: rgba(15, 23, 42, 0.95);
                    color: #f9fafb;
                    padding: 6px 10px;
                    border-radius: 8px;
                    font-size: 18px;
                    pointer-events: none;
                    white-space: nowrap;
                    animation: toastFade 1.3s forwards;
                }

                @keyframes toastFade {
                    0% {
                        opacity: 0;
                        transform: translate(-4px, 4px);
                    }
                    15% {
                        opacity: 1;
                        transform: translate(-8px, 8px);
                    }
                    85% {
                        opacity: 1;
                        transform: translate(-8px, 8px);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-12px, 14px);
                    }
                }
            `}</style>

            {/* 현재 색상을 보여주는 작은 스와치 버튼 */}
            <Button
                onClick={handleOpen}
                disabled={disabled}
                className="cs-swatch"
                sx={{
                    minWidth: 44,
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: `${displayHex || "#ffffff"} !important`,
                    color: `${getContrastColor(displayHex || "#ffffff")} !important`,
                    border: "1px solid rgba(0,0,0,0.15)",
                    p: 0,
                }}
                title={displayHex || "#ffffff"}
            />

            {/* 팝오버 */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                    className: "picker-fade",
                    sx: { p: 2 },
                }}
            >
                <div className="cs-container">
                    {/* 상단: 컬러 차트 단독 */}
                    <HexColorPicker
                        color={displayHex || "#ffffff"}
                        onChange={(c) => {
                            setHex(c);
                            onChange?.(c);
                        }}
                        style={{
                            width: "245px",
                            height: "190px",
                            borderRadius: "12px",
                            margin: "0 auto",
                        }}
                    />

                    {/* 하단: HEX 입력 + 복사 버튼 */}
                    <TextField
                        inputRef={inputRef}
                        label="HEX 코드"
                        className="hex-field"
                        value={hex}
                        onChange={(e) => setHex(e.target.value)}
                        onBlur={(e) => applyHex(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter")
                                applyHex(e.currentTarget.value);
                        }}
                        size="midium"
                        fullWidth
                        margin="dense"
                        placeholder="#RRGGBB"
                        error={
                            !!hex && !isValidHex6(normalizeHex(hex || ""))
                        }
                        helperText={
                            hex &&
                            !isValidHex6(normalizeHex(hex || ""))
                                ? "예: #12ABEF"
                                : " "
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        className="copy-btn"
                                        aria-label="HEX 복사"
                                        onClick={(e) => {
                                            const normalized = normalizeHex(
                                                hex
                                            );
                                            navigator.clipboard.writeText(
                                                normalized
                                            );

                                            // 마우스 커서 기준 좌표 저장
                                            setCopyToast({
                                                visible: true,
                                                x: e.clientX,
                                                y: e.clientY,
                                            });

                                            // 1.3초 후 자동으로 숨기기
                                            setTimeout(
                                                () =>
                                                    setCopyToast((prev) => ({
                                                        ...prev,
                                                        visible: false,
                                                    })),
                                                1300
                                            );
                                        }}
                                        size="midium"
                                    >
                                        📋
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 닫기 버튼 */}
                    <Button
                        size="small"
                        onClick={handleClose}
                        sx={{ alignSelf: "flex-end" }}
                    >
                        닫기
                    </Button>
                </div>
            </Popover>

            {/* 마우스 커서 기준 왼쪽 아래에 뜨는 말풍선 */}
            {copyToast.visible && (
                <div
                    className="copy-tooltip"
                    style={{
                        left: copyToast.x - 150, // 커서 기준 살짝 왼쪽
                        top: copyToast.y + 18,  // 커서 기준 살짝 아래
                    }}
                >
                    복사되었습니다.
                </div>
            )}
        </>
    );
}

const ColorPicker = memo(ColorPickerBase);
export default ColorPicker;
