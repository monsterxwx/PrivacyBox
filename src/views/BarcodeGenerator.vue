<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-indigo-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角靛蓝 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角青色 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间紫色 -->
    <div class="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <!-- 头部 -->
      <div class="text-center mb-12">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          ><path d="m15 18-6-6 6-6" /></svg>
          返回首页
        </RouterLink>
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">条形码生成器</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          在线生成矢量条形码，支持多种编码格式 (Code128, EAN, UPC)，一键导出 PNG/SVG。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：配置面板 -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1 h-6 bg-indigo-500 rounded-full" />
              <h2 class="text-lg font-bold text-slate-800">
                参数设置
              </h2>
            </div>

            <!-- 1. 内容输入 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-2">条码内容</label>
              <div class="relative">
                <input
                  v-model="config.text"
                  type="text"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono"
                  placeholder="请输入数字或字母"
                >
                <button
                  @click="randomize"
                  class="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-all"
                  title="随机生成"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  ><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>
                </button>
              </div>
              <p v-if="errorMsg" class="text-xs text-red-500 mt-2 flex items-center gap-1 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><circle cx="12" cy="12" r="10" /><line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="12"
                /><line
                  x1="12"
                  y1="16"
                  x2="12.01"
                  y2="16"
                /></svg>
                {{ errorMsg }}
              </p>
            </div>

            <!-- 2. 格式选择 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-2">编码格式</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="fmt in formats"
                  :key="fmt"
                  @click="config.format = fmt"
                  class="px-3 py-2 text-sm rounded-lg border transition-all text-left"
                  :class="config.format === fmt ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'"
                >
                  {{ fmt }}
                </button>
              </div>
            </div>

            <!-- 3. 外观调整 (手风琴式折叠) -->
            <div class="space-y-4">
              <!-- 条宽 -->
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-xs text-slate-500">条码宽度 ({{ config.width }})</span>
                </div>
                <input
                  type="range"
                  v-model.number="config.width"
                  min="1"
                  max="4"
                  step="1"
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                >
              </div>

              <!-- 高度 -->
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-xs text-slate-500">条码高度 ({{ config.height }}px)</span>
                </div>
                <input
                  type="range"
                  v-model.number="config.height"
                  min="30"
                  max="150"
                  step="5"
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                >
              </div>

              <!-- 颜色与背景 -->
              <div class="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label class="block text-xs text-slate-500 mb-1">线条颜色</label>
                  <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <input type="color" v-model="config.lineColor" class="w-6 h-6 rounded cursor-pointer border-none bg-transparent">
                    <span class="text-xs font-mono text-slate-600">{{ config.lineColor }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-slate-500 mb-1">背景颜色</label>
                  <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <input type="color" v-model="config.background" class="w-6 h-6 rounded cursor-pointer border-none bg-transparent">
                    <span class="text-xs font-mono text-slate-600">{{ config.background }}</span>
                  </div>
                </div>
              </div>

              <!-- 显示文本开关 -->
              <label class="flex items-center justify-between cursor-pointer py-2 border-t border-slate-100 mt-2">
                <span class="text-sm text-slate-700 font-medium">显示底部文本</span>
                <div class="relative">
                  <input type="checkbox" v-model="config.displayValue" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- 右侧：实时预览 -->
        <div class="lg:col-span-7 sticky top-8">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-10 flex flex-col items-center justify-center min-h-[500px] relative transition-all">
            <!-- 预览区 -->
            <div class="flex-1 flex items-center justify-center w-full overflow-hidden">
              <div class="relative group transition-transform duration-300 hover:scale-105">
                <!-- 实际的 Canvas/SVG 容器 -->
                <svg id="barcode-canvas" class="max-w-full shadow-sm" />

                <!-- 错误时的遮罩 -->
                <div v-if="errorMsg" class="absolute inset-0 bg-slate-100/90 flex items-center justify-center rounded text-center p-4">
                  <span class="text-slate-400 text-sm">当前内容不符合 {{ config.format }} 格式要求</span>
                </div>
              </div>
            </div>

            <!-- 下载按钮组 -->
            <div class="w-full grid grid-cols-2 gap-4 mt-10 border-t border-slate-200/60 pt-6">
              <button
                @click="download('png')"
                :disabled="!!errorMsg"
                class="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="text-lg">🖼️</span> 下载 PNG
              </button>
              <button
                @click="download('svg')"
                :disabled="!!errorMsg"
                class="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="text-lg">📐</span> 下载 SVG
              </button>
            </div>

            <div class="text-center mt-4 text-xs text-slate-400">
              提示：矢量 SVG 适合打印，PNG 适合网页展示
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import JsBarcode from 'jsbarcode'
import { saveAs } from 'file-saver'

// ---------------- 配置数据 ----------------
const formats = ['CODE128', 'EAN13', 'UPC', 'CODE39', 'ITF14', 'MSI']

const config = reactive({
  text: 'PrivacyBox-2025',
  format: 'CODE128',
  width: 2,
  height: 100,
  displayValue: true,
  background: '#ffffff',
  lineColor: '#000000',
  margin: 10,
  fontSize: 20
})

const errorMsg = ref('')

// ---------------- 核心逻辑 ----------------
const renderBarcode = () => {
  errorMsg.value = ''
  try {
    // 检查空值
    if (!config.text.trim()) {
      // 清空 canvas 但不报错
      const svg = document.getElementById('barcode-canvas')
      if (svg) svg.innerHTML = ''
      return
    }

    JsBarcode('#barcode-canvas', config.text, {
      format: config.format,
      width: config.width,
      height: config.height,
      displayValue: config.displayValue,
      background: config.background,
      lineColor: config.lineColor,
      margin: config.margin,
      fontSize: config.fontSize,
      valid: (valid) => {
        if (!valid) {
          errorMsg.value = '内容格式无效'
        }
      }
    })
  } catch (e) {
    errorMsg.value = '无法生成：内容与格式不匹配'
  }
}

// ---------------- 辅助功能 ----------------
const randomize = () => {
  if (config.format === 'EAN13') {
    config.text = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')
  } else if (config.format === 'UPC') {
    config.text = Math.floor(Math.random() * 10000000000).toString().padStart(11, '0')
  } else {
    config.text = Math.random().toString(36).substring(2, 12).toUpperCase()
  }
}

const download = (type) => {
  if (errorMsg.value) return

  const svgNode = document.getElementById('barcode-canvas')

  if (type === 'svg') {
    const xml = new XMLSerializer().serializeToString(svgNode)
    const blob = new Blob([xml], { type: 'image/svg+xml' })
    saveAs(blob, `barcode_${config.text}.svg`)
  } else {
    // PNG 需要将 SVG 画到 Canvas 上
    const xml = new XMLSerializer().serializeToString(svgNode)
    const img = new Image()
    // 转换为 base64 以便 image 加载
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)))

    img.onload = () => {
      const canvas = document.createElement('canvas')
      // 获取 SVG 的实际尺寸
      const bbox = svgNode.getBoundingClientRect()
      // 提高分辨率以获得清晰的 PNG
      const scale = 2
      canvas.width = (bbox.width || 200) * scale
      canvas.height = (bbox.height || 100) * scale

      const ctx = canvas.getContext('2d')
      // 如果背景透明，填充白色背景防止变黑
      if (config.background === 'transparent' || !config.background) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        saveAs(blob, `barcode_${config.text}.png`)
      })
    }
  }
}

// ---------------- 监听 ----------------
watch(config, () => {
  nextTick(renderBarcode)
}, { deep: true })

onMounted(() => {
  renderBarcode()
})
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
