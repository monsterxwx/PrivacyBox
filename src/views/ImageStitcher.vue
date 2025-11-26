<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-violet-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角紫色 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角桃红 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间粉色 -->
    <div class="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-violet-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">长图拼接手</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          将多张图片无缝拼接成一张长图。支持聊天记录、电影台词拼接，纯本地处理。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：图片列表与设置 -->
        <div class="lg:col-span-4 flex flex-col gap-6 h-full">
          <!-- 文件列表卡片 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col h-[500px]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-violet-500 rounded-full" />
                图片素材 ({{ files.length }})
              </h2>
              <button @click="triggerUpload" class="text-xs bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg font-bold hover:bg-violet-200 transition-colors">
                + 添加图片
              </button>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                multiple
                class="hidden"
                @change="handleFileChange"
              >
            </div>

            <!-- 列表区域 -->
            <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 relative">
              <div v-if="files.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 cursor-pointer hover:border-violet-300 hover:bg-violet-50/50 transition-all" @click="triggerUpload">
                <div class="text-3xl mb-2 opacity-50">
                  🖼️
                </div>
                <p class="text-sm">
                  点击添加或拖拽图片
                </p>
              </div>

              <div
                v-for="(file, index) in files"
                :key="file.id"
                class="group flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm hover:border-violet-200 transition-all"
              >
                <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                  {{ index + 1 }}
                </div>
                <img :src="file.preview" class="w-10 h-10 object-cover rounded-lg bg-slate-200">
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-bold text-slate-700 truncate">
                    {{ file.raw.name }}
                  </div>
                  <div class="text-[10px] text-slate-400">
                    {{ file.width }} x {{ file.height }}
                  </div>
                </div>

                <!-- 排序操作 -->
                <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="moveFile(index, -1)" :disabled="index === 0" class="w-5 h-5 flex items-center justify-center rounded bg-slate-50 hover:bg-violet-100 text-slate-400 hover:text-violet-600 disabled:opacity-0 text-[10px]">
                    ▲
                  </button>
                  <button @click="moveFile(index, 1)" :disabled="index === files.length - 1" class="w-5 h-5 flex items-center justify-center rounded bg-slate-50 hover:bg-violet-100 text-slate-400 hover:text-violet-600 disabled:opacity-0 text-[10px]">
                    ▼
                  </button>
                </div>
                <button @click="removeFile(index)" class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- 设置卡片 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-2">拼接方向</label>
                <div class="flex bg-slate-100 rounded-lg p-1">
                  <button @click="config.direction = 'vertical'" class="flex-1 py-1.5 text-xs font-bold rounded-md transition-all" :class="config.direction === 'vertical' ? 'bg-white shadow text-violet-600' : 'text-slate-500'">
                    垂直
                  </button>
                  <button @click="config.direction = 'horizontal'" class="flex-1 py-1.5 text-xs font-bold rounded-md transition-all" :class="config.direction === 'horizontal' ? 'bg-white shadow text-violet-600' : 'text-slate-500'">
                    水平
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-2">背景颜色</label>
                <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 h-[34px]">
                  <input type="color" v-model="config.bgColor" class="w-6 h-6 rounded cursor-pointer border-none bg-transparent">
                  <span class="text-xs font-mono text-slate-600">{{ config.bgColor }}</span>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">图片间距 ({{ config.gap }}px)</label>
                <input
                  type="range"
                  v-model.number="config.gap"
                  min="0"
                  max="100"
                  class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">外边距 ({{ config.padding }}px)</label>
                <input
                  type="range"
                  v-model.number="config.padding"
                  min="0"
                  max="100"
                  class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：预览与导出 -->
        <div class="lg:col-span-8 flex flex-col gap-6 h-full">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col h-full min-h-[600px] relative">
            <!-- 顶部工具 -->
            <div class="flex justify-between items-center mb-4 shrink-0">
              <div class="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" v-if="files.length > 0" />
                实时预览
              </div>
              <button
                @click="download"
                :disabled="files.length === 0"
                class="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line
                  x1="12"
                  y1="15"
                  x2="12"
                  y2="3"
                /></svg>
                保存长图
              </button>
            </div>

            <!-- 预览区域 (滚动) -->
            <div class="flex-1 bg-slate-200/50 rounded-xl overflow-auto border border-slate-200 flex items-start justify-center p-4 custom-scrollbar relative">
              <!-- 背景网格 -->
              <div class="absolute inset-0 z-0 opacity-30 pointer-events-none" style="background-image: linear-gradient(45deg, #cccccc 25%, transparent 25%), linear-gradient(-45deg, #cccccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cccccc 75%), linear-gradient(-45deg, transparent 75%, #cccccc 75%); background-size: 20px 20px;" />

              <div v-if="files.length === 0" class="absolute inset-0 flex items-center justify-center text-slate-400 z-10">
                请在左侧添加图片
              </div>

              <!-- 核心 Canvas -->
              <canvas ref="canvasRef" class="shadow-2xl relative z-10 max-w-full" />
            </div>

            <div class="mt-2 text-center text-xs text-slate-400">
              提示：若图片宽度不一致，将自动以最大宽度为基准居中对齐
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { saveAs } from 'file-saver'

// ---------------- 状态管理 ----------------
const files = ref([]) // { id, raw, preview, width, height }
const fileInput = ref(null)
const canvasRef = ref(null)

const config = reactive({
  direction: 'vertical', // 'vertical' | 'horizontal'
  bgColor: '#ffffff',
  gap: 0,
  padding: 0
})

// ---------------- 交互逻辑 ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = async (e) => {
  const newFiles = Array.from(e.target.files)
  if (!newFiles.length) return

  for (const file of newFiles) {
    const info = await loadImage(file)
    files.value.push(info)
  }
  e.target.value = ''
  draw()
}

const loadImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          raw: file,
          preview: e.target.result,
          width: img.width,
          height: img.height,
          imgObj: img // 保存 Image 对象供 Canvas 使用
        })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const removeFile = (index) => {
  files.value.splice(index, 1)
  draw()
}

const moveFile = (index, direction) => {
  const item = files.value[index]
  files.value.splice(index, 1)
  files.value.splice(index + direction, 0, item)
  draw()
}

// ---------------- 核心绘图逻辑 ----------------
const draw = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')

  if (files.value.length === 0) {
    canvasRef.value.width = 0
    canvasRef.value.height = 0
    return
  }

  // 1. 计算总尺寸
  let totalWidth = 0
  let totalHeight = 0
  let maxWidth = 0
  let maxHeight = 0

  files.value.forEach(f => {
    if (f.width > maxWidth) maxWidth = f.width
    if (f.height > maxHeight) maxHeight = f.height
  })

  if (config.direction === 'vertical') {
    // 垂直拼接：宽度为最宽图片的宽度 + padding*2
    // 高度为所有图片高度之和 + gap*(n-1) + padding*2
    totalWidth = maxWidth + config.padding * 2
    totalHeight = files.value.reduce((acc, f) => acc + f.height, 0) + (files.value.length - 1) * config.gap + config.padding * 2
  } else {
    // 水平拼接
    totalHeight = maxHeight + config.padding * 2
    totalWidth = files.value.reduce((acc, f) => acc + f.width, 0) + (files.value.length - 1) * config.gap + config.padding * 2
  }

  // 2. 设置画布
  canvasRef.value.width = totalWidth
  canvasRef.value.height = totalHeight

  // 3. 填充背景
  ctx.fillStyle = config.bgColor
  ctx.fillRect(0, 0, totalWidth, totalHeight)

  // 4. 绘制图片
  let currentX = config.padding
  let currentY = config.padding

  files.value.forEach((f) => {
    // 计算居中偏移量
    let drawX = currentX
    let drawY = currentY

    if (config.direction === 'vertical') {
      // 垂直模式下，图片水平居中
      drawX = currentX + (maxWidth - f.width) / 2
      ctx.drawImage(f.imgObj, drawX, drawY)
      currentY += f.height + config.gap
    } else {
      // 水平模式下，图片垂直居中
      drawY = currentY + (maxHeight - f.height) / 2
      ctx.drawImage(f.imgObj, drawX, drawY)
      currentX += f.width + config.gap
    }
  })
}

const download = () => {
  if (!canvasRef.value) return
  canvasRef.value.toBlob((blob) => {
    saveAs(blob, `stitched_image_${Date.now()}.png`)
  })
}

// ---------------- 监听 ----------------
watch(config, () => {
  draw()
}, { deep: true })

onMounted(() => {
  draw()
})
</script>

<style scoped>
/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 3px; background: #cbd5e1; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

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
