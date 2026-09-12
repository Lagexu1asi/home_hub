/**
 * 全局 store 类型定义
 * 三个模块（do / eat / exercise）的业务数据结构集中在此
 */

/* ============ do 模块：家务 / 巡检 / 单次任务 ============ */

/** 巡检状态：pending 待检 / ok 正常 / issue 异常 */
export type InspectionStatus = 'pending' | 'ok' | 'issue'

/** 家务项：周期性任务 */
export interface Chore {
  id: string
  title: string
  category: string
  /** 执行周期（天） */
  interval: number
  /** 最后一次执行日期 'YYYY-MM-DD' 或 null */
  lastDone: string | null
  /** 今日是否已完成 */
  done: boolean
  /** 预设下次到期日期（覆盖按周期计算），null 表示按周期算 */
  nextDueOverride: string | null
  /** 撤销用：保存上一次的 lastDone */
  prevLastDone: string | null
}

/** 巡检项 */
export interface Inspection {
  id: string
  title: string
  area: string
  status: InspectionStatus
  note: string
}

/** 单次任务：非周期性，设定具体执行日期 */
export interface OneOff {
  id: string
  title: string
  category: string
  date: string
  done: boolean
}

/* ============ eat 模块：菜谱 / 今日点单 ============ */

/** 菜谱中的一项备料 */
export interface Ingredient {
  name: string
  amount: number
  unit: string
}

/** 菜谱 */
export interface Dish {
  id: string
  name: string
  category: string
  ingredients: Ingredient[]
  steps: string[]
}

/** 今日点单：{ 菜品 id: 份数 } */
export type Orders = Record<string, number>

/* ============ exercise 模块：训练类型 / 计划 / 今日进度 / 体重 ============ */

/** 训练类型 */
export interface ExerciseType {
  id: string
  name: string
  unit: string
  category: string
  defaultAmount: number
  /** 演示视频地址，可为空字符串 */
  url: string
}

/** 一周训练计划中的一项 */
export interface PlanItem {
  id: string
  /** 0=周一 ... 6=周日 */
  weekday: number
  exerciseTypeId: string
  amount: number
  sets: number
}

/** 每日完成进度：{ 'YYYY-MM-DD': { planItemId: 已完成组数 } } */
export type TodayLog = Record<string, Record<string, number>>

/** 体重记录 */
export interface WeightRecord {
  id: string
  date: string
  weight: number
}

/* ============ meta 模块：全局元数据 ============ */

export interface MetaState {
  /** 上次每日重置的日期 'YYYY-MM-DD' */
  lastResetDate: string
}

/* ============ 汇总：整个 store 的状态 ============ */

export interface DoState {
  chores: Chore[]
  inspections: Inspection[]
  oneOffs: OneOff[]
}

export interface EatState {
  dishes: Dish[]
  orders: Orders
}

export interface ExerciseState {
  exerciseTypes: ExerciseType[]
  plan: PlanItem[]
  todayLog: TodayLog
  weightRecords: WeightRecord[]
}

export interface StoreState {
  meta: MetaState
  do: DoState
  eat: EatState
  exercise: ExerciseState
}
