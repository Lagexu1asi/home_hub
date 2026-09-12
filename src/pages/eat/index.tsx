import { useState } from 'react'
import SubTabs from '../../components/layout/SubTabs'
import MenuPage from './MenuPage'
import RecipePage from './RecipePage'

const tabs = [
  { key: 'menu', label: '今日菜单' },
  { key: 'recipe', label: '菜谱' },
]

/**
 * eat 模块容器 —— 今日菜单 / 菜谱
 */
export default function EatModule() {
  const [subTab, setSubTab] = useState('menu')

  return (
    <div className="flex h-full flex-col">
      <SubTabs tabs={tabs} active={subTab} onChange={setSubTab} />
      <div className="flex-1 overflow-y-auto pb-20">
        {subTab === 'menu' && <MenuPage />}
        {subTab === 'recipe' && <RecipePage />}
      </div>
    </div>
  )
}
