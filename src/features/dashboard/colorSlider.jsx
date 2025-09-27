import React, { useEffect, useRef } from "react";

const ColorSlider = () => {
    const sliderRef = useRef(null);

    useEffect(() => {
        const slider = sliderRef.current;

        for (let i = 0; i < 21; i++) {
            const block = document.createElement("div");
            block.className = "color-block";

            const hueStart = (i * 7) % 360;
            const hueEnd = (hueStart + 30) % 360;
            block.style.background = `linear-gradient(to right, hsl(${hueStart}, 80%, 70%), hsl(${hueEnd}, 80%, 60%))`;

            slider.appendChild(block);
        }
    }, []);

    return (
        <div className="color-slider-container-vertical">
            <div className="color-slider-vertical" ref={sliderRef}></div>
        </div>
    );
};

export default ColorSlider;
