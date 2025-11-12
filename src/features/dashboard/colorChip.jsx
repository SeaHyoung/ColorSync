// 컬러슬라이더 수정 코드
import React, { useMemo } from "react";

const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        (hex || "").trim()
    );
    if (!m) return null;
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16),
    };
};
const rgbToHex = (r, g, b) =>
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
        .toString(16)
        .padStart(2, "0")}`.toUpperCase();
const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            default:
                h = (r - g) / d + 4;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
};
const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    return { r, g, b };
};
const mixHsl = (aHex, bHex, t) => {
    const a = hexToRgb(aHex),
        b = hexToRgb(bHex);
    if (!a || !b) return aHex || bHex || "#FFFFFF";
    const A = rgbToHsl(a.r, a.g, a.b),
        B = rgbToHsl(b.r, b.g, b.b);
    let dh = B.h - A.h;
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360; // hue wrap
    const h = A.h + dh * t,
        s = A.s + (B.s - A.s) * t,
        l = A.l + (B.l - A.l) * t;
    const { r, g, b: bb } = hslToRgb(h, s, l);
    return rgbToHex(r, g, bb);
};

const normalizeHex = (h) => {
    let s = String(h || "")
        .toUpperCase()
        .replace(/\s+/g, ""); // 공백 제거
    if (!s.startsWith("#")) s = "#" + s;
    if (!/^#[0-9A-F]{6}$/.test(s)) {
        const rgb = hexToRgb(h);
        if (rgb) return rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    return s;
};
const textOn = (hex) => {
    const c = hexToRgb(hex);
    if (!c) return "#000";
    const yiq = (c.r * 299 + c.g * 587 + c.b * 114) / 1000;
    return yiq >= 150 ? "#111" : "#FFF";
};

const build21SolidTiles = (colors) => {
    const n = colors.length;
    if (n === 0) return [];
    const tiles = [];
    const key = (hex) => ({ hex: normalizeHex(hex), isKey: true });

    tiles.push(key(colors[0]));

    for (let i = 0; i < n - 1; i++) {
        const a = normalizeHex(colors[i]);
        const b = normalizeHex(colors[i + 1]);
        tiles.push({ hex: mixHsl(a, b, 0.25), isKey: false });
        tiles.push({ hex: mixHsl(a, b, 0.5), isKey: false });
        tiles.push({ hex: mixHsl(a, b, 0.75), isKey: false });
        tiles.push(key(b));
    }
    return tiles;
};

export default function ColorChip({
                                      colors = [],
                                      width = 220,
                                      rowGap = 0,
                                      radius = 0,
                                      fontSize = 22,
                                      style,
                                  }) {
    const tiles = useMemo(() => build21SolidTiles(colors), [colors]);

    return (
        <div
            className="color-chips-container"
            style={{
                gridTemplateRows: `repeat(${tiles.length || 1}, 1fr)`,
            }}
            title={colors.map(normalizeHex).join(" • ")}
        >
            <style>{`
                .color-chips-container {
                    display: grid;
                    gap: 0px;
                }
                .color-chips {
                    opacity: 0;
                    transform: translateY(8px) scale(0.98);
                    animation: chip-pop 0.45s cubic-bezier(.2,.8,.2,1) forwards;
                    animation-delay: var(--delay);
                    border-radius: 0px;
                    font-weight: 600;
                    padding: 8px 10px;
                    transition: transform 0.2s ease;
                    cursor: pointer;
                }
                .color-chips:hover {
                    transform: scale(1.03);
                }
                @keyframes chip-pop {
                    0%   { opacity: 0; transform: translateY(8px) scale(0.95); }
                    60%  { opacity: 1; transform: translateY(0) scale(1.02); }
                    100% { opacity: 1; transform: translateY(0) scale(1.00); }
                }
            `}</style>

            {tiles.map((t, i) => {
                const hex = normalizeHex(t.hex);
                return (
                    <div
                        className="color-chips"
                        key={`${hex}-${i}`}
                        title={hex}
                        onClick={() => navigator.clipboard.writeText(hex)}
                        style={{
                            background: hex,
                            color: textOn(hex),
                            // 🟡 추가된 부분: 순차 애니메이션 지연
                            "--delay": `${i * 40}ms`,
                        }}
                    >
                        {t.isKey ? hex : ""}
                     </div>
                );
            })}
        </div>
    );
}


// 컬러슬라이더 기존 코드
// // src/features/dashboard/colorSlider.jsx
// import React, { useEffect, useRef } from "react";
//
// const ColorSlider = () => {
//     const sliderRef = useRef(null);
//
//     useEffect(() => {
//         const slider = sliderRef.current;
//
//         for (let i = 0; i < 50; i++) {
//             const block = document.createElement("div");
//             block.className = "color-block";
//
//             const hueStart = (i * 7) % 360;
//             const hueEnd = (hueStart + 30) % 360;
//             block.style.background = `linear-gradient(to right, hsl(${hueStart}, 80%, 70%), hsl(${hueEnd}, 80%, 60%))`;
//
//             slider.appendChild(block);
//         }
//     }, []);
//
//     return (
//         <div className="color-slider-container-vertical">
//             <div className="color-slider-vertical" ref={sliderRef}></div>
//         </div>
//     );
// };
//
// export default ColorSlider;
