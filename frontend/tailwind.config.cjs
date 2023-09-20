/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: '"Lexend", sans-serif',
            heading: '"Lexend", sans-serif',
            body: '"Lexend", sans-serif',
            Arial: ['Arial', 'sans-serif'],
        },
        extend: {
            colors: {
                'base-100': '#f9fafb',
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                fairq: {
                    ...require("daisyui/src/theming/themes")["[data-theme=light]"],
                    "color-scheme": "light",
                    "primary": "#4b6bfb",
                    "secondary": "#7b92b2",
                    "accent": "#67cba0",
                    "neutral": "#181a2a",
                    "base-100": "#f9fafb",
                    "base-200": "#fafbff",
                },
            },
            "dark",
        ],
    },
}