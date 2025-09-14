// src/features/dashboard/BubbleChart.jsx
import React from "react";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bubble } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// ✅ dataCount prop을 받아 데이터셋을 동적으로 생성합니다.
export default function BubbleChart({
    colors = [
        "#A9A9A9",
        "#888888",
        "#696969",
        "#555555",
        "#444444",
        "#202020ff",
    ],
    dataCount = 2, // 데이터셋 기본 개수
}) {
    // 버블 데이터를 생성하는 헬퍼 함수
    const generateBubbleData = (count) => {
        return Array.from({ length: count }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            r: Math.random() * 20 + 5, // 버블 크기
        }));
    };

    const datasets = Array.from({ length: dataCount }, (_, i) => ({
        label: `${i + 1}`,
        data: generateBubbleData(5), // 각 데이터셋에는 5개의 버블을 포함합니다.
        backgroundColor: colors[i % colors.length], // 색상 배열을 순환 사용
    }));

    const data = {
        datasets: datasets,
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { type: "linear", position: "bottom" },
            y: { beginAtZero: true },
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Bubble data={data} options={options} />
        </div>
    );
}
