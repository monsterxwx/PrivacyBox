<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-indigo-100">
    <!-- ================= 背景特效 (靛蓝/天空蓝) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角靛蓝 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角天空蓝 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间紫 -->
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-violet-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">Base64 全能转换</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          开发者的万能翻译机。文本防乱码编码，图片一键转 CSS/HTML 代码。
        </p>
      </div>

      <!-- 模式切换 Tabs -->
      <div class="flex justify-center mb-8">
        <div class="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-sm inline-flex">
          <button
            v-for="m in ['text', 'image']"
            :key="m"
            @click="activeTab = m"
            class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2"
            :class="activeTab === m ? 'bg-white text-indigo-600 shadow-md shadow-slate-200' : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'"
          >
            <span v-if="m === 'text'">🔡 文本加解密</span>
            <span v-else>🖼️ 图片转码</span>
          </button>
        </div>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- ========================= 左侧：输入区域 ========================= -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col h-full min-h-[400px]">
            <!-- 场景 A: 文本输入 -->
            <div v-if="activeTab === 'text'" class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-slate-700 flex items-center gap-2">
                  <span class="w-1.5 h-5 bg-indigo-500 rounded-full" />
                  输入内容
                </h3>
                <div class="flex gap-2">
                  <button
                    @click="textInput = ''"
                    class="text-xs px-2 py-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                    title="清空"
                  >
                    清空
                  </button>
                </div>
              </div>
              <textarea
                v-model="textInput"
                class="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none font-mono text-sm leading-relaxed custom-scrollbar"
                placeholder="在此输入要编码或解码的文本..."
              />

              <div class="mt-4 flex gap-3">
                <button
                  @click="processText('encode')"
                  class="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  ⬇️ 编码 (Encode)
                </button>
                <button
                  @click="processText('decode')"
                  class="flex-1 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  解码 (Decode) ⬆️
                </button>
              </div>
            </div>

            <!-- 场景 B: 图片上传 -->
            <div v-else class="flex flex-col items-center justify-center h-full">
              <div
                class="w-full h-full min-h-[300px] relative group rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center transition-all cursor-pointer"
                :class="{'border-indigo-400 bg-indigo-50/30': isDragging}"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerUpload"
              >
                <div v-if="!imgData" class="text-center p-8">
                  <div class="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl mx-auto mb-4 text-slate-300 group-hover:text-indigo-500 transition-colors group-hover:scale-110 duration-300">
                    📂
                  </div>
                  <h3 class="font-bold text-slate-700 text-lg mb-1">
                    点击或拖拽图片
                  </h3>
                  <p class="text-slate-500 text-xs mt-2 max-w-[200px] mx-auto">
                    支持 PNG, JPG, GIF, SVG, WebP<br>建议小于 1MB 以免卡顿
                  </p>
                </div>

                <div v-else class="relative w-full h-full p-4 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMMCA0TDQgNEw0IDBaIiBmaWxsPSIjZjFmMhZjIi8+CjxwYXRoIGQ9Ik00IDRMNCA4TDggOEw4IDRaIiBmaWxsPSIjZjFmMhZjIi8+Cjwvc3ZnPg==')]">
                  <img :src="imgData" class="max-w-full max-h-[300px] object-contain shadow-lg rounded-lg">
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
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              >
            </div>
          </div>
        </div>

        <!-- ========================= 右侧：结果区域 ========================= -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 flex-1 flex flex-col min-h-[400px]">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-sky-500 rounded-full" />
                <span v-if="activeTab === 'text'">转换结果</span>
                <span v-else>代码生成</span>
              </h2>

              <!-- 复制按钮 -->
              <button
                v-if="outputContent"
                @click="copyResult"
                class="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                <span v-if="copied">✅ 已复制</span>
                <span v-else>📋 复制结果</span>
              </button>
            </div>

            <!-- 场景 A: 文本结果 -->
            <div v-if="activeTab === 'text'" class="flex-1 relative">
              <textarea
                readonly
                v-model="outputContent"
                class="w-full h-full min-h-[300px] bg-slate-900 rounded-2xl p-4 text-indigo-300 font-mono text-sm leading-relaxed focus:outline-none custom-scrollbar selection:bg-indigo-500 selection:text-white"
                placeholder="结果将显示在这里..."
              />
              <!-- 错误提示 -->
              <div v-if="errorMsg" class="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white text-sm px-4 py-2 rounded-lg backdrop-blur shadow-lg animate-bounce">
                ❌ {{ errorMsg }}
              </div>
            </div>

            <!-- 场景 B: 图片代码结果 -->
            <div v-else class="flex-1 flex flex-col gap-4">
              <div v-if="!imgData" class="flex-1 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div class="text-3xl mb-2 opacity-30">
                  ⌨️
                </div>
                <p class="text-sm">
                  上传图片后自动生成代码
                </p>
              </div>

              <div v-else class="space-y-4">
                <!-- 格式选择 Tabs -->
                <div class="flex gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
                  <button
                    v-for="fmt in imgFormats"
                    :key="fmt.id"
                    @click="activeImgFormat = fmt.id"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                    :class="activeImgFormat === fmt.id ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'"
                  >
                    {{ fmt.label }}
                  </button>
                </div>

                <!-- 代码显示 -->
                <div class="relative group flex-1">
                  <textarea
                    readonly
                    :value="formattedImgCode"
                    class="w-full h-full min-h-[250px] bg-slate-900 rounded-2xl p-4 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none custom-scrollbar selection:bg-emerald-500 selection:text-white break-all"
                  />
                  <!-- 悬浮复制 -->
                  <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="copyResult" class="bg-white/10 backdrop-blur hover:bg-white/20 text-white p-2 rounded-lg">
                      <span v-if="copied" class="text-xs">Copied!</span>
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      ><path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" /><path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" /></svg>
                    </button>
                  </div>
                </div>

                <!-- 统计信息 -->
                <div class="text-xs text-slate-400 flex justify-between px-1">
                  <span>Size: {{ imgSize }}</span>
                  <span>Chars: {{ imgData.length }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// ---------------- 状态管理 ----------------
const activeTab = ref('text') // 'text' | 'image'
const copied = ref(false)

// 文本模式
const textInput = ref('')
const textOutput = ref('') // 存储文本模式的输出
const errorMsg = ref('')

// 图片模式
const fileInput = ref(null)
const isDragging = ref(false)
const imgData = ref('')
const imgSize = ref('0 KB')
const activeImgFormat = ref('base64')

const imgFormats = [
  { id: 'base64', label: 'Raw Base64' },
  { id: 'datauri', label: 'Data URI' },
  { id: 'css', label: 'CSS Background' },
  { id: 'html', label: 'HTML <img />' }
]

// ---------------- 核心逻辑：文本 ----------------
// 为了解决中文乱码，使用 encodeURIComponent 方案
const utf8_to_b64 = (str) => {
  try {
    return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode('0x' + p1)
    }))
  } catch (e) {
    throw new Error('编码失败')
  }
}

const b64_to_utf8 = (str) => {
  try {
    return decodeURIComponent(window.atob(str).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  } catch (e) {
    throw new Error('无效的 Base64 字符串')
  }
}

const processText = (mode) => {
  errorMsg.value = ''
  if (!textInput.value) {
    textOutput.value = ''
    return
  }

  try {
    if (mode === 'encode') {
      textOutput.value = utf8_to_b64(textInput.value)
    } else {
      textOutput.value = b64_to_utf8(textInput.value)
    }
  } catch (e) {
    errorMsg.value = e.message
    setTimeout(() => errorMsg.value = '', 3000)
  }
}

// ---------------- 核心逻辑：图片 ----------------
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
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }

  // 计算大小
  const size = file.size / 1024
  imgSize.value = size > 1024
    ? (size / 1024).toFixed(2) + ' MB'
    : size.toFixed(2) + ' KB'

  const reader = new FileReader()
  reader.onload = (e) => {
    imgData.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// ---------------- 计算属性：统一输出内容 ----------------
const formattedImgCode = computed(() => {
  if (!imgData.value) return ''
  const raw = imgData.value
  const base64Only = raw.split(',')[1] || raw

  switch (activeImgFormat.value) {
    case 'base64': return base64Only
    case 'datauri': return raw
    case 'css': return `background-image: url('${raw}');`
    case 'html': return `<img src="${raw}" alt="base64-img" />`
    default: return raw
  }
})

// 根据当前 Tab 决定 outputContent 用于显示和复制
const outputContent = computed({
  get: () => activeTab.value === 'text' ? textOutput.value : formattedImgCode.value,
  set: (val) => { if (activeTab.value === 'text') textOutput.value = val }
})

// ---------------- 交互动作 ----------------
const copyResult = async () => {
  if (!outputContent.value) return
  try {
    await navigator.clipboard.writeText(outputContent.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error(err)
  }
}

// 切换 Tab 时清空错误
watch(activeTab, () => {
  errorMsg.value = ''
})

</script>

<style scoped>
/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 3px; background: #334155; } /* slate-700 */
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }

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
