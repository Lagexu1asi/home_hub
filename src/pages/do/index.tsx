import { useState } from 'react'
import SubTabs from '../../components/layout/SubTabs'
import Sheet from '../../components/ui/Sheet'
import ChoresPage from './ChoresPage'
import SchedulePage from './SchedulePage'
import InspectionPage from './InspectionPage'
import { CHORE_CATEGORIES, INSPECTION_AREAS } from '../../store/defaults'
import { useStore } from '../../store'
import { getTodayKey } from '../../store/utils'

const tabs = [
  { key: 'chores', label: '家务' },
  { key: 'schedule', label: '周期' },
  { key: 'inspection', label: '巡检' },
]

/**
 * do 模块容器 —— 家务 / 周期 / 巡检
 * 管理子 Tab 切换与统一的添加面板
 */
export default function DoModule() {
  const [subTab, setSubTab] = useState('chores')
  const [sheetOpen, setSheetOpen] = useState(false)
  // 添加表单
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')
  const [date, setDate] = useState(getTodayKey())

  const doActions = useStore((s) => s.do)

  // 添加面板的标签选项：巡检用区域，其余用家务分类
  const tags = subTab === 'inspection' ? INSPECTION_AREAS : CHORE_CATEGORIES
  const isOneOff = subTab === 'schedule'

  /** 提交添加：根据当前子 Tab 分发到对应 action */
  const handleAdd = () => {
    const t = title.trim()
    if (!t) return
    const finalTag = tag || tags[0]
    if (subTab === 'inspection') {
      doActions.addInspection(t, finalTag)
    } else if (isOneOff) {
      doActions.addOneOff(t, finalTag, date)
    } else {
      doActions.addChore(t, finalTag)
    }
    setTitle('')
    setTag('')
    setSheetOpen(false)
  }

  return (
    <div className="flex h-full flex-col">
      <SubTabs tabs={tabs} active={subTab} onChange={setSubTab} />
      <div className="flex-1 overflow-y-auto pb-20">
        {subTab === 'chores' && <ChoresPage />}
        {subTab === 'schedule' && <SchedulePage />}
        {subTab === 'inspection' && <InspectionPage />}
      </div>

      {/* 添加按钮 */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-16 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg active:scale-95"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="添加"
      >
        +
      </button>

      {/* 添加面板 */}
      <Sheet
        open={sheetOpen}
        title={subTab === 'inspection' ? '添加巡检项' : isOneOff ? '添加单次任务' : '添加家务'}
        onClose={() => setSheetOpen(false)}
      >
        <div className="space-y-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="名称"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <div>
            <p className="mb-1 text-xs text-muted">{subTab === 'inspection' ? '区域' : '分类'}</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tg) => (
                <button
                  key={tg}
                  onClick={() => setTag(tg)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    tag === tg ? 'bg-accent text-white' : 'bg-bg text-muted'
                  }`}
                >
                  {tg}
                </button>
              ))}
            </div>
          </div>
          {isOneOff && (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
            />
          )}
          <button
            onClick={handleAdd}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white active:opacity-80"
          >
            添加
          </button>
        </div>
      </Sheet>
    </div>
  )
}
