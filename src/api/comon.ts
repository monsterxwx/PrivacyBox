import { webCenterGet } from '@/utils/http'

export const level = data => webCenterGet('/system/manage/window/scs/list/level', data)

export const getInfo = () => webCenterGet('getInfo', {})

// 菜单
export const menuList = data => webCenterGet('/system/menu/list', data)
