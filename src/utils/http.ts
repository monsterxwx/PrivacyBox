import axios from 'axios'
import router from '@/router'
import { TOKEN_KEY } from '@/constants'

// 定义不同的 baseURL
const baseURLs = {
  webScsApi: '/web-scs-api',
  webCenterApi: '/web-center-api'
}

function withToken (config) {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.authorization = token
  }
}

// 创建通用的请求拦截器函数
const requestInterceptor = (config) => {
  withToken(config)
  return config
}

// 创建通用的响应拦截器函数
const responseInterceptor = (response) => {
  switch (response.data.code) {
    case 200: // 成功
      break
    case 401: // 未授权
      if (router.currentRoute.value.path !== '/login') {
        ElMessage.error('登录过期，请重新登录')
        router.replace({ path: '/login' })
      }
      return Promise.reject(response)
    case 500:
    case 501:
    case 503:
      ElMessage.error(response.data?.msg || '服务器错误')
      return Promise.reject(response.data)
    default:
      break
  }

  return response
}

const errorInterceptor = (error) => {
  if (!error.response?.status) {
    return Promise.reject(error.response)
  }
  switch (error.response.status) {
    case 401:
      ElMessage.error('登录过期，请重新登录')
      setTimeout(() => {
        if (router.currentRoute.value.path !== '/login') {
          router.replace({ path: '/login' })
        }
      }, 1000)
      break
    case 404:
      ElMessage.error('网络请求不存在')
      break
    default:
      ElMessage.error(error.response.data.message)
  }
  return Promise.reject(error.response)
}

// 为每个 baseURL 创建 axios 实例
const createInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 30000
  })
  instance.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error))
  instance.interceptors.response.use(responseInterceptor, errorInterceptor)
  return instance
}

// 创建各个实例
const webScsInstances = createInstance(baseURLs.webScsApi)
const webCenterInstances = createInstance(baseURLs.webCenterApi)

// 为每个实例创建对应的 get 和 post 方法
function createGetPost (instance) {
  const get = (url, params) => {
    return new Promise((resolve, reject) => {
      instance
        .get(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    })
  }

  const post = (url, params) => {
    return new Promise((resolve, reject) => {
      instance
        .post(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    })
  }

  return { get, post }
}

const { get: webScsGet, post: webScsPost } = createGetPost(webScsInstances)
const { get: webCenterGet, post: webCenterPost } = createGetPost(webCenterInstances)

// 导出实例和对应的请求方法
export {
  webScsInstances, webScsGet, webScsPost,
  webCenterInstances, webCenterGet, webCenterPost
}
