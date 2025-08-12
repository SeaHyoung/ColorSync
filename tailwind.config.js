/** @type {import('tailwindcss').Config} */
// export default {
//     content: [],
//     theme: {
//         extend: {},
//     },
//     plugins: [],
// };
// tailwind.config.js
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}", // ★ JSX 포함 확인
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
