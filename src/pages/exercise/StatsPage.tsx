import { useState } from 'react'
import { useStore } from '../../store'
import { getTodayKey } from '../../store/utils'

/**
 * 体重记录页面
 * - 展示体重记录（按日期倒序）
 * - 可添加/删除体重记录
 */
export default function StatsPage() {
  const weightRecords = useStore((s) => s.exercise.weightRecords)
  const addWeight = useStore((s) => s.exercise.addWeight)
  const deleteWeight = useStore((s) => s.exercise.deleteWeight)

  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(getTodayKey())

  const sorted = [...weightRecords].sort((a, b) => b.date.localeCompare(a.date))

  const handleAdd = () => {
    const w = Number(weight)
    if (!w || w <= 0) return
    addWeight(w, date)
    setWeight('')
  }

  // 最新体重用于展示
  const latest = sorted[0]

  return (
    <div className="p-3">
      {/* 当前体重卡片 */}
      <div className="mb-3 rounded-lg bg-card p-4 text-center shadow-sm">
        <p className="text-xs text-muted">最新体重</p>
        <p className="mt-1 text-3xl font-bold text-accent">
          {latest ? latest.weight : '--'}<span className="text-base font-normal text-muted"> kg</span>
        </p>
        {latest && <p className="mt-1 text-xs text-muted">{latest.date}</p>}
      </div>

      {/* 添加记录 */}
      <div className="mb-3 flex gap-2">
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="体重(kg)"
          className="w-24 rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-accent px-4 text-sm font-medium text-white active:opacity-80"
        >
          记录
        </button>
      </div>

      {/* 历史记录 */}
      <ul className="space-y-1.5">
        {sorted.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-lg bg-card px-3 py-2.5 shadow-sm">
            <span className="text-sm text-ink">{r.date}</span>
            <span className="text-sm font-medium text-accent">{r.weight} kg</span>
            <button onClick={() => deleteWeight(r.id)} className="text-xs text-muted hover:text-warn">删除</button>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="rounded-lg bg-card p-4 text-center text-sm text-muted">暂无体重记录</li>
        )}
      </ul>
    </div>
  )
}
