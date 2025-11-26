<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-rose-100">
    <!-- 背景代码保持不变... -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-8">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">极简屏幕录制 Pro</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          混音引擎升级：完美支持系统音+麦克风。视频自带时间戳索引，支持拖拽进度条。
        </p>
      </div>

      <!-- 主工作区 -->
      <div class="flex-1 flex flex-col gap-6">
        <!-- 视频预览容器 -->
        <div class="flex-1 bg-black/90 rounded-3xl shadow-2xl overflow-hidden relative group border border-slate-800 min-h-[400px] flex items-center justify-center backdrop-blur-sm">
          <!-- 1. 初始状态 -->
          <div v-if="status === 'idle'" class="text-center p-10 cursor-pointer hover:scale-105 transition-transform duration-300" @click="startRecording">
            <div class="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mx-auto mb-6 group-hover:border-rose-500 transition-colors">
              <div class="w-16 h-16 rounded-full bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.5)]" />
            </div>
            <h3 class="text-white text-xl font-bold mb-2">
              点击开始录制
            </h3>
            <p class="text-slate-400 text-sm">
              支持 屏幕 / 窗口 / 标签页
            </p>
          </div>

          <!-- 2. 录制中/预览中 (注意：预览必须静音 muted，否则会有回音啸叫) -->
          <video
            v-show="status === 'recording' || status === 'preview'"
            ref="previewVideoRef"
            class="w-full h-full object-contain bg-black"
            autoplay
            muted
            playsinline
          />

          <!-- 状态指示器 -->
          <div v-if="status === 'recording'" class="absolute top-6 right-6 flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 z-20">
            <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span class="text-white font-mono font-bold">{{ formatTime(duration) }}</span>
          </div>

          <!-- 3. 录制完成回放 (不静音，允许拖拽) -->
          <video
            v-if="status === 'finished'"
            :src="recordedUrl"
            controls
            class="w-full h-full object-contain bg-black"
          />
        </div>

        <!-- 底部控制栏 -->
        <div class="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <!-- 左侧设置 -->
          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 cursor-pointer select-none group">
              <div class="relative">
                <input
                  type="checkbox"
                  v-model="enableMic"
                  :disabled="status === 'recording'"
                  class="sr-only peer"
                >
                <div class="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-rose-500 peer-focus:ring-2 peer-focus:ring-rose-300 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
              </div>
              <span class="text-sm font-medium text-slate-700 group-hover:text-rose-600 transition-colors flex items-center gap-1">
                🎤 麦克风混音
              </span>
            </label>
            <div class="text-xs text-slate-400 hidden md:block border-l border-slate-300 pl-4">
              注意：请在弹窗中勾选 <strong>"分享音频"</strong> 以录制系统声音
            </div>
          </div>

          <!-- 右侧按钮 -->
          <div class="flex items-center gap-3">
            <button v-if="status === 'idle'" @click="startRecording" class="btn-primary bg-rose-500 hover:bg-rose-600 shadow-rose-500/30">
              开始录制
            </button>

            <template v-if="status === 'recording'">
              <button @click="stopRecording" class="btn-danger">
                <span class="w-3 h-3 bg-white rounded-sm" /> 结束录制
              </button>
            </template>

            <template v-if="status === 'finished'">
              <button @click="reset" class="btn-secondary">
                丢弃
              </button>
              <button @click="downloadVideo" class="btn-primary bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-pink-500/30">
                💾 下载
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
// 引入 WebM 时长修复工具 (核心修复进度条问题)
import fixWebmDuration from 'fix-webm-duration'

// ---------------- 状态管理 ----------------
const status = ref('idle')
const enableMic = ref(false)
const duration = ref(0)
const previewVideoRef = ref(null)
const recordedUrl = ref('')

// 内部对象
let mediaRecorder = null
let recordedChunks = []
let timerInterval = null
let combinedStream = null // 最终混合流
let audioContext = null // 音频混音器上下文
let sourceNodes = [] // 存储音频源节点，方便清理

// ---------------- 核心逻辑 ----------------

const startRecording = async () => {
  try {
    // 1. 获取屏幕画面 + 系统声音
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' },
      audio: true // 关键：必须请求系统音频
    })

    // 2. 准备音频混音上下文 (AudioContext)
    // 即使没开麦克风，也建议走 AudioContext，方便扩展
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const dest = audioContext.createMediaStreamDestination()
    sourceNodes = []

    // A. 处理系统声音 (如果有)
    if (displayStream.getAudioTracks().length > 0) {
      const sysSource = audioContext.createMediaStreamSource(displayStream)
      sysSource.connect(dest)
      sourceNodes.push(sysSource)
    }

    // B. 处理麦克风声音 (如果开启)
    if (enableMic.value) {
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        })
        const micSource = audioContext.createMediaStreamSource(micStream)
        micSource.connect(dest)
        sourceNodes.push(micSource)
      } catch (err) {
        console.warn('麦克风获取失败', err)
        alert('麦克风权限被拒绝，将只录制屏幕音频。')
      }
    }

    // 3. 组装最终流 (Final Stream)
    // 视频轨道来自屏幕流，音频轨道来自混音后的 destination
    const mixedAudioTracks = dest.stream.getAudioTracks()
    const videoTracks = displayStream.getVideoTracks()

    // 如果没有任何音频（用户没开麦也没分享系统音），就只录视频，否则 MediaRecorder 会报错
    if (mixedAudioTracks.length > 0) {
      combinedStream = new MediaStream([...videoTracks, ...mixedAudioTracks])
    } else {
      combinedStream = new MediaStream([...videoTracks])
    }

    // 4. 监听 "停止共享" 按钮
    displayStream.getVideoTracks()[0].onended = () => {
      stopRecording()
    }

    // 5. 设置预览 (静音)
    if (previewVideoRef.value) {
      previewVideoRef.value.srcObject = combinedStream
    }

    // 6. 初始化录制器
    const mimeType = getSupportedMimeType()
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType })
    recordedChunks = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      // 核心修复逻辑：在这里修复时长
      const rawBlob = new Blob(recordedChunks, { type: mimeType })

      // 计算录制时长 (毫秒)
      const durationMs = duration.value * 1000

      // 使用 fix-webm-duration 库修复元数据
      fixWebmDuration(rawBlob, durationMs, (fixedBlob) => {
        recordedUrl.value = URL.createObjectURL(fixedBlob)
        status.value = 'finished'
      })

      cleanup() // 清理资源
    }

    // 7. 开始
    mediaRecorder.start(1000)
    status.value = 'recording'
    startTimer()
  } catch (err) {
    console.error('录制启动失败', err)
    cleanup()
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }
}

// 资源清理
const cleanup = () => {
  stopTimer()

  // 停止所有流 (包括麦克风和屏幕)
  if (combinedStream) {
    combinedStream.getTracks().forEach(track => track.stop())
    combinedStream = null
  }

  // 关闭 AudioContext
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }

  // 清理预览
  if (previewVideoRef.value) {
    previewVideoRef.value.srcObject = null
  }
}

// 获取浏览器支持的格式
const getSupportedMimeType = () => {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm'
  ]
  return types.find(type => MediaRecorder.isTypeSupported(type)) || ''
}

const downloadVideo = () => {
  if (!recordedUrl.value) return
  const a = document.createElement('a')
  a.href = recordedUrl.value
  a.download = `record_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.webm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const reset = () => {
  if (recordedUrl.value) URL.revokeObjectURL(recordedUrl.value)
  status.value = 'idle'
  recordedUrl.value = ''
  duration.value = 0
  recordedChunks = []
}

// ---------------- 计时器 ----------------
const startTimer = () => {
  duration.value = 0
  timerInterval = setInterval(() => {
    duration.value++
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
}

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  cleanup()
  if (recordedUrl.value) URL.revokeObjectURL(recordedUrl.value)
})
</script>

<style scoped>
/* 样式复用之前的，保持一致 */
.btn-primary {
  @apply px-6 py-3 rounded-xl text-white font-bold transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2;
}
.btn-danger {
  @apply px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/30 flex items-center gap-2 animate-pulse;
}
.btn-secondary {
  @apply px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 font-bold rounded-xl transition-all;
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
