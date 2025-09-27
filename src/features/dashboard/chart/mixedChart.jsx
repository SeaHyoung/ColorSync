import { useState } from "react";
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function MixedChart({
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
    const [barData] = useState(() =>
        Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 10)
    );
    const lineData = barData;
    const data = {
        labels,
        datasets: [
            {
                type: "line",
                label: "Profit",
                data: lineData,
                borderColor: colors[4],
                backgroundColor: "transparent",
            },
            {
                type: "bar",
                label: "Sales",
                data: barData,
                backgroundColor: colors,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
        },
        scales: {
            y: {
                beginAtZero: true,
                position: "left",
            },
            x: { grid: { display: false } },
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Chart type="bar" data={data} options={options} />
        </div>
    );
}
