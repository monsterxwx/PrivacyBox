<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-fuchsia-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角紫红 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角青色 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间紫色 -->
    <div class="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-violet-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <!-- 头部 -->
      <div class="text-center mb-12">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-cyan-600">二维码个性化</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          不仅仅是黑白方块。支持自定义颜色、嵌入 Logo 图标，让您的二维码脱颖而出。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：配置面板 -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1 h-6 bg-fuchsia-500 rounded-full" />
              <h2 class="text-lg font-bold text-slate-800">
                生成设置
              </h2>
            </div>

            <!-- 1. 内容输入 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-2">二维码内容 (文本/链接)</label>
              <textarea
                v-model="config.text"
                rows="3"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none transition-all resize-none text-sm"
                placeholder="https://example.com"
              />
            </div>

            <!-- 2. 外观样式 -->
            <div class="space-y-5">
              <!-- 颜色设置 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-slate-500 mb-2">前景色 (码点)</label>
                  <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 cursor-pointer hover:border-fuchsia-300 transition-colors relative">
                    <input type="color" v-model="config.darkColor" class="w-8 h-8 rounded border-none bg-transparent cursor-pointer">
                    <span class="text-xs font-mono text-slate-600 flex-1">{{ config.darkColor }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-slate-500 mb-2">背景色</label>
                  <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 cursor-pointer hover:border-fuchsia-300 transition-colors relative">
                    <input type="color" v-model="config.lightColor" class="w-8 h-8 rounded border-none bg-transparent cursor-pointer">
                    <span class="text-xs font-mono text-slate-600 flex-1">{{ config.lightColor }}</span>
                  </div>
                </div>
              </div>

              <!-- 容错率与边距 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-slate-500 mb-2">容错率 (建议 High)</label>
                  <select v-model="config.errorLevel" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-fuchsia-500">
                    <option value="L">
                      L (7%)
                    </option>
                    <option value="M">
                      M (15%)
                    </option>
                    <option value="Q">
                      Q (25%)
                    </option>
                    <option value="H">
                      H (30%) - 推荐
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-slate-500 mb-2">边距 (Margin)</label>
                  <select v-model.number="config.margin" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-fuchsia-500">
                    <option :value="0">
                      无边距
                    </option>
                    <option :value="1">
                      1x
                    </option>
                    <option :value="2">
                      2x
                    </option>
                    <option :value="4">
                      4x (默认)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 3. Logo 设置 -->
            <div class="mt-6 pt-6 border-t border-slate-100">
              <label class="block text-sm font-medium text-slate-700 mb-3 flex justify-between">
                <span>嵌入 Logo (中心图标)</span>
                <span v-if="logoUrl" @click="removeLogo" class="text-xs text-red-500 cursor-pointer hover:underline">移除 Logo</span>
              </label>

              <div
                v-if="!logoUrl"
                @click="triggerLogoUpload"
                class="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-4 text-center cursor-pointer hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-all text-slate-500 hover:text-fuchsia-600"
              >
                <div class="text-2xl mb-1">
                  🖼️
                </div>
                <div class="text-xs">
                  点击上传 Logo 图片
                </div>
                <input
                  type="file"
                  ref="logoInput"
                  accept="image/*"
                  class="hidden"
                  @change="handleLogoChange"
                >
              </div>

              <div v-else class="flex items-center gap-4 bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-3">
                <img :src="logoUrl" class="w-12 h-12 object-contain rounded-lg bg-white border border-slate-200 shadow-sm">
                <div class="flex-1">
                  <div class="text-xs text-slate-500 mb-1">
                    Logo 大小 ({{ config.logoSize }}%)
                  </div>
                  <input
                    type="range"
                    v-model.number="config.logoSize"
                    min="10"
                    max="30"
                    step="1"
                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  >
                </div>
              </div>
              <p class="text-[10px] text-slate-400 mt-2">
                提示：嵌入 Logo 时建议将容错率设置为 H (30%) 以确保可扫描。
              </p>
            </div>
          </div>
        </div>

        <!-- 右侧：预览与下载 -->
        <div class="lg:col-span-7 sticky top-8">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-10 flex flex-col items-center justify-center min-h-[500px] relative">
            <!-- 画布容器 -->
            <div class="flex-1 flex items-center justify-center w-full">
              <div
                class="relative group shadow-2xl rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 bg-white w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] aspect-square"
              >
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  class="w-full h-full object-contain"
                  alt="二维码预览"
                >
                <!-- 加个 loading 状态或占位符 -->
                <div v-else class="text-slate-300 text-xs">
                  生成中...
                </div>
              </div>
            </div>

            <!-- 按钮组 -->
            <div class="w-full grid grid-cols-1 gap-4 mt-10 max-w-xs mx-auto">
              <button
                @click="download"
                class="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 hover:-translate-y-0.5 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
                下载二维码 (PNG)
              </button>
            </div>

            <div class="text-center mt-4 text-xs text-slate-400">
              导出的图片分辨率为:1000x1000px • 纯本地生成
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'
import { saveAs } from 'file-saver'

// ---------------- 状态管理 ----------------
const config = reactive({
  text: 'https://github.com',
  darkColor: '#000000',
  lightColor: '#ffffff',
  errorLevel: 'H', // 默认高容错，方便加Logo
  margin: 1,
  logoSize: 20 // 百分比
})

const logoUrl = ref('')
const logoInput = ref(null)
const previewUrl = ref('')

// ---------------- 逻辑方法 ----------------

const triggerLogoUpload = () => logoInput.value.click()

const handleLogoChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (evt) => {
    logoUrl.value = evt.target.result
  }
  reader.readAsDataURL(file)
}

const removeLogo = () => {
  logoUrl.value = ''
  // 如果不强制置空 value，下次选同文件不会触发 change
  if (logoInput.value) logoInput.value.value = ''
}

// 核心生成逻辑
const generateQR = async () => {
  if (!config.text) return

  // 1. 创建一个内存中的虚拟 Canvas (不放在 DOM 里)
  const canvas = document.createElement('canvas')
  const size = 1000 // 设定高清分辨率

  try {
    // 2. 在虚拟 Canvas 上绘制基础二维码
    await QRCode.toCanvas(canvas, config.text, {
      width: size,
      margin: config.margin,
      color: {
        dark: config.darkColor,
        light: config.lightColor
      },
      errorCorrectionLevel: config.errorLevel
    })

    // 3. 如果有 Logo，绘制 Logo
    if (logoUrl.value) {
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = logoUrl.value

      await new Promise((resolve) => {
        img.onload = () => {
          const logoSizePx = size * (config.logoSize / 100)
          const x = (size - logoSizePx) / 2
          const y = (size - logoSizePx) / 2

          // 绘制圆角背景
          ctx.fillStyle = config.lightColor
          ctx.beginPath()
          const bgSize = logoSizePx + 40 // 白边稍微大一点
          const bgX = (size - bgSize) / 2
          const bgY = (size - bgSize) / 2
          ctx.roundRect(bgX, bgY, bgSize, bgSize, 40)
          ctx.fill()

          // 绘制 Logo
          ctx.drawImage(img, x, y, logoSizePx, logoSizePx)
          resolve()
        }
        // 防止图片加载失败卡死
        img.onerror = resolve
      })
    }

    // 4. 【关键步骤】：将 Canvas 转为图片 URL 赋值给 previewUrl
    previewUrl.value = canvas.toDataURL('image/png')
  } catch (err) {
    console.error(err)
  }
}
const download = () => {
  if (!previewUrl.value) return
  // 直接保存 previewUrl 里的 Base64 数据即可
  saveAs(previewUrl.value, `qrcode_${Date.now()}.png`)
}

// ---------------- 监听变化 ----------------
// 监听所有配置变动，自动重绘
watch([config, logoUrl], () => {
  // 防抖或 nextTick
  nextTick(generateQR)
}, { deep: true })

onMounted(() => {
  generateQR()
})
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
