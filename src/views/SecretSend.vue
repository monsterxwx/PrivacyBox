<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-amber-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-40" style="background-image: radial-gradient(#94a3b8 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-amber-400 rounded-full mix-blend-multiply filter blur-[140px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-orange-400 rounded-full mix-blend-multiply filter blur-[130px] opacity-40 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-amber-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">私密瞬传</span>
        </h1>
        <p class="text-slate-600 max-w-2xl">
          端到端 AES-256 加密 · 纯前端加密 · 阅后即焚
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- 左侧：上传区 -->
        <div class="lg:col-span-7 space-y-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 min-h-[500px]">
            <div v-if="!shareLink && !isDownloading">
              <!-- 文件上传器 -->
              <FileUploader
                accept="*/*"
                multiple
                :hint="`点击或拖拽文件到此处`"
                @files-selected="handleFiles"
              />

              <!-- 文件列表 -->
              <div v-if="files.length" class="mt-6 space-y-4">
                <div v-for="(f, index) in files" :key="index" class="flex items-center justify-between p-4 bg-amber-50/70 rounded-xl border border-amber-200">
                  <div class="flex items-center gap-3 flex-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="text-amber-600"
                    ><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                    <div class="min-w-0">
                      <p class="font-medium text-slate-800 truncate">
                        {{ f.name }}
                      </p>
                      <p class="text-xs text-slate-500">
                        {{ formatSize(f.size) }}
                      </p>
                    </div>
                  </div>
                  <button @click="removeFile(index)" class="text-red-500 hover:text-red-700 transition-colors p-1 rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    ><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>

                <!-- 状态提示 -->
                <p v-if="files.length > 0" class="text-xs text-center text-slate-500">
                  总大小: {{ formatSize(totalSize) }} <span v-if="totalSize > maxSafeSize" class="text-orange-500">(注意：大文件加密可能导致页面卡顿)</span>
                </p>

                <!-- 上传按钮 -->
                <div class="pt-4 border-t border-slate-200">
                  <button
                    @click="encryptAndUpload"
                    :disabled="!files.length || uploading"
                    class="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/50 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                  >
                    <span v-if="uploading" class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    {{ uploading ? `处理中... ${uploadProgress}%` : '加密并生成分享链接' }}
                  </button>
                  <p v-if="uploading" class="text-xs text-center text-slate-500 mt-2">
                    {{ statusText }}
                  </p>
                </div>
              </div>

              <!-- 无文件提示 -->
              <div v-else class="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  class="mb-4"
                ><path d="M21.44 11.05l-1-1.55a2 2 0 0 1 0-2.88l1-1.55a2 2 0 0 1 1.5-1.22V3a2 2 0 0 0-2-2h-3.3a2 2 0 0 1-1.5-1.22l-1-1.55a2 2 0 0 1-2.88 0l-1 1.55a2 2 0 0 1-1.5 1.22H3a2 2 0 0 0-2 2v1.3a2 2 0 0 1 1.22 1.5l1.55 1a2 2 0 0 1 0 2.88l-1.55 1a2 2 0 0 1-1.22 1.5V21a2 2 0 0 0 2 2h3.3a2 2 0 0 1 1.5 1.22l1 1.55a2 2 0 0 1 2.88 0l1-1.55a2 2 0 0 1 1.5-1.22H21a2 2 0 0 0 2-2v-1.3a2 2 0 0 1-1.22-1.5l-1.55-1a2 2 0 0 1 0-2.88z" /><circle cx="12" cy="12" r="3" /></svg>
                <p>选择文件开始分享</p>
              </div>
            </div>

            <!-- 分享链接显示 -->
            <div v-else-if="shareLink && !isDownloading" class="text-center space-y-6">
              <div class="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <p class="text-sm text-amber-700 mb-3 font-semibold">
                  {{ usedProviderText }}
                </p>
                <input
                  :value="shareLink"
                  readonly
                  class="w-full px-4 py-3 bg-white/70 rounded-xl font-mono text-sm text-amber-800 cursor-pointer select-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                  @click="copyLink"
                >
                <div class="flex gap-2 mt-3">
                  <button @click="copyLink" class="flex-1 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
                    复制链接
                  </button>
                  <button @click="generateQR" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                    二维码
                  </button>
                </div>
              </div>
              <button @click="reset" class="w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors">
                再传一份
              </button>
            </div>

            <!-- 下载/解密中 -->
            <div v-else-if="isDownloading" class="text-center py-12 space-y-4">
              <div class="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p class="text-lg font-medium text-slate-700">
                {{ downloadStatus }}
              </p>
              <p class="text-sm text-slate-500">
                {{ downloadProgress }}
              </p>
            </div>
          </div>
        </div>

        <!-- 右侧：说明 -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sticky top-8">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-amber-500 rounded-full" />
              为什么安全？
            </h3>
            <ul class="space-y-3 text-sm text-slate-600">
              <li class="flex items-start gap-2">
                <span class="text-amber-600 mt-0.5">✓</span>
                <span><b>本地加密</b>：AES-256 加密在您的浏览器内完成，服务器只收到乱码。</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-amber-600 mt-0.5">✓</span>
                <span><b>代理也安全</b>：即使经过代理，由于内容已加密且密钥从未发送，中转方无法窥探内容。</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-amber-600 mt-0.5">✓</span>
                <span><b>密钥不联网</b>：解密密钥包含在链接哈希(#)中，浏览器不会将其发送给服务器。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 二维码模态 -->
    <div v-if="showQR" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <h3 class="text-lg font-bold mb-4 text-center">
          分享二维码
        </h3>
        <div class="flex justify-center mb-4">
          <canvas id="qrcode" />
        </div>
        <button @click="showQR = false" class="w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FileUploader from '@/components/FileUploader.vue'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import QRCode from 'qrcode'

// ================= 配置区域 =================
// 注意：纯前端大文件加密非常消耗内存，建议限制
const maxSafeSize = 500 * 1024 * 1024 // 500MB

// ================= 状态管理 =================
const files = ref([])
const shareLink = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const statusText = ref('')
const usedProvider = ref('') // 'gofile' | 'fileio'

const isDownloading = ref(false)
const downloadStatus = ref('')
const downloadProgress = ref('')
const showQR = ref(false)

const totalSize = computed(() => files.value.reduce((sum, f) => sum + f.size, 0))
const usedProviderText = computed(() => {
  if (usedProvider.value === 'gofile') return 'GoFile 通道 (高速/大文件支持)'
  if (usedProvider.value === 'fileio') return 'File.io 通道 (阅后即焚)'
  return '加密分享链接'
})

// ================= 文件处理 =================
const handleFiles = (selectedFiles) => {
  files.value = Array.from(selectedFiles)
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const formatSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ================= 核心加密逻辑 (Web Crypto API) =================
const generateKey = async () => crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])

const encryptData = async (data, key) => {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)
  return { encrypted: new Uint8Array(encrypted), iv }
}

const decryptData = async (encrypted, key, iv) => {
  return await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
}

// ================= 智能上传策略 =================

/**
 * 策略1: GoFile (推荐)
 * 流程: 获取最佳服务器 -> 上传
 * 优点: 支持 CORS，支持大文件，速度快
 */
const uploadToGoFile = async (blob, fileName) => {
  statusText.value = '正在寻找最佳服务器 (GoFile)...'

  // 1. 获取服务器
  const serverRes = await fetch('https://api.gofile.io/servers')
  if (!serverRes.ok) throw new Error('GoFile 服务器连接失败')
  const serverData = await serverRes.json()
  if (serverData.status !== 'ok' || !serverData.data.servers?.length) throw new Error('无可用 GoFile 服务器')

  const server = serverData.data.servers[0].name
  const uploadUrl = `https://${server}.gofile.io/contents/uploadfile`

  statusText.value = `正在上传至 ${server}...`

  // 2. 上传
  const formData = new FormData()
  formData.append('file', blob, fileName)

  const res = await fetch(uploadUrl, { method: 'POST', body: formData })
  const json = await res.json()

  if (json.status === 'ok') {
    return json.data.downloadPage
  } else {
    throw new Error('GoFile 上传错误')
  }
}

/**
 * 策略2: File.io (备用，通过 CORS 代理)
 * 流程: 前端 -> corsproxy.io -> file.io
 * 原因: file.io 官方接口经常屏蔽浏览器直连
 * 安全性: 文件已本地加密，代理商无法窃取
 */
const uploadToFileIoWithProxy = async (blob, fileName) => {
  statusText.value = '尝试备用通道 (File.io via Proxy)...'

  const formData = new FormData()
  formData.append('file', blob, fileName)

  // 使用公共 CORS 代理绕过浏览器限制
  // 注意：file.io 免费版限制 100MB
  const PROXY_URL = 'https://corsproxy.io/?'
  const TARGET_URL = 'https://file.io/?expires=1w'

  const res = await fetch(PROXY_URL + encodeURIComponent(TARGET_URL), {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error(`Proxy Error: ${res.status}`)
  const json = await res.json()

  if (json.success) {
    return json.link
  } else {
    throw new Error(json.message || 'File.io 上传失败')
  }
}

// ================= 主流程 =================
const encryptAndUpload = async () => {
  if (!files.value.length) return
  if (totalSize.value > maxSafeSize) {
    if (!confirm(`文件较大 (${formatSize(totalSize.value)})，浏览器加密可能会导致页面短暂卡顿。是否继续？`)) return
  }

  uploading.value = true
  uploadProgress.value = 0
  statusText.value = '正在生成密钥...'

  try {
    // 1. 本地生成密钥
    const key = await generateKey()
    const exportedKey = await crypto.subtle.exportKey('raw', key)
    const keyB64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)))

    uploadProgress.value = 20
    statusText.value = '正在读取文件...'

    // 2. 打包/读取数据
    let sourceData
    let finalFileName = ''

    if (files.value.length === 1) {
      sourceData = await files.value[0].arrayBuffer()
      finalFileName = files.value[0].name + '.enc' // 加个后缀避免被识别
    } else {
      statusText.value = '正在压缩打包...'
      const zip = new JSZip()
      files.value.forEach(f => zip.file(f.name, f))
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      sourceData = await zipBlob.arrayBuffer()
      finalFileName = 'secure_files.zip.enc'
    }

    uploadProgress.value = 50
    statusText.value = '正在进行 AES-256 加密...'

    // 3. 加密
    const { encrypted, iv } = await encryptData(new Uint8Array(sourceData), key)
    const encryptedBlob = new Blob([iv, encrypted], { type: 'application/octet-stream' })

    uploadProgress.value = 70

    // 4. 尝试上传 (双通道策略)
    let downloadLink = ''
    try {
      // 优先尝试 GoFile
      usedProvider.value = 'gofile'
      downloadLink = await uploadToGoFile(encryptedBlob, finalFileName)
    } catch (e) {
      console.warn('GoFile failed, trying fallback:', e)
      // 失败切换 File.io + Proxy
      try {
        usedProvider.value = 'fileio'
        downloadLink = await uploadToFileIoWithProxy(encryptedBlob, finalFileName)
      } catch (e2) {
        throw new Error('所有通道均繁忙，请稍后再试。')
      }
    }

    uploadProgress.value = 100
    statusText.value = '完成！'

    // 5. 生成 Hash 链接 (包含密钥)
    const names = files.value.map(f => f.name).join('|')
    const params = new URLSearchParams()
    params.set('link', downloadLink)
    params.set('key', keyB64)
    params.set('p', usedProvider.value) // 记录使用的是哪个提供商，方便下载时优化逻辑
    params.set('names', names)

    shareLink.value = `${location.origin}${location.pathname}#${params.toString()}`
  } catch (error) {
    console.error(error)
    alert('错误: ' + error.message)
    statusText.value = '操作失败'
  } finally {
    uploading.value = false
  }
}

// ================= 辅助功能 =================
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    alert('链接已复制！')
  } catch (e) {
    alert('复制失败，请手动选择复制')
  }
}

const generateQR = () => {
  showQR.value = true
  setTimeout(() => {
    const canvas = document.getElementById('qrcode')
    if (canvas) QRCode.toCanvas(canvas, shareLink.value, { width: 200, margin: 2 })
  }, 50)
}

const reset = () => {
  files.value = []
  shareLink.value = ''
  showQR.value = false
  uploadProgress.value = 0
  history.replaceState(null, '', location.pathname)
}

// ================= 下载逻辑 =================
onMounted(async () => {
  if (!location.hash) return

  const hashStr = location.hash.substring(1).replace(/^\?/, '') // 兼容有些平台会自动加?
  const params = new URLSearchParams(hashStr)

  const link = params.get('link')
  const keyB64 = params.get('key')
  const names = params.get('names')
  const provider = params.get('p')

  if (link && keyB64) {
    isDownloading.value = true
    downloadStatus.value = '正在建立安全连接...'

    try {
      const fileNames = decodeURIComponent(names || 'file').split('|')

      // 1. 恢复密钥
      const keyData = Uint8Array.from(atob(keyB64), c => c.charCodeAt(0))
      const key = await crypto.subtle.importKey('raw', keyData, 'AES-GCM', true, ['decrypt'])

      // 2. 下载 (处理 CORS)
      downloadStatus.value = '正在下载加密数据...'

      const fetchUrl = link
      // 如果是 file.io 且没有经过代理，可能下载也会遇到 cors，走代理稳一点
      if (provider === 'fileio' || link.includes('file.io')) {
        // 下载通常 file.io 允许 CORS，但如果失败可以尝试 corsproxy
        // 先直连尝试
      }

      const resp = await fetch(fetchUrl, { mode: 'cors' })
      if (!resp.ok) throw new Error('文件链接已失效或被删除')

      // 读取流以显示进度 (可选优化)
      const total = +resp.headers.get('Content-Length')
      const reader = resp.body.getReader()
      let receivedLength = 0
      const chunks = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        receivedLength += value.length
        if (total) {
          downloadProgress.value = `已下载 ${formatSize(receivedLength)} / ${formatSize(total)}`
        }
      }

      // 合并 chunks
      const combined = new Uint8Array(receivedLength)
      let position = 0
      for (const chunk of chunks) {
        combined.set(chunk, position)
        position += chunk.length
      }

      downloadStatus.value = '正在解密数据...'
      // 3. 解密
      const iv = combined.slice(0, 12)
      const encryptedData = combined.slice(12)
      const decrypted = await decryptData(encryptedData, key, iv)

      downloadStatus.value = '处理完成'

      // 4. 保存文件
      if (fileNames.length === 1 && !fileNames[0].endsWith('.zip')) {
        saveAs(new Blob([decrypted]), fileNames[0])
      } else {
        // 尝试解压
        downloadStatus.value = '正在解压...'
        try {
          const zip = new JSZip()
          await zip.loadAsync(decrypted)
          for (const [path, file] of Object.entries(zip.files)) {
            if (!file.dir) {
              const content = await file.async('blob')
              saveAs(content, path)
            }
          }
        } catch (e) {
          // 如果解压失败，当做普通文件下载
          saveAs(new Blob([decrypted]), 'decrypted_files.zip')
        }
      }

      setTimeout(() => {
        alert('下载成功！')
        isDownloading.value = false
        // history.replaceState(null, '', location.pathname) // 可选：下载后清除链接
      }, 1000)
    } catch (error) {
      console.error(error)
      alert('下载失败: ' + error.message)
      isDownloading.value = false
    }
  }
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
</style>
