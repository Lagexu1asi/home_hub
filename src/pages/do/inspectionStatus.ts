/** 巡检状态定义：pending 待检 / ok 正常 / issue 异常 */
export const INSPECTION_STATUS = {
  pending: { label: '待检', color: '#8A8478' },
  ok: { label: '正常', color: '#5C7A5A' },
  issue: { label: '异常', color: '#C8643C' },
} as const
