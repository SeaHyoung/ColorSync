// src/features/dashboard/chartBoard.jsx
import React, { useState } from "react";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";

const ChartBoard = ({ slots, setSlots }) => {
    // 드래그 오버 시 스타일 주기 위한 상태(선택)
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
            next[idx] = type; // 해당 칸에 차트 타입 저장
            return next;
        });
    };

    const renderChart = (type) => {
        if (type === "bar") return <BarChart />;
        if (type === "doughnut") return <DoughnutChart />;
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
                        }`}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, i)}
                    >
                        {/* Block 텍스트는 차트가 없을 때만 보여주기 */}
                        {slots?.[i] === null && (
                            <h3 className="chart-title">Block {i + 1}</h3>
                        )}

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
