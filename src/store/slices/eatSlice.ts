/**
 * eat slice —— 菜谱库 / 今日点单
 * 移植自 what-to-eat 项目的业务逻辑
 */
import type { StateCreator } from 'zustand'
import type { Dish, Orders } from '../types'
import { DEFAULT_DISHES } from '../defaults'
import { genId } from '../utils'

export interface EatSlice {
  eat: {
    dishes: Dish[]
    orders: Orders
    // 点单操作
    incOrder: (id: string) => void
    decOrder: (id: string) => void
    resetOrders: () => void
    // 菜谱操作
    deleteDish: (id: string) => void
    updateDish: (id: string, patch: Partial<Dish>) => void
    addDish: (dish: Omit<Dish, 'id'>) => void
    // 数据交换
    exportDishes: () => string
    importDishes: (text: string) => { ok: boolean; msg: string; count?: number }
  }
}

/**
 * 创建 eat slice
 */
export const createEatSlice: StateCreator<any, [], [], EatSlice> = (set, get) => ({
  eat: {
    dishes: DEFAULT_DISHES,
    orders: {},

    /* ===== 点单操作 ===== */

    /** 增加某菜品的点单份数 */
    incOrder: (id) =>
      set((s: any) => ({
        eat: { ...s.eat, orders: { ...s.eat.orders, [id]: (s.eat.orders[id] || 0) + 1 } },
      })),

    /** 减少某菜品的点单份数，降到 0 时移除 */
    decOrder: (id) =>
      set((s: any) => {
        const next = (s.eat.orders[id] || 0) - 1
        const orders = { ...s.eat.orders }
        if (next <= 0) {
          delete orders[id]
        } else {
          orders[id] = next
        }
        return { eat: { ...s.eat, orders } }
      }),

    /** 清空今日点单 */
    resetOrders: () => set((s: any) => ({ eat: { ...s.eat, orders: {} } })),

    /* ===== 菜谱操作 ===== */

    /** 删除菜品（同时清掉对应点单） */
    deleteDish: (id) =>
      set((s: any) => {
        const orders = { ...s.eat.orders }
        delete orders[id]
        return {
          eat: {
            ...s.eat,
            dishes: s.eat.dishes.filter((d: Dish) => d.id !== id),
            orders,
          },
        }
      }),

    /** 更新菜品字段 */
    updateDish: (id, patch) =>
      set((s: any) => ({
        eat: { ...s.eat, dishes: s.eat.dishes.map((d: Dish) => (d.id === id ? { ...d, ...patch } : d)) },
      })),

    /** 添加菜品 */
    addDish: (dish) =>
      set((s: any) => ({
        eat: { ...s.eat, dishes: [...s.eat.dishes, { ...dish, id: genId('d') }] },
      })),

    /* ===== 数据交换 ===== */

    /** 导出菜谱为 JSON 字符串 */
    exportDishes: () => JSON.stringify(get().eat.dishes, null, 2),

    /**
     * 从 JSON 字符串导入菜谱，覆盖现有菜谱库
     * 校验：必须是数组，每项至少有 name 字段；补全缺失字段与 id
     * 导入后同步清理失效的今日点单
     */
    importDishes: (text) => {
      try {
        const data = JSON.parse(text)
        if (!Array.isArray(data)) return { ok: false, msg: '格式错误：应为菜谱数组 [...]' }
        if (data.length === 0) return { ok: false, msg: '文本中没有菜谱数据' }

        const seenIds = new Set<string>()
        const normalized: Dish[] = data.map((d: any, i: number) => {
          if (!d || typeof d !== 'object' || !d.name) {
            throw new Error(`第 ${i + 1} 条菜谱缺少 name 字段`)
          }
          const id = d.id && !seenIds.has(d.id) ? d.id : genId('d')
          seenIds.add(id)
          return {
            id,
            name: String(d.name),
            category: d.category || '其他',
            ingredients: Array.isArray(d.ingredients)
              ? d.ingredients.map((ing: any) => ({
                  name: String(ing?.name ?? ''),
                  amount: Number(ing?.amount) || 1,
                  unit: String(ing?.unit ?? '份'),
                }))
              : [],
            steps: Array.isArray(d.steps) ? d.steps.map((s: any) => String(s)) : [],
          }
        })

        const validIds = new Set(normalized.map((d) => d.id))
        set((s: any) => {
          const orders: Orders = {}
          Object.entries(s.eat.orders).forEach(([id, qty]) => {
            if (validIds.has(id)) orders[id] = qty as number
          })
          return { eat: { ...s.eat, dishes: normalized, orders } }
        })
        return { ok: true, msg: `成功导入 ${normalized.length} 道菜谱`, count: normalized.length }
      } catch (err: any) {
        return { ok: false, msg: `导入失败：${err.message || 'JSON 解析错误'}` }
      }
    },
  },
})
