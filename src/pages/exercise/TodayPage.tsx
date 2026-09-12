import { useStore } from '../../store'
import { getTodayKey, getWeekdayToday } from '../../store/utils'
import { CATEGORY_COLORS, WEEKDAYS } from '../../store/defaults'

/**
 * 今日训练页面
 * - 展示今日星期的训练计划项
 * - 每项可调整已完成组数，进度实时显示
 */
export default function TodayPage() {
  const plan = useStore((s) => s.exercise.plan)
  const exerciseTypes = useStore((s) => s.exercise.exerciseTypes)
  const todayLog = useStore((s) => s.exercise.todayLog)
  const setSetsDone = useStore((s) => s.exercise.setSetsDone)
  const resetTodayLog = useStore((s) => s.exercise.resetTodayLog)

  const todayKey = getTodayKey()
  const weekday = getWeekdayToday()
  const todayLogData = todayLog[todayKey] || {}

  // 今日计划项
  const todayPlan = plan.filter((p) => p.weekday === weekday)

  // 进度统计
  const totalSets = todayPlan.reduce((sum, p) => sum + p.sets, 0)
  const doneSets = todayPlan.reduce((sum, p) => sum + Math.min(todayLogData[p.id] || 0, p.sets), 0)
  const progress = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0

  return (
    <div className="p-3">
      {/* 进度卡片 */}
      <div className="mb-3 rounded-lg bg-card p-3 shadow-sm">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm text-ink">{WEEKDAYS[weekday].label}训练</span>
          <button onClick={resetTodayLog} className="text-xs text-muted">重置</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-medium text-accent">{progress}%</span>
        </div>
        <p className="mt-1 text-xs text-muted">已完成 {doneSets}/{totalSets} 组</p>
      </div>

      {/* 训练项列表 */}
      <ul className="space-y-2">
        {todayPlan.map((p) => {
          const type = exerciseTypes.find((t) => t.id === p.exerciseTypeId)
          if (!type) return null
          const done = Math.min(todayLogData[p.id] || 0, p.sets)
          const color = CATEGORY_COLORS[type.category] || '#9A9388'
          return (
            <li key={p.id} className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-sm">
              <div className="h-8 w-1 rounded-full" style={{ backgroundColor: color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{type.name}</p>
                <p className="text-xs text-muted">{type.category} · {p.amount}{type.unit} × {p.sets}组</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSetsDone(p.id, Math.max(0, done - 1))}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-bg text-sm text-muted active:scale-95"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium text-accent">
                  {done}/{p.sets}
                </span>
                <button
                  onClick={() => setSetsDone(p.id, Math.min(p.sets, done + 1))}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-sm text-white active:scale-95"
                >
                  +
                </button>
              </div>
            </li>
          )
        })}
        {todayPlan.length === 0 && (
          <li className="rounded-lg bg-card p-4 text-center text-sm text-muted">今日无训练计划，休息一下吧 🌿</li>
        )}
      </ul>
    </div>
  )
}
