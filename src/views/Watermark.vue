<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-cyan-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-cyan-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">隐私水印卫士</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          给身份证、证件照添加防盗水印。所有处理均在本地完成，<span class="font-bold text-slate-800">图片绝不上传</span>。
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：控制面板 -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1 h-6 bg-cyan-500 rounded-full" />
              <h2 class="text-lg font-bold text-slate-800">
                水印设置
              </h2>
            </div>

            <div class="space-y-5">
              <!-- 1. 文本内容 -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">水印文字</label>
                <input
                  v-model="config.text"
                  type="text"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                  placeholder="例如：仅供办理租房使用"
                >
              </div>

              <!-- 2. 颜色与大小 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">颜色</label>
                  <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                    <input type="color" v-model="config.color" class="w-8 h-8 rounded cursor-pointer border-none bg-transparent">
                    <span class="text-xs font-mono text-slate-600">{{ config.color }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">字体大小 ({{ config.fontSize }}px)</label>
                  <input
                    type="range"
                    v-model.number="config.fontSize"
                    min="12"
                    max="100"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-3"
                  >
                </div>
              </div>

              <!-- 3. 透明度与旋转 -->
              <div class="space-y-4 pt-2">
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-xs text-slate-500">透明度 ({{ Math.round(config.opacity * 100) }}%)</span>
                  </div>
                  <input
                    type="range"
                    v-model.number="config.opacity"
                    min="0.1"
                    max="1"
                    step="0.05"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  >
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-xs text-slate-500">旋转角度 ({{ config.rotate }}°)</span>
                  </div>
                  <input
                    type="range"
                    v-model.number="config.rotate"
                    min="-90"
                    max="90"
                    step="1"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  >
                </div>
              </div>

              <!-- 4. 间距设置 -->
              <div class="pt-2 border-t border-slate-100 space-y-4">
                <!-- 水平间距 -->
                <div>
                  <div class="flex justify-between mb-1 mt-2">
                    <span class="text-xs text-slate-500">水平间距 ({{ config.gapX }}px)</span>
                  </div>
                  <input
                    type="range"
                    v-model.number="config.gapX"
                    min="50"
                    max="500"
                    step="10"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  >
                </div>

                <!-- 垂直间距 -->
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-xs text-slate-500">垂直间距/行距 ({{ config.gapY }}px)</span>
                  </div>
                  <input
                    type="range"
                    v-model.number="config.gapY"
                    min="50"
                    max="500"
                    step="10"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 操作说明 -->
          <div class="bg-blue-50/80 rounded-2xl p-5 border border-blue-100 text-sm text-blue-800">
            <strong>🛡️ 安全提示：</strong><br>
            建议在办理业务时，注明“仅供 XX 机构办理 XX 业务使用，他用无效”，可有效防止个人信息泄露。
          </div>
        </div>

        <!-- 右侧：预览与操作 -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 min-h-[500px] flex flex-col relative">
            <!-- 顶部工具条 -->
            <div class="flex justify-between items-center mb-4">
              <div class="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" v-if="imageUrl" />
                {{ imageUrl ? '实时预览' : '请上传图片' }}
              </div>
              <div v-if="imageUrl">
                <button @click="triggerUpload" class="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                  更换图片
                </button>
              </div>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              >
            </div>

            <!-- 画布区域 -->
            <div class="flex-1 bg-slate-100/50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative group">
              <!-- 棋盘格背景 -->
              <div class="absolute inset-0 z-0 opacity-20" style="background-image: linear-gradient(45deg, #cccccc 25%, transparent 25%), linear-gradient(-45deg, #cccccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cccccc 75%), linear-gradient(-45deg, transparent 75%, #cccccc 75%); background-size: 20px 20px;" />

              <div v-if="!imageUrl" class="relative z-10 text-center cursor-pointer p-10" @click="triggerUpload">
                <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl mx-auto mb-4 text-slate-400 group-hover:text-cyan-500 transition-colors">
                  📷
                </div>
                <p class="text-slate-500 font-medium">
                  点击上传身份证/照片
                </p>
              </div>

              <!-- 实际 Canvas -->
              <canvas ref="canvasRef" class="max-w-full max-h-[600px] shadow-lg relative z-10" v-show="imageUrl" />
            </div>

            <!-- 底部下载 -->
            <div class="mt-6 flex justify-end">
              <button
                @click="downloadImage"
                :disabled="!imageUrl"
                class="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
                保存加水印图片
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

// ---------------- 配置状态 ----------------
const config = reactive({
  text: '仅供办理业务使用 他用无效',
  color: '#000000', // 默认黑色
  fontSize: 24,
  opacity: 0.3,
  rotate: -30,
  gapX: 150, // 新增：水平间距
  gapY: 150 // 新增：垂直间距 (行距)
})

const imageUrl = ref('')
const fileInput = ref(null)
const canvasRef = ref(null)
let originalImage = null // 保存原始 Image 对象

// ---------------- 方法 ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    imageUrl.value = event.target.result
    loadImage(event.target.result)
  }
  reader.readAsDataURL(file)
}

const loadImage = (src) => {
  const img = new Image()
  img.onload = () => {
    originalImage = img
    draw()
  }
  img.src = src
}

// 核心绘制逻辑
const draw = () => {
  if (!originalImage || !canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // 1. 设置画布尺寸为图片原始尺寸 (保证高清)
  canvas.width = originalImage.width
  canvas.height = originalImage.height

  // 2. 绘制原图
  ctx.drawImage(originalImage, 0, 0)

  // 3. 配置水印样式
  ctx.font = `bold ${config.fontSize * (canvas.width / 1000 * 2.5)}px sans-serif` // 字体大小随图片尺寸自适应
  // 如果图片很小，字体不能太小，加个基准倍数
  const baseScale = Math.max(1, canvas.width / 1000)
  ctx.font = `bold ${config.fontSize * baseScale}px sans-serif`

  ctx.fillStyle = config.color
  ctx.globalAlpha = config.opacity
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  // 4. 计算平铺逻辑
  // 为了旋转后能覆盖全图，生成的网格区域需要比画布大
  const text = config.text || 'Watermark'

  // 分别计算 X 和 Y 的实际像素间距
  const gapX = config.gapX * baseScale
  const gapY = config.gapY * baseScale

  const rotateRad = config.rotate * Math.PI / 180

  // 保存状态进行旋转
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(rotateRad)
  ctx.translate(-canvas.width / 2, -canvas.height / 2)

  // 计算覆盖对角线长度，确保旋转后不留白
  const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2)
  const limit = diagonal // 向四周扩展范围

  // 使用行索引 (rowIndex) 来控制错位，比用坐标计算更准确
  let rowIndex = 0

  // 外层循环控制 Y 轴 (垂直/行)
  for (let y = -limit; y < limit * 2; y += gapY) {
    // 错位排列逻辑：偶数行不偏移，奇数行向右偏移一半的 gapX
    const offsetX = rowIndex % 2 === 0 ? 0 : gapX / 2

    // 内层循环控制 X 轴 (水平)
    for (let x = -limit; x < limit * 2; x += gapX) {
      ctx.fillText(text, x + offsetX, y)
    }

    rowIndex++
  }

  // 恢复状态
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalAlpha = 1.0
}

const downloadImage = () => {
  if (!canvasRef.value) return
  const link = document.createElement('a')
  link.download = `watermark_${Date.now()}.png`
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}

// ---------------- 监听变化 ----------------
// 监听所有配置项，变化时重绘
watch(config, () => {
  if (imageUrl.value) requestAnimationFrame(draw)
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
