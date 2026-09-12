import { useStore } from '../../store'
import type { Dish } from '../../store/types'

/**
 * 今日菜单页面
 * - 展示所有菜品，可加减点单份数
 * - 顶部汇总：已点种类、总份数、备料种类
 */
export default function MenuPage() {
  const dishes = useStore((s) => s.eat.dishes)
  const orders = useStore((s) => s.eat.orders)
  const incOrder = useStore((s) => s.eat.incOrder)
  const decOrder = useStore((s) => s.eat.decOrder)
  const resetOrders = useStore((s) => s.eat.resetOrders)

  // 汇总统计
  const orderedDishes = dishes.filter((d) => (orders[d.id] || 0) > 0)
  const totalQty = orderedDishes.reduce((sum, d) => sum + orders[d.id], 0)
  // 备料汇总：{ 食材名: { amount, unit } }
  const ingredientMap = new Map<string, { amount: number; unit: string }>()
  orderedDishes.forEach((d) => {
    const qty = orders[d.id]
    d.ingredients.forEach((ing) => {
      const prev = ingredientMap.get(ing.name)
      if (prev) {
        prev.amount += ing.amount * qty
      } else {
        ingredientMap.set(ing.name, { amount: ing.amount * qty, unit: ing.unit })
      }
    })
  })

  return (
    <div className="p-3">
      {/* 汇总卡片 */}
      <div className="mb-3 rounded-lg bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm">
            <span className="text-muted">已点 <b className="text-ink">{orderedDishes.length}</b> 种</span>
            <span className="text-muted">共 <b className="text-ink">{totalQty}</b> 份</span>
          </div>
          <button onClick={resetOrders} className="text-xs text-muted hover:text-warn">清空</button>
        </div>
        {ingredientMap.size > 0 && (
          <div className="mt-2 border-t border-line pt-2">
            <p className="mb-1 text-xs text-muted">备料清单：</p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(ingredientMap.entries()).map(([name, v]) => (
                <span key={name} className="rounded-full bg-bg px-2 py-0.5 text-xs text-ink">
                  {name} {v.amount}{v.unit}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 菜品列表 */}
      <ul className="space-y-2">
        {dishes.map((d: Dish) => {
          const qty = orders[d.id] || 0
          return (
            <li key={d.id} className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{d.name}</p>
                <p className="text-xs text-muted">{d.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decOrder(d.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-bg text-lg text-muted active:scale-95"
                >
                  −
                </button>
                <span className={`w-6 text-center text-sm font-medium ${qty > 0 ? 'text-accent' : 'text-muted'}`}>
                  {qty}
                </span>
                <button
                  onClick={() => incOrder(d.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-lg text-white active:scale-95"
                >
                  +
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
