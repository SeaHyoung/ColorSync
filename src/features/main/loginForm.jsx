export default function LoginForm({ onClose }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        // 로그인 처리 로직 여기에 추가
    };

    return (
        <div className="login-form">
            <h2 className="text-2xl font-bold mb-4">로그인</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="border w-full mb-2 p-2"
                    placeholder="아이디"
                    type="text"
                    name="username"
                    required
                />
                <input
                    className="border w-full mb-4 p-2"
                    placeholder="비밀번호"
                    type="password"
                    name="password"
                    required
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
                >
                    로그인
                </button>
            </form>
        </div>
    );
}
