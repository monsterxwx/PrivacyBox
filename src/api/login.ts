import { webCenterPost } from '@/utils/http'

export const login = data => webCenterPost('/system/enter', data)
