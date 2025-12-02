<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-orange-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-orange-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-4xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-orange-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">P2P 极速传送门</span>
        </h1>
        <p class="text-slate-600 max-w-2xl">
          告别网盘限速与上传。基于 WebRTC 技术，建立浏览器间的加密直连通道，不限速、不限大小、无服务器存储。
        </p>
      </div>

      <!-- 模式切换卡片 -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-2 flex mb-8 max-w-md mx-auto">
        <button
          @click="mode = 'send'"
          class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          :class="mode === 'send' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-500 hover:bg-slate-100'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          ><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          我要发送
        </button>
        <button
          @click="mode = 'receive'"
          class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          :class="mode === 'receive' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-500 hover:bg-slate-100'"
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
            x2="12"
            y1="15"
            y2="3"
          /></svg>
          我要接收
        </button>
      </div>

      <!-- 主体功能区 -->
      <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-10 min-h-[400px] flex flex-col items-center justify-center transition-all relative overflow-hidden">
        <!-- === 发送模式 === -->
        <div v-if="mode === 'send'" class="w-full max-w-lg flex flex-col items-center">
          <!-- 1. 还没选文件 -->
          <div v-if="!file" class="w-full">
            <label
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-orange-200 rounded-2xl cursor-pointer bg-orange-50/30 hover:bg-orange-50 hover:border-orange-400 transition-all group"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    class="w-8 h-8 text-orange-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  ><path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  /></svg>
                </div>
                <p class="mb-2 text-sm text-slate-600 font-bold">点击上传 或 拖拽文件到这里</p>
                <p class="text-xs text-slate-400">支持任意格式，大小不限 (P2P直连)</p>
              </div>
              <input type="file" class="hidden" @change="handleFileSelect">
            </label>
          </div>

          <!-- 2. 已选文件，等待连接 -->
          <div v-else class="w-full flex flex-col items-center text-center space-y-6">
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 w-full">
              <div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold text-xl uppercase">
                {{ file.name.split('.').pop().substring(0,3) }}
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-bold text-slate-800 truncate">
                  {{ file.name }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ formatSize(file.size) }}
                </div>
              </div>
              <button @click="reset" class="text-slate-400 hover:text-red-500 transition-colors p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"
                /><line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                /></svg>
              </button>
            </div>

            <div class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
              <h3 class="text-slate-500 text-sm font-medium mb-3">
                将此取件码告诉对方
              </h3>

              <div class="flex items-center justify-center gap-3 mb-4">
                <div v-if="!peerId" class="animate-pulse h-10 w-32 bg-slate-200 rounded" />
                <div v-else class="text-4xl font-mono font-black text-orange-600 tracking-wider select-all">
                  {{ peerId }}
                </div>
              </div>

              <div class="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span class="w-2 h-2 rounded-full" :class="status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-400'" />
                {{ statusText }}
              </div>
            </div>

            <div class="text-xs text-slate-400 max-w-xl">
              ⚠️ 请保持此页面开启，直到对方下载完成。关闭页面将断开连接。
            </div>
          </div>
        </div>

        <!-- === 接收模式 === -->
        <div v-if="mode === 'receive'" class="w-full max-w-lg flex flex-col items-center">
          <div v-if="!connection" class="w-full space-y-6">
            <div class="text-center">
              <h3 class="text-lg font-bold text-slate-800">
                请输入取件码
              </h3>
              <p class="text-sm text-slate-500 mt-1">
                输入对方屏幕上显示的 6 位号码
              </p>
            </div>

            <div class="flex justify-center gap-2">
              <input
                v-model="targetId"
                type="text"
                placeholder="例如: 9A3F12"
                maxlength="8"
                class="w-full max-w-xs text-center text-2xl font-mono font-bold py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 uppercase placeholder:text-slate-300"
                @keyup.enter="connectToPeer"
              >
            </div>

            <button
              @click="connectToPeer"
              :disabled="!targetId || isConnecting"
              class="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isConnecting ? '正在连接...' : '立即连接接收' }}
            </button>
          </div>

          <!-- 传输中/已连接 -->
          <div v-else class="w-full text-center space-y-6">
            <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-2">
              <svg
                v-if="transferProgress < 100"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="animate-bounce"
              ><path d="M12 17V3" /><path d="m6 11 6 6 6-6" /><path d="M19 21H5" /></svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              ><polyline points="20 6 9 17 4 12" /></svg>
            </div>

            <div>
              <h3 class="text-xl font-bold text-slate-800">
                {{ transferStatus }}
              </h3>
              <p class="text-slate-500 text-sm mt-1" v-if="incomingMeta">
                {{ incomingMeta.name }} ({{ formatSize(incomingMeta.size) }})
              </p>
            </div>

            <!-- 进度条 -->
            <div class="w-full bg-slate-100 rounded-full h-4 overflow-hidden relative">
              <div
                class="h-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-300"
                :style="{ width: transferProgress + '%' }"
              />
              <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-600 mix-blend-multiply">
                {{ transferProgress }}%
              </div>
            </div>

            <button
              v-if="transferProgress === 100"
              @click="downloadReceivedFile"
              class="px-8 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all"
            >
              保存文件
            </button>
            <button
              v-if="transferProgress === 100"
              @click="reset"
              class="block mx-auto mt-4 text-sm text-slate-400 hover:text-orange-500"
            >
              接收下一个
            </button>
          </div>
        </div>
      </div>

      <!-- 说明 -->
      <div class="mt-8 bg-blue-50/80 backdrop-blur rounded-2xl p-5 border border-blue-100 text-sm text-blue-800">
        <strong class="flex items-center gap-2 mb-2"><span class="text-lg">🛡️</span> 隐私声明：</strong>
        <p class="leading-relaxed opacity-90">
          使用 WebRTC 技术实现点对点传输。文件数据直接从发送端流向接收端，不经过任何中间服务器，也不会被存储。请确保双方在传输过程中不要关闭页面。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Peer from 'peerjs'

const route = useRoute()
const router = useRouter()

// 状态
const mode = ref('send') // 'send' | 'receive'
const file = ref(null)
const peer = ref(null)
const connection = ref(null)
const peerId = ref('') // 本机 ID
const targetId = ref('') // 目标 ID
const status = ref('idle') // idle, waiting, connected, transferring, done
const statusText = ref('等待生成连接码...')
const copied = ref(false)
const isConnecting = ref(false)

// 传输数据
const incomingMeta = ref(null)
const receivedChunks = ref([])
const receivedSize = ref(0)
const transferProgress = ref(0)
const transferStatus = ref('等待发送方...')
const receivedBlob = ref(null)

// 工具函数
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const generateShortId = () => {
  // 生成 6 位随机大写 ID
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// === 初始化 Peer ===
const initPeer = () => {
  if (peer.value) return

  // 使用自定义 ID (方便输入)
  const myId = generateShortId()

  // 初始化 PeerJS (连接到公共服务器仅用于交换信令)
  peer.value = new Peer(myId, {
    debug: 2
  })

  peer.value.on('open', (id) => {
    peerId.value = id
    statusText.value = '等待对方连接...'

    // 如果 URL 有参数，说明是扫码进入的接收方
    if (route.query.code && mode.value === 'receive') {
      targetId.value = route.query.code
      connectToPeer()
    }
  })

  peer.value.on('connection', (conn) => {
    // [发送端] 被人连接了
    handleConnection(conn)
  })

  peer.value.on('error', (err) => {
    console.error(err)
    statusText.value = '连接服务错误: ' + err.type
    isConnecting.value = false
  })
}

// === 处理连接逻辑 ===
const handleConnection = (conn) => {
  connection.value = conn
  status.value = 'connected'
  statusText.value = '已连接! 准备传输...'
  isConnecting.value = false

  conn.on('open', () => {
    if (mode.value === 'send' && file.value) {
      sendFile()
    }
  })

  conn.on('data', (data) => {
    // 处理接收到的数据
    handleIncomingData(data)
  })

  conn.on('close', () => {
    reset()
    alert('连接已断开')
  })
}

// === 1. 发送端逻辑 ===
const handleFileSelect = (e) => {
  const f = e.target.files[0]
  if (f) file.value = f
}

const handleDrop = (e) => {
  const f = e.dataTransfer.files[0]
  if (f) file.value = f
}

const sendFile = () => {
  if (!connection.value || !file.value) return

  const conn = connection.value
  const f = file.value

  statusText.value = '正在传输中...'

  // 1. 发送元数据
  conn.send({
    type: 'meta',
    name: f.name,
    size: f.size,
    mime: f.type
  })

  // 2. 切片发送
  const chunkSize = 16 * 1024 // 16KB per chunk for safety
  let offset = 0

  const reader = new FileReader()

  reader.onload = (e) => {
    conn.send({
      type: 'chunk',
      data: e.target.result
    })

    offset += e.target.result.byteLength
    // 更新本地进度(可选)

    if (offset < f.size) {
      readNextChunk()
    } else {
      conn.send({ type: 'end' })
      statusText.value = '传输完成!'
    }
  }

  const readNextChunk = () => {
    const slice = f.slice(offset, offset + chunkSize)
    reader.readAsArrayBuffer(slice)
  }

  readNextChunk()
}

// === 2. 接收端逻辑 ===
const connectToPeer = () => {
  if (!targetId.value) return
  isConnecting.value = true

  // 连接对方
  const conn = peer.value.connect(targetId.value.toUpperCase())
  handleConnection(conn)
}

const handleIncomingData = (data) => {
  if (data.type === 'meta') {
    incomingMeta.value = data
    receivedChunks.value = []
    receivedSize.value = 0
    transferProgress.value = 0
    transferStatus.value = '正在接收文件...'
  } else if (data.type === 'chunk') {
    receivedChunks.value.push(data.data)
    receivedSize.value += data.data.byteLength
    if (incomingMeta.value) {
      transferProgress.value = Math.floor((receivedSize.value / incomingMeta.value.size) * 100)
    }
  } else if (data.type === 'end') {
    transferProgress.value = 100
    transferStatus.value = '接收完成!'
    // 组装文件
    receivedBlob.value = new Blob(receivedChunks.value, { type: incomingMeta.value.mime })
  }
}

const downloadReceivedFile = () => {
  if (!receivedBlob.value || !incomingMeta.value) return
  const url = URL.createObjectURL(receivedBlob.value)
  const a = document.createElement('a')
  a.href = url
  a.download = incomingMeta.value.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const reset = () => {
  file.value = null
  connection.value = null
  status.value = 'idle'
  receivedChunks.value = []
  receivedBlob.value = null
  transferProgress.value = 0
  incomingMeta.value = null
  // 重新生成 ID 或保持 ID 取决于需求，这里保持 ID
  statusText.value = '等待对方连接...'
}

// 监听 URL 参数自动切换模式
onMounted(() => {
  initPeer()
  if (route.query.code) {
    mode.value = 'receive'
    targetId.value = route.query.code
  }
})

onUnmounted(() => {
  if (peer.value) peer.value.destroy()
})

watch(mode, (newMode) => {
  // 切换模式时清理状态，防止冲突
  if (newMode === 'send') {
    router.replace({ query: {} }) // 清除 url code
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
