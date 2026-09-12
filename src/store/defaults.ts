/**
 * 三个模块的默认数据与常量
 * 首次使用时注入，数据迁移后用户数据会覆盖这些默认值
 */
import type { Chore, Inspection, Dish, ExerciseType, PlanItem } from './types'

/* ============ do 模块常量与默认数据 ============ */

/** 家务分类标签 */
export const CHORE_CATEGORIES = ['厨房', '客厅', '主卧', '次卧', '书房', '卫生间', '阳台', '其他']

/** 巡检区域标签 */
export const INSPECTION_AREAS = ['厨房', '客厅', '主卧', '次卧', '书房', '卫生间', '阳台', '全屋']

/** 周期预设选项（天） */
export const INTERVAL_PRESETS = [
  { label: '每日', days: 1 },
  { label: '每3天', days: 3 },
  { label: '每周', days: 7 },
  { label: '每2周', days: 14 },
  { label: '每4周', days: 28 },
  { label: '每月', days: 30 },
  { label: '每3月', days: 90 },
  { label: '每半年', days: 180 },
]

/** 默认家务项 */
export const DEFAULT_CHORES: Chore[] = [
  { id: 'c1', title: '洗碗并清理水槽', category: '厨房', interval: 1, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c2', title: '擦拭灶台与料理台', category: '厨房', interval: 1, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c3', title: '整理桌面杂物', category: '客厅', interval: 1, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c4', title: '扫地或吸尘', category: '客厅', interval: 3, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c5', title: '拖地', category: '客厅', interval: 3, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c6', title: '整理床铺', category: '主卧', interval: 1, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c7', title: '收衣叠衣入柜', category: '主卧', interval: 2, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c8', title: '更换床单被套', category: '次卧', interval: 14, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c9', title: '整理书桌与书架', category: '书房', interval: 3, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c10', title: '擦拭镜面与洗手台', category: '卫生间', interval: 2, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c11', title: '清理地面积水', category: '卫生间', interval: 1, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c12', title: '清洗洗衣机', category: '卫生间', interval: 28, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c13', title: '清洁浴室地缝', category: '卫生间', interval: 7, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
  { id: 'c14', title: '清洗纱窗', category: '阳台', interval: 90, lastDone: null, done: false, nextDueOverride: null, prevLastDone: null },
]

/** 默认巡检项 */
export const DEFAULT_INSPECTIONS: Inspection[] = [
  { id: 'i1', title: '燃气阀门已关闭', area: '厨房', status: 'pending', note: '' },
  { id: 'i2', title: '灶台周围无易燃物', area: '厨房', status: 'pending', note: '' },
  { id: 'i3', title: '门窗锁闭完好', area: '全屋', status: 'pending', note: '' },
  { id: 'i4', title: '水龙头无滴漏', area: '卫生间', status: 'pending', note: '' },
  { id: 'i5', title: '地漏排水通畅', area: '卫生间', status: 'pending', note: '' },
  { id: 'i6', title: '非必要电器电源已断', area: '客厅', status: 'pending', note: '' },
  { id: 'i7', title: '阳台排水口无堵塞', area: '阳台', status: 'pending', note: '' },
  { id: 'i8', title: '晾衣架稳固无松动', area: '阳台', status: 'pending', note: '' },
]

/* ============ eat 模块常量与默认数据 ============ */

/** 菜品分类标签 */
export const DISH_CATEGORIES = ['荤菜', '素菜', '汤品', '主食', '凉菜', '其他']

/** 默认菜谱 */
export const DEFAULT_DISHES: Dish[] = [
  {
    id: 'd1', name: '番茄炒蛋', category: '素菜',
    ingredients: [
      { name: '番茄', amount: 2, unit: '个' }, { name: '鸡蛋', amount: 3, unit: '个' },
      { name: '盐', amount: 1, unit: '小勺' }, { name: '糖', amount: 1, unit: '小勺' }, { name: '葱花', amount: 1, unit: '把' },
    ],
    steps: ['番茄洗净切块,鸡蛋打散加少许盐', '热锅冷油,倒入蛋液翻炒至凝固盛出', '锅中下番茄翻炒出汁,加糖盐调味', '倒回鸡蛋翻炒均匀,撒葱花出锅'],
  },
  {
    id: 'd2', name: '青椒土豆丝', category: '素菜',
    ingredients: [
      { name: '土豆', amount: 2, unit: '个' }, { name: '青椒', amount: 1, unit: '个' },
      { name: '蒜末', amount: 2, unit: '瓣' }, { name: '盐', amount: 1, unit: '小勺' }, { name: '香醋', amount: 1, unit: '小勺' },
    ],
    steps: ['土豆去皮切细丝,泡水洗去淀粉沥干', '青椒去籽切细丝,蒜切末', '热油锅爆香蒜末,下土豆丝大火翻炒', '加青椒丝同炒,沿锅边淋醋,加盐调味即可'],
  },
  {
    id: 'd3', name: '红烧肉', category: '荤菜',
    ingredients: [
      { name: '五花肉', amount: 500, unit: '克' }, { name: '冰糖', amount: 30, unit: '克' },
      { name: '生抽', amount: 2, unit: '大勺' }, { name: '老抽', amount: 1, unit: '大勺' },
      { name: '料酒', amount: 2, unit: '大勺' }, { name: '葱姜', amount: 1, unit: '把' },
    ],
    steps: ['五花肉切方块,冷水下锅焯水去血沫', '热锅小火炒冰糖至焦糖色', '下肉块翻炒上色,加葱姜料酒', '加生抽老抽与热水没过肉块', '大火烧开转小火炖 40 分钟,收汁出锅'],
  },
  {
    id: 'd4', name: '番茄炖牛腩', category: '荤菜',
    ingredients: [
      { name: '牛腩', amount: 600, unit: '克' }, { name: '番茄', amount: 4, unit: '个' },
      { name: '洋葱', amount: 1, unit: '个' }, { name: '番茄酱', amount: 2, unit: '大勺' },
      { name: '盐', amount: 1, unit: '小勺' }, { name: '姜片', amount: 3, unit: '片' },
    ],
    steps: ['牛腩切块焯水,番茄切块,洋葱切丝', '热油锅炒香洋葱与姜片', '下牛腩翻炒,加番茄酱炒匀', '加足量热水,大火烧开转小火炖 1 小时', '加番茄块继续炖 20 分钟,加盐收汁'],
  },
  {
    id: 'd5', name: '蒜蓉空心菜', category: '素菜',
    ingredients: [
      { name: '空心菜', amount: 1, unit: '把' }, { name: '蒜末', amount: 4, unit: '瓣' },
      { name: '盐', amount: 1, unit: '小勺' }, { name: '食用油', amount: 2, unit: '大勺' },
    ],
    steps: ['空心菜洗净掐段,蒜切末', '热油锅爆香蒜末', '下空心菜大火快炒', '加盐调味,断生即可出锅'],
  },
  {
    id: 'd6', name: '紫菜蛋花汤', category: '汤品',
    ingredients: [
      { name: '紫菜', amount: 1, unit: '把' }, { name: '鸡蛋', amount: 2, unit: '个' },
      { name: '葱花', amount: 1, unit: '把' }, { name: '盐', amount: 1, unit: '小勺' }, { name: '香油', amount: 1, unit: '小勺' },
    ],
    steps: ['紫菜泡水洗净,鸡蛋打散', '锅中加水烧开,下紫菜', '画圈淋入蛋液,等蛋花浮起', '加盐与香油调味,撒葱花出锅'],
  },
  {
    id: 'd7', name: '蛋炒饭', category: '主食',
    ingredients: [
      { name: '隔夜米饭', amount: 2, unit: '碗' }, { name: '鸡蛋', amount: 3, unit: '个' },
      { name: '葱花', amount: 2, unit: '把' }, { name: '盐', amount: 1, unit: '小勺' }, { name: '食用油', amount: 2, unit: '大勺' },
    ],
    steps: ['鸡蛋打散加少许盐,米饭抓散', '热油锅倒入蛋液,半凝固时下米饭', '大火快速翻炒,把米饭炒散炒干', '加盐调味,撒葱花炒匀出锅'],
  },
  {
    id: 'd8', name: '凉拌黄瓜', category: '凉菜',
    ingredients: [
      { name: '黄瓜', amount: 2, unit: '根' }, { name: '蒜末', amount: 3, unit: '瓣' },
      { name: '生抽', amount: 1, unit: '大勺' }, { name: '香醋', amount: 1, unit: '大勺' },
      { name: '香油', amount: 1, unit: '小勺' }, { name: '白糖', amount: 1, unit: '小勺' },
    ],
    steps: ['黄瓜洗净拍裂,切小段', '加盐腌制 10 分钟,倒掉多余水分', '加蒜末、生抽、香醋、糖、香油拌匀', '冷藏 15 分钟更入味'],
  },
]

/* ============ exercise 模块常量与默认数据 ============ */

/** 训练类型分类标签 */
export const EXERCISE_CATEGORIES = ['力量', '有氧', '核心', '柔韧', '爆发', '其他']

/** 训练单位预设 */
export const EXERCISE_UNITS = ['个', 'km', '米', '分钟', '秒', '组']

/** 一周星期定义：0=周一 ... 6=周日 */
export const WEEKDAYS = [
  { key: 0, label: '周一', short: '一' },
  { key: 1, label: '周二', short: '二' },
  { key: 2, label: '周三', short: '三' },
  { key: 3, label: '周四', short: '四' },
  { key: 4, label: '周五', short: '五' },
  { key: 5, label: '周六', short: '六' },
  { key: 6, label: '周日', short: '日' },
]

/** 训练类型分类配色 */
export const CATEGORY_COLORS: Record<string, string> = {
  力量: '#C8643C',
  有氧: '#2D6A4F',
  核心: '#D4A040',
  柔韧: '#5C7A5A',
  爆发: '#B8442E',
  其他: '#9A9388',
}

/** 默认训练类型库 */
export const DEFAULT_EXERCISE_TYPES: ExerciseType[] = [
  { id: 'e1', name: '俯卧撑', unit: '个', category: '力量', defaultAmount: 20, url: '' },
  { id: 'e2', name: '深蹲', unit: '个', category: '力量', defaultAmount: 30, url: '' },
  { id: 'e3', name: '引体向上', unit: '个', category: '力量', defaultAmount: 8, url: '' },
  { id: 'e4', name: '弓步蹲', unit: '个', category: '力量', defaultAmount: 20, url: '' },
  { id: 'e5', name: '哑铃推举', unit: '个', category: '力量', defaultAmount: 15, url: '' },
  { id: 'e6', name: '跑步', unit: 'km', category: '有氧', defaultAmount: 5, url: '' },
  { id: 'e7', name: '跳绳', unit: '分钟', category: '有氧', defaultAmount: 10, url: '' },
  { id: 'e8', name: '开合跳', unit: '个', category: '有氧', defaultAmount: 50, url: '' },
  { id: 'e9', name: '平板支撑', unit: '秒', category: '核心', defaultAmount: 60, url: '' },
  { id: 'e10', name: '卷腹', unit: '个', category: '核心', defaultAmount: 30, url: '' },
  { id: 'e11', name: '俄罗斯转体', unit: '个', category: '核心', defaultAmount: 40, url: '' },
  { id: 'e12', name: '拉伸放松', unit: '分钟', category: '柔韧', defaultAmount: 15, url: '' },
  { id: 'e13', name: '高抬腿', unit: '秒', category: '爆发', defaultAmount: 30, url: '' },
  { id: 'e14', name: '波比跳', unit: '个', category: '爆发', defaultAmount: 15, url: '' },
]

/** 默认一周训练计划 */
export const DEFAULT_PLAN: PlanItem[] = [
  { id: 'p1', weekday: 0, exerciseTypeId: 'e1', amount: 20, sets: 3 },
  { id: 'p2', weekday: 0, exerciseTypeId: 'e3', amount: 8, sets: 3 },
  { id: 'p3', weekday: 0, exerciseTypeId: 'e5', amount: 15, sets: 3 },
  { id: 'p4', weekday: 1, exerciseTypeId: 'e6', amount: 5, sets: 1 },
  { id: 'p5', weekday: 1, exerciseTypeId: 'e7', amount: 10, sets: 3 },
  { id: 'p6', weekday: 2, exerciseTypeId: 'e9', amount: 60, sets: 3 },
  { id: 'p7', weekday: 2, exerciseTypeId: 'e10', amount: 30, sets: 3 },
  { id: 'p8', weekday: 2, exerciseTypeId: 'e11', amount: 40, sets: 3 },
  { id: 'p9', weekday: 3, exerciseTypeId: 'e2', amount: 30, sets: 3 },
  { id: 'p10', weekday: 3, exerciseTypeId: 'e4', amount: 20, sets: 3 },
  { id: 'p11', weekday: 4, exerciseTypeId: 'e13', amount: 30, sets: 4 },
  { id: 'p12', weekday: 4, exerciseTypeId: 'e14', amount: 15, sets: 3 },
  { id: 'p13', weekday: 4, exerciseTypeId: 'e8', amount: 50, sets: 3 },
  { id: 'p14', weekday: 5, exerciseTypeId: 'e6', amount: 5, sets: 1 },
  { id: 'p15', weekday: 5, exerciseTypeId: 'e12', amount: 15, sets: 1 },
]
