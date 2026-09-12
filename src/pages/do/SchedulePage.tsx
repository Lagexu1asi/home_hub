import { useState } from 'react'
import { useStore } from '../../store'
import { INTERVAL_PRESETS } from '../../store/defaults'
import { getTodayKey, diffDays } from '../../store/utils'
import type { Chore, OneOff } from '../../store/types'

/**
 * 周期管理页面
 * - 周期子 Tab：所有家务的周期管理
 * - 单次子 Tab：所有单次任务管理
 */
export default function SchedulePage() {
  const [subTab, setSubTab] = useState<'periodic' | 'oneoff'>('periodic')

  return (
    <div className="p-3">
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setSubTab('periodic')}
          className={`rounded-full px-4 py-1.5 text-xs ${subTab === 'periodic' ? 'bg-accent text-white' : 'bg-card text-muted'}`}
        >
          周期任务
        </button>
        <button
          onClick={() => setSubTab('oneoff')}
          className={`rounded-full px-4 py-1.5 text-xs ${subTab === 'oneoff' ? 'bg-accent text-white' : 'bg-card text-muted'}`}
        >
          单次任务
        </button>
      </div>
      {subTab === 'periodic' ? <PeriodicList /> : <OneOffList />}
    </div>
  )
}

/** 周期任务列表：管理所有家务的周期与执行记录 */
function PeriodicList() {
  const chores = useStore((s) => s.do.chores)
  const changeInterval = useStore((s) => s.do.changeInterval)
  const markChoreDone = useStore((s) => s.do.markChoreDone)
  const resetLastDone = useStore((s) => s.do.resetLastDone)
  const deleteChore = useStore((s) => s.do.deleteChore)

  const today = getTodayKey()

  /** 计算下次到期日期 */
  const nextDue = (c: Chore): string => {
    if (c.nextDueOverride) return c.nextDueOverride
    if (!c.lastDone) return '从未'
    return addDays(c.lastDone, c.interval)
  }

  return (
    <ul className="space-y-2">
      {chores.map((c) => {
        const due = nextDue(c)
        const overdue = due !== '从未' && diffDays(today, due) > 0
        return (
          <li key={c.id} className="rounded-lg bg-card p-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{c.title}</p>
                <p className="text-xs text-muted">{c.category}</p>
              </div>
              <button onClick={() => deleteChore(c.id)} className="text-xs text-muted hover:text-warn">删除</button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted">下次：</span>
              <span className={overdue ? 'text-warn' : 'text-ink'}>
                {due === '从未' ? '从未执行' : due}
              </span>
              <span className="text-muted">周期：</span>
              <select
                value={c.interval}
                onChange={(e) => changeInterval(c.id, Number(e.target.value))}
                className="rounded border border-line bg-bg px-1 py-0.5 text-xs"
              >
                {INTERVAL_PRESETS.map((p) => (
                  <option key={p.days} value={p.days}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => markChoreDone(c.id)}
                className="flex-1 rounded bg-accent/10 py-1.5 text-xs text-accent active:opacity-80"
              >
                今日已做
              </button>
              <button
                onClick={() => resetLastDone(c.id)}
                className="flex-1 rounded bg-bg py-1.5 text-xs text-muted active:opacity-80"
              >
                清除记录
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** 单次任务列表：按日期排序展示 */
function OneOffList() {
  const oneOffs = useStore((s) => s.do.oneOffs)
  const toggleOneOff = useStore((s) => s.do.toggleOneOff)
  const deleteOneOff = useStore((s) => s.do.deleteOneOff)

  const sorted = [...oneOffs].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <ul className="space-y-1.5">
      {sorted.map((o: OneOff) => (
        <li key={o.id} className="flex items-center gap-2 rounded-lg bg-card p-3 shadow-sm">
          <button
            onClick={() => toggleOneOff(o.id)}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-xs ${
              o.done ? 'border-accent bg-accent text-white' : 'border-line'
            }`}
          >
            {o.done && '✓'}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${o.done ? 'text-muted line-through' : 'text-ink'}`}>{o.title}</p>
            <p className="text-xs text-muted">{o.category} · {o.date}</p>
          </div>
          <button onClick={() => deleteOneOff(o.id)} className="text-xs text-muted hover:text-warn">删除</button>
        </li>
      ))}
      {sorted.length === 0 && (
        <li className="rounded-lg bg-card p-4 text-center text-sm text-muted">暂无单次任务</li>
      )}
    </ul>
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
