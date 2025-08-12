import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import MainPage from "./pages/mainPage.jsx";
import DashboardPage from "./pages/dashboardPage.jsx";
import MyPage from "./pages/myPage.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/mypage" element={<MyPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
// seahyoung branch수정
