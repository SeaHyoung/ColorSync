export default function JoinForm({ onClose }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        // 로그인 처리 로직 여기에 추가
    };

    return (
        <div className="join-form">
            <h2 className="text-2xl font-bold mb-4">회원가입</h2>
            <input className="border w-full mb-2 p-2" placeholder="이메일" />
            <input
                className="border w-full mb-2 p-2"
                placeholder="비밀번호"
                type="password"
            />
            <input
                className="border w-full mb-4 p-2"
                placeholder="비밀번호 확인"
                type="password"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
                회원가입
            </button>
        </div>
    );
}
