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
    colors = ["#31A843", "#52B960", "#FEFE57", "#8BD17C", "#2F7A3E"],
}) {
    const data = {
        labels: ["A", "B", "C", "D", "E"],
        datasets: [
            {
                label: "Sample",
                data: [12, 19, 3, 5, 2],
                backgroundColor: colors,
                borderWidth: 0,
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
