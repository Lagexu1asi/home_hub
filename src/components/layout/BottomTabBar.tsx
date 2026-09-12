import { NavLink } from 'react-router-dom'

/**
 * 底部 Tab Bar —— 一级导航
 * 4 个入口：首页 / 待办 / 吃饭 / 训练
 * 固定底部，适配安全区
 */
const tabs = [
  { to: '/', label: '首页', icon: '🏠' },
  { to: '/do', label: '待办', icon: '✓' },
  { to: '/eat', label: '吃饭', icon: '🍜' },
  { to: '/exercise', label: '训练', icon: '💪' },
]

export default function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-line bg-card/95 backdrop-blur">
      <div
        className="mx-auto flex max-w-xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs2 transition-colors ${
                isActive ? 'text-accent' : 'text-muted'
              }`
            }
          >
            <span className="text-lg leading-none">{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
