interface SubTab {
  key: string
  label: string
}

interface SubTabsProps {
  tabs: SubTab[]
  active: string
  onChange: (key: string) => void
}

/**
 * 子 Tab 切换 —— 模块内部页面导航
 * 横向排列，当前项高亮下划线
 */
export default function SubTabs({ tabs, active, onChange }: SubTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
            active === t.key
              ? 'text-accent border-b-2 border-accent -mb-px'
              : 'text-muted hover:text-ink'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
