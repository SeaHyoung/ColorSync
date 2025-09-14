import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function BarChart({
    colors = [
        "#A9A9A9",
        "#888888",
        "#696969",
        "#555555",
        "#444444",
        "#202020ff",
    ],
    // dataValues = [50, 65, 80, 40, 75, 100],
    // labels = ["A", "B", "C", "D", "E", "F"],
    dataCount = 3, //chartSelector에서 보이는 datacount
}) {
    //bar차트는 labels 랜덤이어야 세팅값 업데이트 됨
    const labels = Array.from({ length: dataCount }, (_, i) => `${i + 1}`);

    const dataValues = Array.from(
        { length: dataCount },
        () => Math.floor(Math.random() * 20) + 10
    );

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Share",
                data: dataValues,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            title: { display: false },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { display: true } },
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Bar data={data} options={options} />
        </div>
    );
}
