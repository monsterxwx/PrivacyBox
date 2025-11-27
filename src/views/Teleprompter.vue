<template>
  <!-- 整体容器：深色系 (Zinc Theme) -->
  <div class="h-100% bg-zinc-950 relative overflow-hidden font-sans text-zinc-100 selection:bg-zinc-700 selection:text-white">
    <!-- ================= 背景特效 (深邃专注风格) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.15]" style="background-image: radial-gradient(#52525b 1px, transparent 1px); background-size: 24px 24px;" />
    <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-zinc-800 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" />
    <div class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-zinc-700 rounded-full mix-blend-screen filter blur-[100px] opacity-20" />

    <!-- ================= 编辑 & 设置模式 (非全屏时显示) ================= -->
    <div v-show="!isPlaying" class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <!-- 头部 -->
      <div class="flex justify-between items-end mb-8 border-b border-zinc-800 pb-6">
        <div>
          <RouterLink to="/" class="text-sm font-medium text-zinc-500 hover:text-white mb-2 inline-flex items-center gap-1 transition-colors">
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
          <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            在线提词器 <span class="text-zinc-600 font-normal text-xl ml-2">Teleprompter</span>
          </h1>
        </div>
        <div class="hidden md:block text-right">
          <p class="text-zinc-500 text-sm">
            准备好你的脚本，点击开始进入全屏滚动模式。
          </p>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-8 h-[calc(100vh-240px)] min-h-[500px]">
        <!-- 左侧：脚本编辑器 (8列) -->
        <div class="lg:col-span-8 flex flex-col space-y-4">
          <div class="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div class="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 flex justify-between items-center">
              <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">脚本内容</span>
              <span class="text-xs text-zinc-600">{{ text.length }} 字符</span>
            </div>
            <textarea
              v-model="text"
              placeholder="在此粘贴或输入您的台词脚本..."
              class="flex-1 border-none! w-full bg-transparent text-zinc-300 p-6 resize-none focus:outline-none text-lg leading-relaxed scrollbar-thin "
            />
          </div>
        </div>

        <!-- 右侧：控制面板 (4列) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-700 p-6 shadow-xl">
            <h2 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span class="w-1 h-5 bg-white rounded-full" />
              播放设置
            </h2>

            <div class="space-y-6">
              <!-- 字体大小 -->
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-medium text-zinc-400">字体大小</label>
                  <span class="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{{ settings.fontSize }}px</span>
                </div>
                <input
                  type="range"
                  v-model.number="settings.fontSize"
                  min="24"
                  max="120"
                  step="4"
                  class="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
                >
              </div>

              <!-- 滚动速度 -->
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-medium text-zinc-400">滚动速度</label>
                  <span class="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{{ settings.speed }}</span>
                </div>
                <input
                  type="range"
                  v-model.number="settings.speed"
                  min="0.5"
                  max="10"
                  step="0.5"
                  class="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
                >
              </div>

              <!-- 背景与镜像 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-zinc-400">背景颜色</label>
                  <div class="flex gap-2">
                    <button @click="settings.bgColor = 'black'" class="w-8 h-8 rounded-full border border-zinc-600 bg-black focus:ring-2 ring-white ring-offset-2 ring-offset-zinc-900" :class="{'ring-2': settings.bgColor==='black'}" />
                    <button @click="settings.bgColor = 'white'" class="w-8 h-8 rounded-full border border-zinc-600 bg-white focus:ring-2 ring-white ring-offset-2 ring-offset-zinc-900" :class="{'ring-2': settings.bgColor==='white'}" />
                    <button
                      @click="settings.bgColor = 'transparent'"
                      class="w-8 h-8 rounded-full border border-zinc-600 bg-transparent relative overflow-hidden focus:ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                      :class="{'ring-2': settings.bgColor==='transparent'}"
                      title="透明/绿幕"
                    >
                      <div class="absolute inset-0 bg-checkered opacity-50" />
                    </button>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-zinc-400">镜像翻转</label>
                  <div class="flex flex-col gap-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="settings.mirrorX" class="rounded bg-zinc-700 border-zinc-600 text-white focus:ring-0">
                      <span class="text-xs text-zinc-300">水平 (镜子)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="settings.mirrorY" class="rounded bg-zinc-700 border-zinc-600 text-white focus:ring-0">
                      <span class="text-xs text-zinc-300">垂直 (倒挂)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-zinc-800">
                <button
                  @click="enterPresentationMode"
                  class="w-full py-4 bg-white text-black font-bold text-lg rounded-xl shadow-lg shadow-white/10 hover:bg-zinc-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  ><path d="M8 5v14l11-7z" /></svg>
                  开始提词
                </button>
                <p class="text-center text-xs text-zinc-500 mt-3">
                  进入后按 <kbd class="bg-zinc-800 px-1 rounded font-mono text-zinc-300">Space</kbd> 暂停/播放，<kbd class="bg-zinc-800 px-1 rounded font-mono text-zinc-300">Esc</kbd> 退出
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= 提词器全屏播放模式 ================= -->
    <div
      v-if="isPlaying"
      ref="prompterContainer"
      class="fixed inset-0 z-50 overflow-hidden cursor-none"
      :class="{
        'bg-black': settings.bgColor === 'black',
        'bg-white': settings.bgColor === 'white',
        'bg-green-600': settings.bgColor === 'transparent' // 绿幕模式方便抠像
      }"
      @mousemove="showControlsBriefly"
      @click="toggleScroll"
    >
      <!-- 辅助线 (视线引导) -->
      <div class="absolute top-1/2 left-0 w-10 h-0 border-t-2 border-red-500/50 z-50 translate-y-[-50%]" />
      <div class="absolute top-1/2 right-0 w-10 h-0 border-t-2 border-red-500/50 z-50 translate-y-[-50%]" />

      <!-- 滚动内容区 -->
      <div
        ref="scrollContent"
        class="w-full h-full overflow-y-auto scrollbar-hide relative"
        style="scroll-behavior: auto;"
      >
        <!-- 顶部留白，确保第一行能滚到中间 -->
        <div class="h-[50vh]" />

        <div
          class="max-w-5xl mx-auto px-8 font-bold leading-tight text-center transition-transform pb-[50vh]"
          :style="{
            fontSize: settings.fontSize + 'px',
            color: settings.bgColor === 'white' ? 'black' : 'white',
            transform: `scaleX($${settings.mirrorX ? -1 : 1}) scaleY($${settings.mirrorY ? -1 : 1})`
          }"
        >
          {{ text }}
        </div>
      </div>

      <!-- 悬浮控制条 (鼠标移动时显示) -->
      <div
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-zinc-900/90 backdrop-blur px-6 py-3 rounded-full border border-zinc-700 flex items-center gap-6 transition-opacity duration-300 z-50"
        :class="controlsVisible ? 'opacity-100' : 'opacity-0'"
        @click.stop
      >
        <button @click="adjustSpeed(-0.5)" class="text-zinc-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          ><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <div class="text-sm font-mono text-zinc-300 w-16 text-center">
          SPD: {{ settings.speed }}
        </div>
        <button @click="adjustSpeed(0.5)" class="text-zinc-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          ><path d="M12 5v14M5 12h14" /><path d="M5 12h14" /></svg>
        </button>

        <div class="w-px h-6 bg-zinc-700" />

        <button @click="toggleScroll" class="text-white hover:scale-110 transition-transform">
          <svg
            v-if="isScrolling"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          ><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          ><path d="M8 5v14l11-7z" /></svg>
        </button>

        <div class="w-px h-6 bg-zinc-700" />

        <button @click="exitPresentationMode" class="text-red-400 hover:text-red-300 font-medium text-sm">
          退出 (Esc)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted, watch } from 'vue'

const text = ref('欢迎使用 PrivacyBox 在线提词器！\n\n这是一个纯本地运行的提词工具，您的脚本不会上传到任何服务器。\n\n支持镜像翻转（适配专业提词器硬件），支持调节速度和字体大小。\n\n点击“开始提词”按钮，进入全屏专注模式。\n\n按空格键暂停，按 ESC 退出。')

const isPlaying = ref(false)
const isScrolling = ref(false)
const controlsVisible = ref(false)
let controlsTimeout = null

const settings = reactive({
  fontSize: 64,
  speed: 2,
  bgColor: 'black',
  mirrorX: false,
  mirrorY: false
})

const scrollContent = ref(null)
let rafId = null

// --- 核心滚动逻辑 ---
const startScrollLoop = () => {
  if (!isScrolling.value || !scrollContent.value) return

  // 简单的每帧像素增加
  // 为了更平滑，可以将 scrollBy 改为 scrollTop 计算
  scrollContent.value.scrollTop += (settings.speed * 0.5) // 0.5 作为基础倍率

  // 循环检测
  if (scrollContent.value.scrollTop + scrollContent.value.clientHeight >= scrollContent.value.scrollHeight) {
    isScrolling.value = false // 到底停止
  } else {
    rafId = requestAnimationFrame(startScrollLoop)
  }
}

const toggleScroll = () => {
  isScrolling.value = !isScrolling.value
  if (isScrolling.value) {
    startScrollLoop()
  } else {
    cancelAnimationFrame(rafId)
  }
}

const adjustSpeed = (delta) => {
  settings.speed = Math.max(0.5, Math.min(10, settings.speed + delta))
}

// --- 交互控制 ---
const enterPresentationMode = () => {
  isPlaying.value = true
  isScrolling.value = false // 开始时是暂停状态，给用户准备时间
  // 请求浏览器全屏
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => {})
  }

  // 绑定键盘事件
  window.addEventListener('keydown', handleKeydown)

  // 3秒后开始滚动 (可选，目前设为手动开始)
}

const exitPresentationMode = () => {
  isPlaying.value = false
  isScrolling.value = false
  cancelAnimationFrame(rafId)
  window.removeEventListener('keydown', handleKeydown)

  if (document.exitFullscreen) {
    document.exitFullscreen().catch(err => {})
  }
}

const handleKeydown = (e) => {
  if (!isPlaying.value) return

  if (e.code === 'Space') {
    e.preventDefault()
    toggleScroll()
  } else if (e.code === 'ArrowUp') {
    e.preventDefault()
    adjustSpeed(0.5)
  } else if (e.code === 'ArrowDown') {
    e.preventDefault()
    adjustSpeed(-0.5)
  } else if (e.code === 'Escape') {
    e.preventDefault()
    exitPresentationMode()
  }
}

const showControlsBriefly = () => {
  controlsVisible.value = true
  if (controlsTimeout) clearTimeout(controlsTimeout)
  controlsTimeout = setTimeout(() => {
    if (isScrolling.value) { // 只有在滚动时自动隐藏，暂停时不隐藏
      controlsVisible.value = false
    }
  }, 2000)
}

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 隐藏滚动条但保持可滚动 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 棋盘格背景 (用于透明预览) */
.bg-checkered {
  background-position: 0 0, 0 5px, 5px -5px, -5px 0;
  background-size: 10px 10px;
  background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
}

/* 自定义滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #16161a;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
