import React from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

// 1. 16진수 색상 코드를 rgba()로 변환하는 헬퍼 함수
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function RadarChart({
    colors = ["#A9A9A9", "#696969"],
    // dataValues = [50, 65, 80, 40, 75, 100],
    // labels = ["A", "B", "C", "D", "E", "F"],
    dataCount = 5,
}) {
    const labels = Array.from({ length: dataCount }, (_, i) => `${i + 1}`);
    const dataValues = Array.from(
        { length: dataCount },
        () => Math.floor(Math.random() * 100) + 30
    );
    const data = {
        labels,
        datasets: [
            {
                label: "My Dataset",
                data: dataValues,
                backgroundColor: hexToRgba(colors[1], 0.5),
                borderColor: colors[0],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { display: false },
                suggestedMin: 0,
                suggestedMax: 90,
            },
        },
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Radar data={data} options={options} />
        </div>
    );
}
