import { useStore } from '../../store'
import { WEEKDAYS } from '../../store/defaults'
import type { PlanItem } from '../../store/types'

interface PlanPageProps {
  onAdd: (weekday?: number) => void
}

/**
 * 训练计划页面
 * - 按星期分组展示计划项
 * - 可修改训练量、组数、删除
 * - 每个星期可添加计划项
 */
export default function PlanPage({ onAdd }: PlanPageProps) {
  const plan = useStore((s) => s.exercise.plan)
  const exerciseTypes = useStore((s) => s.exercise.exerciseTypes)
  const changeAmount = useStore((s) => s.exercise.changeAmount)
  const changeSets = useStore((s) => s.exercise.changeSets)
  const deletePlanItem = useStore((s) => s.exercise.deletePlanItem)

  return (
    <div className="p-3 space-y-3">
      {WEEKDAYS.map((wd) => {
        const items = plan.filter((p) => p.weekday === wd.key)
        return (
          <div key={wd.key} className="rounded-lg bg-card p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">{wd.label}</h3>
              <button
                onClick={() => onAdd(wd.key)}
                className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent"
              >
                + 添加
              </button>
            </div>
            {items.length === 0 ? (
              <p className="py-1 text-xs text-muted">休息日</p>
            ) : (
              <ul className="space-y-2">
                {items.map((p: PlanItem) => {
                  const type = exerciseTypes.find((t) => t.id === p.exerciseTypeId)
                  return (
                    <li key={p.id} className="flex items-center gap-2 rounded bg-bg p-2">
                      <span className="flex-1 text-sm text-ink">{type?.name || '未知'}</span>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <input
                          type="number"
                          value={p.amount}
                          onChange={(e) => changeAmount(p.id, Number(e.target.value))}
                          className="w-12 rounded border border-line bg-card px-1 py-0.5 text-center"
                        />
                        <span>{type?.unit}</span>
                        <span>×</span>
                        <input
                          type="number"
                          value={p.sets}
                          onChange={(e) => changeSets(p.id, Number(e.target.value))}
                          className="w-10 rounded border border-line bg-card px-1 py-0.5 text-center"
                        />
                        <span>组</span>
                      </div>
                      <button onClick={() => deletePlanItem(p.id)} className="text-xs text-muted hover:text-warn">删</button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
