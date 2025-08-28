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

    return (
        <div className="dashboard-container">
            <Nev />
            <ChartTypeSelector />
            <div className="dashboard-main">
                <ChartBoard slots={slots} setSlots={setSlots} />
                <ColorSlider />
                <SettingBoard />
            </div>
        </div>
    );
}
