import { useState } from 'react'
import Sheet from '../../components/ui/Sheet'
import { useStore } from '../../store'
import { WEEKDAYS, EXERCISE_CATEGORIES, EXERCISE_UNITS } from '../../store/defaults'

interface AddSheetProps {
  open: boolean
  type: 'plan' | 'exercise'
  defaultWeekday: number
  onClose: () => void
}

/**
 * 训练添加面板
 * - plan 类型：添加训练计划项（星期 + 类型 + 量 + 组数）
 * - exercise 类型：添加训练类型（名称 + 分类 + 单位 + 默认量 + 视频URL）
 */
export default function AddSheet({ open, type, defaultWeekday, onClose }: AddSheetProps) {
  const exerciseTypes = useStore((s) => s.exercise.exerciseTypes)
  const addPlanItem = useStore((s) => s.exercise.addPlanItem)
  const addExerciseType = useStore((s) => s.exercise.addExerciseType)

  // plan 表单
  const [weekday, setWeekday] = useState(defaultWeekday)
  const [exerciseTypeId, setExerciseTypeId] = useState('')
  const [amount, setAmount] = useState('')
  const [sets, setSets] = useState('')

  // exercise 表单
  const [name, setName] = useState('')
  const [category, setCategory] = useState(EXERCISE_CATEGORIES[0])
  const [unit, setUnit] = useState(EXERCISE_UNITS[0])
  const [defaultAmount, setDefaultAmount] = useState('')
  const [url, setUrl] = useState('')

  // 每次打开时重置表单
  useState(() => {
    if (open) {
      setWeekday(defaultWeekday)
      setExerciseTypeId(exerciseTypes[0]?.id || '')
      setAmount('')
      setSets('')
      setName('')
      setCategory(EXERCISE_CATEGORIES[0])
      setUnit(EXERCISE_UNITS[0])
      setDefaultAmount('')
      setUrl('')
    }
  })

  const handleAdd = () => {
    if (type === 'plan') {
      if (!exerciseTypeId || !amount || !sets) return
      addPlanItem(weekday, exerciseTypeId, Number(amount), Number(sets))
    } else {
      if (!name || !defaultAmount) return
      addExerciseType(name, category, unit, Number(defaultAmount), url)
    }
    onClose()
  }

  return (
    <Sheet open={open} title={type === 'plan' ? '添加训练计划' : '添加训练类型'} onClose={onClose}>
      {type === 'plan' ? (
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs text-muted">星期</p>
            <div className="flex flex-wrap gap-1.5">
              {WEEKDAYS.map((wd) => (
                <button
                  key={wd.key}
                  onClick={() => setWeekday(wd.key)}
                  className={`rounded-full px-3 py-1 text-xs ${weekday === wd.key ? 'bg-accent text-white' : 'bg-bg text-muted'}`}
                >
                  {wd.label}
                </button>
              ))}
            </div>
          </div>
          <select
            value={exerciseTypeId}
            onChange={(e) => setExerciseTypeId(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="">选择训练类型</option>
            {exerciseTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}（{t.category}）</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="训练量"
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              placeholder="组数"
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名称（如：俯卧撑）"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {EXERCISE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {EXERCISE_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <input
            type="number"
            value={defaultAmount}
            onChange={(e) => setDefaultAmount(e.target.value)}
            placeholder="默认训练量"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="演示视频链接（可选）"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
      )}
      <button onClick={handleAdd} className="mt-3 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white active:opacity-80">
        添加
      </button>
    </Sheet>
  )
}
