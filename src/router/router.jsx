import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../pages/mainPage";
import MyPage from "../pages/myPage";
import DashboardPage from "../pages/dashboardPage";

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
