<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-teal-100">
    <!-- ================= 背景特效 (清爽/净化) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-teal-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">SVG 瘦身净化</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          移除冗余元数据、注释和隐藏元素，压缩代码体积。让你的图标更轻、更快、更规范。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- ========================= 左侧：输入与配置 ========================= -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col h-full min-h-[500px]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-teal-500 rounded-full" />
                原始代码 / 上传
              </h2>
              <button
                @click="triggerUpload"
                class="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:text-teal-600 hover:border-teal-200 transition-colors flex items-center gap-1 shadow-sm"
              >
                <div class="i-tabler-upload" />
                上传文件
              </button>
              <input
                type="file"
                ref="fileInput"
                accept=".svg"
                class="hidden"
                @change="handleFileChange"
              >
            </div>

            <!-- 输入框 -->
            <div class="relative flex-1 group">
              <textarea
                v-model="inputSvg"
                class="w-full h-full min-h-[300px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-600 font-mono text-xs leading-relaxed focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all resize-none custom-scrollbar"
                placeholder="<svg>...</svg> 粘贴代码到这里"
              />

              <!-- 原始大小浮标 -->
              <div v-if="inputSize" class="absolute bottom-4 right-4 bg-slate-200/80 backdrop-blur text-slate-600 text-[10px] px-2 py-1 rounded font-bold">
                原始: {{ inputSize }}
              </div>
            </div>

            <!-- 优化配置 -->
            <div class="mt-6 pt-6 border-t border-slate-100">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                净化选项
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 hover:text-teal-700 transition-colors">
                  <input type="checkbox" v-model="options.removeComments" class="accent-teal-500 w-4 h-4 rounded">
                  移除注释
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 hover:text-teal-700 transition-colors">
                  <input type="checkbox" v-model="options.removeMetadata" class="accent-teal-500 w-4 h-4 rounded">
                  移除元数据 (Title/Desc)
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 hover:text-teal-700 transition-colors">
                  <input type="checkbox" v-model="options.minifyStyles" class="accent-teal-500 w-4 h-4 rounded">
                  压缩空白与换行
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 hover:text-teal-700 transition-colors">
                  <input type="checkbox" v-model="options.removeIds" class="accent-teal-500 w-4 h-4 rounded">
                  移除不必要的 ID
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 hover:text-teal-700 transition-colors col-span-2">
                  <input type="checkbox" v-model="options.fixPrecision" class="accent-teal-500 w-4 h-4 rounded">
                  数值精度优化 (保留3位小数)
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================= 右侧：结果与对比 ========================= -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <!-- 1. 视觉对比区 (修复版：使用 v-html + 强制 CSS) -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <span class="w-1.5 h-6 bg-cyan-500 rounded-full" />
              视觉无损对比
            </h2>

            <div class="grid grid-cols-2 gap-4 h-64 md:h-80">
              <!-- Before -->
              <div class="bg-slate-100/50 rounded-2xl border border-slate-200 flex flex-col overflow-hidden relative group">
                <div class="absolute top-2 left-2 text-[10px] uppercase font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded z-10">
                  Before
                </div>
                <div class="flex-1 flex items-center justify-center p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMMCA0TDQgNEw0IDBaIiBmaWxsPSIjZjFmMhZjIi8+CjxwYXRoIGQ9Ik00IDRMNCA4TDggOEw4IDRaIiBmaWxsPSIjZjFmMhZjIi8+Cjwvc3ZnPg==')]">
                  <div
                    v-if="inputSvg"
                    v-html="inputSvg"
                    class="svg-preview-wrapper w-full h-full flex items-center justify-center"
                  />
                  <div v-else class="text-slate-300 text-3xl">
                    ?
                  </div>
                </div>
              </div>

              <!-- After -->
              <div class="bg-white rounded-2xl border border-teal-200 flex flex-col overflow-hidden relative shadow-sm group">
                <div class="absolute top-2 left-2 text-[10px] uppercase font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded z-10">
                  After
                </div>
                <div class="flex-1 flex items-center justify-center p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMMCA0TDQgNEw0IDBaIiBmaWxsPSIjZjFmMhZjIi8+CjxwYXRoIGQ9Ik00IDRMNCA4TDggOEw4IDRaIiBmaWxsPSIjZjFmMhZjIi8+Cjwvc3ZnPg==')]">
                  <div
                    v-if="outputSvg"
                    v-html="outputSvg"
                    class="svg-preview-wrapper w-full h-full flex items-center justify-center"
                  />
                  <div v-else class="text-slate-300 text-3xl">
                    ✨
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 代码结果区 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col flex-1">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-emerald-500 rounded-full" />
                优化后代码
              </h2>

              <!-- 压缩率标签 -->
              <div v-if="savings" class="flex items-center gap-2">
                <span class="text-xs text-slate-500">{{ outputSize }}</span>
                <span class="text-xs font-bold text-white bg-teal-500 px-2 py-1 rounded-full shadow-sm">
                  ↓ {{ savings }}%
                </span>
              </div>
            </div>

            <div class="relative flex-1 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden group">
              <textarea
                readonly
                :value="outputSvg"
                class="w-full h-full bg-transparent p-4 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none custom-scrollbar break-all"
                placeholder="优化结果将显示在这里..."
              />

              <!-- 复制按钮 -->
              <button
                v-if="outputSvg"
                @click="copyOutput"
                class="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
              >
                <div v-if="copied" class="i-tabler-check" />
                <div v-else class="i-tabler-copy" />
                {{ copied ? '已复制' : '复制' }}
              </button>
            </div>

            <div class="mt-4 flex justify-end">
              <button
                v-if="outputSvg"
                @click="downloadSvg"
                class="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <div class="i-tabler-download" />
                下载 .svg
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// ---------------- State ----------------
const inputSvg = ref('')
const fileInput = ref(null)
const copied = ref(false)

const options = reactive({
  removeComments: true,
  removeMetadata: true,
  minifyStyles: true,
  removeIds: false,
  fixPrecision: true
})

// ---------------- Logic: Optimization Engine ----------------
const optimize = (svgStr) => {
  if (!svgStr.trim().startsWith('<')) return ''

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgStr, 'image/svg+xml')
    const svgEl = doc.querySelector('svg')

    if (!svgEl) return '无效的 SVG 代码'
    if (doc.querySelector('parsererror')) return 'SVG 解析错误'

    // 确保SVG有合适的viewBox属性用于缩放
    if (!svgEl.hasAttribute('viewBox')) {
      const width = svgEl.getAttribute('width') || '100'
      const height = svgEl.getAttribute('height') || '100'
      svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`)
    }

    // 移除固定的宽高属性，让SVG通过viewBox自适应
    svgEl.removeAttribute('width')
    svgEl.removeAttribute('height')

    // 添加preserveAspectRatio属性确保正确缩放
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_ALL, null)
    const nodesToRemove = []

    let currentNode = walker.nextNode()
    while (currentNode) {
      if (options.removeComments && currentNode.nodeType === Node.COMMENT_NODE) {
        nodesToRemove.push(currentNode)
      }

      if (options.removeMetadata && currentNode.nodeType === Node.ELEMENT_NODE) {
        const tagName = currentNode.tagName.toLowerCase()
        if (['title', 'desc', 'metadata'].includes(tagName)) {
          nodesToRemove.push(currentNode)
        }
      }

      if (options.removeIds && currentNode.nodeType === Node.ELEMENT_NODE) {
        if (currentNode.hasAttribute('id')) {
          currentNode.removeAttribute('id')
        }
      }

      currentNode = walker.nextNode()
    }

    nodesToRemove.forEach(n => n.parentNode && n.parentNode.removeChild(n))

    const serializer = new XMLSerializer()
    let result = serializer.serializeToString(svgEl)

    if (options.minifyStyles) {
      result = result.replace(/[\r\n]+/g, '')
      result = result.replace(/\s{2,}/g, ' ')
      result = result.replace(/>\s+</g, '><')
    }

    if (options.fixPrecision) {
      result = result.replace(/(\d+\.\d{4,})/g, (match) => parseFloat(match).toFixed(3) * 1)
    }

    // 移除固定的宽高属性，让SVG通过viewBox自适应
    result = result.replace(/\s+(width|height)="[^"]*"/g, '')

    return result
  } catch (e) {
    console.error(e)
    return svgStr
  }
}

// ---------------- Computed ----------------
const outputSvg = computed(() => {
  if (!inputSvg.value) return ''
  return optimize(inputSvg.value)
})

const inputSize = computed(() => {
  if (!inputSvg.value) return null
  return formatSize(new Blob([inputSvg.value]).size)
})

const outputSize = computed(() => {
  if (!outputSvg.value) return ''
  return formatSize(new Blob([outputSvg.value]).size)
})

const savings = computed(() => {
  if (!inputSvg.value || !outputSvg.value) return 0
  const inBytes = new Blob([inputSvg.value]).size
  const outBytes = new Blob([outputSvg.value]).size
  if (inBytes === 0) return 0
  return ((1 - outBytes / inBytes) * 100).toFixed(1)
})

// ---------------- Handlers ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    inputSvg.value = e.target.result
  }
  reader.readAsText(file)
  e.target.value = ''
}

const copyOutput = async () => {
  await navigator.clipboard.writeText(outputSvg.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const downloadSvg = () => {
  const blob = new Blob([outputSvg.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'optimized.svg'
  a.click()
  URL.revokeObjectURL(url)
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  return (bytes / 1024).toFixed(2) + ' KB'
}

</script>

<style scoped>
/* 关键修复：强制 SVG 填满容器，覆盖内部写死的宽高 */
.svg-preview-wrapper :deep(svg) {
  display: block !important;
  margin: auto !important;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  max-height: 100% !important;
  object-fit: contain !important;
}

/* 确保预览容器有足够的高度和正确的布局 */
.svg-preview-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

/* 背景网格样式调整 */
.bg-\[url\(\'data\:image\/svg\+xml\;base64\,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8\+CjxwYXRoIGQ9Ik0wIDBMMCA0TDQgNEw0IDBaIiBmaWxsPSIjZjFmMhZjIi8\+CjxwYXRoIGQ9Ik04IDRMNCA4TDggOEw4IDRaIiBmaWxsPSIjZjFmMhZjIi8\+Cjwvc3ZnPg\=\=\'\)\] {
  background-size: 20px 20px !important;
}

/* 滚动条 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 3px; background: #334155; } /* slate-700 */

@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
</style>
