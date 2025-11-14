import React, { useState, memo } from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, Button } from "@mui/material";

// value === "none" → 투명 상태
// onChange("none") → SettingBoard가 처리해야 함

function ColorPickerBase({ label, value, onChange, onClose }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const hex = value ?? "none";
    const isNone = hex === "none";

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);

        // 팝업 열릴 때 none이면 기본 색(흰색)으로 변환해 Picker가 뜨도록 한다.
        if (hex === "none") {
            onChange?.("#ffffff");
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        onClose?.();
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
                <div style={{ padding: "16px", width: "200px" }}>
                    <div style={{ marginBottom: "10px", fontSize: "14px" }}>
                        {label || "색상 선택"}
                    </div>

                    {/* 투명 상태 안내 */}
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

                            <input
                                type="text"
                                value={hex}
                                onChange={(e) => onChange?.(e.target.value)}
                                style={{
                                    marginTop: "12px",
                                    width: "100%",
                                    padding: "6px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    fontSize: "14px",
                                    textAlign: "center",
                                }}
                            />
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
                                onChange?.("none");
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
