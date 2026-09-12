import { useState } from 'react'
import SubTabs from '../../components/layout/SubTabs'
import TodayPage from './TodayPage'
import PlanPage from './PlanPage'
import TypesPage from './TypesPage'
import StatsPage from './StatsPage'
import AddSheet from './AddSheet'

const tabs = [
  { key: 'today', label: '今日' },
  { key: 'plan', label: '计划' },
  { key: 'types', label: '类型' },
  { key: 'stats', label: '体重' },
]

/**
 * exercise 模块容器 —— 今日 / 计划 / 类型 / 体重
 */
export default function ExerciseModule() {
  const [subTab, setSubTab] = useState('today')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetWeekday, setSheetWeekday] = useState(0)

  /** 打开添加面板：计划页传入默认星期 */
  const openSheet = (weekday?: number) => {
    if (subTab === 'plan') setSheetWeekday(typeof weekday === 'number' ? weekday : 0)
    setSheetOpen(true)
  }

  // 仅计划页和类型页显示添加按钮
  const showAddBtn = subTab === 'plan' || subTab === 'types'

  return (
    <div className="flex h-full flex-col">
      <SubTabs tabs={tabs} active={subTab} onChange={setSubTab} />
      <div className="flex-1 overflow-y-auto pb-20">
        {subTab === 'today' && <TodayPage />}
        {subTab === 'plan' && <PlanPage onAdd={openSheet} />}
        {subTab === 'types' && <TypesPage onAdd={() => openSheet()} />}
        {subTab === 'stats' && <StatsPage />}
      </div>

      {showAddBtn && (
        <button
          onClick={() => openSheet()}
          className="fixed bottom-16 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg active:scale-95"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          aria-label="添加"
        >
          +
        </button>
      )}

      <AddSheet
        open={sheetOpen}
        type={subTab === 'types' ? 'exercise' : 'plan'}
        defaultWeekday={sheetWeekday}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  )
}
