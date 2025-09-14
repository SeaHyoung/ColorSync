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

            <button
                className="chart-icon-button"
                draggable
                onDragStart={(e) => handleDragStart(e, "line")}
                title="라인차트"
            >
                Line
            </button>

            <button
                className="chart-icon-button"
                draggable
                onDragStart={(e) => handleDragStart(e, "pie")}
                title="파이차트"
            >
                Pie
            </button>

            <button
                className="chart-icon-button"
                draggable
                onDragStart={(e) => handleDragStart(e, "radar")}
                title="레이더차트"
            >
                Radar
            </button>

            <button
                className="chart-icon-button"
                draggable
                onDragStart={(e) => handleDragStart(e, "polarArea")}
                title="폴라에어리어차트"
            >
                polarArea
            </button>

            <button
                className="chart-icon-button"
                draggable
                onDragStart={(e) => handleDragStart(e, "bubble")}
                title="버블차트"
            >
                Bubble
            </button>

            <button
                className="chart-icon-button"
                draggable
                onDragStart={(e) => handleDragStart(e, "mixed")}
                title="믹스차트"
            >
                Mixed
            </button>

            <button
                className="chart-icon-button"
                draggable
                onDragStart={(e) => handleDragStart(e, "treeMap")}
                title="트리맵차트"
            >
                TreeMap
            </button>

            {/* 나머지 아이콘들은 계속 추가 가능 */}
        </div>
    );
};

export default ChartTypeSelector;
