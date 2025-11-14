import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function LineChart({
    colors = [
        "#A9A9A9",
        "#888888",
        "#696969",
        "#555555",
        "#444444",
        "#202020ff",
    ],
    dataCount = 4,
}) {
    const labels = Array.from({ length: 6 }, (_, i) => `${i + 1}`);

    // dataCount 개수만큼 랜덤 데이터 생성 (각 라인은 6개의 점)
    const datasets = Array.from({ length: dataCount }, (_, idx) => ({
        label: "Trend", // 고정 레이블
        data: Array.from(
            { length: 6 },
            () => Math.floor(Math.random() * 20) + 10
        ),
        borderColor: colors[idx % colors.length],
        backgroundColor: colors[idx % colors.length] + "33", // 투명도 추가
    }));

    const data = { labels, datasets };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: "top",
            },
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Line data={data} options={options} />
        </div>
    );
}
