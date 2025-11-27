<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-rose-100">
    <!-- ================= 背景特效 (Rose Theme) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-rose-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-rose-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">音频波形剪辑</span>
        </h1>
        <p class="text-slate-600 max-w-2xl">
          可视化裁剪 MP3/WAV/OGG。支持波形预览、精准选取、淡入淡出，本地无损导出。
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- 左侧：波形操作区 (占 8 列) -->
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 min-h-[500px] flex flex-col transition-all relative">
            <!-- 加载遮罩 -->
            <div v-if="isProcessing" class="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-600 mb-4" />
              <p class="text-rose-600 font-medium animate-pulse">
                {{ progressText }}
              </p>
            </div>

            <!-- 未上传状态 -->
            <div v-if="!file" class="flex-1 flex flex-col justify-center">
              <FileUploader
                accept="audio/*"
                hint="支持 MP3, WAV, OGG, AAC, M4A"
                @files-selected="handleFileSelect"
              />
            </div>

            <!-- 已上传：波形编辑器 -->
            <div v-else class="w-full h-full flex flex-col">
              <!-- 顶部控制栏 -->
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-3">
                  <button
                    @click="togglePlay"
                    class="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 hover:bg-rose-600 hover:scale-105 transition-all"
                  >
                    <svg
                      v-if="!isPlaying"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    ><path d="M8 5v14l11-7z" /></svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    ><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  </button>
                  <div class="text-sm font-mono text-slate-600">
                    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                  </div>
                </div>

                <button @click="resetFile" class="text-sm text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors px-3 py-2 rounded-lg hover:bg-rose-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  ><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  重选文件
                </button>
              </div>

              <!-- Waveform 容器 -->
              <div class="relative flex-1 bg-rose-50/50 rounded-xl border border-rose-100 flex flex-col justify-center p-4 min-h-[200px]">
                <div ref="waveformRef" class="w-full" />
                <!-- 缩放滑块 -->
                <div class="mt-4 flex items-center gap-2 px-2">
                  <span class="text-xs text-slate-400">➖</span>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    v-model="zoomLevel"
                    @input="onZoomChange"
                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  >
                  <span class="text-xs text-slate-400">➕</span>
                </div>
              </div>

              <!-- 选中区间信息 -->
              <div class="mt-6 grid grid-cols-2 gap-4">
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <div class="text-xs text-slate-400 mb-1">
                    开始时间
                  </div>
                  <div class="text-lg font-mono font-bold text-slate-700">
                    {{ formatTime(trimStart) }}
                  </div>
                </div>
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <div class="text-xs text-slate-400 mb-1">
                    结束时间
                  </div>
                  <div class="text-lg font-mono font-bold text-slate-700">
                    {{ formatTime(trimEnd) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：导出设置 (占 4 列) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sticky top-8">
            <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span class="w-1 h-6 bg-rose-500 rounded-full" />
              剪辑设置
            </h2>

            <div class="space-y-6">
              <!-- 淡入淡出设置 -->
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-1">
                    <label class="text-sm font-medium text-slate-700">淡入时长 (Fade In)</label>
                    <span class="text-xs font-mono bg-rose-50 text-rose-600 px-1.5 rounded">{{ fadeDurationIn }}s</span>
                  </div>
                  <input
                    type="range"
                    v-model.number="fadeDurationIn"
                    min="0"
                    max="5"
                    step="0.5"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  >
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <label class="text-sm font-medium text-slate-700">淡出时长 (Fade Out)</label>
                    <span class="text-xs font-mono bg-rose-50 text-rose-600 px-1.5 rounded">{{ fadeDurationOut }}s</span>
                  </div>
                  <input
                    type="range"
                    v-model.number="fadeDurationOut"
                    min="0"
                    max="5"
                    step="0.5"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  >
                </div>
              </div>

              <!-- 格式选择 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">导出格式</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="fmt in ['mp3', 'wav', 'm4a']"
                    :key="fmt"
                    @click="targetFormat = fmt"
                    class="px-2 py-2 rounded-lg text-sm font-medium border transition-all uppercase"
                    :class="targetFormat === fmt ? 'bg-rose-100 border-rose-500 text-rose-700' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'"
                  >
                    {{ fmt }}
                  </button>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100">
                <button
                  @click="processAudio"
                  :disabled="!file || isProcessing"
                  class="w-full py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {{ isFFmpegLoaded ? '导出剪辑音频' : '初始化并导出' }}
                </button>
              </div>
            </div>

            <!-- Logs -->
            <div v-if="logs.length > 0" class="mt-4 p-3 bg-slate-900 rounded-xl overflow-hidden">
              <div class="text-xs text-slate-400 font-mono mb-1 border-b border-slate-700 pb-1">
                系统日志
              </div>
              <div class="h-24 overflow-y-auto text-[10px] font-mono text-green-400 space-y-1 scrollbar-thin">
                <div v-for="(log, i) in logs" :key="i">
                  > {{ log }}
                </div>
              </div>
            </div>
          </div>

          <!-- 小贴士 -->
          <div class="bg-rose-50/80 backdrop-blur rounded-2xl p-5 border border-rose-100 text-sm text-rose-800 leading-relaxed">
            <strong>🎵 剪辑技巧：</strong><br>
            拖拽波形上的红色选区来调整开始和结束点。使用淡入淡出可以让铃声过渡更自然。所有处理均在本地浏览器完成，隐私安全。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import FileUploader from '@/components/FileUploader.vue'
import { saveAs } from 'file-saver'

// Wavesurfer & Plugins
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

// FFmpeg
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'

// State
const file = ref(null)
const isProcessing = ref(false)
const progressText = ref('')
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const zoomLevel = ref(10)

// Trimming State
const trimStart = ref(0)
const trimEnd = ref(0)
const fadeDurationIn = ref(0)
const fadeDurationOut = ref(0)
const targetFormat = ref('mp3')

// Refs
const waveformRef = ref(null)
let wavesurfer = null
let regionsPlugin = null

// FFmpeg State
const ffmpeg = new FFmpeg()
const isFFmpegLoaded = ref(false)
const logs = ref([])

// ================= FFmpeg Core Logic (Single Threaded) =================
const loadFFmpeg = async () => {
  if (isFFmpegLoaded.value) return true

  try {
    progressText.value = '正在加载 FFmpeg 引擎...'
    logs.value.push('Loading FFmpeg core...')

    // 单线程版 CDN 配置 (0.12.6)
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'

    ffmpeg.on('log', ({ message }) => {
      logs.value.push(message)
    })

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      // Single-threaded mode: no workerURL
    })

    isFFmpegLoaded.value = true
    logs.value.push('FFmpeg loaded successfully.')
    return true
  } catch (error) {
    console.error(error)
    logs.value.push(`Error: ${error.message}`)
    alert('FFmpeg 加载失败，请检查网络连接。')
    return false
  }
}

// ================= Wavesurfer Logic =================
const initWavesurfer = (blob) => {
  if (wavesurfer) wavesurfer.destroy()

  // 创建实例
  wavesurfer = WaveSurfer.create({
    container: waveformRef.value,
    waveColor: '#fda4af', // rose-300
    progressColor: '#e11d48', // rose-600
    cursorColor: '#881337',
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    height: 128,
    normalize: true,
    minPxPerSec: zoomLevel.value
  })

  // 注册区域插件
  regionsPlugin = wavesurfer.registerPlugin(RegionsPlugin.create())

  // 加载音频
  const url = URL.createObjectURL(blob)
  wavesurfer.load(url)

  // 事件监听
  wavesurfer.on('ready', () => {
    duration.value = wavesurfer.getDuration()
    trimEnd.value = duration.value

    // 添加初始选中区域 (中间 80%)
    const start = duration.value * 0.1
    const end = duration.value * 0.9

    regionsPlugin.addRegion({
      start,
      end,
      content: '裁剪区域',
      color: 'rgba(225, 29, 72, 0.2)', // rose-600 with opacity
      drag: true,
      resize: true
    })

    updateTrimState(start, end)
  })

  wavesurfer.on('timeupdate', (time) => {
    currentTime.value = time
  })

  wavesurfer.on('finish', () => {
    isPlaying.value = false
  })

  // 区域更新事件
  regionsPlugin.on('region-updated', (region) => {
    updateTrimState(region.start, region.end)
  })

  // 点击区域播放该区域
  regionsPlugin.on('region-clicked', (region, e) => {
    e.stopPropagation()
    region.play()
    isPlaying.value = true
  })
}

const updateTrimState = (start, end) => {
  trimStart.value = start
  trimEnd.value = end
  // 限制淡入淡出时间不能超过剪辑时长的一半
  const clipDuration = end - start
  if (fadeDurationIn.value > clipDuration / 2) fadeDurationIn.value = 0
  if (fadeDurationOut.value > clipDuration / 2) fadeDurationOut.value = 0
}

// ================= Handlers =================
const handleFileSelect = (files) => {
  if (files && files[0]) {
    file.value = files[0]
    // 等待 DOM 渲染 waveform 容器
    nextTick(() => {
      initWavesurfer(file.value)
    })
  }
}

const resetFile = () => {
  if (wavesurfer) wavesurfer.destroy()
  file.value = null
  isPlaying.value = false
  currentTime.value = 0
  logs.value = []
}

const togglePlay = () => {
  if (!wavesurfer) return
  wavesurfer.playPause()
  isPlaying.value = wavesurfer.isPlaying()
}

const onZoomChange = () => {
  if (wavesurfer) {
    wavesurfer.zoom(Number(zoomLevel.value))
  }
}

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 10)
  return `${m}:${s.toString().padStart(2, '0')}.${ms}`
}

// ================= Processing Logic =================
const processAudio = async () => {
  if (!file.value) return

  isProcessing.value = true

  // 1. 确保 FFmpeg 加载
  const loaded = await loadFFmpeg()
  if (!loaded) {
    isProcessing.value = false
    return
  }

  try {
    progressText.value = '正在读取文件...'
    const inputName = `input.${file.value.name.split('.').pop()}`
    const outputName = `output.${targetFormat.value}`

    // 写入文件
    await ffmpeg.writeFile(inputName, await fetchFile(file.value))

    progressText.value = '正在处理音频...'

    // 计算参数
    const ss = trimStart.value
    const durationClip = trimEnd.value - trimStart.value // 剪辑后的时长
    const fadeOutStart = durationClip - fadeDurationOut.value

    // 构建滤镜链 (Fade In + Fade Out)
    // 注意：使用 -ss 和 -t 在输入前剪辑，时间戳会重置为0。
    // 所以 afade 的 st (start time) 是相对于剪辑后的片段的。
    const filterComplex = []
    if (fadeDurationIn.value > 0) {
      filterComplex.push(`afade=t=in:st=0:d=${fadeDurationIn.value}`)
    }
    if (fadeDurationOut.value > 0) {
      // 如果有 fadeOut，需要基于剪辑后的总时长计算开始点
      filterComplex.push(`afade=t=out:st=${fadeOutStart}:d=${fadeDurationOut.value}`)
    }

    const ffmpegArgs = []

    // 输入剪辑 (寻求精度通常足够，且速度快)
    ffmpegArgs.push('-ss', ss.toString())
    ffmpegArgs.push('-t', durationClip.toString())
    ffmpegArgs.push('-i', inputName)

    // 应用滤镜
    if (filterComplex.length > 0) {
      ffmpegArgs.push('-af', filterComplex.join(','))
    }

    // 编码设置
    if (targetFormat.value === 'mp3') {
      ffmpegArgs.push('-c:a', 'libmp3lame', '-q:a', '2') // VBR quality 2 (High)
    } else if (targetFormat.value === 'm4a') {
      ffmpegArgs.push('-c:a', 'aac', '-b:a', '192k')
    }
    // WAV 默认 pcm_s16le

    ffmpegArgs.push(outputName)

    logs.value.push(`Running: ffmpeg ${ffmpegArgs.join(' ')}`)

    // 执行命令
    await ffmpeg.exec(ffmpegArgs)

    // 读取输出
    progressText.value = '打包下载中...'
    const data = await ffmpeg.readFile(outputName)

    saveAs(
      new Blob([data.buffer], { type: `audio/${targetFormat.value}` }),
      `privacy_box_trim_${Date.now()}.${targetFormat.value}`
    )

    logs.value.push('Done!')

    // 清理 (可选，保留文件以便下次调整参数更快？FFmpeg FS 是内存盘，刷新即丢)
    // await ffmpeg.deleteFile(inputName)
    // await ffmpeg.deleteFile(outputName)
  } catch (error) {
    console.error(error)
    logs.value.push(`Process Error: ${error.message}`)
    alert('处理出错，请查看日志')
  } finally {
    isProcessing.value = false
    progressText.value = ''
  }
}

onUnmounted(() => {
  if (wavesurfer) wavesurfer.destroy()
})
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

/* Custom Scrollbar for logs */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #1e293b;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #475569;
}
</style>
