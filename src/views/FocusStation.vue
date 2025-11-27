<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-cyan-100">
    <!-- ================= 背景特效 (天蓝色系) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#bae6fd 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-cyan-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-600">专注白噪音台</span>
        </h1>
        <p class="text-slate-600 max-w-2xl">
          Web Audio 实时音频合成。无音频文件加载，纯净的数理之声，助你进入心流状态。
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- 左侧：番茄钟 (占 6 列) -->
        <div class="lg:col-span-6 space-y-6">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 h-full flex flex-col items-center justify-center relative overflow-hidden transition-all">
            <!-- 通知状态指示器 -->
            <div class="absolute top-4 right-4 z-20">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
                :class="{
                  'bg-green-100 text-green-600': notificationPermission === 'granted',
                  'bg-yellow-100 text-yellow-600': notificationPermission === 'default',
                  'bg-red-100 text-red-600': notificationPermission === 'denied',
                  'bg-gray-100 text-gray-600': notificationPermission === 'unsupported'
                }"
                :title="{
                  'granted': '通知已开启',
                  'default': '点击开始按钮开启通知',
                  'denied': '通知已被禁用',
                  'unsupported': '浏览器不支持通知'
                }[notificationPermission]"
              >
                <svg
                  v-if="notificationPermission === 'granted'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <svg
                  v-else-if="notificationPermission === 'default'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  <circle cx="12" cy="2" r="1" />
                </svg>
                <svg
                  v-else-if="notificationPermission === 'denied'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  <line
                    x1="5"
                    y1="5"
                    x2="19"
                    y2="19"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  <line
                    x1="1"
                    y1="1"
                    x2="23"
                    y2="23"
                  />
                </svg>
              </div>
            </div>

            <!-- 模式切换 -->
            <div class="flex p-1 bg-slate-100 rounded-xl mb-8 relative z-10">
              <button
                v-for="mode in timerModes"
                :key="mode.id"
                @click="switchMode(mode.id)"
                class="px-4 py-2 text-sm font-bold rounded-lg transition-all"
                :class="currentMode === mode.id ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
              >
                {{ mode.label }}
              </button>
            </div>

            <!-- 环形进度条 -->
            <div class="relative w-64 h-64 mb-8">
              <!-- SVG Circle -->
              <svg class="w-full h-full transform -rotate-90">
                <!-- 轨道 -->
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="none"
                  class="text-slate-100"
                />
                <!-- 进度 -->
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="none"
                  stroke-linecap="round"
                  class="text-cyan-500 transition-[stroke-dashoffset] duration-1000 linear"
                  :style="{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset
                  }"
                />
              </svg>

              <!-- 中间时间文字 -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-6xl font-mono font-bold text-slate-700 tracking-tighter">
                  {{ formatTime(timeLeft) }}
                </span>
                <span class="text-sm font-medium text-slate-400 mt-2 tracking-widest uppercase">
                  {{ isTimerRunning ? 'FOCUSING' : 'PAUSED' }}
                </span>
              </div>
            </div>

            <!-- 控制按钮 -->
            <div class="flex items-center gap-4 relative z-10">
              <button
                @click="resetTimer"
                class="p-4 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
              </button>

              <button
                @click="toggleTimer"
                class="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all"
              >
                <svg
                  v-if="!isTimerRunning"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                ><path d="M8 5v14l11-7z" /></svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                ><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              </button>

              <button
                @click="skipTimer"
                class="p-4 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M5 4l10 8-10 8V4z" /><line
                  x1="19"
                  y1="5"
                  x2="19"
                  y2="19"
                /></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：声波生成器 (占 6 列) -->
        <div class="lg:col-span-6 space-y-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 h-full flex flex-col">
            <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span class="w-1 h-6 bg-cyan-500 rounded-full" />
              声音合成器
              <span class="ml-auto text-xs font-normal text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">Pure Web Audio API</span>
            </h2>

            <!-- 声音类型选择 -->
            <div class="grid grid-cols-1 gap-4 mb-8">
              <button
                v-for="noise in noiseTypes"
                :key="noise.id"
                @click="selectNoise(noise.id)"
                class="relative overflow-hidden group border rounded-2xl p-4 text-left transition-all"
                :class="currentNoise === noise.id ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'"
              >
                <div class="flex justify-between items-center relative z-10">
                  <div>
                    <h3 class="font-bold text-slate-700 group-hover:text-cyan-700">
                      {{ noise.name }}
                    </h3>
                    <p class="text-xs text-slate-500 mt-1">
                      {{ noise.desc }}
                    </p>
                  </div>
                  <div
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    :class="currentNoise === noise.id ? 'border-cyan-500' : 'border-slate-300'"
                  >
                    <div v-if="currentNoise === noise.id" class="w-3 h-3 bg-cyan-500 rounded-full" />
                  </div>
                </div>

                <!-- 简单的 CSS 动画模拟声波背景 -->
                <div v-if="currentNoise === noise.id && isPlaying" class="absolute inset-0 z-0 opacity-10 flex items-end justify-center gap-1 pb-2">
                  <div class="w-2 bg-cyan-600 animate-sound-wave h-4" style="animation-duration: 0.6s" />
                  <div class="w-2 bg-cyan-600 animate-sound-wave h-6" style="animation-duration: 0.8s" />
                  <div class="w-2 bg-cyan-600 animate-sound-wave h-3" style="animation-duration: 0.5s" />
                  <div class="w-2 bg-cyan-600 animate-sound-wave h-7" style="animation-duration: 0.9s" />
                  <div class="w-2 bg-cyan-600 animate-sound-wave h-4" style="animation-duration: 0.7s" />
                </div>
              </button>
            </div>

            <!-- 音量控制 -->
            <div class="mb-8">
              <div class="flex justify-between mb-3">
                <label class="text-sm font-bold text-slate-600">主音量</label>
                <span class="text-sm font-mono text-cyan-600">{{ Math.round(volume * 100) }}%</span>
              </div>
              <input
                type="range"
                v-model.number="volume"
                min="0"
                max="1"
                step="0.01"
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              >
            </div>

            <!-- 播放开关 -->
            <div class="mt-auto">
              <button
                @click="toggleAudio"
                class="w-full py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
                :class="isPlaying
                  ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                  : 'bg-slate-800 text-white shadow-lg hover:bg-slate-700'"
              >
                <span v-if="isPlaying">🛑 停止噪音</span>
                <span v-else>🎧 开始播放</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'

// ================== 音频引擎 (Web Audio API) ==================
const audioCtx = ref(null)
const gainNode = ref(null) // 音量节点
const noiseSource = ref(null) // 当前的噪音源节点
const isPlaying = ref(false)
const volume = ref(0.3)
const currentNoise = ref('brown') // 默认布朗噪音(雨声)

// 通知权限状态
const notificationPermission = ref('default')

// 获取通知权限状态
const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    notificationPermission.value = 'unsupported'
    return
  }
  notificationPermission.value = Notification.permission
}

const noiseTypes = [
  { id: 'white', name: '白噪音 (White Noise)', desc: '全频段均匀能量，适合隔绝外部交谈声。' },
  { id: 'pink', name: '粉红噪音 (Pink Noise)', desc: '柔和均衡，类似风吹树叶或海浪声。' },
  { id: 'brown', name: '布朗噪音 (Brown Noise)', desc: '低频深沉，类似暴雨或瀑布声，最助眠专注。' }
]

// 音频上下文初始化
const initAudio = () => {
  if (!audioCtx.value) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioCtx.value = new AudioContext()

    // 创建主音量控制
    gainNode.value = audioCtx.value.createGain()
    gainNode.value.connect(audioCtx.value.destination)
    gainNode.value.gain.value = volume.value
  }
  // 必须由用户手势触发 resume
  if (audioCtx.value.state === 'suspended') {
    audioCtx.value.resume()
  }
}

// 核心算法：生成不同颜色的噪音 buffer
const createNoiseBuffer = () => {
  if (!audioCtx.value) return null

  const bufferSize = 2 * audioCtx.value.sampleRate // 生成 2 秒的循环 buffer
  const buffer = audioCtx.value.createBuffer(1, bufferSize, audioCtx.value.sampleRate)
  const output = buffer.getChannelData(0)

  if (currentNoise.value === 'white') {
    // 白噪音：纯随机
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }
  } else if (currentNoise.value === 'pink') {
    // 粉红噪音：Paul Kellett 的算法 (近似 -3dB/octave)
    let b0, b1, b2, b3, b4, b5, b6
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      output[i] *= 0.11 // 补偿增益，防止爆音
      b6 = white * 0.115926
    }
  } else if (currentNoise.value === 'brown') {
    // 布朗噪音：积分白噪音 (随机游走)
    let lastOut = 0.0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      lastOut = (lastOut + (0.02 * white)) / 1.02
      output[i] = lastOut * 3.5 // 补偿增益
    }
  }

  return buffer
}

const startAudio = () => {
  initAudio()

  // 停止旧的
  if (noiseSource.value) {
    noiseSource.value.stop()
    noiseSource.value.disconnect()
  }

  // 创建源
  const buffer = createNoiseBuffer()
  noiseSource.value = audioCtx.value.createBufferSource()
  noiseSource.value.buffer = buffer
  noiseSource.value.loop = true // 循环播放
  noiseSource.value.connect(gainNode.value)

  noiseSource.value.start()
  isPlaying.value = true
}

const stopAudio = () => {
  if (noiseSource.value) {
    noiseSource.value.stop()
    isPlaying.value = false
  }
}

const toggleAudio = () => {
  if (isPlaying.value) {
    stopAudio()
  } else {
    startAudio()
  }
}

const selectNoise = (id) => {
  currentNoise.value = id
  if (isPlaying.value) {
    startAudio() // 重新生成对应 buffer 并播放
  }
}

// 监听音量变化
watch(volume, (newVal) => {
  if (gainNode.value) {
    // 平滑过渡音量，防止咔哒声
    gainNode.value.gain.setTargetAtTime(newVal, audioCtx.value.currentTime, 0.1)
  }
})

// ================== 番茄钟逻辑 ==================
const timerModes = [
  { id: 'focus', label: '专注 25', minutes: 25 },
  { id: 'short', label: '小憩 5', minutes: 5 },
  { id: 'long', label: '长休 15', minutes: 15 }
]

const currentMode = ref('focus')
const defaultTime = computed(() => timerModes.find(m => m.id === currentMode.value).minutes * 60)
const timeLeft = ref(defaultTime.value)
const isTimerRunning = ref(false)
let timerInterval = null

// SVG 环形进度计算
const radius = 120
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => {
  const progress = timeLeft.value / defaultTime.value
  return circumference * (1 - progress)
})

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const switchMode = (modeId) => {
  currentMode.value = modeId
  resetTimer()
}

const toggleTimer = () => {
  if (isTimerRunning.value) {
    clearInterval(timerInterval)
    isTimerRunning.value = false
  } else {
    // 首次点击时检查通知权限
    if (notificationPermission.value === 'default') {
      console.log('准备请求通知权限...')
      // 立即请求权限，不在setTimeout中执行
      Notification.requestPermission().then((permission) => {
        console.log('通知权限请求结果:', permission)
        notificationPermission.value = permission
        if (permission === 'granted') {
          console.log('通知权限已授予')
          // 显示一个测试通知
          new Notification('✅ 通知已开启', {
            body: '番茄钟结束时您将收到提醒！',
            icon: '/favicon.ico'
          })
        } else if (permission === 'denied') {
          console.log('通知权限被拒绝')
          alert('通知权限被拒绝，您可以在浏览器设置中手动开启通知权限')
        }
      }).catch((error) => {
        console.error('请求通知权限失败:', error)
        alert('请求通知权限失败，请检查浏览器设置')
      })
    }

    isTimerRunning.value = true
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        // 完成
        timerFinished()
      }
    }, 1000)
  }
}

const resetTimer = () => {
  clearInterval(timerInterval)
  isTimerRunning.value = false
  timeLeft.value = defaultTime.value
}

const skipTimer = () => {
  resetTimer()
}

const timerFinished = () => {
  resetTimer()
  // 播放一个简单的提示音 (同样使用 Oscillator)
  if (audioCtx.value) {
    const osc = audioCtx.value.createOscillator()
    const gain = audioCtx.value.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.value.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, audioCtx.value.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.value.currentTime + 0.1)

    gain.gain.setValueAtTime(0.5, audioCtx.value.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.value.currentTime + 0.5)

    osc.start()
    osc.stop(audioCtx.value.currentTime + 0.5)
  }

  // 浏览器通知（可选）
  if (notificationPermission.value === 'granted') {
    new Notification('番茄钟结束', { body: '该休息一下了！' })
  }
}

// 页面加载时检查通知权限
onMounted(() => {
  // 初始化通知权限状态
  getNotificationPermission()
})

onUnmounted(() => {
  stopAudio()
  if (audioCtx.value) audioCtx.value.close()
  clearInterval(timerInterval)
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
.animation-delay-4000 { animation-delay: 4s; }

@keyframes sound-wave {
  0%, 100% { height: 10%; }
  50% { height: 100%; }
}
.animate-sound-wave {
  animation-name: sound-wave;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
</style>
