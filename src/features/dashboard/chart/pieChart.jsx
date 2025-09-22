import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({
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

    // const [dataValues] = useState(() =>
    //     Array.from(
    //         { length: dataCount },
    //         () => Math.floor(Math.random() * 20) + 10
    //     )
    // );

    // 데이터 업데이트 제어 useState 사용불가한 차트
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
            legend: { position: "bottom" },
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Pie data={data} options={options} />
        </div>
    );
}
