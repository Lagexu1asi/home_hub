import { useState } from 'react'
import { useStore } from '../../store'
import Sheet from '../../components/ui/Sheet'
import { DISH_CATEGORIES } from '../../store/defaults'
import type { Dish, Ingredient } from '../../store/types'

/**
 * 菜谱页面
 * - 菜谱列表，可展开查看备料与步骤
 * - 添加菜品（弹出面板）
 * - 删除菜品
 * - 导入/导出菜谱（JSON）
 */
export default function RecipePage() {
  const dishes = useStore((s) => s.eat.dishes)
  const addDish = useStore((s) => s.eat.addDish)
  const deleteDish = useStore((s) => s.eat.deleteDish)
  const exportDishes = useStore((s) => s.eat.exportDishes)
  const importDishes = useStore((s) => s.eat.importDishes)

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [dataMode, setDataMode] = useState<'export' | 'import' | null>(null)
  const [importText, setImportText] = useState('')
  const [importMsg, setImportMsg] = useState('')

  // 新增菜品表单
  const [name, setName] = useState('')
  const [category, setCategory] = useState(DISH_CATEGORIES[0])
  const [ingredientsText, setIngredientsText] = useState('')
  const [stepsText, setStepsText] = useState('')

  /** 提交新增菜品 */
  const handleAdd = () => {
    const n = name.trim()
    if (!n) return
    const ingredients: Ingredient[] = ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        // 格式：食材名 数量 单位（空格分隔）
        const parts = line.split(/\s+/)
        return {
          name: parts[0] || '',
          amount: Number(parts[1]) || 1,
          unit: parts[2] || '份',
        }
      })
    const steps = stepsText.split('\n').map((s) => s.trim()).filter(Boolean)
    addDish({ name: n, category, ingredients, steps })
    setName('')
    setIngredientsText('')
    setStepsText('')
    setAddOpen(false)
  }

  /** 执行导入 */
  const handleImport = () => {
    const res = importDishes(importText)
    setImportMsg(res.msg)
    if (res.ok) {
      setImportText('')
      setTimeout(() => setDataMode(null), 1200)
    }
  }

  return (
    <div className="p-3">
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setAddOpen(true)}
          className="flex-1 rounded-lg bg-accent py-2 text-sm font-medium text-white active:opacity-80"
        >
          + 添加菜品
        </button>
        <button
          onClick={() => setDataMode('export')}
          className="rounded-lg bg-card px-3 py-2 text-sm text-ink shadow-sm"
        >
          导出
        </button>
        <button
          onClick={() => { setImportMsg(''); setDataMode('import') }}
          className="rounded-lg bg-card px-3 py-2 text-sm text-ink shadow-sm"
        >
          导入
        </button>
      </div>

      <ul className="space-y-2">
        {dishes.map((d: Dish) => {
          const expanded = expandedId === d.id
          return (
            <li key={d.id} className="rounded-lg bg-card shadow-sm">
              <button
                onClick={() => setExpandedId(expanded ? null : d.id)}
                className="flex w-full items-center justify-between p-3 text-left"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{d.name}</p>
                  <p className="text-xs text-muted">{d.category} · {d.ingredients.length} 种备料</p>
                </div>
                <span className="text-muted">{expanded ? '▲' : '▼'}</span>
              </button>
              {expanded && (
                <div className="border-t border-line px-3 pb-3 pt-2">
                  <p className="mb-1 text-xs font-medium text-muted">备料</p>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {d.ingredients.map((ing, i) => (
                      <span key={i} className="rounded-full bg-bg px-2 py-0.5 text-xs text-ink">
                        {ing.name} {ing.amount}{ing.unit}
                      </span>
                    ))}
                  </div>
                  <p className="mb-1 text-xs font-medium text-muted">步骤</p>
                  <ol className="list-decimal space-y-0.5 pl-4 text-xs text-ink">
                    {d.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                  <button
                    onClick={() => deleteDish(d.id)}
                    className="mt-2 text-xs text-warn"
                  >
                    删除此菜谱
                  </button>
                </div>
              )}
            </li>
          )
        })}
        {dishes.length === 0 && (
          <li className="rounded-lg bg-card p-4 text-center text-sm text-muted">暂无菜谱</li>
        )}
      </ul>

      {/* 添加菜品面板 */}
      <Sheet open={addOpen} title="添加菜品" onClose={() => setAddOpen(false)}>
        <div className="space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="菜名"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <div>
            <p className="mb-1 text-xs text-muted">分类</p>
            <div className="flex flex-wrap gap-1.5">
              {DISH_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1 text-xs ${category === c ? 'bg-accent text-white' : 'bg-bg text-muted'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder={'备料（每行一项，格式：食材 数量 单位）\n例：\n番茄 2 个\n鸡蛋 3 个'}
            rows={4}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <textarea
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            placeholder={'步骤（每行一步）'}
            rows={3}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button onClick={handleAdd} className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white active:opacity-80">
            添加
          </button>
        </div>
      </Sheet>

      {/* 数据交换面板 */}
      <Sheet
        open={dataMode !== null}
        title={dataMode === 'export' ? '导出菜谱' : '导入菜谱'}
        onClose={() => setDataMode(null)}
      >
        {dataMode === 'export' ? (
          <textarea
            readOnly
            value={exportDishes()}
            rows={12}
            className="w-full rounded-lg border border-line bg-bg p-2 text-xs"
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />
        ) : (
          <div className="space-y-2">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="粘贴菜谱 JSON 数组..."
              rows={10}
              className="w-full rounded-lg border border-line p-2 text-sm outline-none focus:border-accent"
            />
            {importMsg && <p className="text-xs text-warn">{importMsg}</p>}
            <button onClick={handleImport} className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white active:opacity-80">
              导入
            </button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
