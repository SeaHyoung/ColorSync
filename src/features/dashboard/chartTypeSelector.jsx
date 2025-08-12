import React, { useRef, useEffect } from "react";

const ChartTypeSelector = () => {
    const scrollRef = useRef();

    // 마우스 휠 좌우 스크롤 핸들링
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, []);

    return (
        <div className="chart-type-selector" ref={scrollRef}>
            {Array.from({ length: 24 }).map((_, index) => (
                <button key={index} className="chart-icon-button"></button>
            ))}
        </div>
    );
};

export default ChartTypeSelector;
