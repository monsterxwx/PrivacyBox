<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-fuchsia-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角紫红 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角玫瑰红 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间紫色 -->
    <div class="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-rose-600">视频转 GIF 工场</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          基于 WebAssembly (FFmpeg) 的硬核转码。
          支持视频裁剪、帧率调节、尺寸缩放，生成高质量 GIF。
        </p>
      </div>

      <!-- 核心加载状态 -->
      <div v-if="!ffmpegLoaded" class="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div class="relative w-20 h-20 mb-6">
          <div class="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full" />
          <div class="absolute top-0 left-0 w-full h-full border-4 border-fuchsia-500 rounded-full border-t-transparent animate-spin" />
        </div>
        <h3 class="text-xl font-bold text-slate-700">
          正在加载 FFmpeg 核心组件...
        </h3>
        <p class="text-slate-500 mt-2 text-sm">
          首次加载可能需要几秒钟 (约 30MB)
        </p>
      </div>

      <!-- 主界面 -->
      <div v-else class="flex-1 grid lg:grid-cols-12 gap-8 items-start animate-fade-in-up">
        <!-- 左侧：剪辑台 -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <!-- 1. 视频播放与上传 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-4 md:p-6">
            <div
              v-if="!videoUrl"
              class="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-fuchsia-50/50 hover:border-fuchsia-300 transition-all min-h-[300px] flex flex-col items-center justify-center cursor-pointer group"
              @click="triggerUpload"
            >
              <div class="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl mb-4 text-slate-300 group-hover:text-fuchsia-500 transition-colors">
                🎬
              </div>
              <p class="text-slate-600 font-bold group-hover:text-fuchsia-600">
                上传 MP4 / WebM 视频
              </p>
              <input
                type="file"
                ref="fileInput"
                accept="video/mp4, video/webm"
                class="hidden"
                @change="handleFileChange"
              >
            </div>

            <div v-else class="space-y-4">
              <!-- 视频播放器 -->
              <div class="rounded-xl overflow-hidden bg-black aspect-video shadow-md relative group">
                <video
                  ref="videoEl"
                  :src="videoUrl"
                  controls
                  class="w-full h-full"
                  @loadedmetadata="handleVideoLoaded"
                />
                <button @click="reset" class="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  ✕ 移除
                </button>
              </div>

              <!-- 裁剪控制条 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label class="text-xs font-bold text-slate-500 mb-2 block">开始时间 (秒)</label>
                  <div class="flex gap-2">
                    <input
                      type="number"
                      v-model.number="config.startTime"
                      step="0.1"
                      min="0"
                      class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm"
                    >
                    <button @click="setStartTime" class="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-xs font-bold rounded hover:bg-fuchsia-200" title="设为当前播放时间">
                      ⏱️
                    </button>
                  </div>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label class="text-xs font-bold text-slate-500 mb-2 block">持续时长 (秒)</label>
                  <div class="flex gap-2">
                    <input
                      type="number"
                      v-model.number="config.duration"
                      step="0.1"
                      min="0.1"
                      class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm"
                    >
                    <button @click="setEndTime" class="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-xs font-bold rounded hover:bg-fuchsia-200" title="设为当前播放时间计算时长">
                      ⏱️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 参数设置 -->
          <div
            class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 opacity-50 pointer-events-none transition-opacity"
            :class="{'opacity-100 pointer-events-auto': videoUrl}"
          >
            <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-fuchsia-500 rounded-full" /> 输出设置
            </h2>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-2">帧率 (FPS)</label>
                <div class="flex items-center gap-3">
                  <input
                    type="range"
                    v-model.number="config.fps"
                    min="5"
                    max="30"
                    step="1"
                    class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  >
                  <span class="text-sm font-mono font-bold w-8 text-right">{{ config.fps }}</span>
                </div>
                <p class="text-[10px] text-slate-400 mt-1">
                  值越大越流畅，文件也越大
                </p>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-2">宽度 (px)</label>
                <div class="flex items-center gap-3">
                  <input
                    type="range"
                    v-model.number="config.width"
                    min="200"
                    max="800"
                    step="50"
                    class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  >
                  <span class="text-sm font-mono font-bold w-8 text-right">{{ config.width }}</span>
                </div>
                <p class="text-[10px] text-slate-400 mt-1">
                  高度会自动按比例缩放
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：生成结果 -->
        <div class="lg:col-span-5 flex flex-col h-full gap-6">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex-1 flex flex-col min-h-[400px]">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold text-slate-800">
                生成预览
              </h2>
              <span v-if="gifUrl" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">转换成功</span>
            </div>

            <!-- 预览框 -->
            <div class="flex-1 bg-slate-200/50 rounded-2xl overflow-hidden flex items-center justify-center relative border border-slate-200">
              <!-- 背景网格 -->
              <div class="absolute inset-0 z-0 opacity-30 pointer-events-none" style="background-image: linear-gradient(45deg, #cccccc 25%, transparent 25%), linear-gradient(-45deg, #cccccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cccccc 75%), linear-gradient(-45deg, transparent 75%, #cccccc 75%); background-size: 20px 20px;" />

              <!-- 空状态 -->
              <div v-if="!gifUrl && !isProcessing" class="text-slate-400 text-center relative z-10 px-6">
                <div class="text-4xl mb-2 opacity-50">
                  🎞️
                </div>
                <p class="text-sm">
                  点击转换后在此预览
                </p>
              </div>

              <!-- 处理中 -->
              <div v-if="isProcessing" class="text-center relative z-10 w-full px-10">
                <div class="w-12 h-12 border-4 border-fuchsia-200 border-t-fuchsia-600 rounded-full animate-spin mx-auto mb-4" />
                <p class="text-fuchsia-600 font-bold mb-2">
                  FFmpeg 转码中...
                </p>
                <p class="text-xs text-slate-500 break-words bg-white/50 p-2 rounded">
                  {{ logMessage }}
                </p>
              </div>

              <!-- 结果 -->
              <img v-if="gifUrl" :src="gifUrl" class="max-w-full max-h-full object-contain relative z-10 shadow-lg">
            </div>

            <!-- 操作按钮 -->
            <div class="mt-6 flex flex-col gap-3">
              <button
                @click="convert"
                :disabled="!videoUrl || isProcessing"
                class="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⚡ 开始转换
              </button>

              <button
                v-if="gifUrl"
                @click="download"
                class="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                💾 下载 GIF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { saveAs } from 'file-saver'

// ---------------- 状态管理 ----------------
const ffmpegLoaded = ref(false)
const ffmpeg = new FFmpeg()
const videoUrl = ref('')
const videoFile = ref(null)
const fileInput = ref(null)
const videoEl = ref(null)
const gifUrl = ref('')
const isProcessing = ref(false)
const logMessage = ref('初始化...')

const config = reactive({
  startTime: 0,
  duration: 3,
  fps: 10,
  width: 320
})

// ---------------- 初始化 FFmpeg ----------------
const loadFFmpeg = async () => {
  try {
    // 【关键修改】：版本号改为 0.12.10，与 npm 安装的版本保持一致
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd'

    ffmpeg.on('log', ({ message }) => {
      console.log(message)
      logMessage.value = message
    })

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    })

    ffmpegLoaded.value = true
    console.log('FFmpeg 0.12.10 加载成功')
  } catch (error) {
    console.error('加载出错:', error)

    // 辅助排查：检查是不是 SharedArrayBuffer 的问题
    if (typeof SharedArrayBuffer === 'undefined') {
      alert('错误：浏览器不支持 SharedArrayBuffer。\n\n请检查：\n1. 必须使用 http://localhost:3331 访问（不能用 IP 地址）\n2. 确保 vite.config.js 的 headers 配置已生效')
    } else {
      alert(`加载失败: ${error.message}`)
    }
  }
}
onMounted(() => {
  loadFFmpeg()
})

// ---------------- 视频交互逻辑 ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  videoFile.value = file
  videoUrl.value = URL.createObjectURL(file)
  gifUrl.value = '' // 重置结果
}

const handleVideoLoaded = () => {
  // 视频加载后，默认设置裁剪前 3 秒 (或视频总长)
  config.startTime = 0
  config.duration = Math.min(3, videoEl.value.duration)
}

const setStartTime = () => {
  if (videoEl.value) config.startTime = parseFloat(videoEl.value.currentTime.toFixed(1))
}

const setEndTime = () => {
  if (videoEl.value) {
    let dur = parseFloat(videoEl.value.currentTime) - config.startTime
    if (dur <= 0) dur = 1 // 保护逻辑
    config.duration = parseFloat(dur.toFixed(1))
  }
}

const reset = () => {
  videoUrl.value = ''
  videoFile.value = null
  gifUrl.value = ''
}

// ---------------- 核心转换逻辑 (大杀器) ----------------
const convert = async () => {
  if (!ffmpegLoaded.value || !videoFile.value) return

  isProcessing.value = true
  gifUrl.value = ''

  try {
    // 1. 将文件写入 FFmpeg 虚拟文件系统
    const inputName = 'input.mp4'
    const outputName = 'output.gif'

    await ffmpeg.writeFile(inputName, await fetchFile(videoFile.value))

    // 2. 构建 FFmpeg 命令
    // -ss: 开始时间
    // -t: 持续时间
    // -vf: 滤镜链
    //      fps={config.fps} : 设定帧率
    //      scale={config.width}:-1 : 设定宽度，高度自适应(-1)
    //      flags=lanczos : 缩放算法
    //      split[s0][s1]... : 生成调色板以获得更好的 GIF 颜色质量 (palettegen/paletteuse)

    const filters = `fps=${config.fps},scale=${config.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`

    // 执行转换
    await ffmpeg.exec([
      '-ss', config.startTime.toString(),
      '-t', config.duration.toString(),
      '-i', inputName,
      '-vf', filters,
      outputName
    ])

    // 3. 读取生成的文件
    const data = await ffmpeg.readFile(outputName)

    // 4. 生成 URL
    const blob = new Blob([data.buffer], { type: 'image/gif' })
    gifUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    console.error(error)
    alert('转换出错，请查看控制台日志')
  } finally {
    isProcessing.value = false
  }
}

const download = () => {
  if (gifUrl.value) {
    saveAs(gifUrl.value, `clip_${Date.now()}.gif`)
  }
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
.animation-delay-4000 { animation-delay: 4s; }

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
</style>
