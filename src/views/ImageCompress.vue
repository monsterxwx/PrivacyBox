<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-teal-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-teal-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">图片智能压缩</span>
        </h1>
      </div>

      <!-- ================= 1. 模式切换区 (UI 优化) ================= -->
      <div class="flex flex-col items-center gap-6 mb-8">
        <!-- 大号 Tab 切换 -->
        <div class="p-1.5 bg-slate-200/60 backdrop-blur rounded-2xl inline-flex shadow-inner">
          <button
            v-for="mode in modes"
            :key="mode.key"
            @click="switchMode(mode.key)"
            class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
            :class="currentMode === mode.key
              ? 'bg-white text-teal-700 shadow-lg shadow-teal-900/5 scale-100 ring-1 ring-black/5'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'"
          >
            <span>{{ mode.label }}</span>
            <!-- 选中时的指示点 -->
            <span v-if="currentMode === mode.key" class="w-1.5 h-1.5 rounded-full bg-teal-500" />
          </button>
        </div>

        <!-- ================= 2. 自定义面板 (参考图还原) ================= -->
        <!-- 使用 Transition 实现丝滑展开 -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform -translate-y-4 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-4 opacity-0"
        >
          <div v-if="currentMode === 'custom'" class="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-teal-100 p-6 md:p-8">
            <div class="grid md:grid-cols-2 gap-8 relative">
              <!-- 中间分割线 (仅桌面端显示) -->
              <div class="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-200" />

              <!-- 左侧：按清晰度 -->
              <div class="space-y-6" :class="{ 'opacity-50 grayscale': customSettings.method !== 'quality' }">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center justify-center">
                    <input
                      type="radio"
                      v-model="customSettings.method"
                      value="quality"
                      class="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-teal-500 checked:bg-teal-500 transition-all"
                    >
                    <div class="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span class="font-bold text-slate-800 text-lg group-hover:text-teal-600 transition-colors">指定清晰度压缩</span>
                </label>

                <div class="pl-8 space-y-5">
                  <!-- 清晰度滑块 -->
                  <div>
                    <div class="flex justify-between mb-2">
                      <span class="text-sm text-slate-600">清晰度</span>
                      <span class="text-sm font-mono font-bold text-teal-600 bg-teal-50 px-2 rounded">{{ customSettings.quality }}%</span>
                    </div>
                    <input
                      type="range"
                      v-model.number="customSettings.quality"
                      min="10"
                      max="100"
                      step="5"
                      :disabled="customSettings.method !== 'quality'"
                      class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500 disabled:cursor-not-allowed"
                    >
                  </div>

                  <!-- 分辨率下拉 -->
                  <div>
                    <span class="text-sm text-slate-600 block mb-2">分辨率缩放</span>
                    <select v-model.number="customSettings.scale" :disabled="customSettings.method !== 'quality'" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none disabled:bg-slate-100">
                      <option :value="1">
                        保持原分辨率
                      </option>
                      <option :value="0.75">
                        75% (缩小尺寸)
                      </option>
                      <option :value="0.5">
                        50% (缩小尺寸)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 右侧：按文件大小 -->
              <div class="space-y-6" :class="{ 'opacity-50 grayscale': customSettings.method !== 'size' }">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center justify-center">
                    <input
                      type="radio"
                      v-model="customSettings.method"
                      value="size"
                      class="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-sky-500 checked:bg-sky-500 transition-all"
                    >
                    <div class="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span class="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">指定大小压缩</span>
                  <span class="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded ml-auto">Beta</span>
                </label>

                <div class="pl-8 space-y-5">
                  <!-- 期望大小输入 -->
                  <div>
                    <span class="text-sm text-slate-600 block mb-2">期望大小 (KB)</span>
                    <div class="relative">
                      <input
                        type="number"
                        v-model.number="customSettings.targetKB"
                        min="10"
                        :disabled="customSettings.method !== 'size'"
                        class="w-full bg-white border border-slate-300 rounded-lg pl-4 pr-12 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition disabled:bg-slate-100"
                      >
                      <span class="absolute right-4 top-2 text-sm text-slate-400">KB</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-2">
                      注：我们会尝试逼近此数值，但无法保证 100% 精确。
                    </p>
                  </div>

                  <!-- 格式强转 -->
                  <div>
                    <span class="text-sm text-slate-600 block mb-2">输出格式</span>
                    <div class="flex gap-4">
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          :value="false"
                          v-model="customSettings.forceJpeg"
                          :disabled="customSettings.method !== 'size'"
                          class="text-sky-500 focus:ring-sky-500"
                        >
                        <span class="text-sm text-slate-700">原格式</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          :value="true"
                          v-model="customSettings.forceJpeg"
                          :disabled="customSettings.method !== 'size'"
                          class="text-sky-500 focus:ring-sky-500"
                        >
                        <span class="text-sm text-slate-700">转为 JPG</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 自定义模式下的底部按钮 -->
              <div class="md:col-span-2 pt-6 border-t border-slate-100 flex justify-end">
                <button @click="reCompressAll" class="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition">
                  应用并重新压缩
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- ================= 3. 文件列表区域 ================= -->
      <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden min-h-[400px] flex flex-col">
        <!-- 空状态 -->
        <div v-if="fileList.length === 0" class="flex-1 flex flex-col items-center justify-center p-12">
          <FileUploader
            accept="image/*"
            :multiple="true"
            hint="支持 JPG, PNG, WebP"
            @files-selected="addFiles"
          />
        </div>

        <!-- 列表状态 -->
        <div v-else class="flex flex-col h-full">
          <!-- 顶部追加 -->
          <div class="p-4 border-b border-slate-200/60 bg-white/40 flex justify-between items-center">
            <div
              class="inline-flex items-center gap-2 text-sm text-teal-700 font-medium cursor-pointer hover:bg-teal-50 px-3 py-1.5 rounded-lg transition"
              @click="triggerAddFiles"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              ><line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
              /><line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              /></svg>
              添加图片
              <input
                type="file"
                ref="addInput"
                multiple
                accept="image/*"
                class="hidden"
                @change="(e) => addFiles([...e.target.files])"
              >
            </div>
            <button @click="resetAll" class="text-xs text-red-400 hover:text-red-600 px-3">
              清空列表
            </button>
          </div>

          <!-- 列表内容 -->
          <div class="flex-1 overflow-y-auto max-h-[500px] bg-slate-50/30 p-4 space-y-3">
            <div
              v-for="(item, index) in fileList"
              :key="item.id"
              class="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
            >
              <!-- 左侧信息 -->
              <div class="flex items-center gap-4 overflow-hidden">
                <div class="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <img :src="item.preview" class="w-full h-full object-cover">
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-bold text-slate-800 truncate max-w-[150px] md:max-w-[300px]">
                    {{ item.file.name }}
                  </div>
                  <div class="text-xs text-slate-400 flex gap-2">
                    <span>原始: {{ formatSize(item.file.size) }}</span>
                    <span v-if="item.status === 'done' && item.compressedBlob" class="text-teal-600 font-bold">
                      → {{ formatSize(item.compressedBlob.size) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 右侧状态/操作 -->
              <div class="flex items-center gap-4">
                <!-- 状态标签 -->
                <div v-if="item.status === 'processing'" class="text-blue-500">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                </div>
                <div v-else-if="item.status === 'done'" class="text-right">
                  <span class="block text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                    -{{ calculateSaving(item) }}%
                  </span>
                </div>

                <!-- 按钮组 -->
                <div class="flex gap-2">
                  <button v-if="item.status === 'done'" @click="downloadSingle(item)" class="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition">
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
                  </button>
                  <button @click="removeItem(index)" class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    ><line
                      x1="18"
                      y1="6"
                      x2="6"
                      y2="18"
                    /><line
                      x1="6"
                      y1="6"
                      x2="18"
                      y2="18"
                    /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部栏 -->
          <div class="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
            <div class="hidden md:block text-sm text-slate-500">
              节省空间: <span class="font-bold text-emerald-600">{{ formatSize(totalSavedSize) }}</span>
            </div>
            <button
              @click="downloadAll"
              :disabled="isProcessing || !hasDoneItems"
              class="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {{ isProcessing ? '正在压缩...' : '打包下载全部' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import FileUploader from '@/components/FileUploader.vue'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

// ---------------- UI 配置 ----------------
const modes = [
  { key: 'small', label: '缩小优先' },
  { key: 'balance', label: '推荐模式' },
  { key: 'clear', label: '清晰优先' },
  { key: 'custom', label: '自定义' }
]

// ---------------- 响应式状态 ----------------
const currentMode = ref('balance')
const addInput = ref(null)
const fileList = ref([])

// 自定义设置对象
const customSettings = reactive({
  method: 'quality', // 'quality' | 'size'
  quality: 90, // 10-100
  scale: 1, // 1, 0.75, 0.5
  targetKB: 100,
  forceJpeg: false
})

// 计算属性
const isProcessing = computed(() => fileList.value.some(item => item.status === 'processing'))
const hasDoneItems = computed(() => fileList.value.some(item => item.status === 'done'))
const totalSavedSize = computed(() => {
  return fileList.value.reduce((acc, item) => {
    if (item.status === 'done' && item.compressedBlob) {
      return acc + (item.file.size - item.compressedBlob.size)
    }
    return acc
  }, 0)
})

// ---------------- 逻辑方法 ----------------

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const calculateSaving = (item) => {
  if (!item.compressedBlob) return 0
  const saving = ((item.file.size - item.compressedBlob.size) / item.file.size) * 100
  return Math.max(0, saving.toFixed(1))
}

const switchMode = (modeKey) => {
  currentMode.value = modeKey
  // 如果不是自定义模式，立即重新压缩；自定义模式等待用户点确认
  if (modeKey !== 'custom') {
    reCompressAll()
  }
}

const addFiles = (files) => {
  const newItems = files.map(file => ({
    id: Math.random().toString(36).substr(2, 9),
    file,
    preview: URL.createObjectURL(file),
    status: 'pending',
    compressedBlob: null
  }))
  fileList.value.push(...newItems)
  processQueue()
}

const triggerAddFiles = () => addInput.value.click()
const removeItem = (index) => {
  URL.revokeObjectURL(fileList.value[index].preview)
  fileList.value.splice(index, 1)
}
const resetAll = () => {
  fileList.value.forEach(item => URL.revokeObjectURL(item.preview))
  fileList.value = []
}
const reCompressAll = () => {
  fileList.value.forEach(item => item.status = 'pending')
  processQueue()
}

// ---------------- 核心压缩逻辑 ----------------

// 基础压缩函数：给定清晰度和缩放比例
const compressWithQuality = (img, type, quality, scale = 1) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = img.width * scale
    canvas.height = img.height * scale

    ctx.fillStyle = '#FFFFFF' // 白底防黑边
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

// 目标大小压缩函数（二分逼近）
const compressToTargetSize = async (img, originalType, targetKB, forceJpeg) => {
  const targetBytes = targetKB * 1024
  const type = forceJpeg ? 'image/jpeg' : (originalType === 'image/png' ? 'image/jpeg' : originalType) // PNG在指定大小时通常建议转JPG以获得更好压缩比

  let minQ = 0.01
  let maxQ = 1.0
  let resultBlob = null

  // 迭代 6 次，精度已经足够高
  for (let i = 0; i < 6; i++) {
    const midQ = (minQ + maxQ) / 2
    const blob = await compressWithQuality(img, type, midQ, 1)

    if (!blob) break

    resultBlob = blob // 暂存结果

    if (blob.size > targetBytes) {
      maxQ = midQ // 太大了，降低质量
    } else {
      minQ = midQ // 满足要求，尝试提高一点质量看行不行
    }
  }
  return resultBlob
}

// 主处理逻辑
const processQueue = async () => {
  for (const item of fileList.value) {
    if (item.status === 'pending') {
      item.status = 'processing'
      await new Promise(r => requestAnimationFrame(r)) // 让UI刷新

      const img = new Image()
      img.src = item.preview

      await new Promise((resolve) => {
        img.onload = resolve
        img.onerror = () => {
          item.status = 'error'
          resolve()
        }
      })

      if (item.status === 'error') continue

      let blob = null

      // 根据模式选择逻辑
      if (currentMode.value === 'custom') {
        if (customSettings.method === 'quality') {
          // 自定义 - 清晰度模式
          const q = customSettings.quality / 100
          const s = customSettings.scale
          // PNG 如果不转 JPG，quality 参数可能无效，这里简单处理统一转 JPEG 以体现压缩
          // 或者保留原格式
          const type = item.file.type === 'image/png' ? 'image/jpeg' : item.file.type
          blob = await compressWithQuality(img, type, q, s)
        } else {
          // 自定义 - 指定大小模式
          blob = await compressToTargetSize(img, item.file.type, customSettings.targetKB, customSettings.forceJpeg)
        }
      } else {
        // 预设模式
        const settings = {
          small: { q: 0.5, s: 1 },
          balance: { q: 0.75, s: 1 },
          clear: { q: 0.9, s: 1 }
        }
        const { q, s } = settings[currentMode.value]
        const type = item.file.type === 'image/png' ? 'image/jpeg' : item.file.type
        blob = await compressWithQuality(img, type, q, s)
      }

      // 容错：如果压缩失败或比原图大（少见但可能）
      if (blob) {
        // 注：在指定大小模式下，我们通常接受它可能比原图小很多。
        // 在普通模式下，如果压缩后比原图大，通常返回原图。
        // 但为了展示“压缩器”功能，我们通常显示压缩结果，除非用户强制要求。
        item.compressedBlob = blob
        item.status = 'done'
      } else {
        item.status = 'error'
      }
    }
  }
}

// ---------------- 下载逻辑 ----------------
const downloadSingle = (item) => {
  saveAs(item.compressedBlob, `min_${item.file.name}`)
}

const downloadAll = async () => {
  const zip = new JSZip()
  const folder = zip.folder('compressed_images')
  fileList.value.forEach(item => {
    if (item.status === 'done' && item.compressedBlob) {
      folder.file(`min_${item.file.name}`, item.compressedBlob)
    }
  })
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `images_archive_${Date.now()}.zip`)
}
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
</style>
