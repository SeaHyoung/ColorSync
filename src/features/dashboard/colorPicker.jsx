import React, { useState, useEffect, useRef, memo } from "react";
import { Button, Popover, TextField, IconButton, InputAdornment } from "@mui/material";
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

    // 외부 값 ↔ 내부 동기화
    useEffect(() => {
        if (typeof value === "string" && value !== hex) setHex(value);
    }, [value]);

    // 열릴 때 입력창 자동 포커스
    useEffect(() => {
        if (open && inputRef.current) {
            const id = setTimeout(() => {
                inputRef.current.focus();
                inputRef.current.select();
            }, 40);
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
            {/* 글씨 없이 버튼 전체가 색 */}
            <Button
                onClick={handleOpen}
                disabled={disabled}
                className="cs-swatch"                       // ← 고유 클래스 부여
                sx={{
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    // ↓↓↓ 핵심: !important 로 덮어쓰기
                    backgroundColor: `${hex} !important`,
                    color: `${getContrastColor(hex)} !important`,
                    border: "1px solid rgba(0,0,0,0.2)",
                    "&:hover": { backgroundColor: `${hex} !important` },
                }}
                title={hex}
            />

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{ sx: { p: 2 } }}
            >
                <HexColorPicker
                    color={hex}
                    onChange={(c) => {
                        setHex(c);
                        onChange?.(c);
                    }}
                />

                <TextField
                    inputRef={inputRef}
                    label="HEX"
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
                    helperText={hex && !isValidHex6(normalizeHex(hex)) ? "예: #12abef" : " "}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="HEX 복사"
                                    onClick={() => navigator.clipboard.writeText(normalizeHex(hex))}
                                    size="small"
                                >
                                    📋
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
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
