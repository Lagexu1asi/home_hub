import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Vite 构建配置
 * - React 插件：支持 JSX/TSX
 * - PWA 插件：生成 manifest 与 Service Worker，实现离线可用
 * - base: './' 保证部署到任意子路径都能正确加载资源
 */
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '生活小助手',
        short_name: '生活助手',
        description: '待办 · 吃饭 · 训练，一站式日常生活管理',
        theme_color: '#5C7A5A',
        background_color: '#f5f5f0',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
