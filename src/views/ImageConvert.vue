<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-purple-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 颜色换成偏紫色系，区分于PDF工具 -->
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-purple-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">图片格式工场</span>
        </h1>
        <p class="text-slate-600">
          WebP / PNG / JPEG 极速互转，无损压缩。
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- 左侧：操作区 (占 8 列) -->
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 min-h-[500px] flex flex-col justify-center transition-all">
            <div v-if="!file" class="w-full">
              <FileUploader
                accept="image/*"
                hint="支持 PNG, JPG, WebP"
                @files-selected="f => file = f[0]"
              />
            </div>

            <div v-else class="w-full h-full flex flex-col">
              <!-- 预览区域：增加棋盘格背景，方便看透明图片 -->
              <div
                class="relative flex-1 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-4 min-h-[300px]"
                style=" background-position: 0 0, 0 10px, 10px -10px, -10px 0; background-size: 20px 20px;background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);"
              >
                <img :src="previewUrl" class="max-w-full max-h-[400px] object-contain shadow-lg rounded-lg">

                <!-- 悬浮的文件名 -->
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-slate-600 shadow-sm border border-slate-200">
                  {{ file.name }}
                </div>
              </div>

              <div class="mt-6 flex justify-between items-center">
                <button @click="file = null" class="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  ><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  重选图片
                </button>
                <div class="text-xs text-slate-400">
                  原始大小: {{ formatSize(file.size) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：设置区 (占 4 列) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sticky top-8">
            <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span class="w-1 h-6 bg-purple-500 rounded-full" />
              输出设置
            </h2>

            <div class="space-y-6">
              <!-- 格式选择 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">目标格式</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="fmt in ['webp', 'jpeg', 'png']"
                    :key="fmt"
                    @click="targetFormat = `image/${fmt}`"
                    class="px-2 py-2 rounded-lg text-sm font-medium border transition-all"
                    :class="targetFormat === `image/${fmt}` ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'"
                  >
                    {{ fmt.toUpperCase() }}
                  </button>
                </div>
              </div>

              <!-- 质量滑块 -->
              <div v-if="targetFormat !== 'image/png'">
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-medium text-slate-700">压缩质量</label>
                  <span class="text-sm font-mono text-purple-600 bg-purple-50 px-2 rounded">{{ Math.round(quality * 100) }}%</span>
                </div>
                <input
                  type="range"
                  v-model.number="quality"
                  min="0.1"
                  max="1"
                  step="0.05"
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                >
                <p class="text-xs text-slate-400 mt-2">
                  值越小体积越小，但画质越差。
                </p>
              </div>

              <div class="pt-4 border-t border-slate-100">
                <button
                  @click="convertImage"
                  :disabled="!file"
                  class="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  开始转换并下载
                </button>
              </div>
            </div>
          </div>

          <!-- 小贴士卡片 -->
          <div class="bg-blue-50/80 backdrop-blur rounded-2xl p-5 border border-blue-100 text-sm text-blue-800 leading-relaxed">
            <strong>💡 开发者提示：</strong><br>
            WebP 格式通常比 JPEG 小 30% 且画质更好。如果是透明背景图，请选择 WebP 或 PNG。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import FileUploader from '@/components/FileUploader.vue'
import { saveAs } from 'file-saver'

const file = ref(null)
const targetFormat = ref('image/webp')
const quality = ref(0.8)
const previewUrl = ref('')

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

watch(file, (newFile) => {
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile)
  } else {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
})

const convertImage = () => {
  if (!file.value) return
  const img = new Image()
  img.src = previewUrl.value
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        const ext = targetFormat.value.split('/')[1]
        saveAs(blob, `privacy_box_${Date.now()}.${ext}`)
      }
    }, targetFormat.value, quality.value)
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
</style>
