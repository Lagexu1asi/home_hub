/**
 * exercise slice —— 训练类型 / 周计划 / 今日进度 / 体重记录
 * 移植自 what-to-exercise 项目的业务逻辑
 */
import type { StateCreator } from 'zustand'
import type { ExerciseType, PlanItem, TodayLog, WeightRecord } from '../types'
import { DEFAULT_EXERCISE_TYPES, DEFAULT_PLAN } from '../defaults'
import { getTodayKey, genId } from '../utils'

export interface ExerciseSlice {
  exercise: {
    exerciseTypes: ExerciseType[]
    plan: PlanItem[]
    todayLog: TodayLog
    weightRecords: WeightRecord[]
    // 今日进度操作
    setSetsDone: (planItemId: string, setsDone: number) => void
    resetTodayLog: () => void
    // 计划操作
    changeAmount: (id: string, amount: number) => void
    changeSets: (id: string, sets: number) => void
    deletePlanItem: (id: string) => void
    addPlanItem: (weekday: number, exerciseTypeId: string, amount: number, sets: number) => void
    importPlanData: (data: PlanItem[], mode: 'merge' | 'replace') => void
    // 训练类型操作
    updateExerciseType: (id: string, patch: Partial<ExerciseType>) => void
    deleteExerciseType: (id: string) => void
    addExerciseType: (name: string, category: string, unit: string, defaultAmount: number, url?: string) => void
    importExerciseTypesData: (data: ExerciseType[], mode: 'merge' | 'replace') => void
    // 体重操作
    addWeight: (weight: number, date: string) => void
    deleteWeight: (id: string) => void
  }
}

/**
 * 创建 exercise slice
 */
export const createExerciseSlice: StateCreator<any, [], [], ExerciseSlice> = (set) => ({
  exercise: {
    exerciseTypes: DEFAULT_EXERCISE_TYPES,
    plan: DEFAULT_PLAN,
    todayLog: {},
    weightRecords: [],

    /* ===== 今日进度操作 ===== */

    /** 更新某计划项的已完成组数；为 0 时移除 */
    setSetsDone: (planItemId, setsDone) =>
      set((s: any) => {
        const todayKey = getTodayKey()
        const dayLog = { ...(s.exercise.todayLog[todayKey] || {}) }
        if (setsDone <= 0) {
          delete dayLog[planItemId]
        } else {
          dayLog[planItemId] = setsDone
        }
        return {
          exercise: { ...s.exercise, todayLog: { ...s.exercise.todayLog, [todayKey]: dayLog } },
        }
      }),

    /** 重置今日完成记录 */
    resetTodayLog: () =>
      set((s: any) => ({
        exercise: { ...s.exercise, todayLog: { ...s.exercise.todayLog, [getTodayKey()]: {} } },
      })),

    /* ===== 计划操作 ===== */

    /** 修改计划项训练量 */
    changeAmount: (id, amount) =>
      set((s: any) => ({
        exercise: { ...s.exercise, plan: s.exercise.plan.map((p: PlanItem) => (p.id === id ? { ...p, amount } : p)) },
      })),

    /** 修改计划项组数 */
    changeSets: (id, sets) =>
      set((s: any) => ({
        exercise: { ...s.exercise, plan: s.exercise.plan.map((p: PlanItem) => (p.id === id ? { ...p, sets } : p)) },
      })),

    /** 删除计划项 */
    deletePlanItem: (id) =>
      set((s: any) => ({
        exercise: { ...s.exercise, plan: s.exercise.plan.filter((p: PlanItem) => p.id !== id) },
      })),

    /** 添加计划项 */
    addPlanItem: (weekday, exerciseTypeId, amount, sets) =>
      set((s: any) => ({
        exercise: {
          ...s.exercise,
          plan: [...s.exercise.plan, { id: genId('p'), weekday, exerciseTypeId, amount, sets }],
        },
      })),

    /** 导入计划：merge 追加 / replace 替换 */
    importPlanData: (data, mode) =>
      set((s: any) => ({
        exercise: {
          ...s.exercise,
          plan: mode === 'replace' ? data : [...s.exercise.plan, ...data],
        },
      })),

    /* ===== 训练类型操作 ===== */

    /** 更新训练类型字段 */
    updateExerciseType: (id, patch) =>
      set((s: any) => ({
        exercise: {
          ...s.exercise,
          exerciseTypes: s.exercise.exerciseTypes.map((t: ExerciseType) => (t.id === id ? { ...t, ...patch } : t)),
        },
      })),

    /** 删除训练类型（同时移除引用该类型的计划项） */
    deleteExerciseType: (id) =>
      set((s: any) => ({
        exercise: {
          ...s.exercise,
          exerciseTypes: s.exercise.exerciseTypes.filter((t: ExerciseType) => t.id !== id),
          plan: s.exercise.plan.filter((p: PlanItem) => p.exerciseTypeId !== id),
        },
      })),

    /** 添加训练类型 */
    addExerciseType: (name, category, unit, defaultAmount, url = '') =>
      set((s: any) => ({
        exercise: {
          ...s.exercise,
          exerciseTypes: [...s.exercise.exerciseTypes, { id: genId('e'), name, category, unit, defaultAmount, url }],
        },
      })),

    /** 导入训练类型库：merge 追加 / replace 替换 */
    importExerciseTypesData: (data, mode) =>
      set((s: any) => ({
        exercise: {
          ...s.exercise,
          exerciseTypes: mode === 'replace' ? data : [...s.exercise.exerciseTypes, ...data],
        },
      })),

    /* ===== 体重操作 ===== */

    /** 添加体重记录（同一日期覆盖） */
    addWeight: (weight, date) =>
      set((s: any) => {
        const filtered = s.exercise.weightRecords.filter((r: WeightRecord) => r.date !== date)
        return {
          exercise: {
            ...s.exercise,
            weightRecords: [...filtered, { id: genId('w'), date, weight }],
          },
        }
      }),

    /** 删除体重记录 */
    deleteWeight: (id) =>
      set((s: any) => ({
        exercise: { ...s.exercise, weightRecords: s.exercise.weightRecords.filter((r: WeightRecord) => r.id !== id) },
      })),
  },
})
