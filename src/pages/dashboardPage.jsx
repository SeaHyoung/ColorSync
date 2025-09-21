// src/pages/dashboardPage.jsx
import React, { useState } from "react";
// import React from "react";
import Nev from "../features/dashboard/nav";
import ChartTypeSelector from "../features/dashboard/chartTypeSelector";
import ChartBoard from "../features/dashboard/chartBoard";
import ColorSlider from "../features/dashboard/colorSlider";
import SettingBoard from "../features/dashboard/settingBoard";

import "../styles/dashboardPage.css"; // CSS는 styles 폴더에서 관리 추천

export default function dashboardPage() {
    const [slots, setSlots] = useState(Array(6).fill(null));
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

    return (
        <div className="dashboard-container">
            <Nev />
            <ChartTypeSelector />
            <div className="dashboard-main">
                {/* 차트보드와 세팅보드 상태공유 */}
                <ChartBoard
                    slots={slots}
                    setSlots={setSlots}
                    selectedSlotIndex={selectedSlotIndex}
                    setSelectedSlotIndex={setSelectedSlotIndex}
                />
                {/* <ColorSlider /> */}
                <SettingBoard
                    slots={slots}
                    setSlots={setSlots}
                    selectedSlotIndex={selectedSlotIndex}
                />
            </div>
        </div>
    );
}
