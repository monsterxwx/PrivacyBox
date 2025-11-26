import { defineStore } from 'pinia'
import router from '@/router'
import { getInfo } from '@/api/comon'
import { TOKEN_KEY } from '@/constants/index'
import { login } from '@/api/login'

const useSystemStore = defineStore({
  id: 'router',
  state: () => ({
    loginFlag: false,
    userInfo: {},
    routerList: [],
    menuList: [
      {
        name: 'test',
        icon: 'mdi-light:home',
        children: [
          {
            name: 'test1',
            path: '/test1',
            component: '/test1/index.vue',
            icon: 'mdi-light:home'
          }
        ]
      },
      {
        name: 'test2',
        path: '/test2',
        component: '/test2/index.vue',
        icon: 'mdi-light:home'
      }
    ]
  }),
  actions: {
    async loginFunc (formData) {
      const res = await login({
        ...formData
      })
      localStorage.setItem(TOKEN_KEY, res.token)
    },
    async logout () {
      localStorage.removeItem(TOKEN_KEY)
      this.$reset()
      router.replace({ path: '/login' })
      this.removeRoute('layout')
    },
    removeRoute (name) {
      if (router.hasRoute(name)) {
        const route = router.getRoutes().find(r => r.name === name)
        if (route && route.children) {
          route.children.forEach(child => {
            if (child.name) {
              router.removeRoute(child.name)
            }
          })
        }
      }
    },
    async initUserInfo () {
      const { user = {} } = await getInfo()
      this.userInfo = user
    },
    async getMenuList () {
    //   const { rows = [] } = await menuList({ pid: 'f289d508788b4a039e1ac03b33176fee' })
    //   console.log('rows', rows)
    // this.menuList = rows
      const routerMap = [
        {
          path: '/home',
          name: 'home',
          component: '/home/index.vue'
        },
        {
          path: '/test1',
          name: 'test1',
          component: '/test1/index.vue'
        },
        {
          path: '/test2',
          name: 'test2',
          component: '/test2/index.vue'
        }
      ]
      const compList = import.meta.glob('@/views/*/index.vue')
      console.log('compList', compList)

      const newRouterMap = routerMap.map(item => {
        return {
          ...item,
          component: compList[`/src/views${item.component}`]
        }
      })
      newRouterMap.forEach((route) => {
        router.addRoute('layout', route)
      })
      this.loginFlag = true
    }
  }
})

export default useSystemStore
