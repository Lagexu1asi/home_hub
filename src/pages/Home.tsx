import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { getTodayKey, getWeekdayToday, diffDays } from '../store/utils'
import type { Chore } from '../store/types'

/**
 * 首页 —— 三个模块的今日状态汇总
 * 纯展示 + 跳转，不做快捷操作
 */
export default function Home() {
  const navigate = useNavigate()
  const chores = useStore((s) => s.do.chores)
  const inspections = useStore((s) => s.do.inspections)
  const orders = useStore((s) => s.eat.orders)
  const plan = useStore((s) => s.exercise.plan)
  const todayLog = useStore((s) => s.exercise.todayLog)
  const weightRecords = useStore((s) => s.exercise.weightRecords)

  const today = getTodayKey()
  const weekday = getWeekdayToday()
  const todayLogData = todayLog[today] || {}

  /* ---- do 摘要 ---- */
  const isDueToday = (c: Chore): boolean => {
    if (!c.lastDone) return true
    const due = c.nextDueOverride ?? addDays(c.lastDone, c.interval)
    return diffDays(today, due) >= 0
  }
  const dueChores = chores.filter(isDueToday)
  const undoneChores = dueChores.filter((c) => !c.done).length
  const pendingInspections = inspections.filter((i) => i.status === 'pending').length

  /* ---- eat 摘要 ---- */
  const totalOrders = Object.values(orders).reduce((a, b) => a + b, 0)

  /* ---- exercise 摘要 ---- */
  const todayPlan = plan.filter((p) => p.weekday === weekday)
  const totalSets = todayPlan.reduce((sum, p) => sum + p.sets, 0)
  const doneSets = todayPlan.reduce((sum, p) => sum + Math.min(todayLogData[p.id] || 0, p.sets), 0)

  /* ---- 体重 ---- */
  const sortedWeights = [...weightRecords].sort((a, b) => b.date.localeCompare(a.date))
  const latestWeight = sortedWeights[0]

  return (
    <div className="p-3 space-y-3">
      {/* 待办卡片 */}
      <button
        onClick={() => navigate('/do')}
        className="w-full rounded-2xl bg-card p-4 text-left shadow-sm active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✓</span>
            <h2 className="text-base font-semibold text-ink">今日待办</h2>
          </div>
          <span className="text-xs text-muted">查看 ›</span>
        </div>
        <div className="mt-3 flex gap-4">
          <div>
            <p className="text-2xl font-bold text-accent">{undoneChores}<span className="text-sm font-normal text-muted">/{dueChores.length}</span></p>
            <p className="text-xs text-muted">家务待完成</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warn">{pendingInspections}<span className="text-sm font-normal text-muted">/{inspections.length}</span></p>
            <p className="text-xs text-muted">巡检待检</p>
          </div>
        </div>
      </button>

      {/* 吃饭卡片 */}
      <button
        onClick={() => navigate('/eat')}
        className="w-full rounded-2xl bg-card p-4 text-left shadow-sm active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍜</span>
            <h2 className="text-base font-semibold text-ink">今日点单</h2>
          </div>
          <span className="text-xs text-muted">查看 ›</span>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-accent">{totalOrders}<span className="text-sm font-normal text-muted"> 份</span></p>
          <p className="text-xs text-muted">{Object.keys(orders).length} 种菜</p>
        </div>
      </button>

      {/* 训练卡片 */}
      <button
        onClick={() => navigate('/exercise')}
        className="w-full rounded-2xl bg-card p-4 text-left shadow-sm active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💪</span>
            <h2 className="text-base font-semibold text-ink">今日训练</h2>
          </div>
          <span className="text-xs text-muted">查看 ›</span>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-accent">{doneSets}<span className="text-sm font-normal text-muted">/{totalSets} 组</span></p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${totalSets > 0 ? (doneSets / totalSets) * 100 : 0}%` }}
            />
          </div>
        </div>
      </button>

      {/* 体重 */}
      {latestWeight && (
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <h2 className="text-base font-semibold text-ink">最新体重</h2>
          </div>
          <p className="mt-2 text-2xl font-bold text-accent">{latestWeight.weight}<span className="text-sm font-normal text-muted"> kg</span></p>
          <p className="text-xs text-muted">{latestWeight.date}</p>
        </div>
      )}
    </div>
  )
}

/** 日期加天数，返回 'YYYY-MM-DD' */
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
