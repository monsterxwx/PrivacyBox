<template>
  <div class="min-h-screen bg-slate-900 relative overflow-hidden font-sans selection:bg-fuchsia-500 selection:text-white">
    <!-- ================= 背景特效 (赛博霓虹) ================= -->
    <!-- 网格背景 -->
    <div
      class="absolute inset-0 z-0 opacity-20"
      style="background-image: linear-gradient(rgb(255 255 255 / 10%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 10%) 1px, transparent 1px); background-size: 40px 40px;"
    />
    <!-- 霓虹光斑 -->
    <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-blob" />

    <!-- ================= 编辑模式内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col h-screen max-h-[900px]">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-8 text-center shrink-0">
        <RouterLink to="/" class="text-sm font-medium text-slate-400 hover:text-fuchsia-400 mb-4 inline-flex items-center gap-1 transition-colors">
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
        <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">LED 滚动弹幕</span>
        </h1>
        <p class="text-slate-400 text-sm">
          打Call / 接机 / 摆摊神器。支持镜像、闪烁与 LED 仿真纹理。
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <!-- 左侧：设置面板 (4列) -->
        <div class="lg:col-span-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          <!-- 1. 文本输入 -->
          <div class="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl">
            <label class="text-xs font-bold text-fuchsia-300 uppercase tracking-wider mb-3 block">弹幕内容</label>
            <textarea
              v-model="config.text"
              rows="3"
              class="w-full bg-slate-900/50 text-white border border-slate-700 rounded-xl p-3 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all resize-none text-lg"
              placeholder="输入文字..."
            />

            <!-- 快速预设 -->
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="preset in presets"
                :key="preset.label"
                @click="applyPreset(preset)"
                class="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>

          <!-- 2. 样式调节 -->
          <div class="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl space-y-5">
            <!-- 颜色选择 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-slate-400 mb-2 block">文字颜色</label>
                <div class="flex items-center gap-2">
                  <input type="color" v-model="config.textColor" class="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0">
                  <span class="text-xs font-mono text-slate-500">{{ config.textColor }}</span>
                </div>
              </div>
              <div>
                <label class="text-xs text-slate-400 mb-2 block">背景颜色</label>
                <div class="flex items-center gap-2">
                  <input type="color" v-model="config.bgColor" class="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0">
                  <span class="text-xs font-mono text-slate-500">{{ config.bgColor }}</span>
                </div>
              </div>
            </div>

            <!-- 滑块控制 -->
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-400">字号大小</span>
                  <span class="text-fuchsia-400">{{ config.fontSize }}px</span>
                </div>
                <input
                  type="range"
                  v-model.number="config.fontSize"
                  min="50"
                  max="400"
                  class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                >
              </div>

              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-400">滚动速度</span>
                  <span class="text-fuchsia-400">{{ config.speed }}</span>
                </div>
                <input
                  type="range"
                  v-model.number="config.speed"
                  min="1"
                  max="50"
                  class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                >
                <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>慢</span>
                  <span>快</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 特效开关 (修复部分) -->
          <div class="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl">
            <label class="text-xs font-bold text-fuchsia-300 uppercase tracking-wider mb-3 block">特效增强</label>

            <div class="space-y-3">
              <!-- 使用 v-for 循环渲染开关 -->
              <div
                v-for="item in toggleItems"
                :key="item.key"
                class="flex items-center justify-between"
              >
                <div>
                  <div class="text-sm text-slate-300 font-medium">
                    {{ item.label }}
                  </div>
                  <div class="text-[10px] text-slate-500">
                    {{ item.desc }}
                  </div>
                </div>
                <button
                  @click="config[item.key] = !config[item.key]"
                  class="w-11 h-6 rounded-full transition-colors relative focus:outline-none"
                  :class="config[item.key] ? 'bg-fuchsia-600' : 'bg-slate-600'"
                >
                  <div
                    class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
                    :class="config[item.key] ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：预览区 (8列) -->
        <div class="lg:col-span-8 flex flex-col">
          <!-- 手机外壳模拟 -->
          <div class="relative flex-1 bg-black rounded-[2rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center group">
            <!-- 预览画面 -->
            <div
              class="w-full h-full relative overflow-hidden flex items-center"
              :style="{ backgroundColor: config.bgColor }"
            >
              <!-- LED 网格层 -->
              <div
                v-if="config.showGrid"
                class="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-50"
                style="background-image: radial-gradient(rgb(0 0 0 / 80%) 20%, transparent 20%); background-size: 4px 4px;"
              />

              <!-- 滚动文字容器 -->
              <div
                class="whitespace-nowrap will-change-transform absolute"
                :class="{ 'animate-scroll': !isPaused, 'animate-blink': config.blink }"
                :style="textStyle"
              >
                {{ config.text }}
              </div>
            </div>

            <!-- 悬浮提示 -->
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 backdrop-blur rounded-full text-xs text-slate-400 z-30 pointer-events-none border border-white/10">
              预览模式 (实际全屏效果更佳)
            </div>
          </div>

          <!-- 底部全屏按钮 -->
          <div class="mt-6">
            <button
              @click="enterFullscreen"
              class="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white text-lg font-bold rounded-2xl shadow-lg shadow-fuchsia-900/50 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
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
              ><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M16 9h5v5" /><path d="m21 9-9 9" /></svg>
              开启全屏弹幕
            </button>
            <p class="text-center text-slate-500 text-xs mt-3">
              全屏后双击屏幕即可退出，手机请开启横屏锁定。
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= 全屏真实展示层 ================= -->
    <div
      v-if="isFullscreen"
      ref="fullscreenEl"
      class="fixed inset-0 z-50 overflow-hidden flex items-center cursor-none"
      :style="{ backgroundColor: config.bgColor }"
      @dblclick="exitFullscreen"
      @click="togglePause"
    >
      <!-- 退出提示 (淡出) -->
      <div class="absolute top-4 left-1/2 -translate-x-1/2 text-white/30 text-sm pointer-events-none z-50 animate-fade-out">
        双击退出 / 单击暂停
      </div>

      <!-- LED 网格层 -->
      <div
        v-if="config.showGrid"
        class="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-50"
        style="background-image: radial-gradient(rgb(0 0 0 / 80%) 20%, transparent 20%); background-size: 4px 4px;"
      />

      <!-- 滚动文字 -->
      <div
        class="whitespace-nowrap will-change-transform absolute"
        :class="{ 'animate-scroll': !isPaused, 'animate-blink': config.blink }"
        :style="textStyle"
      >
        {{ config.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// --- State ---
const config = reactive({
  text: 'PrivacyBox',
  textColor: '#f0abfc', // fuchsia-300
  bgColor: '#000000',
  fontSize: 150,
  speed: 20, // 1-50
  showGrid: true,
  glow: true,
  blink: false,
  mirror: false
})

// 开关配置项 (替代之前的内联组件)
const toggleItems = [
  { key: 'showGrid', label: 'LED 网格纹理', desc: '模拟真实屏幕颗粒感' },
  { key: 'glow', label: '霓虹发光', desc: '文字边缘模糊发光' },
  { key: 'blink', label: '闪烁特效', desc: '文字高频闪烁' },
  { key: 'mirror', label: '镜像翻转', desc: '对着镜子自拍时使用' }
]

const isFullscreen = ref(false)
const isPaused = ref(false)
const fullscreenEl = ref(null)

// --- Presets ---
const presets = [
  { label: '应援粉', text: 'LOVE YOU FOREVER', textColor: '#ff00cc', bgColor: '#000000', glow: true },
  { label: '接机黄', text: '欢迎回家 WELCOME', textColor: '#fbbf24', bgColor: '#000000', glow: false },
  { label: '警示红', text: '禁止吸烟 !!!', textColor: '#ef4444', bgColor: '#000000', blink: true },
  { label: '黑客绿', text: 'The Matrix has you...', textColor: '#22c55e', bgColor: '#000000', showGrid: true }
]

// --- Computed Styles ---

const textStyle = computed(() => {
  const duration = Math.max(1, 51 - config.speed) + 's'

  return {
    color: config.textColor,
    fontSize: config.fontSize + 'px',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    textShadow: config.glow ? `0 0 20px ${config.textColor}, 0 0 40px ${config.textColor}` : 'none',
    transform: config.mirror ? 'scaleX(-1)' : 'none',
    animationDuration: duration,
    paddingLeft: '100vw', // 初始位置在右侧屏幕外
    lineHeight: 1
  }
})

// --- Actions ---

const applyPreset = (p) => {
  if (p.text) config.text = p.text
  if (p.textColor) config.textColor = p.textColor
  if (p.bgColor) config.bgColor = p.bgColor
  if (p.glow !== undefined) config.glow = p.glow
  if (p.blink !== undefined) config.blink = p.blink
  if (p.showGrid !== undefined) config.showGrid = p.showGrid
}

const enterFullscreen = async () => {
  isFullscreen.value = true
  try {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      await elem.requestFullscreen()
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      await elem.webkitRequestFullscreen()
    }
  } catch (err) {
    console.error(err)
  }
}

const exitFullscreen = async () => {
  isFullscreen.value = false
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
    } else if (document.webkitExitFullscreen) { /* Safari */
      await document.webkitExitFullscreen()
    }
  } catch (err) {
    // ignore
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const handleEsc = (e) => {
  if (e.key === 'Escape') {
    exitFullscreen()
  }
}

const handleFullscreenChange = () => {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    isFullscreen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEsc)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }

  /*
    注意：我们在 style 中设置了 padding-left: 100vw。
    动画从 translateX(0) 开始（此时由于 padding-left，文字在屏幕右侧外）。
    结束时 translateX(-100%)，这里的 100% 是指元素自身的宽度。
    这样可以保证文字完全从右边出来，完全走到左边消失，无论文字多长。
  */
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

@keyframes fadeOut {
  0% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
.animate-scroll {
  animation-name: scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.animate-blink {
  animation: blink 0.5s step-end infinite alternate;

  /* 叠加 scroll 动画需要技巧，这里简单处理，如果开启闪烁，最好不要滚动太快，
     或者用嵌套 div 分离动画。为了演示简单，这里如果 blink 开启，scroll 可能会被样式覆盖问题影响。
     修正方案：将 blink 应用在 inner wrapper 或利用 animation composition (新特性)。
     稳妥方案：分开写 keyframes。
  */
}

/* 修正：让闪烁和滚动共存 */
.animate-scroll.animate-blink {
  animation: scroll linear infinite, blink 0.5s steps(2, start) infinite;
}
.animate-fade-out {
  animation: fadeOut 3s forwards;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgb(255 255 255 / 5%);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #a21caf;
}

@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.animate-blob { animation: blob 10s infinite; }

/* 覆盖 select 样式 */
input[type="range"] {
  appearance: none;
  background: transparent;
}
input[type="range"]::-webkit-slider-thumb {
  margin-top: -6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #d946ef;
  box-shadow: 0 0 10px rgb(217 70 239 / 50%);
  appearance: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #334155;
  cursor: pointer;
}
</style>
