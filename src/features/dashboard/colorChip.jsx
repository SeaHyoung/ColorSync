import React, { useMemo } from "react";

// HEX → RGB
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

// RGB → HEX
const rgbToHex = (r, g, b) =>
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
        .toString(16)
        .padStart(2, "0")}`.toUpperCase();

// RGB → HSL
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

// HSL → RGB
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

// 두 색 사이 HSL 보간
const mixHsl = (aHex, bHex, t) => {
    const a = hexToRgb(aHex),
        b = hexToRgb(bHex);
    if (!a || !b) return aHex || bHex || "#FFFFFF";

    const A = rgbToHsl(a.r, a.g, a.b);
    const B = rgbToHsl(b.r, b.g, b.b);

    // hue 랩 보정
    let dh = B.h - A.h;
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;

    const h = A.h + dh * t;
    const s = A.s + (B.s - A.s) * t;
    const l = A.l + (B.l - A.l) * t;

    const { r, g, b: bb } = hslToRgb(h, s, l);
    return rgbToHex(r, g, bb);
};

const normalizeHex = (h) => {
    let s = String(h || "")
        .toUpperCase()
        .replace(/\s+/g, "");
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

// 키컬러 사이 중간 단계들 만들어서 슬라이더용 타일 생성
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

    // 팔레트가 바뀔 때마다 애니메이션 다시 실행
    const animationKey = useMemo(
        () => colors.map((c) => normalizeHex(c)).join("_"),
        [colors]
    );

    // 추천받기 전에는 아예 렌더하지 않아서 "자리"도 안 생기게
    if (!tiles.length) return null;

    return (
        <div
            key={animationKey} // 팔레트 바뀔 때마다 컴포넌트 재마운트 → 애니메이션 재실행
            className="color-chips-container"
            style={{
                gridTemplateRows: `repeat(${tiles.length || 1}, 1fr)`,
                width,
                rowGap,
                ...style,
            }}
            title={colors.map(normalizeHex).join(" • ")}
        >
            <style>{`
                .color-chips-container {
                    display: grid;
                    gap: 0px;

                    /* ✅ 오른쪽에서 왼쪽으로 슬라이드 인 */
                    opacity: 0;
                    transform: translateX(40px);
                    animation: chips-slide-in 0.9s cubic-bezier(.2,.8,.2,1.05) forwards;
                }

                .color-chips {
                    opacity: 1;
                    transform: none;
                    border-radius: ${radius}px;
                    font-weight: 600;
                    padding: 8px 10px;
                    transition: transform 0.2s ease;
                    cursor: pointer;
                    font-size: ${fontSize}px;
                }

                .color-chips:hover {
                    transform: scale(1.03);
                }

                @keyframes chips-slide-in {
                    0% {
                        opacity: 0;
                    }
                    55% {
                        opacity: 1;
                    }
                        85% {
                    opacity: 1;
    }
                    100% {
                        opacity: 1;
                    }
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
                        }}
                    >
                        {t.isKey ? hex : ""}
                    </div>
                );
            })}
        </div>
    );
}
