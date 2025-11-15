import React, { useState } from "react";
import Nev from "../features/dashboard/nav";
import ChartTypeSelector from "../features/dashboard/chartTypeSelector";
import ChartBoard from "../features/dashboard/chartBoard";
import ColorChip from "../features/dashboard/colorChip";
import SettingBoard from "../features/dashboard/settingBoard";

import "../styles/dashboardPage.css"; // CSS는 styles 폴더에서 관리 추천

export default function dashboardPage() {
    const [slots, setSlots] = useState(Array(6).fill(null));
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
    const [palette, setPalette] = useState([]);
    const [boardBgc, setBoardBgc] = useState("none");

    return (
        <div className="dashboard-container">
            <Nev />
            <ChartTypeSelector />
            <div className="dashboard-main">
                {/* 차트보드와 세팅보드 상태공유 */}
                <ChartBoard
                    slots={slots}
                    setSlots={setSlots}
                    boardBgc={boardBgc}
                    selectedSlotIndex={selectedSlotIndex}
                    setSelectedSlotIndex={setSelectedSlotIndex}
                />
                <ColorChip
                    colors={palette}
                    stepsPerPair={4} // 이웃 색 사이 중간 단계(3~5 권장)
                    onColorClick={(hex) => navigator.clipboard.writeText(hex)}
                />

                <SettingBoard
                    slots={slots}
                    setSlots={setSlots}
                    boardBgc={boardBgc}
                    setBoardBgc={setBoardBgc}
                    selectedSlotIndex={selectedSlotIndex}
                    onPaletteChange={setPalette}
                />
            </div>
        </div>
    );
}
