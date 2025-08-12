import React, { useState } from "react";

export default function SlidePanel({ children, onClose }) {
    const [closing, setClosing] = useState(false);

    // 배경 클릭 시 닫기 요청
    const handleClose = () => {
        console.log("배경 클릭됨 - 패널 닫힘 요청");
        setClosing(true);
    };

    // 애니메이션 종료 시 onClose 호출
    const onAnimationEnd = () => {
        console.log("애니메이션 종료됨");
        if (closing) {
            console.log("패널 닫기 완료");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* 배경 영역 클릭 시 닫기 */}
            <div
                className="w-[50%] bg-black bg-opacity-0"
                onClick={handleClose}
            />

            {/* 슬라이드 패널 */}
            <div
                className={`w-[50%] bg-white text-black p-6 shadow-lg ${
                    closing ? "slide-out" : "slide-in"
                }`}
                onAnimationEnd={onAnimationEnd}
            >
                {children}
            </div>
        </div>
    );
}
