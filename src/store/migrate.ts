/**
 * 旧数据迁移工具
 * 从三个旧项目（what-to-do / what-to-eat / what-to-exercise）的 localStorage key
 * 读取数据，转换为新 store 的结构，迁移完成后删除旧 key。
 *
 * 旧 key 前缀：
 *   what-to-do:      hc_
 *   what-to-eat:     we_
 *   what-to-exercise: we_  (与 eat 前缀相同，但 key 名不同，不冲突)
 */
import type { StoreState } from './types'
import { getTodayKey } from './utils'

/** 从 localStorage 安全读取并 JSON 解析，失败返回 null */
function readKey<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/** 删除旧 key（迁移完成后清理） */
function removeKey(key: string): void {
  localStorage.removeItem(key)
}

/**
 * 执行旧数据迁移
 * @returns 迁移得到的 partial store state；若无旧数据则返回空对象
 */
export function migrateOldData(): Partial<StoreState> {
  const result: Partial<StoreState> = {}
  let hasOldData = false

  /* ---- do 模块 ---- */
  const oldChores = readKey<any[]>('hc_chores')
  const oldInspections = readKey<any[]>('hc_inspections')
  const oldOneOffs = readKey<any[]>('hc_oneOffs')
  const oldDoReset = readKey<string>('hc_lastReset')

  if (oldChores) {
    // 兼容旧版数据：补全 nextDueOverride / prevLastDone 字段
    result.do = {
      chores: oldChores.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        interval: c.interval ?? 1,
        lastDone: c.lastDone ?? null,
        done: c.done ?? false,
        nextDueOverride: c.nextDueOverride ?? null,
        prevLastDone: c.prevLastDone ?? null,
      })),
      inspections: (oldInspections ?? []).map((i) => ({
        id: i.id,
        title: i.title,
        area: i.area,
        status: i.status ?? 'pending',
        note: i.note ?? '',
      })),
      oneOffs: (oldOneOffs ?? []).map((o) => ({
        id: o.id,
        title: o.title,
        category: o.category,
        date: o.date,
        done: o.done ?? false,
      })),
    }
    removeKey('hc_chores')
    removeKey('hc_inspections')
    removeKey('hc_oneOffs')
    removeKey('hc_lastReset')
    removeKey('hc_badgeText')
    hasOldData = true
  }

  /* ---- eat 模块 ---- */
  const oldDishes = readKey<any[]>('we_dishes')
  const oldOrders = readKey<Record<string, number>>('we_orders')
  const oldEatReset = readKey<string>('we_lastReset')

  if (oldDishes) {
    result.eat = {
      dishes: oldDishes.map((d) => ({
        id: d.id,
        name: d.name,
        category: d.category || '其他',
        ingredients: Array.isArray(d.ingredients)
          ? d.ingredients.map((ing: any) => ({
              name: String(ing?.name ?? ''),
              amount: Number(ing?.amount) || 1,
              unit: String(ing?.unit ?? '份'),
            }))
          : [],
        steps: Array.isArray(d.steps) ? d.steps.map((s: any) => String(s)) : [],
      })),
      orders: oldOrders ?? {},
    }
    removeKey('we_dishes')
    removeKey('we_orders')
    removeKey('we_lastReset')
    removeKey('we_badge')
    hasOldData = true
  }

  /* ---- exercise 模块 ---- */
  const oldTypes = readKey<any[]>('we_exerciseTypes')
  const oldPlan = readKey<any[]>('we_plan')
  const oldTodayLog = readKey<Record<string, any>>('we_todayLog')
  const oldWeight = readKey<any[]>('we_weightRecords')

  if (oldTypes) {
    // 兼容旧版 todayLog 数组结构：[id1, id2] => { id1: 999, id2: 999 }
    const todayLog: Record<string, Record<string, number>> = {}
    if (oldTodayLog) {
      Object.entries(oldTodayLog).forEach(([date, val]) => {
        if (Array.isArray(val)) {
          const obj: Record<string, number> = {}
          val.forEach((id) => { obj[id] = 999 })
          todayLog[date] = obj
        } else if (val && typeof val === 'object') {
          todayLog[date] = val as Record<string, number>
        }
      })
    }

    result.exercise = {
      exerciseTypes: oldTypes.map((t) => ({
        id: t.id,
        name: t.name,
        unit: t.unit,
        category: t.category,
        defaultAmount: t.defaultAmount,
        url: t.url ?? '',
      })),
      plan: (oldPlan ?? []).map((p) => ({
        id: p.id,
        weekday: p.weekday,
        exerciseTypeId: p.exerciseTypeId,
        amount: p.amount,
        sets: p.sets,
      })),
      todayLog,
      weightRecords: (oldWeight ?? []).map((w) => ({
        id: w.id,
        date: w.date,
        weight: w.weight,
      })),
    }
    removeKey('we_exerciseTypes')
    removeKey('we_plan')
    removeKey('we_todayLog')
    removeKey('we_weightRecords')
    hasOldData = true
  }

  /* ---- meta：取三个旧项目中最新的 lastReset，或用今天 ---- */
  if (hasOldData) {
    const resets = [oldDoReset, oldEatReset].filter(Boolean) as string[]
    const latest = resets.length > 0 ? resets.sort().reverse()[0] : getTodayKey()
    result.meta = { lastResetDate: latest }
  }

  return result
}
