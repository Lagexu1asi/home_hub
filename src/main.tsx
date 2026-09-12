import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './style.css'

/**
 * 应用入口
 * - 使用 HashRouter 以便部署到任意子路径（GitHub Pages 等）无需服务器 rewrite
 * - 挂载到 #root
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
