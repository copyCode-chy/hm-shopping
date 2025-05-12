// 本地存储模块

// 约定一个通用键名
// 用户信息
const INFO_KEY = 'hm_shopping_info'
// 历史搜索
const HISTORY_KEY = 'hm_shopping_history'

// -----------------个人信息
// 设置个人信息
export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}

// 获取个人信息
export const getInfo = () => {
  const defaultInfo = { userId: '', token: '' }
  const res = localStorage.getItem(INFO_KEY)
  // 默认值判断，如果res不存在则返回一个默认值
  return res ? JSON.parse(res) : defaultInfo
}

// 移除个人信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// -----------------搜索历史
// 设置历史搜索信息
export const setHistory = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}

// 获取历史搜索信息
export const getHistory = () => {
  // 默认值判断
  const res = localStorage.getItem(HISTORY_KEY)
  return res ? JSON.parse(res) : []
}
