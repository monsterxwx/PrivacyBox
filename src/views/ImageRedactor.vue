<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-orange-100">
    <!-- ================= 背景特效 (橙色系) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-orange-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-orange-600 mb-4 inline-flex items-center gap-1 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="m15 18-6-6 6-6" /></svg>
          返回首页
        </RouterLink>
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">隐私涂抹卫士</span>
        </h1>
        <p class="text-slate-600 max-w-2xl">
          纯本地安全处理。支持高斯模糊、马赛克、纯色覆盖，内置 AI 自动识别文本区域。
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- 左侧：画布编辑区 (占 8 列) -->
        <div class="lg:col-span-8 space-y-4">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-1 md:p-2 min-h-[600px] flex flex-col transition-all relative">
            <!-- 空状态 / 上传 -->
            <div v-if="!file" class="flex-1 flex items-center justify-center p-8">
              <FileUploader
                accept="image/*"
                hint="拖入截图或点击上传 (JPG, PNG, WebP)"
                @files-selected="handleFileSelect"
              />
            </div>

            <!-- 画布区域 -->
            <div v-else class="relative w-full h-full bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center select-none group cursor-crosshair">
              <!-- 棋盘格背景 -->
              <div class="absolute inset-0 z-0 opacity-50" style=" background-position: 0 0, 0 10px, 10px -10px, -10px 0; background-size: 20px 20px;background-image: linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%);" />

              <canvas
                ref="canvasRef"
                @mousedown="startSelection"
                @mousemove="updateSelection"
                @mouseup="endSelection"
                @mouseleave="endSelection"
                class="relative z-10 max-w-full max-h-[70vh] shadow-lg object-contain"
              />

              <!-- 悬浮的操作提示 -->
              <div class="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur text-white px-4 py-1.5 rounded-full text-xs font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                🖱️ 鼠标框选区域以打码
              </div>
            </div>

            <!-- 底部工具栏 (仅在有文件时显示) -->
            <div v-if="file" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-white/90 backdrop-blur shadow-lg border border-slate-200 rounded-2xl z-20">
              <button @click="undo" class="p-2 hover:bg-slate-100 rounded-xl text-slate-600 tooltip" title="撤销上一步">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
              </button>
              <div class="w-px h-6 bg-slate-200 mx-1" />
              <button @click="clearAll" class="p-2 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-xl transition-colors" title="清除所有">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              </button>
              <button @click="resetFile" class="p-2 hover:bg-slate-100 text-slate-600 rounded-xl" title="重新上传">
                <span class="text-xs font-bold">重选</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：设置区 (占 4 列) -->
        <div class="lg:col-span-4 space-y-6">
          <!-- 打码样式设置 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-orange-500 rounded-full" />
              打码样式
            </h2>

            <div class="grid grid-cols-3 gap-3 mb-6">
              <button
                v-for="type in effectTypes"
                :key="type.value"
                @click="currentEffect = type.value"
                class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2"
                :class="currentEffect === type.value
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200'"
              >
                <span class="text-xl">{{ type.icon }}</span>
                <span class="text-xs font-bold">{{ type.label }}</span>
              </button>
            </div>

            <!-- 强度滑块 -->
            <div v-if="currentEffect !== 'solid'" class="mb-2">
              <div class="flex justify-between mb-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">强度 / 模糊度</label>
                <span class="text-xs font-mono bg-slate-100 px-2 rounded">{{ intensity }}</span>
              </div>
              <input
                type="range"
                v-model.number="intensity"
                :min="currentEffect === 'pixelate' ? 5 : 2"
                :max="currentEffect === 'pixelate' ? 50 : 30"
                step="1"
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              >
            </div>
            <p class="text-xs text-slate-400">
              提示：框选后实时生效，可叠加使用。
            </p>
          </div>

          <!-- AI 智能辅助 -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-xl rounded-3xl shadow-lg border border-orange-100 p-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl" />

            <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-orange-500"
              ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              AI 智能识别
            </h2>
            <p class="text-sm text-slate-600 mb-4 leading-relaxed">
              利用浏览器内置 OCR 自动检测图片中的文字区域并自动打码。
            </p>

            <button
              @click="runAutoRedact"
              :disabled="!file || isProcessing"
              class="w-full py-3 bg-white border border-orange-200 text-orange-700 font-bold rounded-xl shadow-sm hover:shadow-md hover:bg-orange-50 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="isProcessing" class="animate-spin">⏳</span>
              <span v-else>✨</span>
              {{ isProcessing ? '正在分析图片...' : '一键自动抹除文字' }}
            </button>
          </div>

          <!-- 导出按钮 -->
          <button
            @click="downloadImage"
            :disabled="!file"
            class="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
          >
            保存处理后的图片
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FileUploader from '@/components/FileUploader.vue'
import { saveAs } from 'file-saver'
import Tesseract from 'tesseract.js'

// --- 状态定义 ---
const file = ref(null)
const canvasRef = ref(null)
const ctx = ref(null)
const imgObj = ref(null) // 原始图片对象

// 编辑状态
const regions = ref([]) // { x, y, w, h, type, intensity }
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })
const currentEffect = ref('blur') // blur | pixelate | solid
const intensity = ref(15) // 强度
const isProcessing = ref(false)

const effectTypes = [
  { value: 'blur', label: '高斯模糊', icon: '💧' },
  { value: 'pixelate', label: '马赛克', icon: '🧱' },
  { value: 'solid', label: '纯黑覆盖', icon: '⬛' }
]

// --- 文件处理 ---
const handleFileSelect = (files) => {
  if (!files || files.length === 0) return
  file.value = files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      imgObj.value = img
      initCanvas()
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(files[0])
}

const resetFile = () => {
  file.value = null
  imgObj.value = null
  regions.value = []
}

// --- Canvas 核心逻辑 ---
const initCanvas = () => {
  if (!canvasRef.value || !imgObj.value) return
  const canvas = canvasRef.value
  const img = imgObj.value

  // 限制最大显示宽度，但保持 Canvas 分辨率为原图分辨率（重要：为了清晰度）
  // 在 CSS 中通过 max-width 控制显示大小
  canvas.width = img.width
  canvas.height = img.height

  ctx.value = canvas.getContext('2d', { willReadFrequently: true })
  render()
}

// 渲染循环：绘制背景 -> 绘制所有已确认区域 -> 绘制当前拖拽选框
const render = () => {
  if (!ctx.value || !imgObj.value) return
  const c = ctx.value
  const w = canvasRef.value.width
  const h = canvasRef.value.height

  // 1. 清空并绘制原图
  c.filter = 'none'
  c.clearRect(0, 0, w, h)
  c.drawImage(imgObj.value, 0, 0)

  // 2. 绘制已保存的区域
  regions.value.forEach(r => {
    applyEffectToRegion(c, r)
  })

  // 3. 绘制当前正在拖拽的选框（仅边框指示）
  if (isDragging.value) {
    const rect = getCurrentDragRect()
    c.strokeStyle = '#f97316' // orange-500
    c.lineWidth = 2
    c.setLineDash([5, 5])
    c.strokeRect(rect.x, rect.y, rect.w, rect.h)
    c.setLineDash([])

    // 也可以实时预览效果（可选，性能消耗大，这里暂只画框）
    c.fillStyle = 'rgba(249, 115, 22, 0.2)'
    c.fillRect(rect.x, rect.y, rect.w, rect.h)
  }
}

// 应用滤镜到指定区域
const applyEffectToRegion = (context, r) => {
  context.save()
  context.beginPath()
  context.rect(r.x, r.y, r.w, r.h)
  context.clip()

  if (r.type === 'solid') {
    context.fillStyle = '#000000'
    context.fillRect(r.x, r.y, r.w, r.h)
  } else if (r.type === 'blur') {
    // 使用 Canvas Filter (高性能)
    context.filter = `blur(${r.intensity}px)`
    // 为了防止模糊边缘泛白，通常需要把图稍微画大一点点或者只画图的部分
    context.drawImage(imgObj.value, 0, 0)
  } else if (r.type === 'pixelate') {
    // 马赛克算法：缩小再放大
    const size = r.intensity / 100 // 0.05 ~ 0.5
    // 离屏绘制
    const wScaled = Math.max(1, Math.floor(r.w * size))
    const hScaled = Math.max(1, Math.floor(r.h * size))

    // 简单粗暴的方法：利用 imageSmoothingEnabled = false
    context.imageSmoothingEnabled = false

    // 这里有个小技巧：我们把原图的这部分切出来，缩放到极小，再放回画布
    // 1. 创建临时 canvas
    const offCanvas = document.createElement('canvas')
    offCanvas.width = wScaled
    offCanvas.height = hScaled
    const offCtx = offCanvas.getContext('2d')
    offCtx.drawImage(imgObj.value, r.x, r.y, r.w, r.h, 0, 0, wScaled, hScaled)

    // 2. 画回去
    context.drawImage(offCanvas, 0, 0, wScaled, hScaled, r.x, r.y, r.w, r.h)
    context.imageSmoothingEnabled = true
  }

  context.restore()
  // 恢复 filter
  context.filter = 'none'
}

// --- 鼠标交互 ---
const getCanvasCoordinates = (e) => {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()

  // 计算缩放比例 (CSS 尺寸 vs 实际分辨率)
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}

const startSelection = (e) => {
  if (!file.value) return
  isDragging.value = true
  startPos.value = getCanvasCoordinates(e)
}

const updateSelection = (e) => {
  if (!isDragging.value) return
  const currentPos = getCanvasCoordinates(e)
  // 触发重绘以显示选框
  render()
  // 存储当前终点用于计算 rect
  startPos.value.currentX = currentPos.x
  startPos.value.currentY = currentPos.y
}

const endSelection = (e) => {
  if (!isDragging.value) return
  isDragging.value = false

  const rect = getCurrentDragRect()
  // 防止误触微小点击
  if (rect.w > 5 && rect.h > 5) {
    regions.value.push({
      ...rect,
      type: currentEffect.value,
      intensity: intensity.value
    })
  }
  render()
}

const getCurrentDragRect = () => {
  const curX = startPos.value.currentX || startPos.value.x
  const curY = startPos.value.currentY || startPos.value.y

  return {
    x: Math.min(startPos.value.x, curX),
    y: Math.min(startPos.value.y, curY),
    w: Math.abs(curX - startPos.value.x),
    h: Math.abs(curY - startPos.value.y)
  }
}

const undo = () => {
  regions.value.pop()
  render()
}

const clearAll = () => {
  regions.value = []
  render()
}

// --- 功能实现 ---
const runAutoRedact = async () => {
  if (!file.value) return
  isProcessing.value = true

  try {
    // 使用 Tesseract 识别
    const worker = await Tesseract.createWorker('eng+chi_sim') // 中英文混合
    const { data: { words } } = await worker.recognize(file.value)

    // 将识别到的每个单词都作为一个区域添加
    words.forEach(word => {
      // 稍微扩大一点范围，确保盖住
      const padding = 2
      const box = word.bbox
      regions.value.push({
        x: box.x0 - padding,
        y: box.y0 - padding,
        w: (box.x1 - box.x0) + padding * 2,
        h: (box.y1 - box.y0) + padding * 2,
        type: currentEffect.value,
        intensity: intensity.value
      })
    })

    await worker.terminate()
    render()
  } catch (e) {
    console.error('OCR Error:', e)
    alert('文字识别失败，请检查网络（需要加载语言包）或图片是否清晰。')
  } finally {
    isProcessing.value = false
  }
}

const downloadImage = () => {
  if (!canvasRef.value) return
  canvasRef.value.toBlob((blob) => {
    saveAs(blob, `redacted_${Date.now()}.png`)
  })
}

// 监听强度变化，如果在非拖拽状态下调整滑块，不直接改变已有区域，只影响下一次
// 或者：如果想让最近一次的区域跟随滑块变动，可以加逻辑。这里保持简单，只影响新区域。
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

/* 鼠标样式 */
.cursor-crosshair {
  cursor: crosshair;
}
</style>
