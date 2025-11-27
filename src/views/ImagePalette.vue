<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-rose-100">
    <!-- ================= 背景特效 (粉色/艺术) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角玫瑰红 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角紫色 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间橙色 -->
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-orange-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-rose-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">灵感调色板</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          上传照片，AI 自动提取 8 种灵感配色。一键复制 Hex/RGB，为你的设计注入灵魂。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：图片上传与预览 -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col items-center">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 w-full">
              <span class="w-1.5 h-6 bg-rose-500 rounded-full" />
              原图预览
            </h2>

            <!-- 上传区域 -->
            <div
              class="w-full relative group rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 min-h-[300px] flex items-center justify-center transition-all cursor-pointer"
              :class="{'border-rose-400 bg-rose-50/30': isDragging}"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerUpload"
            >
              <div v-if="!imageUrl" class="text-center p-8">
                <div class="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl mx-auto mb-4 text-slate-300 group-hover:text-rose-500 transition-colors group-hover:scale-110 duration-300">
                  🎨
                </div>
                <h3 class="font-bold text-slate-700 text-lg mb-1">
                  点击或拖拽照片
                </h3>
                <p class="text-slate-500 text-xs mt-2">
                  支持 JPG, PNG, WebP
                </p>
              </div>

              <div v-else class="relative w-full h-full flex items-center justify-center bg-slate-100">
                <img
                  ref="imageRef"
                  :src="imageUrl"
                  class="max-w-full max-h-[500px] object-contain shadow-sm"
                  crossorigin="anonymous"
                  @load="extractColors"
                >
                <!-- 遮罩 -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="text-white font-bold bg-white/20 backdrop-blur px-4 py-2 rounded-full border border-white/30">
                    更换图片
                  </span>
                </div>
              </div>
            </div>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              class="hidden"
              @change="handleFileChange"
            >

            <!-- 提取状态 -->
            <div v-if="isExtracting" class="mt-4 text-rose-500 flex items-center gap-2 text-sm font-medium">
              <svg
                class="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              ><circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              正在分析色彩...
            </div>
          </div>
        </div>

        <!-- 右侧：调色板 -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 min-h-[500px] flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-purple-500 rounded-full" />
                色彩提取结果
              </h2>
              <div v-if="palette.length > 0" class="flex gap-2">
                <button @click="formatMode = formatMode === 'hex' ? 'rgb' : 'hex'" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                  切换显示: {{ formatMode.toUpperCase() }}
                </button>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="palette.length === 0" class="flex-1 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <div class="text-4xl mb-4 opacity-30">
                🌈
              </div>
              <p class="text-sm">
                等待图片上传...
              </p>
            </div>

            <!-- 色卡网格 -->
            <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in-up">
              <!-- 1. 主色调 (大卡片) -->
              <div
                class="col-span-2 sm:col-span-4 h-32 rounded-2xl shadow-sm relative group cursor-pointer overflow-hidden flex items-end p-4 transition-transform hover:scale-[1.01]"
                :style="{ backgroundColor: dominantColor.hex }"
                @click="copyColor(dominantColor)"
              >
                <div class="absolute top-3 left-3 bg-black/20 backdrop-blur text-white/90 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                  Dominant
                </div>
                <div class="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                  <span class="font-mono font-bold text-slate-800">
                    {{ formatMode === 'hex' ? dominantColor.hex : dominantColor.rgb }}
                  </span>
                  <div class="i-tabler-copy text-slate-400 text-sm" />
                </div>
                <!-- 复制反馈 -->
                <div v-if="dominantColor.copied" class="absolute inset-0 bg-black/10 flex items-center justify-center text-white font-bold backdrop-blur-[2px] animate-fade-in">
                  已复制!
                </div>
              </div>

              <!-- 2. 调色板 (小卡片) -->
              <div
                v-for="(color, index) in palette"
                :key="index"
                class="h-32 rounded-2xl shadow-sm relative group cursor-pointer overflow-hidden flex flex-col justify-end transition-transform hover:-translate-y-1"
                :style="{ backgroundColor: color.hex }"
                @click="copyColor(color)"
              >
                <!-- 悬浮时显示数值 -->
                <div class="bg-white/90 backdrop-blur-md p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div class="font-mono font-bold text-slate-800 text-sm text-center">
                    {{ formatMode === 'hex' ? color.hex : color.rgb }}
                  </div>
                  <div class="text-[10px] text-slate-500 text-center uppercase tracking-wide mt-0.5">
                    Click to Copy
                  </div>
                </div>

                <!-- 复制反馈 -->
                <div v-if="color.copied" class="absolute inset-0 bg-black/10 flex items-center justify-center text-white font-bold backdrop-blur-[2px] animate-fade-in">
                  Copied
                </div>
              </div>
            </div>

            <!-- 渐变预览条 (Bonus) -->
            <div v-if="palette.length > 0" class="mt-6">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Gradient Preview
              </h3>
              <div class="h-8 w-full rounded-xl shadow-inner border border-black/5" :style="gradientStyle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ColorThief from 'colorthief'

// ---------------- 状态管理 ----------------
const imageUrl = ref('')
const fileInput = ref(null)
const imageRef = ref(null)
const isDragging = ref(false)
const isExtracting = ref(false)
const formatMode = ref('hex') // 'hex' | 'rgb'

// 结果数据
const dominantColor = ref({ hex: '#ffffff', rgb: 'rgb(255,255,255)', r: 255, g: 255, b: 255, copied: false })
const palette = ref([])

// ---------------- 交互逻辑 ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
  e.target.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

const processFile = (file) => {
  if (!file.type.match('image.*')) {
    alert('请上传图片文件')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    palette.value = [] // 重置
  }
  reader.readAsDataURL(file)
}

// ---------------- 核心逻辑：提取颜色 ----------------
const extractColors = () => {
  if (!imageRef.value) return
  isExtracting.value = true

  // ColorThief 需要图片加载完成，且不能有跨域问题 (FileReader 完美避开跨域)
  setTimeout(() => {
    try {
      const colorThief = new ColorThief()
      const img = imageRef.value

      // 1. 获取主色
      const main = colorThief.getColor(img)
      dominantColor.value = formatColor(main)

      // 2. 获取调色板 (8色)
      const rawPalette = colorThief.getPalette(img, 8)
      palette.value = rawPalette.map(c => formatColor(c))
    } catch (err) {
      console.error('Color extraction failed', err)
    } finally {
      isExtracting.value = false
    }
  }, 100) // 稍微延迟确保 DOM 渲染
}

// ---------------- 工具函数 ----------------
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

const formatColor = ([r, g, b]) => ({
  r,
  g,
  b,
  hex: rgbToHex(r, g, b),
  rgb: `rgb(${r}, ${g}, ${b})`,
  copied: false
})

const copyColor = async (colorObj) => {
  const text = formatMode.value === 'hex' ? colorObj.hex : colorObj.rgb
  try {
    await navigator.clipboard.writeText(text)
    colorObj.copied = true
    setTimeout(() => colorObj.copied = false, 1500)
  } catch (e) {
    console.error(e)
  }
}

// ---------------- 计算属性 ----------------
const gradientStyle = computed(() => {
  if (palette.value.length === 0) return {}
  const stops = palette.value.map(c => c.hex).join(', ')
  return {
    background: `linear-gradient(to right, ${stops})`
  }
})

</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

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
