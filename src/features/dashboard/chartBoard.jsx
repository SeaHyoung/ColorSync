import React, { useState } from "react";
import BarChart from "./chart/barchart";
import DoughnutChart from "./chart/doughnutChart";
import LineChart from "./chart/lineChart";
import PieChart from "./chart/pieChart";
import RadarChart from "./chart/radarChart";
import PolarAreaChart from "./chart/polarAreaChart";
import BubbleChart from "./chart/bubbleChart";
import MixedChart from "./chart/mixedChart";
import TreeMapChart from "./chart/treeMapChart";

const ChartBoard = ({
    slots,
    setSlots,
    boardBgc,
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
        const settings = slot.settings || {}; // 설정 객체 없으면 빈 객체
        const dataCount = settings.attributeCount || 4; // 기본값 4
        const finalColors =
            settings.colors && settings.colors.length > 0
                ? settings.colors
                : undefined; // 설정된 색상 배열이 있으면 사용, 없으면 undefined(=기본 흑백색 적용됨)

        const chartProps = { dataCount, colors: finalColors }; // dataCount와 colors 전달

        if (slot.type === "bar") return <BarChart {...chartProps} />;
        if (slot.type === "doughnut") return <DoughnutChart {...chartProps} />;
        if (slot.type === "line") return <LineChart {...chartProps} />;
        if (slot.type === "pie") return <PieChart {...chartProps} />;
        if (slot.type === "radar") return <RadarChart {...chartProps} />;
        if (slot.type === "polarArea")
            return <PolarAreaChart {...chartProps} />;
        if (slot.type === "bubble") return <BubbleChart {...chartProps} />;
        if (slot.type === "mixed") return <MixedChart {...chartProps} />;
        if (slot.type === "treeMap") return <TreeMapChart {...chartProps} />;
        return <span className="placeholder"></span>;
    };

    // 차트보드 제목 상태
    const [boardTitle, setBoardTitle] = useState("Chart Board");
    // 차트보드 제목변경 핸들러
    const handleTitleChange = (e) => {
        setBoardTitle(e.target.value);
    };
    return (
        <div className="chart-board" style={{ backgroundColor: boardBgc }}>
            {/* 차트보드 타이틀 */}
            <input
                className="board-title"
                type="text"
                value={boardTitle}
                onChange={handleTitleChange}
            />
            {/* 차트보드 */}
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
                        style={{
                            backgroundColor:
                                slots[i]?.settings?.chartBgc === "none"
                                    ? "transparent"
                                    : slots[i]?.settings?.chartBgc,
                        }}
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
