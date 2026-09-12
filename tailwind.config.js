/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 统一的主题色板：暖灰底色 + 绿/橙强调色
        bg: '#f5f5f0',
        card: '#ffffff',
        ink: '#2c2a26',
        muted: '#8A8478',
        line: '#e5e4e0',
        accent: '#5C7A5A',
        warn: '#C8643C',
      },
      fontSize: {
        // PDA 友好的字号阶梯
        xs2: ['0.6875rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
}
