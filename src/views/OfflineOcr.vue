<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-indigo-100">
    <!-- ================= 背景特效 (智慧/扫描) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-sky-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">本地 OCR 文字识别</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          基于 Tesseract.js (WASM)。在浏览器本地提取图片文字，文档绝不上传云端，隐私绝对安全。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：上传与预览 -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col h-full min-h-[500px]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-indigo-500 rounded-full" />
                扫描原件
              </h2>

              <!-- 语言选择 -->
              <div class="relative group">
                <select
                  v-model="language"
                  :disabled="isProcessing"
                  class="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:border-indigo-500 hover:border-indigo-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <option value="eng">
                    英语 (English)
                  </option>
                  <option value="chi_sim">
                    简体中文
                  </option>
                  <option value="chi_tra">
                    繁体中文
                  </option>
                  <option value="jpn">
                    日语 (Japanese)
                  </option>
                  <option value="chi_sim+eng">
                    中英混合
                  </option>
                </select>
                <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  ><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>
            </div>

            <!-- 上传/预览区 -->
            <div
              class="relative flex-1 rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center transition-all group"
              :class="{'border-indigo-400 bg-indigo-50/30': isDragging, 'cursor-pointer': !imageUrl}"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="!imageUrl && triggerUpload()"
            >
              <!-- 扫描线动画 (处理中显示) -->
              <div v-if="isProcessing" class="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <div class="w-full h-1 bg-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.8)] absolute top-0 animate-scan" />
                <div class="absolute inset-0 bg-indigo-500/10" />
              </div>

              <!-- 图片预览 -->
              <img v-if="imageUrl" :src="imageUrl" class="max-w-full max-h-[500px] object-contain z-10 relative">

              <!-- 上传提示 -->
              <div v-else class="text-center p-8">
                <div class="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl mx-auto mb-4 text-slate-300 group-hover:text-indigo-500 transition-colors group-hover:scale-110 duration-300">
                  👁️
                </div>
                <h3 class="font-bold text-slate-700 text-lg mb-1">
                  点击或拖拽图片
                </h3>
                <p class="text-slate-500 text-xs mt-2">
                  支持 PNG, JPG, BMP <br> 首次加载模型可能较慢
                </p>
              </div>

              <!-- 重新上传浮层 -->
              <div v-if="imageUrl && !isProcessing" class="absolute inset-0 z-30 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <button @click="triggerUpload" class="bg-white/20 backdrop-blur border border-white/50 text-white px-4 py-2 rounded-full font-bold pointer-events-auto hover:bg-white/30 transition-colors">
                  更换图片
                </button>
              </div>
            </div>

            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              class="hidden"
              @change="handleFileChange"
            >

            <!-- 进度条 -->
            <div v-if="isProcessing" class="mt-4">
              <div class="flex justify-between text-xs text-indigo-600 font-bold mb-1">
                <span>{{ statusText }}</span>
                <span>{{ (progress * 100).toFixed(0) }}%</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div class="bg-indigo-500 h-full transition-all duration-300" :style="{ width: `${progress * 100}%` }" />
              </div>
            </div>

            <button
              v-if="imageUrl && !isProcessing"
              @click="recognize"
              class="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              开始识别
            </button>
          </div>
        </div>

        <!-- 右侧：识别结果 -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col h-full min-h-[500px]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-blue-500 rounded-full" />
                识别结果
              </h2>
              <div class="flex gap-2">
                <button
                  v-if="resultText"
                  @click="copyResult"
                  class="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                >
                  <div v-if="copied" class="i-tabler-check text-green-500" />
                  <div v-else class="i-tabler-copy" />
                  {{ copied ? '已复制' : '复制' }}
                </button>
                <button
                  v-if="resultText"
                  @click="downloadTxt"
                  class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <div class="i-tabler-download" />
                  下载 .txt
                </button>
              </div>
            </div>

            <!-- 结果编辑区 -->
            <div class="relative flex-[1_0] group">
              <textarea
                v-model="resultText"
                class="w-full h-full min-h-400px bg-white border border-slate-200 rounded-2xl p-6 text-slate-700 text-sm leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none custom-scrollbar shadow-inner"
                placeholder="识别后的文字将显示在这里..."
              />

              <!-- 占位图 -->
              <div v-if="!resultText && !isProcessing" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <div class="text-center">
                  <div class="text-6xl mb-2">
                    📝
                  </div>
                  <div class="text-slate-400 text-sm">
                    等待识别...
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部提示 -->
            <div class="mt-4 text-xs text-slate-400 flex items-center gap-1">
              <div class="i-tabler-shield-check text-emerald-500" />
              <span>隐私保护：识别过程完全在您的浏览器本地完成，图片与文字不会上传服务器。</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { createWorker } from 'tesseract.js'

// ---------------- State ----------------
const imageUrl = ref('')
const fileInput = ref(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const progress = ref(0)
const statusText = ref('准备就绪')
const resultText = ref('')
const language = ref('chi_sim+eng') // 默认中英混合
const copied = ref(false)

let worker = null

// ---------------- Handlers ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) loadFile(file)
  e.target.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  loadFile(e.dataTransfer.files[0])
}

const loadFile = (file) => {
  if (!file.type.match('image.*')) {
    alert('请上传图片文件')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    resultText.value = ''
    progress.value = 0
    statusText.value = '准备就绪'
  }
  reader.readAsDataURL(file)
}

// ---------------- Core Logic: OCR ----------------
const recognize = async () => {
  if (!imageUrl.value) return
  if (isProcessing.value) return

  isProcessing.value = true
  resultText.value = ''
  progress.value = 0

  try {
    // 1. 创建 Worker
    statusText.value = '正在加载识别引擎...'

    // Tesseract.js v5 写法
    worker = await createWorker(language.value, 1, {
      logger: m => {
        // m.status: "loading tesseract core", "recognizing text", etc.
        // m.progress: 0 - 1
        if (m.status === 'recognizing text') {
          statusText.value = '正在识别文字...'
          progress.value = m.progress
        } else if (m.status.includes('loading')) {
          statusText.value = '加载语言模型 (首次较慢)...'
          // 模拟加载进度 (语言包下载无法精确获取进度)
          if (progress.value < 0.5) progress.value += 0.05
        }
      }
    })

    // 2. 执行识别
    statusText.value = '分析图像中...'
    const { data: { text } } = await worker.recognize(imageUrl.value)

    resultText.value = text
    statusText.value = '识别完成'
    progress.value = 1

    // 3. 清理 Worker (为了节省内存，每次识别完销毁，或者保留实例)
    // 这里选择销毁，防止语言包切换时逻辑复杂
    await worker.terminate()
    worker = null
  } catch (err) {
    console.error(err)
    statusText.value = '识别出错'
    alert('识别失败，请重试或检查网络 (首次需要下载语言包)')
  } finally {
    isProcessing.value = false
  }
}

// ---------------- Actions ----------------
const copyResult = async () => {
  await navigator.clipboard.writeText(resultText.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const downloadTxt = () => {
  const blob = new Blob([resultText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ocr_result.txt'
  a.click()
  URL.revokeObjectURL(url)
}

onUnmounted(async () => {
  if (worker) {
    await worker.terminate()
  }
})

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 3px; background: #cbd5e1; } /* slate-300 */

@keyframes scan {
  0% { top: 0%; opacity: 1; }
  50% { opacity: 0.8; }
  100% { top: 100%; opacity: 0; }
}
.animate-scan {
  animation: scan 2s linear infinite;
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
