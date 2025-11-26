
import { setupPinia } from './pinia'
import { setupEcharts } from './echarts'

export function setupPlugins(app) {
  setupPinia(app)
  setupEcharts(app)
}
