import React, { useState } from "react";
import SlidePanel from "../features/main/slidePanel";
import LoginForm from "../features/main/loginForm";
import JoinForm from "../features/main/joinForm";
import { useNavigate } from "react-router-dom";
import WavesBackground from "../features/main/wavesBackground"; // 파도 배경 컴포넌트
import "../styles/mainPage.css";

export default function MainPage() {
    const [panelType, setPanelType] = useState(null);
    const navigate = useNavigate();

    const closePanel = () => setPanelType(null);

    return (
        <div className="main-container">
            <WavesBackground />

            {/* 상단 로그인/회원가입 버튼 */}
            <div className="top">
                <button
                    onClick={() => setPanelType("login")}
                    className="auth-button"
                >
                    Log in
                </button>
                <button
                    onClick={() => setPanelType("join in")}
                    className="auth-button"
                >
                    Sign up
                </button>
            </div>

            {/* 중앙 콘텐츠 */}
            <div className="content">
                <h1 className="main-title">ColorSync</h1>
                <p className="sub-title text-5xl">데이터에 감각을 더하다</p>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="start text-6xl"
                >
                    Start &gt;&gt;
                </button>
            </div>

            {/* 슬라이드 패널 */}
            {panelType && (
                <SlidePanel onClose={closePanel}>
                    {panelType === "login" ? (
                        <LoginForm onClose={closePanel} />
                    ) : (
                        <JoinForm onClose={closePanel} />
                    )}
                </SlidePanel>
            )}
        </div>
    );
}
