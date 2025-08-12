// src/pages/dashboardPage.jsx
import React, { useState } from "react";
import Nev from "../features/dashboard/nav";
import ChartTypeSelector from "../features/dashboard/chartTypeSelector";
import ChartBoard from "../features/dashboard/chartBoard";
import ColorSlider from "../features/dashboard/colorSlider";
import SettingBoard from "../features/dashboard/settingBoard";
import "../styles/dashboardPage.css";

export default function DashboardPage() {
  // 6개의 슬롯: null | 'bar' | 'doughnut' ...
  const [slots, setSlots] = useState(Array(6).fill(null));

  return (
    <div className="dashboard-container">
      <Nev />
      {/* 선택 패널: 드래그 시작은 여기서 */}
      <ChartTypeSelector />
      <div className="dashboard-main">
        {/* 보드: 드롭은 여기서 */}
        <ChartBoard slots={slots} setSlots={setSlots} />
        <ColorSlider />
        <SettingBoard />
      </div>
    </div>
  );
}
