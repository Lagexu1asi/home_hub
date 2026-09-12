import { useStore } from '../../store'
import { INSPECTION_STATUS } from './inspectionStatus'

/**
 * 巡检页面
 * - 巡检项状态循环切换：待检 → 正常 → 异常 → 待检
 * - 可添加备注、删除、重置全部
 */
export default function InspectionPage() {
  const inspections = useStore((s) => s.do.inspections)
  const cycleInspection = useStore((s) => s.do.cycleInspection)
  const updateNote = useStore((s) => s.do.updateNote)
  const deleteInspection = useStore((s) => s.do.deleteInspection)
  const resetInspections = useStore((s) => s.do.resetInspections)

  return (
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">
          巡检 ({inspections.filter((i) => i.status !== 'pending').length}/{inspections.length})
        </h2>
        <button onClick={resetInspections} className="text-xs text-muted">重置</button>
      </div>
      <ul className="space-y-2">
        {inspections.map((i) => {
          const st = INSPECTION_STATUS[i.status]
          return (
            <li key={i.id} className="rounded-lg bg-card p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => cycleInspection(i.id)}
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: st.color }}
                >
                  {st.label}
                </button>
                <span className="flex-1 text-sm text-ink">{i.title}</span>
                <button onClick={() => deleteInspection(i.id)} className="text-xs text-muted hover:text-warn">删除</button>
              </div>
              <input
                value={i.note}
                onChange={(e) => updateNote(i.id, e.target.value)}
                placeholder="备注（可选）"
                className="mt-2 w-full rounded border border-line bg-bg px-2 py-1 text-xs outline-none focus:border-accent"
              />
            </li>
          )
        })}
        {inspections.length === 0 && (
          <li className="rounded-lg bg-card p-4 text-center text-sm text-muted">暂无巡检项</li>
        )}
      </ul>
    </div>
  )
}
