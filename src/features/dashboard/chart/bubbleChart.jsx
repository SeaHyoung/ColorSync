import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bubble } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// 6개의 데이터셋을 미리 생성하고 고정
const initialDatasets = Array.from({ length: 6 }, (_, i) => ({
    label: `${i + 1}`,
    data: Array.from({ length: 7 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 20 + 5,
    })),
}));

// dataCount prop을 받아 데이터셋을 동적으로 생성
export default function BubbleChart({
    colors = [
        "#A9A9A9",
        "#888888",
        "#696969",
        "#555555",
        "#444444",
        "#202020ff",
    ],
    dataCount = 6, //props 오류방지 기본값
}) {
    // 버블 데이터를 생성하는 헬퍼 함수
    // const generateBubbleData = (count) => {
    //     return Array.from({ length: count }, () => ({
    //         x: Math.random() * 100,
    //         y: Math.random() * 100,
    //         r: Math.random() * 20 + 5, // 버블 크기
    //     }));
    // };

    // const datasets = Array.from({ length: dataCount }, (_, i) => ({
    //     label: `${i + 1}`,
    //     data: generateBubbleData, // 각 데이터셋에는 5개의 버블을 포함
    //     backgroundColor: colors[i % colors.length], // 색상 배열을 순환 사용
    // }));

    const [originalDatasets] = useState(initialDatasets);

    const datasets = originalDatasets.slice(0, dataCount).map((dataset, i) => ({
        ...dataset,
        backgroundColor: colors[i % colors.length],
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
