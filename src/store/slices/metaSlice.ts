/**
 * meta slice —— 全局元数据
 * 目前只存 lastResetDate，用于全局每日重置判断
 */
import type { StateCreator } from 'zustand'

export interface MetaSlice {
  meta: {
    /** 上次每日重置的日期 'YYYY-MM-DD' */
    lastResetDate: string
  }
}

/**
 * 创建 meta slice
 * StateCreator 第一个类型参数用 any，避免与完整 Store 类型循环依赖
 */
export const createMetaSlice: StateCreator<any, [], [], MetaSlice> = () => ({
  meta: {
    lastResetDate: '',
  },
})
