import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({
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
    dataCount = 3,
}) {
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
                // 도넛차트는 데이터의 합이 100분율이어야 하므로 차트의 길이만큼 데이터 slice 하여 사용
                data: dataValues.slice(0, dataCount),
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
            legend: { position: "bottom" },
        },
        cutout: "60%",
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Doughnut data={data} options={options} />
        </div>
    );
}
