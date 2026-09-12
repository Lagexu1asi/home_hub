import { Routes, Route } from 'react-router-dom'
import BottomTabBar from './components/layout/BottomTabBar'
import Home from './pages/Home'
import DoModule from './pages/do'
import EatModule from './pages/eat'
import ExerciseModule from './pages/exercise'
import { formatDateZh } from './store/utils'

/**
 * App —— 应用根组件
 * 顶部标题 + 路由内容区 + 底部 Tab Bar
 */
export default function App() {
  return (
    <div className="mx-auto flex h-full max-w-xl flex-col bg-bg">
      {/* 顶部标题栏 */}
      <header className="sticky top-0 z-30 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-semibold text-ink">生活小助手</h1>
        <p className="text-xs text-muted">{formatDateZh()}</p>
      </header>

      {/* 路由内容区 */}
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/do" element={<DoModule />} />
          <Route path="/eat" element={<EatModule />} />
          <Route path="/exercise" element={<ExerciseModule />} />
        </Routes>
      </main>

      {/* 底部导航 */}
      <BottomTabBar />
    </div>
  )
}
