import { useState } from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function PolarAreaChart({
    colors = [
        "#A9A9A9",
        "#888888",
        "#696969",
        "#555555",
        "#444444",
        "#202020ff",
    ],
    dataCount = 6,
}) {
    const labels = Array.from({ length: dataCount }, (_, i) => `${i + 1}`);
    // 데이터 업데이트 제어 useState 사용불가한 차트
    const dataValues = Array.from(
        { length: dataCount },
        () => Math.floor(Math.random() * 20) + 10
    );

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Amount",
                data: dataValues,
                backgroundColor: colors.map((c) => `${c}B3`), // 70% 투명도 적용
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
        },
        scales: {
            r: {
                pointLabels: { display: true },
                ticks: { display: false },
            },
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <PolarArea data={data} options={options} />
        </div>
    );
}
