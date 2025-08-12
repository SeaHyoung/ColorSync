const ChartPreviewGrid = () => {
    return (
        <div className="chart-preview-grid">
            {Array.from({ length: 10 }, (_, i) => (
                <div
                    key={i}
                    style={{
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        height: "120px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    Chart {i + 1}
                </div>
            ))}
        </div>
    );
};

export default ChartPreviewGrid;
