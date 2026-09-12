import { useStore } from '../../store'
import { CATEGORY_COLORS, EXERCISE_CATEGORIES, EXERCISE_UNITS } from '../../store/defaults'
import type { ExerciseType } from '../../store/types'

interface TypesPageProps {
  onAdd: () => void
}

/**
 * 训练类型库页面
 * - 展示所有训练类型，可编辑字段、删除
 * - 添加按钮由模块容器统一提供（onAdd 保留以备扩展）
 */
export default function TypesPage({ onAdd: _onAdd }: TypesPageProps) {
  const exerciseTypes = useStore((s) => s.exercise.exerciseTypes)
  const updateExerciseType = useStore((s) => s.exercise.updateExerciseType)
  const deleteExerciseType = useStore((s) => s.exercise.deleteExerciseType)

  return (
    <div className="p-3">
      <ul className="space-y-2">
        {exerciseTypes.map((t: ExerciseType) => {
          const color = CATEGORY_COLORS[t.category] || '#9A9388'
          return (
            <li key={t.id} className="rounded-lg bg-card p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 rounded-full" style={{ backgroundColor: color }} />
                <div className="flex-1 min-w-0">
                  <input
                    value={t.name}
                    onChange={(e) => updateExerciseType(t.id, { name: e.target.value })}
                    className="w-full bg-transparent text-sm font-medium text-ink outline-none"
                  />
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <select
                      value={t.category}
                      onChange={(e) => updateExerciseType(t.id, { category: e.target.value })}
                      className="rounded border border-line bg-bg px-1 py-0.5"
                    >
                      {EXERCISE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={t.defaultAmount}
                      onChange={(e) => updateExerciseType(t.id, { defaultAmount: Number(e.target.value) })}
                      className="w-14 rounded border border-line bg-bg px-1 py-0.5 text-center"
                    />
                    <select
                      value={t.unit}
                      onChange={(e) => updateExerciseType(t.id, { unit: e.target.value })}
                      className="rounded border border-line bg-bg px-1 py-0.5"
                    >
                      {EXERCISE_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={() => deleteExerciseType(t.id)} className="text-xs text-muted hover:text-warn">删除</button>
              </div>
              {t.url && (
                <a href={t.url} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-accent truncate">
                  📺 {t.url}
                </a>
              )}
            </li>
          )
        })}
        {exerciseTypes.length === 0 && (
          <li className="rounded-lg bg-card p-4 text-center text-sm text-muted">暂无训练类型</li>
        )}
      </ul>
    </div>
  )
}
