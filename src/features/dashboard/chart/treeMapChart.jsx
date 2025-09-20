// yarn add chartjs-chart-treemap (인스톨필요)
import React from "react";
import { Chart as ChartJS } from "chart.js";
import { Chart } from "react-chartjs-2";
import { TreemapController, TreemapElement } from "chartjs-chart-treemap";

// 트리맵 차트 관련 컨트롤러와 엘리먼트를 명시적으로 등록
ChartJS.register(TreemapController, TreemapElement);

export default function TreemapChart({
    colors = [
        "#A9A9A9",
        "#888888",
        "#696969",
        "#555555",
        "#444444",
        "#202020ff",
    ],
    dataCount = 5,
}) {
    // 트리맵 데이터 생성 함수
    const generateTreemapData = (count) => {
        const data = [];
        const categories = Array.from({ length: count }, (_, i) => `${i + 1}`);

        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < Math.floor(count / categories.length); j++) {
                data.push({
                    value: Math.floor(Math.random() * 50) + 10,
                    category: categories[i],
                    name: `${categories[i]} Item ${j + 1}`,
                });
            }
        }
        return data;
    };

    const data = {
        datasets: [
            {
                type: "treemap", // 차트 타입 명시
                tree: generateTreemapData(dataCount),
                key: "value",
                groups: ["category"],
                labels: {
                    display: true,
                    formatter: (context) => context.raw.name,
                    font: { size: 12 },
                    color: "white",
                },
                backgroundColor: (context) => {
                    // dataIndex를 사용해 색상 배열에 접근합니다.
                    const categoryIndex = context.dataIndex % colors.length;
                    return colors[categoryIndex];
                },
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title: (context) => context[0].raw.name,
                    label: (context) => `Value: ${context.raw.value}`,
                },
            },
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Chart type="treemap" data={data} options={options} />
        </div>
    );
}
