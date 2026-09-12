import { useStore } from '../../store'
import { getTodayKey, diffDays } from '../../store/utils'
import type { Chore, OneOff } from '../../store/types'

/**
 * 家务页面
 * - 展示今日家务列表，可勾选完成
 * - 展示今日到期的单次任务
 */
export default function ChoresPage() {
  const chores = useStore((s) => s.do.chores)
  const oneOffs = useStore((s) => s.do.oneOffs)
  const toggleChore = useStore((s) => s.do.toggleChore)
  const deleteChore = useStore((s) => s.do.deleteChore)
  const resetChores = useStore((s) => s.do.resetChores)
  const toggleOneOff = useStore((s) => s.do.toggleOneOff)

  const today = getTodayKey()

  /** 判断家务今日是否到期 */
  const isDueToday = (c: Chore): boolean => {
    if (!c.lastDone) return true
    const due = c.nextDueOverride ?? addDays(c.lastDone, c.interval)
    return diffDays(today, due) >= 0
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

  // 今日到期的家务
  const dueChores = chores.filter(isDueToday)
  // 今日到期的单次任务
  const todayOneOffs = oneOffs.filter((o: OneOff) => o.date === today)

  return (
    <div className="p-3">
      {/* 家务列表 */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">今日家务 ({dueChores.filter((c) => !c.done).length}/{dueChores.length})</h2>
        <button onClick={resetChores} className="text-xs text-muted">重置</button>
      </div>
      <ul className="space-y-1.5">
        {dueChores.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-2 rounded-lg bg-card p-3 shadow-sm"
          >
            <button
              onClick={() => toggleChore(c.id)}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-xs ${
                c.done ? 'border-accent bg-accent text-white' : 'border-line'
              }`}
            >
              {c.done && '✓'}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${c.done ? 'text-muted line-through' : 'text-ink'}`}>{c.title}</p>
              <p className="text-xs text-muted">{c.category} · 每{c.interval}天</p>
            </div>
            <button
              onClick={() => deleteChore(c.id)}
              className="text-xs text-muted hover:text-warn"
            >
              删除
            </button>
          </li>
        ))}
        {dueChores.length === 0 && (
          <li className="rounded-lg bg-card p-4 text-center text-sm text-muted">今日无家务 🎉</li>
        )}
      </ul>

      {/* 今日单次任务 */}
      {todayOneOffs.length > 0 && (
        <>
          <h2 className="mb-2 mt-5 text-sm font-semibold text-ink">今日单次任务</h2>
          <ul className="space-y-1.5">
            {todayOneOffs.map((o) => (
              <li key={o.id} className="flex items-center gap-2 rounded-lg bg-card p-3 shadow-sm">
                <button
                  onClick={() => toggleOneOff(o.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-xs ${
                    o.done ? 'border-accent bg-accent text-white' : 'border-line'
                  }`}
                >
                  {o.done && '✓'}
                </button>
                <span className={`flex-1 text-sm ${o.done ? 'text-muted line-through' : 'text-ink'}`}>{o.title}</span>
                <span className="text-xs text-muted">{o.category}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
