<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-fuchsia-100">
    <!-- ================= 背景特效 (声波紫) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-fuchsia-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-violet-600">音频提取与转换</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          视频转音频，或音频格式互转。基于 FFmpeg 核心，支持 MP3, AAC, WAV, OGG 等常见格式，纯本地极速处理。
        </p>

        <!-- 引擎状态 -->
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
            音频引擎初始化中...
          </div>
          <div v-else class="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
            <div class="i-tabler-music" />
            Audio Engine Ready
          </div>
        </div>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：操作区 -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col min-h-[400px]">
            <!-- 上传区 -->
            <div v-if="!inputFile" class="flex-1 flex flex-col items-center justify-center">
              <div
                class="w-full h-64 relative group rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center transition-all cursor-pointer"
                :class="{'border-fuchsia-400 bg-fuchsia-50/30': isDragging}"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerUpload"
              >
                <div class="text-center p-8">
                  <div class="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl mx-auto mb-4 text-slate-300 group-hover:text-fuchsia-500 transition-colors group-hover:scale-110 duration-300">
                    🎵
                  </div>
                  <h3 class="font-bold text-slate-700 text-lg mb-1">
                    点击或拖拽文件
                  </h3>
                  <p class="text-slate-500 text-xs mt-2">
                    支持视频 (MP4, MOV...) 或音频 (WAV, M4A...)
                  </p>
                </div>
              </div>
              <input
                type="file"
                ref="fileInput"
                accept="video/*, audio/*"
                class="hidden"
                @change="handleFileChange"
              >
            </div>

            <!-- 配置区 -->
            <div v-else class="space-y-6">
              <!-- 文件信息卡片 -->
              <div class="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div class="w-12 h-12 bg-fuchsia-100 text-fuchsia-600 rounded-xl flex items-center justify-center text-2xl">
                  {{ isVideo ? '🎬' : '🎧' }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-bold text-slate-700 truncate">
                    {{ inputFile.name }}
                  </div>
                  <div class="text-xs text-slate-500">
                    {{ formatSize(inputFile.size) }}
                  </div>
                </div>
                <button
                  @click="reset"
                  class="p-[2px_8px] text-slate-400 hover:text-red-500 transition-colors"
                  title="移除文件"
                >
                  x
                </button>
              </div>

              <div class="w-full h-px bg-slate-100" />

              <!-- 转换选项 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <label class="block text-xs font-bold text-slate-500 mb-2 uppercase">目标格式</label>
                  <select v-model="settings.format" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg p-2.5 focus:border-fuchsia-500 focus:outline-none font-bold">
                    <option value="mp3">
                      MP3 (最通用)
                    </option>
                    <option value="aac">
                      AAC (高压缩)
                    </option>
                    <option value="wav">
                      WAV (无损)
                    </option>
                    <option value="ogg">
                      OGG (Web通用)
                    </option>
                  </select>
                </div>

                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <label class="block text-xs font-bold text-slate-500 mb-2 uppercase">音频质量 (Bitrate)</label>
                  <select v-model="settings.bitrate" :disabled="settings.format === 'wav'" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg p-2.5 focus:border-fuchsia-500 focus:outline-none disabled:opacity-50">
                    <option value="128k">
                      128 kbps (标准)
                    </option>
                    <option value="192k">
                      192 kbps (高音质)
                    </option>
                    <option value="320k">
                      320 kbps (极高)
                    </option>
                  </select>
                  <div v-if="settings.format === 'wav'" class="text-[10px] text-fuchsia-500 mt-1">
                    WAV 为无损格式，无需设置比特率
                  </div>
                </div>
              </div>

              <!-- 转换按钮 -->
              <button
                @click="convert"
                :disabled="isProcessing || !ffmpegLoaded"
                class="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
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
                  转换中... {{ progress }}%
                </span>
                <span v-else class="flex items-center gap-2">
                  <div class="i-tabler-wand text-xl" />
                  开始转换
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：输出结果 -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 flex-1 flex flex-col min-h-[300px]">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <span class="w-1.5 h-6 bg-violet-500 rounded-full" />
              输出结果
            </h2>

            <div class="flex-1 flex flex-col gap-4">
              <!-- 成功状态 -->
              <div v-if="outputUrl" class="animate-fade-in space-y-4">
                <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-white shadow-lg">
                  <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-500 to-violet-500 flex items-center justify-center shadow-inner">
                    <div class="i-tabler-music text-3xl animate-bounce" />
                  </div>
                  <div class="text-center">
                    <div class="font-bold text-lg">
                      转换成功
                    </div>
                    <div class="text-slate-400 text-sm font-mono mt-1">
                      output.{{ settings.format }}
                    </div>
                  </div>

                  <!-- 音频播放器 (必须加 :key 防止缓存) -->
                  <audio
                    :src="outputUrl"
                    :key="outputUrl"
                    controls
                    class="w-full h-8 mt-2 mix-blend-screen opacity-90"
                  />
                </div>

                <a
                  :href="outputUrl"
                  :download="`converted_audio.${settings.format}`"
                  class="w-full py-3 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <div class="i-tabler-download" />
                  下载音频 ({{ outputSize }})
                </a>
              </div>

              <!-- 等待状态 -->
              <div v-else class="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8">
                <div class="text-4xl mb-2 opacity-30">
                  🎧
                </div>
                <p class="text-sm">
                  提取后的音频将在此显示
                </p>
              </div>
            </div>

            <!-- 日志窗口 -->
            <div class="mt-6 bg-black/90 rounded-xl p-4 h-32 overflow-y-auto custom-scrollbar font-mono text-xs text-fuchsia-300">
              <div v-if="logs.length === 0" class="text-slate-500 italic">
                >> Ready to process...
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
import { ref, reactive, computed, onMounted } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// ---------------- State ----------------
const ffmpegLoaded = ref(false)
const isProcessing = ref(false)
const progress = ref(0)
const logs = ref([])

const inputFile = ref(null)
const outputUrl = ref('')
const outputSize = ref('')
const fileInput = ref(null)
const isDragging = ref(false)

const settings = reactive({
  format: 'mp3',
  bitrate: '192k'
})

let ffmpeg = null

// ---------------- Logic: Load FFmpeg ----------------
// 复用 VideoToGif 的加载逻辑 (CDN 单线程版)
const loadFFmpeg = async () => {
  if (ffmpeg) return
  try {
    logs.value.push('>> 初始化音频引擎 (Single Threaded)...')
    ffmpeg = new FFmpeg()

    ffmpeg.on('log', ({ message }) => {
      if (!message.includes('frame=') && !message.includes('size=')) {
        if (logs.value.length > 50) logs.value.shift()
        logs.value.push(message)
      }
    })
    ffmpeg.on('progress', ({ progress: p }) => progress.value = Math.round(p * 100))

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    })

    ffmpegLoaded.value = true
    logs.value.push('>> 引擎加载完成！')
  } catch (error) {
    console.error(error)
    logs.value.push(`!! 加载失败: ${error.message}`)
  }
}

// ---------------- Logic: Interaction ----------------
const triggerUpload = () => fileInput.value.click()
const handleFileChange = (e) => loadFile(e.target.files[0])
const handleDrop = (e) => {
  isDragging.value = false
  loadFile(e.dataTransfer.files[0])
}

const loadFile = (file) => {
  if (!file) return
  inputFile.value = file
  outputUrl.value = ''
  logs.value.push(`>> 已加载文件: ${file.name}`)
}

const reset = () => {
  inputFile.value = null
  outputUrl.value = ''
  fileInput.value.value = '' // 清空 input 防止同文件不触发
}

// ---------------- Logic: Convert ----------------
const convert = async () => {
  if (!inputFile.value || !ffmpegLoaded.value) return
  isProcessing.value = true
  progress.value = 0
  outputUrl.value = ''

  try {
    const ext = inputFile.value.name.split('.').pop()
    const inputName = `input.${ext}`
    const outputName = `output.${settings.format}`

    // 1. 写入文件
    logs.value.push('>> 正在读取文件...')
    await ffmpeg.writeFile(inputName, await fetchFile(inputFile.value))

    // 2. 构建参数
    // -vn: 禁用视频流 (仅提取音频)
    // -acodec / -c:a : 指定音频编码器
    // -b:a : 比特率
    const args = ['-i', inputName, '-vn']

    if (settings.format === 'mp3') {
      // libmp3lame 是最通用的 MP3 编码器
      args.push('-c:a', 'libmp3lame', '-b:a', settings.bitrate)
    } else if (settings.format === 'aac') {
      args.push('-c:a', 'aac', '-b:a', settings.bitrate)
    } else if (settings.format === 'ogg') {
      args.push('-c:a', 'libvorbis', '-b:a', settings.bitrate)
    } else if (settings.format === 'wav') {
      // pcm_s16le 是标准的 CD 级无损编码
      args.push('-c:a', 'pcm_s16le')
    }

    args.push(outputName)

    logs.value.push(`>> 执行转换: ffmpeg ${args.join(' ')}`)

    // 3. 执行
    await ffmpeg.exec(args)

    // 4. 读取
    logs.value.push('>> 打包输出文件...')
    const data = await ffmpeg.readFile(outputName)
    const blob = new Blob([data.buffer], { type: `audio/${settings.format}` })

    outputUrl.value = URL.createObjectURL(blob)
    outputSize.value = formatSize(blob.size)
    logs.value.push('>> 转换成功！')
  } catch (error) {
    console.error(error)
    logs.value.push(`!! 转换错误: ${error.message}`)
    alert('转换失败，请检查日志。')
  } finally {
    isProcessing.value = false
  }
}

// ---------------- Utils ----------------
const isVideo = computed(() => inputFile.value?.type.startsWith('video/'))

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

onMounted(() => {
  loadFFmpeg()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 2px; background: #555555; }
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
