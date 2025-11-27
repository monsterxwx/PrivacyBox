<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-orange-100">
    <!-- ================= 背景特效 (橙色/活力) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角橙色 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角黄色 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间粉红 -->
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-rose-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-orange-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Favicon 图标生成</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          一键生成网站所需的全套图标 (ICO, PNG, Apple Touch Icon)。<br>支持 PWA 标准，纯本地极速处理。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- ========================= 左侧：上传与设置 ========================= -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <span class="w-1.5 h-6 bg-orange-500 rounded-full" />
              上传 Logo
            </h2>

            <!-- 上传区域 -->
            <div
              class="w-full relative group rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 min-h-[300px] flex flex-col items-center justify-center transition-all cursor-pointer"
              :class="{'border-orange-400 bg-orange-50/30': isDragging}"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerUpload"
            >
              <div v-if="!sourceImage" class="text-center p-8">
                <div class="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl mx-auto mb-4 text-slate-300 group-hover:text-orange-500 transition-colors group-hover:scale-110 duration-300">
                  ✨
                </div>
                <h3 class="font-bold text-slate-700 text-lg mb-1">
                  点击或拖拽 Logo
                </h3>
                <p class="text-slate-500 text-xs mt-2 max-w-[200px] mx-auto">
                  建议上传 512x512 以上的 PNG 或 SVG 文件以获得最佳效果
                </p>
              </div>

              <div v-else class="relative w-full h-full p-8 flex items-center justify-center">
                <!-- 原图预览背景 (棋盘格) -->
                <div class="bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMMCA0TDQgNEw0IDBaIiBmaWxsPSIjZjFmMhZjIi8+CjxwYXRoIGQ9Ik00IDRMNCA4TDggOEw4IDRaIiBmaWxsPSIjZjFmMhZjIi8+Cjwvc3ZnPg==')] rounded-xl overflow-hidden shadow-lg">
                  <img :src="sourceImage" class="max-w-full max-h-[250px] object-contain">
                </div>

                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="text-white font-bold bg-white/20 backdrop-blur px-4 py-2 rounded-full border border-white/30">
                    更换图片
                  </span>
                </div>
              </div>
            </div>
            <input
              type="file"
              ref="fileInput"
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              class="hidden"
              @change="handleFileChange"
            >

            <!-- 裁切选项 (简化版) -->
            <div v-if="sourceImage" class="mt-6 space-y-4">
              <div class="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="bg-white p-2 rounded-lg shadow-sm text-orange-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    ><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /></svg>
                  </div>
                  <div>
                    <div class="font-bold text-slate-700 text-sm">
                      圆角处理
                    </div>
                    <div class="text-xs text-slate-500">
                      仅用于 App 图标 (iOS/Android)
                    </div>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.rounded" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
                </label>
              </div>

              <button
                @click="generateIcons"
                class="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <svg
                  v-if="isProcessing"
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                ><circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                <span v-else>🚀 开始生成</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ========================= 右侧：预览与下载 ========================= -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <!-- 效果预览卡片 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <span class="w-1.5 h-6 bg-amber-500 rounded-full" />
              真实效果预览
            </h2>

            <!-- 浏览器标签页模拟 -->
            <div class="bg-slate-100 rounded-lg border border-slate-300 overflow-hidden mb-6">
              <!-- 浏览器顶部栏 -->
              <div class="bg-slate-200 px-4 py-2 flex items-center gap-2 border-b border-slate-300">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-400" />
                  <div class="w-3 h-3 rounded-full bg-yellow-400" />
                  <div class="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <!-- 标签页 -->
                <div class="ml-4 bg-white rounded-t-lg px-3 py-1.5 text-xs text-slate-600 flex items-center gap-2 shadow-sm min-w-[150px]">
                  <img :src="previewIcon" class="w-4 h-4 object-contain">
                  <span class="font-medium">My Awesome Website</span>
                </div>
              </div>
              <!-- 浏览器内容区 -->
              <div class="h-24 bg-white flex items-center justify-center text-slate-300 text-sm">
                Web Content Area
              </div>
            </div>

            <!-- 应用图标模拟 (App Icon) -->
            <div class="flex items-center gap-8 justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div class="text-center">
                <div class="w-16 h-16 rounded-2xl shadow-md bg-white mb-2 overflow-hidden mx-auto">
                  <img v-if="generatedList.length > 0" :src="getIconUrl(180)" class="w-full h-full object-contain">
                  <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    Icon
                  </div>
                </div>
                <span class="text-xs text-slate-500">iPhone Home</span>
              </div>
              <div class="text-center">
                <div class="w-14 h-14 rounded-full shadow-md bg-white mb-2 overflow-hidden mx-auto flex items-center justify-center">
                  <img v-if="generatedList.length > 0" :src="getIconUrl(192)" class="w-10 h-10 object-contain">
                  <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    Icon
                  </div>
                </div>
                <span class="text-xs text-slate-500">Android Chrome</span>
              </div>
            </div>
          </div>

          <!-- 生成列表与下载 -->
          <div v-if="generatedList.length > 0" class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 flex-1 flex flex-col animate-fade-in-up">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-slate-800">
                生成清单 ({{ generatedList.length }})
              </h3>
              <button
                @click="downloadAll"
                class="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
              >
                <div class="i-tabler-download" />
                打包下载 ZIP
              </button>
            </div>

            <div class="flex-1 overflow-hidden relative border border-slate-200 rounded-xl bg-white">
              <div class="absolute inset-0 overflow-y-auto custom-scrollbar">
                <table class="w-full text-left text-sm">
                  <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0">
                    <tr>
                      <th class="px-4 py-3">
                        预览
                      </th>
                      <th class="px-4 py-3">
                        文件名
                      </th>
                      <th class="px-4 py-3">
                        尺寸
                      </th>
                      <th class="px-4 py-3 text-right">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="item in generatedList" :key="item.name" class="hover:bg-slate-50/80 transition-colors">
                      <td class="px-4 py-2">
                        <div class="w-8 h-8 border border-slate-200 rounded bg-white flex items-center justify-center overflow-hidden">
                          <img :src="item.url" class="max-w-full max-h-full">
                        </div>
                      </td>
                      <td class="px-4 py-2 font-mono text-slate-600 text-xs">
                        {{ item.name }}
                      </td>
                      <td class="px-4 py-2 text-slate-500 text-xs">
                        {{ item.size }}x{{ item.size }}
                      </td>
                      <td class="px-4 py-2 text-right">
                        <button
                          @click="downloadSingle(item)"
                          class="text-orange-500 hover:text-orange-600 p-1.5 rounded-md hover:bg-orange-50 transition-colors"
                          title="下载单张"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          ><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><polyline points="7 11 12 16 17 11" /><line
                            x1="12"
                            y1="16"
                            x2="12"
                            y2="4"
                          /></svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

// ---------------- 状态管理 ----------------
const sourceImage = ref('')
const fileInput = ref(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const generatedList = ref([])

const settings = reactive({
  rounded: false // 是否为大图标生成圆角
})

// 需要生成的配置清单
const CONFIG = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon.ico' }, // 虽然扩展名是 ico，但为了兼容性我们通常写入 32或48 的 PNG 数据，或者这里我们单独处理
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
]

// ---------------- 交互逻辑 ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
  e.target.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

const processFile = (file) => {
  if (!file.type.match('image.*')) {
    alert('请上传图片文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    sourceImage.value = e.target.result
    // 清空上次结果，强制用户重新点击生成
    generatedList.value = []
  }
  reader.readAsDataURL(file)
}

// ---------------- 核心逻辑：生成图标 ----------------
const generateIcons = async () => {
  if (!sourceImage.value) return
  isProcessing.value = true

  // 模拟一点延迟让 UI 反应
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    const img = new Image()
    img.src = sourceImage.value
    await img.decode()

    const results = []

    for (const conf of CONFIG) {
      const canvas = document.createElement('canvas')
      canvas.width = conf.size
      canvas.height = conf.size
      const ctx = canvas.getContext('2d')

      // 启用高质量缩放
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // 圆角处理 (仅针对 180, 192, 512 这种大图标)
      if (settings.rounded && conf.size >= 180) {
        const radius = conf.size * 0.18 // 仿 iOS 圆角比例
        ctx.beginPath()
        ctx.moveTo(radius, 0)
        ctx.lineTo(conf.size - radius, 0)
        ctx.quadraticCurveTo(conf.size, 0, conf.size, radius)
        ctx.lineTo(conf.size, conf.size - radius)
        ctx.quadraticCurveTo(conf.size, conf.size, conf.size - radius, conf.size)
        ctx.lineTo(radius, conf.size)
        ctx.quadraticCurveTo(0, conf.size, 0, conf.size - radius)
        ctx.lineTo(0, radius)
        ctx.quadraticCurveTo(0, 0, radius, 0)
        ctx.closePath()
        ctx.clip()
      }

      ctx.drawImage(img, 0, 0, conf.size, conf.size)

      // 转换为 Blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const url = URL.createObjectURL(blob)

      results.push({
        ...conf,
        blob,
        url
      })
    }

    generatedList.value = results
  } catch (error) {
    console.error(error)
    alert('生成失败，请检查图片格式')
  } finally {
    isProcessing.value = false
  }
}

// ---------------- 计算属性与工具函数 ----------------
const previewIcon = computed(() => {
  // 优先显示 16x16 或 32x32 的结果，如果没有生成则显示原图
  const small = generatedList.value.find(i => i.size === 32)
  return small ? small.url : (sourceImage.value || '')
})

const getIconUrl = (size) => {
  const item = generatedList.value.find(i => i.size === size)
  return item ? item.url : ''
}

// ---------------- 下载逻辑 ----------------
const downloadSingle = (item) => {
  saveAs(item.blob, item.name)
}

const downloadAll = async () => {
  const zip = new JSZip()
  const folder = zip.folder('favicons')

  generatedList.value.forEach(item => {
    folder.file(item.name, item.blob)
  })

  // 生成一个简单的 HTML 引用代码片段
  const htmlCode = `
<!-- Favicon Setup -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
  `.trim()

  folder.file('head-tags.html', htmlCode)

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'favicons_package.zip')
}

</script>

<style scoped>
/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 3px; background: #cbd5e1; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
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
