import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import {
    Bar,
    Doughnut,
    Pie,
    Line,
    Radar,
    PolarArea,
    Bubble,
    Chart,
} from "react-chartjs-2";
import "chartjs-chart-treemap";
import { TreemapController, TreemapElement } from "chartjs-chart-treemap";

// 모든 차트 모듈
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale,
    Tooltip,
    Legend,
    Filler,
    TreemapController,
    TreemapElement
);

// 모든 차트에 공통으로 적용
// const colors = ["#d3d3d3", "#c8c8c8", "#b7b7b7", "#A8A8A8", "#A8A8A8"];
// const colors = ["#cce0f5", "#a4d9f4", "#cce0f5", "#a4d9f4", "#cce0f5"];
const colors = ["#cce0f5", "#cce0f5", "#cce0f5", "#cce0f5", "#cce0f5"];
const iconOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
    },
    animation: false,
};

// 바 차트
export const BarChartIcon = () => {
    const data = {
        labels: ["A", "B", "C", "D"],
        datasets: [
            {
                data: [10, 30, 20, 30],
                backgroundColor: colors,
            },
        ],
    };
    return (
        <Bar
            data={data}
            options={{
                ...iconOptions,
                scales: {
                    x: { display: false },
                    y: { display: false },
                },
            }}
        />
    );
};

// 도넛 차트
export const DoughnutChartIcon = () => {
    const data = {
        datasets: [
            {
                data: [30, 20, 50],
                backgroundColor: colors,
            },
        ],
    };
    return <Doughnut data={data} options={iconOptions} />;
};

// 파이 차트
export const PieChartIcon = () => {
    const data = {
        datasets: [
            {
                data: [30, 20, 50],
                backgroundColor: colors,
            },
        ],
    };
    return <Pie data={data} options={iconOptions} />;
};

// 선 차트
export const LineChartIcon = () => {
    const data = {
        labels: ["A", "B", "C", "D"],
        datasets: [
            {
                data: [12, 19, 3, 5],
                borderColor: colors,
                backgroundColor: "rgba(66, 133, 244, 0.2)",
            },
        ],
    };
    return (
        <Line
            data={data}
            options={{
                ...iconOptions,
                scales: {
                    x: { display: false },
                    y: { display: false },
                },
            }}
        />
    );
};

// 레이더 차트
export const RadarChartIcon = () => {
    const data = {
        labels: ["A", "B", "C", "D", "D"],
        datasets: [
            {
                data: [50, 50, 50, 50, 50],
                borderColor: colors,
                backgroundColor: "rgba(222, 222, 222, 0.5)",
            },
        ],
    };
    return (
        <Radar
            data={data}
            options={{
                ...iconOptions,
                scales: {
                    r: {
                        suggestedMax: 50, // 데이터 값(50)보다 큰 값을 설정
                        pointLabels: { display: false }, // 불필요한 레이블 숨기기
                        ticks: { display: false }, // 눈금선 숨기기
                    },
                },
            }}
        />
    );
};

// 폴라 차트
export const PolarAreaChartIcon = () => {
    const data = {
        datasets: [
            {
                data: [11, 15, 9, 14],
                backgroundColor: colors,
            },
        ],
    };
    return (
        <PolarArea
            data={data}
            options={{
                ...iconOptions,
                scales: {
                    r: {
                        // ✅ 레이블(pointLabels)과 눈금(ticks)을 숨깁니다.
                        pointLabels: { display: false },
                        ticks: { display: false },
                    },
                },
            }}
        />
    );
    return <PolarArea data={data} options={iconOptions} />;
};

// 버블 차트
export const BubbleChartIcon = () => {
    const data = {
        datasets: [
            {
                data: [
                    { x: 10, y: 85, r: 10 },
                    { x: 25, y: 15, r: 11 },
                    { x: 50, y: 50, r: 16 },
                    { x: 70, y: 20, r: 8 },
                    { x: 85, y: 90, r: 9 },
                    { x: 95, y: 40, r: 14 },
                    { x: 5, y: 50, r: 10 },
                    { x: 45, y: 10, r: 5 },
                    { x: 80, y: 65, r: 12 },
                    { x: 20, y: 70, r: 10 },
                    { x: 60, y: 5, r: 9 },
                    { x: 90, y: 10, r: 11 },
                ],
                backgroundColor: colors,
            },
        ],
    };
    return (
        <Bubble
            data={data}
            options={{
                ...iconOptions,
                scales: { x: { display: false }, y: { display: false } },
            }}
        />
    );
};

// 믹스차트
export const MixedChartIcon = () => {
    const data = {
        labels: ["A", "B", "C", "D"],
        datasets: [
            {
                type: "bar",
                data: [10, 20, 7, 10],
                backgroundColor: colors,
            },
            {
                type: "line",
                data: [10, 20, 7, 10],
                borderColor: colors,
                backgroundColor: "transparent",
            },
        ],
    };
    return (
        <Chart
            type="bar"
            data={data}
            options={{
                ...iconOptions,
                scales: { x: { display: false }, y: { display: false } },
            }}
        />
    );
};

// 트리맵차트
export const TreeMapChartIcon = () => {
    const data = {
        datasets: [
            {
                type: "treemap",
                tree: [
                    { value: 5, category: "A", name: "A" },
                    { value: 7, category: "B", name: "B" },
                    { value: 9, category: "C", name: "C" },
                    { value: 11, category: "D", name: "D" },
                    { value: 13, category: "E", name: "E" },
                ],
                key: "value",
                groups: ["category"],
                labels: { display: false },
                backgroundColor: (context) => {
                    const categoryIndex = context.dataIndex % colors.length;
                    return colors[categoryIndex];
                },
            },
        ],
    };
    return <Chart type="treemap" data={data} options={iconOptions} />;
};
