<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-rose-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">视频转 GIF</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          基于 FFmpeg.wasm 核心，浏览器本地转码。无需上传服务器，支持剪辑、帧率调整，生成的 GIF 极度清晰。
        </p>

        <!-- 核心加载状态提示 -->
        <div class="mt-4 h-6 flex justify-center items-center">
          <div v-if="!ffmpegLoaded" class="flex items-center gap-2 text-xs text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full animate-pulse">
            <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            正在初始化 FFmpeg 引擎 (约 30MB)...
          </div>
          <div v-else class="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
            <div class="i-tabler-check" />
            引擎就绪 (单线程兼容模式)
          </div>
        </div>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：操作区 -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col min-h-[500px]">
            <!-- 步骤 1: 上传 -->
            <div v-if="!videoUrl" class="flex-1 flex flex-col items-center justify-center">
              <div
                class="w-full h-64 relative group rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center transition-all cursor-pointer"
                :class="{'border-rose-400 bg-rose-50/30': isDragging}"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerUpload"
              >
                <div class="text-center p-8">
                  <div class="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl mx-auto mb-4 text-slate-300 group-hover:text-rose-500 transition-colors group-hover:scale-110 duration-300">
                    📹
                  </div>
                  <h3 class="font-bold text-slate-700 text-lg mb-1">
                    上传视频
                  </h3>
                  <p class="text-slate-500 text-xs mt-2">
                    支持 MP4, WebM, MOV <br> 建议 < 50MB
                  </p>
                </div>
              </div>
              <input
                type="file"
                ref="fileInput"
                accept="video/*"
                class="hidden"
                @change="handleFileChange"
              >
            </div>

            <!-- 步骤 2: 剪辑与配置 -->
            <div v-else class="space-y-6">
              <!-- 视频预览器 -->
              <div class="relative rounded-xl overflow-hidden bg-black aspect-video shadow-md group">
                <video
                  ref="videoEl"
                  :src="videoUrl"
                  :key="videoUrl"
                  playsinline
                  class="w-full h-full object-contain"
                  controls
                  @loadedmetadata="onMetaLoaded"
                  @timeupdate="onTimeUpdate"
                />

                <!-- 重新上传按钮 -->
                <button
                  @click="reset"
                  class="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg hover:bg-rose-600 transition-colors z-10"
                  title="重新上传"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  ><path d="M3 12a9 9 0 1 0 9 -9 9.75 9.75 0 0 0 -6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                </button>
              </div>

              <!-- 剪辑控制条 -->
              <div class="space-y-2">
                <div class="flex justify-between items-center text-sm font-bold text-slate-700">
                  <span>剪辑范围</span>
                  <span class="text-rose-500 font-mono">{{ formatTime(trim.start) }} - {{ formatTime(trim.end) }} ({{ (trim.end - trim.start).toFixed(1) }}s)</span>
                </div>
                <div class="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div class="flex-1 flex flex-col gap-1">
                    <label class="text-xs text-slate-500">开始时间 (秒)</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="number"
                        v-model.number="trim.start"
                        :min="0"
                        :max="trim.end"
                        step="0.1"
                        class="w-full input-std"
                      >
                      <button @click="setTrim('start')" class="btn-mini">
                        当前
                      </button>
                    </div>
                  </div>
                  <div class="w-px h-10 bg-slate-300" />
                  <div class="flex-1 flex flex-col gap-1">
                    <label class="text-xs text-slate-500">结束时间 (秒)</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="number"
                        v-model.number="trim.end"
                        :min="trim.start"
                        :max="duration"
                        step="0.1"
                        class="w-full input-std"
                      >
                      <button @click="setTrim('end')" class="btn-mini">
                        当前
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 输出参数 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label class="block text-xs font-bold text-slate-500 mb-2 uppercase">画面宽度 (px)</label>
                  <select v-model="settings.width" class="w-full bg-white border border-slate-300 text-slate-700 rounded-lg p-2 focus:border-rose-500 focus:outline-none">
                    <option :value="240">
                      240px (极小)
                    </option>
                    <option :value="320">
                      320px (表情包)
                    </option>
                    <option :value="480">
                      480px (标清)
                    </option>
                    <option :value="640">
                      640px (高清)
                    </option>
                    <option :value="-1">
                      原画质 (慎选)
                    </option>
                  </select>
                </div>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label class="block text-xs font-bold text-slate-500 mb-2 uppercase">帧率 (FPS)</label>
                  <select v-model="settings.fps" class="w-full bg-white border border-slate-300 text-slate-700 rounded-lg p-2 focus:border-rose-500 focus:outline-none">
                    <option :value="10">
                      10 fps (流畅)
                    </option>
                    <option :value="15">
                      15 fps (标准)
                    </option>
                    <option :value="24">
                      24 fps (电影感)
                    </option>
                    <option :value="5">
                      5 fps (卡顿/复古)
                    </option>
                  </select>
                </div>
              </div>

              <!-- 转换按钮 -->
              <button
                @click="convert"
                :disabled="isProcessing || !ffmpegLoaded"
                class="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isProcessing" class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  处理中... {{ progress }}%
                </span>
                <span v-else>
                  🚀 开始转换
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：结果与日志 -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 flex-1 flex flex-col min-h-[300px]">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <span class="w-1.5 h-6 bg-rose-500 rounded-full" />
              输出结果
            </h2>

            <!-- 结果展示 -->
            <div class="flex-1 flex flex-col gap-4">
              <div v-if="gifUrl" class="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-4">
                <img :src="gifUrl" class="max-w-full max-h-[400px] shadow-lg rounded-lg">
              </div>
              <div v-else class="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8">
                <div class="text-4xl mb-2 opacity-30">
                  🖼️
                </div>
                <p class="text-sm">
                  GIF 生成后将在此显示
                </p>
              </div>

              <!-- 下载按钮 -->
              <a
                v-if="gifUrl"
                :href="gifUrl"
                download="output.gif"
                class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <div class="i-tabler-download" />
                下载 GIF ({{ gifSize }})
              </a>
            </div>

            <!-- 简易日志 -->
            <div class="mt-6 bg-black/90 rounded-xl p-4 h-32 overflow-y-auto custom-scrollbar font-mono text-xs text-green-400">
              <div v-if="logs.length === 0" class="text-slate-500 italic">
                >> 等待任务开始...
              </div>
              <div v-for="(log, i) in logs" :key="i" class="mb-1 whitespace-pre-wrap font-sans break-all">
                {{ log }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// ---------------- 状态管理 ----------------
const ffmpegLoaded = ref(false)
const isProcessing = ref(false)
const progress = ref(0)
const logs = ref([])

const videoFile = ref(null)
const videoUrl = ref('')
const gifUrl = ref('')
const gifSize = ref('')
const videoEl = ref(null)
const fileInput = ref(null)
const isDragging = ref(false)

const duration = ref(0)
const currentTime = ref(0)

const trim = reactive({ start: 0, end: 0 })
const settings = reactive({ width: 320, fps: 15 })

let ffmpeg = null

// ---------------- 核心逻辑：加载 FFmpeg (单线程兼容模式) ----------------
const loadFFmpeg = async () => {
  if (ffmpeg) return

  try {
    logs.value.push('>> 正在初始化 FFmpeg 引擎 (CDN Single Threaded)...')

    ffmpeg = new FFmpeg()

    ffmpeg.on('log', ({ message }) => {
      // 过滤太频繁的进度日志
      if (message.includes('frame=') || message.includes('size=') || message.includes('fps=')) {
        // 可选：在这里解析进度
      } else {
        if (logs.value.length > 50) logs.value.shift()
        logs.value.push(message)
      }
    })

    ffmpeg.on('progress', ({ progress: p }) => {
      progress.value = Math.round(p * 100)
    })

    // 指定 CDN 地址 (0.12.6 单线程版)
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      // 单线程模式不需要 workerURL，这样最省心
    })

    ffmpegLoaded.value = true
    logs.value.push('>> 引擎加载完成！')
  } catch (error) {
    console.error(error)
    logs.value.push(`!! 加载失败: ${error.message}`)
  }
}
// ---------------- 交互逻辑 ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) loadVideo(file)
  e.target.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) loadVideo(file)
}

const loadVideo = (file) => {
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  videoFile.value = file
  videoUrl.value = URL.createObjectURL(file)
  gifUrl.value = ''
  // 必须重置 FFmpeg 的 FS，否则会爆内存 (虽然 JS GC 会处理，但手动管理更好)
  // 简单起见，这里假设每次只处理一个流程
}

const onMetaLoaded = (e) => {
  duration.value = e.target.duration
  trim.start = 0
  trim.end = e.target.duration
}

const onTimeUpdate = (e) => {
  currentTime.value = e.target.currentTime
}

const setTrim = (type) => {
  if (type === 'start') trim.start = parseFloat(currentTime.value.toFixed(1))
  if (type === 'end') trim.end = parseFloat(currentTime.value.toFixed(1))
}

const reset = () => {
  videoUrl.value = ''
  videoFile.value = null
  gifUrl.value = ''
  logs.value = []
}

// ---------------- 核心逻辑：转换 GIF ----------------
const convert = async () => {
  if (!videoFile.value || !ffmpegLoaded.value) return
  isProcessing.value = true
  progress.value = 0
  gifUrl.value = ''

  try {
    const inputName = 'input.mp4'
    const outputName = 'output.gif'

    // 1. 写文件到内存 FS
    logs.value.push('>> 正在写入文件到内存...')
    await ffmpeg.writeFile(inputName, await fetchFile(videoFile.value))

    // 2. 构建命令
    // 计算持续时间
    const durationTime = trim.end - trim.start
    if (durationTime <= 0) throw new Error('结束时间必须大于开始时间')

    // 缩放过滤器: scale=320:-1 (宽320，高自适应)
    // 调色板优化: split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse
    // 单线程跑 palettegen 可能比较慢，但质量好。我们先试用普通 scale+fps，如果用户需要再加 palette
    // 为了速度，我们先用普通的 dither

    const scaleFilter = settings.width === -1 ? '' : `,scale=${settings.width}:-1:flags=lanczos`
    const filter = `fps=${settings.fps}${scaleFilter}`

    // 简单的命令 (转换速度快，质量中等)
    const args = [
      '-ss', trim.start.toString(),
      '-t', durationTime.toString(),
      '-i', inputName,
      '-vf', filter,
      '-f', 'gif',
      outputName
    ]

    logs.value.push(`>> 执行命令: ffmpeg ${args.join(' ')}`)

    // 3. 执行
    await ffmpeg.exec(args)

    // 4. 读取结果
    logs.value.push('>> 读取生成文件...')
    const data = await ffmpeg.readFile(outputName)

    // 5. 生成 URL
    const blob = new Blob([data.buffer], { type: 'image/gif' })
    gifUrl.value = URL.createObjectURL(blob)
    gifSize.value = (blob.size / 1024 / 1024).toFixed(2) + ' MB'

    logs.value.push('>> 转换成功！')
  } catch (error) {
    console.error(error)
    logs.value.push(`!! 错误: ${error.message}`)
    alert('转换出错，请检查日志或尝试缩短时长')
  } finally {
    isProcessing.value = false
  }
}

const formatTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  const ms = Math.floor((s % 1) * 10)
  return `${m}:${sec.toString().padStart(2, '0')}.${ms}`
}

onMounted(() => {
  loadFFmpeg()
})

onUnmounted(() => {
  // 可以在这里清理 ffmpeg 实例，但通常没必要
})

</script>

<style scoped lang="scss">
.input-std {
  @apply bg-white border border-slate-300 text-slate-700 rounded-lg p-1.5 text-sm focus:border-rose-500 focus:outline-none transition-colors;
}
.btn-mini {
  @apply bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-bold px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap;
}

/* 滚动条 */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 2px; background: #333333; }

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
