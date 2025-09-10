// src/features/dashboard/chartBoard.jsx
import React, { useState } from "react";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";

const ChartBoard = ({
    slots,
    setSlots,
    selectedSlotIndex,
    setSelectedSlotIndex,
}) => {
    const [overIndex, setOverIndex] = useState(null);
    const items = Array.from({ length: 6 }, (_, i) => i); // 0..5

    const handleDragOver = (e, idx) => {
        e.preventDefault(); // drop 허용
        e.dataTransfer.dropEffect = "copy";
        setOverIndex(idx);
    };

    const handleDragLeave = () => setOverIndex(null);

    const handleDrop = (e, idx) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("text/chart-type"); // 'bar' 등
        if (!type) return;
        setOverIndex(null);
        setSlots((prev) => {
            const next = [...prev];
            // 해당 칸에 차트 타입 저장, 설정객체저장
            next[idx] = { type, settings: {} };
            return next;
        });
        setSelectedSlotIndex(idx); //드롭 후 해당 슬롯 선택
    };

    const handleSlotClick = (idx) => {
        // 슬롯 클릭 핸들러 추가
        setSelectedSlotIndex(idx);
    };

    const renderChart = (slot) => {
        if (!slot) return <span className="placeholder"></span>;
        // if (slot.type === "bar") return <BarChart {...slot.settings} />;
        // if (slot.type === "doughnut")
        //     return <DoughnutChart {...slot.settings} />;
        const settings = slot.settings || {}; // 설정 객체 없으면 빈 객체
        const dataCount = settings.attributeCount || 4; // 기본값 5
        const chartProps = { dataCount, colors: settings.colors }; // dataCount와 colors 전달

        if (slot.type === "bar") return <BarChart {...chartProps} />;
        if (slot.type === "doughnut") return <DoughnutChart {...chartProps} />;
        return <span className="placeholder"></span>;
    };

    return (
        <div className="chart-board">
            <h1 className="board-title">Chart Board</h1>
            <div className="boards">
                {items.map((i) => (
                    <div
                        key={i}
                        className={`chart-item ${
                            overIndex === i ? "drag-over" : ""
                        } ${selectedSlotIndex === i ? "selected" : ""}`}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, i)}
                        onClick={() => handleSlotClick(i)}
                    >
                        {/* 슬롯 상태에 따라 차트/플레이스홀더 렌더 */}
                        <div className="chart-canvas">
                            {slots?.[i] !== undefined && renderChart(slots[i])}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChartBoard;
