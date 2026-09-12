/**
 * 全局 Zustand store
 * 组合四个 slice（meta / do / eat / exercise），配置 persist 持久化，
 * 在 rehydrate 完成后执行旧数据迁移与全局每日重置。
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MetaSlice } from './slices/metaSlice'
import { createMetaSlice } from './slices/metaSlice'
import type { DoSlice } from './slices/doSlice'
import { createDoSlice } from './slices/doSlice'
import type { EatSlice } from './slices/eatSlice'
import { createEatSlice } from './slices/eatSlice'
import type { ExerciseSlice } from './slices/exerciseSlice'
import { createExerciseSlice } from './slices/exerciseSlice'
import { migrateOldData } from './migrate'
import { getTodayKey } from './utils'
import type { TodayLog } from './types'

/** 完整 Store 类型 = 四个 slice 的并集 */
export type Store = MetaSlice & DoSlice & EatSlice & ExerciseSlice

/**
 * 清理 todayLog 中 30 天前的历史记录，避免 localStorage 无限增长
 */
function cleanupOldTodayLog(todayLog: TodayLog, today: string): TodayLog {
  const cutoff = new Date(today + 'T00:00:00').getTime() - 30 * 86400000
  const result: TodayLog = {}
  Object.entries(todayLog).forEach(([date, log]) => {
    const t = new Date(date + 'T00:00:00').getTime()
    if (t >= cutoff) result[date] = log
  })
  return result
}

/**
 * 创建 store 并配置 persist
 * - name: 'home-hub:root' —— 整个 store 序列化到一个 localStorage key
 * - partialize: 只持久化业务数据，不持久化 actions（函数）
 * - onRehydrateStorage: 数据加载完成后执行迁移与每日重置
 */
export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createMetaSlice(...a),
      ...createDoSlice(...a),
      ...createEatSlice(...a),
      ...createExerciseSlice(...a),
    }),
    {
      name: 'home-hub:root',
      /** 白名单：只持久化业务数据，排除所有 actions */
      partialize: (state) => ({
        meta: state.meta,
        do: {
          chores: state.do.chores,
          inspections: state.do.inspections,
          oneOffs: state.do.oneOffs,
        },
        eat: {
          dishes: state.eat.dishes,
          orders: state.eat.orders,
        },
        exercise: {
          exerciseTypes: state.exercise.exerciseTypes,
          plan: state.exercise.plan,
          todayLog: state.exercise.todayLog,
          weightRecords: state.exercise.weightRecords,
        },
      }),
      /** 持久化数据加载完成后：迁移旧数据 + 全局每日重置 */
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const today = getTodayKey()

        // 1) 旧数据迁移：仅首次（无持久化数据时 lastResetDate 为空）
        if (!state.meta.lastResetDate) {
          const migrated = migrateOldData()
          if (Object.keys(migrated).length > 0) {
            // migrated 只含业务数据不含 actions，用 as any 绕过 slice 模式的类型约束
            useStore.setState(migrated as any)
            // 迁移后 state 引用已变，后续重置用最新 state
            setTimeout(() => doDailyReset(today), 0)
            return
          }
        }

        // 2) 全局每日重置：跨天时重置 do/eat 的今日态，清理 exercise 历史
        doDailyReset(today)
      },
    },
  ),
)

/**
 * 执行全局每日重置
 * - do.chores.done → false
 * - do.inspections.status → pending, note → ''
 * - eat.orders → {}
 * - exercise.todayLog → 清理 30 天前记录
 * - meta.lastResetDate → today
 */
function doDailyReset(today: string) {
  const s = useStore.getState()
  if (s.meta.lastResetDate === today) return
  useStore.setState({
    meta: { lastResetDate: today },
    do: {
      ...s.do,
      chores: s.do.chores.map((c) => ({ ...c, done: false })),
      inspections: s.do.inspections.map((i) => ({ ...i, status: 'pending' as const, note: '' })),
    },
    eat: { ...s.eat, orders: {} },
    exercise: {
      ...s.exercise,
      todayLog: cleanupOldTodayLog(s.exercise.todayLog, today),
    },
  })
}
