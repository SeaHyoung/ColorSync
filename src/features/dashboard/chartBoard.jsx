import React from "react";

const ChartBoard = () => {
    const items = Array.from({ length: 6 }, (_, i) => i + 1);

    return (
        <div className="chart-board">
            <h1 className="board-title">Chart Board Title</h1>
            <div className="boards">
                {items.map((item) => (
                    <div key={item} className="chart-item">
                        Chart {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChartBoard;
