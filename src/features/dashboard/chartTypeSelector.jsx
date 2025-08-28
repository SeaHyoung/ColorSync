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

    // 드래그 시작 핸들러: chartType을 전달
    const handleDragStart = (e, chartType) => {
        e.dataTransfer.setData("text/chart-type", chartType); // 예: 'bar'
        e.dataTransfer.effectAllowed = "copy";
    };
    return (
        <div className="chart-type-selector" ref={scrollRef}>
            {/* {Array.from({ length: 24 }).map((_, index) => (
                <button key={index} className="chart-icon-button"></button>
            ))} */}

            {/* 막대그래프 아이콘 (드래그 가능) */}
            <button
                className="chart-icon-button"
                draggable
                onDragStart={(e) => handleDragStart(e, "bar")}
                title="막대그래프"
            >
                Bar
            </button>

            {/* 도넛차트 아이콘 (옵션) */}
            <button
                className="chart-icon-button"
                draggable
                onDragStart={(e) => handleDragStart(e, "doughnut")}
                title="도넛차트"
            >
                Doughnut
            </button>

            {/* 나머지 아이콘들은 계속 추가 가능 */}
        </div>
    );
};

export default ChartTypeSelector;
