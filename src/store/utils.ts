/**
 * 通用工具函数
 * 主要是日期处理：三个模块都依赖"今日日期"做重置与展示
 */

/**
 * 获取今日日期键 'YYYY-MM-DD'（本地时区）
 * 用于 localStorage 存储的日期比较与每日重置判断
 */
export function getTodayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 格式化中文日期，如 "2026年9月11日 周五"
 */
export function formatDateZh(): string {
  const d = new Date()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`
}

/**
 * 获取今天是星期几（0=周一 ... 6=周日）
 * JS 的 getDay() 是 0=周日，需转换
 */
export function getWeekdayToday(): number {
  const jsDay = new Date().getDay() // 0=周日 ... 6=周六
  return (jsDay + 6) % 7 // 转为 0=周一 ... 6=周日
}

/**
 * 生成唯一 id（基于时间戳，加随机后缀防冲突）
 */
export function genId(prefix = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * 计算两个 'YYYY-MM-DD' 日期之间的天数差（a - b）
 */
export function diffDays(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round((da.getTime() - db.getTime()) / 86400000)
}
