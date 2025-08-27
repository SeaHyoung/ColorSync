import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({
    colors = ["#31A843", "#FEFE57", "#52B960"],
}) {
    const data = {
        labels: ["Alpha", "Beta", "Gamma"],
        datasets: [
            {
                label: "Share",
                data: [40, 35, 25],
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
