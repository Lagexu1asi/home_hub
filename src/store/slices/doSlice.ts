/**
 * do slice —— 家务 / 巡检 / 单次任务
 * 移植自 what-to-do 项目的业务逻辑
 */
import type { StateCreator } from 'zustand'
import type { Chore, Inspection, OneOff } from '../types'
import { DEFAULT_CHORES, DEFAULT_INSPECTIONS } from '../defaults'
import { getTodayKey, genId } from '../utils'

/** 巡检状态循环：待检 → 正常 → 异常 → 待检 */
const STATUS_CYCLE: Record<string, string> = { pending: 'ok', ok: 'issue', issue: 'pending' }

export interface DoSlice {
  do: {
    chores: Chore[]
    inspections: Inspection[]
    oneOffs: OneOff[]
    // 家务操作
    toggleChore: (id: string) => void
    deleteChore: (id: string) => void
    resetChores: () => void
    changeInterval: (id: string, interval: number) => void
    markChoreDone: (id: string) => void
    resetLastDone: (id: string) => void
    presetNextDue: (id: string, date: string) => void
    clearNextDue: (id: string) => void
    addChore: (title: string, category: string) => void
    // 巡检操作
    cycleInspection: (id: string) => void
    updateNote: (id: string, note: string) => void
    deleteInspection: (id: string) => void
    resetInspections: () => void
    addInspection: (title: string, area: string) => void
    // 单次任务操作
    toggleOneOff: (id: string) => void
    deleteOneOff: (id: string) => void
    addOneOff: (title: string, category: string, date: string) => void
  }
}

/**
 * 创建 do slice
 */
export const createDoSlice: StateCreator<any, [], [], DoSlice> = (set) => ({
  do: {
    chores: DEFAULT_CHORES,
    inspections: DEFAULT_INSPECTIONS,
    oneOffs: [],

    /* ===== 家务操作 ===== */

    /** 切换家务完成状态：勾选时保存原 lastDone 到 prevLastDone 再更新为今天；取消时恢复 */
    toggleChore: (id) =>
      set((s: any) => ({
        do: {
          ...s.do,
          chores: s.do.chores.map((c: Chore) => {
            if (c.id !== id) return c
            const done = !c.done
            return done
              ? { ...c, done: true, prevLastDone: c.prevLastDone ?? c.lastDone, lastDone: getTodayKey() }
              : { ...c, done: false, lastDone: c.prevLastDone ?? c.lastDone, prevLastDone: null }
          }),
        },
      })),

    /** 删除家务 */
    deleteChore: (id) =>
      set((s: any) => ({ do: { ...s.do, chores: s.do.chores.filter((c: Chore) => c.id !== id) } })),

    /** 重置今日家务完成状态（done 置 false，lastDone 保留） */
    resetChores: () =>
      set((s: any) => ({
        do: { ...s.do, chores: s.do.chores.map((c: Chore) => ({ ...c, done: false })) },
      })),

    /** 修改家务执行周期 */
    changeInterval: (id, interval) =>
      set((s: any) => ({
        do: { ...s.do, chores: s.do.chores.map((c: Chore) => (c.id === id ? { ...c, interval } : c)) },
      })),

    /** 标记家务今日已执行（更新 lastDone 为今天，清除预设与撤销记录） */
    markChoreDone: (id) =>
      set((s: any) => ({
        do: {
          ...s.do,
          chores: s.do.chores.map((c: Chore) =>
            c.id === id
              ? { ...c, lastDone: getTodayKey(), done: true, prevLastDone: c.prevLastDone ?? c.lastDone, nextDueOverride: null }
              : c,
          ),
        },
      })),

    /** 清除家务最后执行记录（重置为从未执行） */
    resetLastDone: (id) =>
      set((s: any) => ({
        do: {
          ...s.do,
          chores: s.do.chores.map((c: Chore) =>
            c.id === id ? { ...c, lastDone: null, done: false, prevLastDone: null, nextDueOverride: null } : c,
          ),
        },
      })),

    /** 预设家务下次到期日期 */
    presetNextDue: (id, date) =>
      set((s: any) => ({
        do: { ...s.do, chores: s.do.chores.map((c: Chore) => (c.id === id ? { ...c, nextDueOverride: date } : c)) },
      })),

    /** 清除预设下次到期日期，恢复按周期计算 */
    clearNextDue: (id) =>
      set((s: any) => ({
        do: { ...s.do, chores: s.do.chores.map((c: Chore) => (c.id === id ? { ...c, nextDueOverride: null } : c)) },
      })),

    /** 添加家务（默认周期 1 天） */
    addChore: (title, category) =>
      set((s: any) => ({
        do: {
          ...s.do,
          chores: [
            ...s.do.chores,
            { id: genId('c'), title, category, interval: 1, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
          ],
        },
      })),

    /* ===== 巡检操作 ===== */

    /** 巡检状态循环切换 */
    cycleInspection: (id) =>
      set((s: any) => ({
        do: {
          ...s.do,
          inspections: s.do.inspections.map((i: Inspection) =>
            i.id === id ? { ...i, status: STATUS_CYCLE[i.status] as Inspection['status'] } : i,
          ),
        },
      })),

    /** 更新巡检备注 */
    updateNote: (id, note) =>
      set((s: any) => ({
        do: { ...s.do, inspections: s.do.inspections.map((i: Inspection) => (i.id === id ? { ...i, note } : i)) },
      })),

    /** 删除巡检项 */
    deleteInspection: (id) =>
      set((s: any) => ({
        do: { ...s.do, inspections: s.do.inspections.filter((i: Inspection) => i.id !== id) },
      })),

    /** 重置全部巡检为待检 */
    resetInspections: () =>
      set((s: any) => ({
        do: {
          ...s.do,
          inspections: s.do.inspections.map((i: Inspection) => ({ ...i, status: 'pending', note: '' })),
        },
      })),

    /** 添加巡检项 */
    addInspection: (title, area) =>
      set((s: any) => ({
        do: { ...s.do, inspections: [...s.do.inspections, { id: genId('i'), title, area, status: 'pending', note: '' }] },
      })),

    /* ===== 单次任务操作 ===== */

    /** 切换单次任务完成状态 */
    toggleOneOff: (id) =>
      set((s: any) => ({
        do: { ...s.do, oneOffs: s.do.oneOffs.map((o: OneOff) => (o.id === id ? { ...o, done: !o.done } : o)) },
      })),

    /** 删除单次任务 */
    deleteOneOff: (id) =>
      set((s: any) => ({ do: { ...s.do, oneOffs: s.do.oneOffs.filter((o: OneOff) => o.id !== id) } })),

    /** 添加单次任务 */
    addOneOff: (title, category, date) =>
      set((s: any) => ({
        do: { ...s.do, oneOffs: [...s.do.oneOffs, { id: genId('o'), title, category, date, done: false }] },
      })),
  },
})
