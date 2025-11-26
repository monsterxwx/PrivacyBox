import { defineStore } from 'pinia'

const useProjectStore = defineStore({
  id: 'project',
  state: () => ({
    projectId: ''
  }),
  actions: {

  },
  persist: true
})

export default useProjectStore
