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
    colors = ["#A9A9A9", "#696969"],
    dataCount = 6, //props 오류방지 기본값
}) {
    const labels = Array.from({ length: dataCount }, (_, i) => `${i + 1}`);
    const [dataValues] = useState(() =>
        Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 10)
    );

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Trend",
                data: dataValues,
                borderColor: colors[1],
                backgroundColor: colors[0],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
        },
        // scales: {
        //     x: { grid: { display: false } },
        //     y: { grid: { display: true } },
        // },
    };

    return (
        <div style={{ height: "100%", width: '100%"' }}>
            <Line data={data} options={options} />
        </div>
    );
}
