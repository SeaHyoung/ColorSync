import React, { useState, useEffect, useRef, memo } from "react";
import {
    Button,
    Popover,
    TextField,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { HexColorPicker } from "react-colorful";

function normalizeHex(s) {
    if (!s) return "";
    let t = s.trim().toLowerCase();
    if (!t.startsWith("#")) t = "#" + t;
    if (t.length === 4) t = `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}`;
    return t;
}
function isValidHex6(s) {
    return /^#[0-9a-f]{6}$/.test(s);
}
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

    const open = Boolean(anchorEl);
    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => {
        setAnchorEl(null);
        onClose?.();
    };

    useEffect(() => {
        if (typeof value === "string" && value !== hex) setHex(value);
    }, [value]);

    useEffect(() => {
        if (open && inputRef.current) {
            const id = setTimeout(() => {
                inputRef.current.focus();
                inputRef.current.select();
            }, 100);
            return () => clearTimeout(id);
        }
    }, [open]);

    const applyHex = (raw) => {
        const n = normalizeHex(raw);
        setHex(n);
        if (isValidHex6(n)) onChange?.(n);
    };

    return (
        <>
            <style>{`
                .cs-swatch {
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                }
                .cs-swatch:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.25);
                    filter: brightness(1.08);
                }

                .picker-fade {
                    animation: popIn 0.25s cubic-bezier(.25,.8,.25,1) forwards;
                    border-radius: 16px !important;
                    background: rgba(255,255,255,0.85) !important;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 6px 18px rgba(0,0,0,0.15);
                }

                @keyframes popIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px) scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .hex-field {
                    margin-top: 8px;
                    background: rgba(255,255,255,0.6);
                    border-radius: 8px;
                }
                .hex-field input {
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .copy-btn {
                    transition: transform 0.2s;
                }
                .copy-btn:hover {
                    transform: scale(1.2);
                }
            `}</style>

            {/* 색상 버튼 */}
            <Button
                onClick={handleOpen}
                disabled={disabled}
                className="cs-swatch"
                sx={{
                    minWidth: 44,
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: `${hex} !important`,
                    color: `${getContrastColor(hex)} !important`,
                    border: "1px solid rgba(0,0,0,0.15)",
                }}
                title={hex}
            />

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{ className: "picker-fade", sx: { p: 2 } }}
            >
                <HexColorPicker
                    color={hex}
                    onChange={(c) => {
                        setHex(c);
                        onChange?.(c);
                    }}
                    style={{
                        width: "220px",
                        height: "180px",
                        borderRadius: "12px",
                        marginBottom: "10px",
                    }}
                />

                <TextField
                    inputRef={inputRef}
                    label="HEX 코드"
                    className="hex-field"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    onBlur={(e) => applyHex(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") applyHex(e.currentTarget.value);
                    }}
                    size="small"
                    margin="dense"
                    placeholder="#RRGGBB"
                    error={hex && !isValidHex6(normalizeHex(hex))}
                    helperText={
                        hex && !isValidHex6(normalizeHex(hex))
                            ? "예: #12ABEF"
                            : " "
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    className="copy-btn"
                                    aria-label="HEX 복사"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            normalizeHex(hex)
                                        )
                                    }
                                    size="small"
                                >
                                    📋
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 8,
                    }}
                >
                    <Button size="small" onClick={handleClose}>
                        닫기
                    </Button>
                </div>
            </Popover>
        </>
    );
}

const ColorPicker = memo(ColorPickerBase);
export default ColorPicker;
