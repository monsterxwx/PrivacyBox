<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-amber-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角金色 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角深灰 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-slate-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间橙色 -->
    <div class="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-12">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-amber-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">文件加密保险箱</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          银行级 AES-256 加密。在本地给您的敏感文件上一把锁，没有密码谁也打不开。
        </p>
      </div>

      <!-- 模式切换 Tab -->
      <div class="flex justify-center mb-8">
        <div class="bg-white/60 backdrop-blur rounded-2xl p-1.5 shadow-sm border border-white/50 flex">
          <button
            @click="mode = 'encrypt'"
            class="px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            :class="mode === 'encrypt' ? 'bg-slate-800 text-amber-400 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-700'"
          >
            🔒 加密文件
          </button>
          <button
            @click="mode = 'decrypt'"
            class="px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            :class="mode === 'decrypt' ? 'bg-white text-emerald-600 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-700'"
          >
            🔓 解密文件
          </button>
        </div>
      </div>

      <!-- 主卡片 -->
      <div class="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden relative min-h-[500px] flex flex-col transition-all duration-500">
        <!-- 装饰线 -->
        <div class="h-2 w-full bg-gradient-to-r" :class="mode === 'encrypt' ? 'from-amber-400 to-orange-500' : 'from-emerald-400 to-teal-500'" />

        <div class="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center">
          <!-- 1. 文件上传区 -->
          <div
            v-if="!file"
            class="w-full border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all group relative overflow-hidden"
            :class="mode === 'encrypt' ? 'border-amber-200 hover:border-amber-400 hover:bg-amber-50' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'"
            @click="triggerUpload"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div class="relative z-10">
              <div
                class="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-sm transition-transform group-hover:scale-110"
                :class="mode === 'encrypt' ? 'bg-amber-100 text-amber-500' : 'bg-emerald-100 text-emerald-500'"
              >
                {{ mode === 'encrypt' ? '🛡️' : '🔑' }}
              </div>
              <h3 class="text-xl font-bold text-slate-700 mb-2">
                {{ mode === 'encrypt' ? '点击上传要加密的文件' : '点击上传已加密的 .enc 文件' }}
              </h3>
              <p class="text-slate-400 text-sm">
                支持任意格式 • 建议小于 50MB
              </p>
            </div>

            <!-- 隐藏 Input -->
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              @change="handleFileChange"
            >
          </div>

          <!-- 2. 密码输入与操作区 -->
          <div v-else class="w-full max-w-md animate-fade-in-up">
            <!-- 文件信息卡片 -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 mb-6 relative group">
              <div class="text-3xl">
                {{ getFileIcon(file.name) }}
              </div>
              <div class="text-left min-w-0 flex-1">
                <div class="font-bold text-slate-700 truncate">
                  {{ file.name }}
                </div>
                <div class="text-xs text-slate-400">
                  {{ (file.size / 1024).toFixed(1) }} KB
                </div>
              </div>
              <button @click="reset" class="text-slate-300 hover:text-red-500 p-2">
                ✕
              </button>
            </div>

            <!-- 密码输入框 -->
            <div class="space-y-4">
              <div>
                <label class="block text-left text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {{ mode === 'encrypt' ? '设置密码' : '输入密码' }}
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none transition-all font-mono tracking-widest"
                    :class="mode === 'encrypt' ? 'focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10' : 'focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10'"
                    placeholder="••••••"
                  >
                  <button @click="showPassword = !showPassword" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    {{ showPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
                <p v-if="mode === 'encrypt'" class="text-left text-xs text-amber-600 mt-2 flex items-center gap-1">
                  ⚠️ 请务必记住密码，一旦丢失无法找回！
                </p>
              </div>

              <!-- 执行按钮 -->
              <button
                @click="processFile"
                :disabled="!password || isProcessing"
                class="w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                :class="mode === 'encrypt'
                  ? 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 shadow-slate-900/20'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/30'"
              >
                <span v-if="isProcessing" class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                {{ buttonText }}
              </button>
            </div>
          </div>

          <!-- 进度条 (处理大文件时显示) -->
          <div v-if="isProcessing" class="w-full max-w-md mt-6">
            <div class="flex justify-between text-xs text-slate-500 mb-1">
              <span>处理中...</span>
              <span>{{ progress }}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="mode === 'encrypt' ? 'bg-amber-400' : 'bg-emerald-400'"
                :style="{ width: progress + '%' }"
              />
            </div>
            <p class="text-xs text-slate-400 mt-2">
              正在进行 AES-256 运算，请勿关闭页面
            </p>
          </div>
        </div>
      </div>

      <!-- 安全声明 -->
      <div class="mt-8 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-200/50 rounded-full text-slate-500 text-xs font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          ><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          本地加密 • 无后门 • 纯内存计算
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'
import { saveAs } from 'file-saver'

// ---------------- 状态管理 ----------------
const mode = ref('encrypt') // 'encrypt' | 'decrypt'
const file = ref(null)
const password = ref('')
const showPassword = ref(false)
const isProcessing = ref(false)
const progress = ref(0)
const fileInput = ref(null)

// ---------------- 计算属性 ----------------
const buttonText = computed(() => {
  if (isProcessing.value) return mode.value === 'encrypt' ? '加密中...' : '解密中...'
  return mode.value === 'encrypt' ? '🔒 立即加密下载' : '🔓 立即解密下载'
})

// ---------------- 交互逻辑 ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  const selected = e.target.files[0]
  if (selected) validateAndSetFile(selected)
  e.target.value = ''
}

const handleDrop = (e) => {
  const selected = e.dataTransfer.files[0]
  if (selected) validateAndSetFile(selected)
}

const validateAndSetFile = (f) => {
  // 简单的文件大小提示 (前端 JS 处理大文件 Crypto 会卡顿，建议限制)
  if (f.size > 50 * 1024 * 1024) {
    alert('为了保证浏览器不卡顿，建议上传 50MB 以内的文件。')
  }
  file.value = f
  password.value = ''
  progress.value = 0
}

const reset = () => {
  file.value = null
  password.value = ''
  progress.value = 0
}

const getFileIcon = (name) => {
  if (name.endsWith('.enc')) return '🔐'
  if (name.match(/\.(jpg|jpeg|png|gif)$/i)) return '🖼️'
  if (name.match(/\.(pdf)$/i)) return '📄'
  if (name.match(/\.(zip|rar)$/i)) return '📦'
  return '📁'
}

// ---------------- 核心加密/解密逻辑 ----------------
const processFile = () => {
  if (!file.value || !password.value) return
  isProcessing.value = true
  progress.value = 10

  const reader = new FileReader()

  if (mode.value === 'encrypt') {
    // ================= 加密流程 =================
    reader.onload = (e) => {
      progress.value = 30
      // 使用 setTimeout 让出主线程，以便 UI 能更新进度条
      setTimeout(() => {
        try {
          const fileData = e.target.result // Base64 字符串

          // 封装数据包 (保留文件名)
          const dataObj = { n: file.value.name, d: fileData }
          const jsonStr = JSON.stringify(dataObj)

          // AES 加密
          const encrypted = CryptoJS.AES.encrypt(jsonStr, password.value).toString()
          progress.value = 90

          // 保存为 .enc 文件
          const blob = new Blob([encrypted], { type: 'text/plain' })
          saveAs(blob, `${file.value.name}.enc`)
          isProcessing.value = false
        } catch (err) {
          console.error(err)
          alert('加密失败，文件可能过大导致内存不足')
          isProcessing.value = false
        }
      }, 50)
    }
    // 加密时：读取文件为 Base64
    reader.readAsDataURL(file.value)
  } else {
    // ================= 解密流程 =================
    reader.onload = (e) => {
      progress.value = 30
      setTimeout(() => {
        try {
          const encryptedStr = e.target.result

          // AES 解密
          const decryptedBytes = CryptoJS.AES.decrypt(encryptedStr, password.value)
          const decryptedStr = decryptedBytes.toString(CryptoJS.enc.Utf8)

          if (!decryptedStr) throw new Error('密码错误或文件损坏')

          progress.value = 70

          const dataObj = JSON.parse(decryptedStr)

          // 还原文件
          // dataObj.d 是 Base64 字符串 (e.g., "data:image/png;base64,....")
          // 我们需要解析 Base64 并转回 Blob
          const arr = dataObj.d.split(',')
          const mime = arr[0].match(/:(.*?);/)[1]
          const bstr = atob(arr[1])
          let n = bstr.length
          const u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          const blob = new Blob([u8arr], { type: mime })

          progress.value = 90
          saveAs(blob, dataObj.n) // 使用原始文件名下载
          isProcessing.value = false
        } catch (err) {
          console.error(err)
          alert('解密失败：密码错误或文件不是有效的加密包')
          isProcessing.value = false
        }
      }, 50)
    }
    // 解密时：读取文件为纯文本
    reader.readAsText(file.value)
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
