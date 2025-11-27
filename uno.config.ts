import { defineConfig } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  // 配置选项，如预设、规则等
  transformers: [
    transformerDirectives()
  ]
})
