<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-teal-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-teal-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">临时隐私邮箱</span>
        </h1>
        <p class="text-slate-600 max-w-2xl">
          免费的一次性邮箱，用于注册临时账号、接收验证码。用完即走，拒绝垃圾邮件骚扰。
        </p>
      </div>

      <!-- 核心控制区 -->
      <div class="max-w-3xl mx-auto mb-10">
        <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 md:p-3 flex flex-col md:flex-row items-center gap-3">
          <!-- 邮箱地址显示 -->
          <div class="flex-1 w-full flex items-center bg-slate-100/50 rounded-xl px-4 py-3 border border-slate-200 relative group transition-colors hover:border-teal-300 hover:bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-slate-400 mr-3 group-hover:text-teal-500 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><rect
              width="20"
              height="16"
              x="2"
              y="4"
              rx="2"
            /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>

            <span v-if="loading" class="text-slate-400 text-sm animate-pulse">正在初始化账号...</span>
            <span v-else class="text-lg font-mono text-slate-800 font-bold truncate select-all">{{ emailAddress }}</span>

            <button
              v-if="emailAddress"
              @click="copyEmail"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
              title="复制地址"
            >
              <span v-if="copied" class="text-xs font-bold text-teal-600">已复制!</span>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><rect
                width="14"
                height="14"
                x="8"
                y="8"
                rx="2"
                ry="2"
              /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
            </button>
          </div>

          <!-- 操作按钮组 -->
          <div class="flex gap-2 w-full md:w-auto">
            <button
              @click="refreshInbox"
              :disabled="!token || refreshing"
              class="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 hover:border-teal-300 hover:text-teal-600 text-slate-600 font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <svg
                :class="{'animate-spin': refreshing}"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
              刷新
              <span v-if="autoRefreshCount > 0 && token" class="text-xs bg-slate-100 px-1.5 rounded text-slate-400">{{ autoRefreshCount }}s</span>
            </button>

            <button
              @click="initNewAccount"
              :disabled="loading"
              class="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              更换
            </button>
          </div>
        </div>
      </div>

      <!-- 邮件主界面 Grid -->
      <div class="grid lg:grid-cols-12 gap-6 h-[600px]">
        <!-- 左侧：邮件列表 -->
        <div class="lg:col-span-4 flex flex-col bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 class="font-bold text-slate-700">
              收件箱
            </h3>
            <span class="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{{ mailList.length }} 封</span>
          </div>

          <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            <!-- 空状态 -->
            <div v-if="mailList.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-60">
              <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="M19 16v6" /><path d="M16 19h6" /></svg>
              </div>
              <p class="text-sm">
                暂无新邮件，等待中...
              </p>
            </div>

            <!-- 列表项 -->
            <div
              v-for="mail in mailList"
              :key="mail.id"
              @click="fetchMailContent(mail.id)"
              class="cursor-pointer p-3 rounded-xl transition-all border"
              :class="currentMailId === mail.id
                ? 'bg-white border-teal-200 shadow-md ring-1 ring-teal-100'
                : 'bg-transparent border-transparent hover:bg-white hover:shadow-sm hover:border-slate-100'"
            >
              <div class="flex justify-between items-start mb-1">
                <span class="font-bold text-slate-800 text-sm truncate w-2/3" :title="mail.from.address">{{ mail.from.name || mail.from.address }}</span>
                <span class="text-xs text-slate-400 font-mono whitespace-nowrap">{{ formatTime(mail.createdAt) }}</span>
              </div>
              <div class="text-sm text-slate-600 font-medium truncate mb-1">
                {{ mail.subject || '(无主题)' }}
              </div>
              <div class="text-xs text-slate-400 truncate">
                {{ mail.intro }}
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：邮件详情 -->
        <div class="lg:col-span-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 flex flex-col overflow-hidden relative">
          <div v-if="!currentMail" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              class="mb-4 opacity-20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><rect
              width="20"
              height="16"
              x="2"
              y="4"
              rx="2"
            /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            <p>点击邮件查看详情</p>
          </div>

          <div v-else class="flex flex-col h-full relative z-10">
            <!-- 邮件头 -->
            <div class="p-6 border-b border-slate-100 bg-white/50">
              <h2 class="text-xl font-bold text-slate-800 mb-2">
                {{ currentMail.subject }}
              </h2>
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                    {{ (currentMail.from.name || currentMail.from.address)[0] }}
                  </div>
                  <div>
                    <p class="text-slate-900 font-medium">
                      {{ currentMail.from.name ? `${currentMail.from.name} <${currentMail.from.address}>` : currentMail.from.address }}
                    </p>
                    <p class="text-slate-500 text-xs">
                      发送给 &lt;{{ emailAddress }}&gt;
                    </p>
                  </div>
                </div>
                <div class="text-slate-400 font-mono text-xs">
                  {{ new Date(currentMail.createdAt).toLocaleString() }}
                </div>
              </div>
            </div>

            <!-- 邮件正文 -->
            <div class="flex-1 bg-white relative">
              <iframe
                :srcdoc="currentMail.html ? currentMail.html[0] : (currentMail.text || '无内容')"
                class="w-full h-full border-none"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              />
            </div>

            <!-- 附件提示 (简单展示) -->
            <div v-if="currentMail.attachments && currentMail.attachments.length > 0" class="p-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 px-4">
              包含 {{ currentMail.attachments.length }} 个附件 (暂不支持直接下载)
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center text-sm text-slate-400">
        <p>数据服务由 <a href="https://mail.tm/" target="_blank" class="hover:text-teal-600 underline">Mail.tm</a> 提供。页面关闭后账号自动失效。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const API_BASE = 'https://api.mail.tm'
const emailAddress = ref('')
const password = ref('')
const token = ref('')
const mailList = ref([])
const currentMailId = ref(null)
const currentMail = ref(null)

const loading = ref(false)
const refreshing = ref(false)
const copied = ref(false)
const autoRefreshCount = ref(10)

let interval = null

// === 工具函数 ===
const generateRandomString = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const formatTime = (isoString) => {
  const date = new Date(isoString)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// === 核心 API 调用 (直连，无需代理) ===

// 1. 获取可用域名
const getDomains = async () => {
  const res = await fetch(`${API_BASE}/domains`)
  const data = await res.json()
  return data['hydra:member'] // 返回数组
}

// 2. 初始化新账号
const initNewAccount = async () => {
  loading.value = true
  token.value = ''
  mailList.value = []
  currentMail.value = null
  currentMailId.value = null

  try {
    // 获取域名
    const domains = await getDomains()
    if (!domains || domains.length === 0) throw new Error('No domains available')
    const domain = domains[0].domain

    // 生成账号
    const user = generateRandomString(10)
    const pwd = generateRandomString(12)
    const email = `${user}@${domain}`

    // 注册账号
    const regRes = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: email, password: pwd })
    })

    if (!regRes.ok) throw new Error('Registration failed')

    // 获取 Token
    const tokenRes = await fetch(`${API_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: email, password: pwd })
    })
    const tokenData = await tokenRes.json()

    // 保存状态
    emailAddress.value = email
    password.value = pwd
    token.value = tokenData.token

    // 立即刷新一次
    refreshInbox()
  } catch (e) {
    console.error('Account init failed:', e)
    alert('邮箱服务连接失败，请检查网络 (Mail.tm)')
  } finally {
    loading.value = false
    resetTimer()
  }
}

// 3. 获取邮件列表
const refreshInbox = async () => {
  if (!token.value) return
  refreshing.value = true

  try {
    const res = await fetch(`${API_BASE}/messages?page=1`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    const data = await res.json()
    // Mail.tm 返回的是 hydra:member 数组
    const newMails = data['hydra:member'] || []

    // 简单对比是否有新邮件 (实际场景可优化)
    if (newMails.length > 0) {
      mailList.value = newMails
    }
  } catch (e) {
    console.error('Fetch mail failed:', e)
  } finally {
    refreshing.value = false
    resetTimer()
  }
}

// 4. 获取单封邮件详情
const fetchMailContent = async (id) => {
  if (!token.value) return
  currentMailId.value = id
  // 不清空 currentMail，避免闪烁，或者可以显示局部 loading

  try {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    const data = await res.json()
    currentMail.value = data
  } catch (e) {
    console.error('Fetch content failed:', e)
  }
}

// === 交互逻辑 ===
const copyEmail = () => {
  navigator.clipboard.writeText(emailAddress.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const resetTimer = () => {
  autoRefreshCount.value = 15 // Mail.tm 建议频率稍微低一点点
}

onMounted(() => {
  initNewAccount()

  interval = setInterval(() => {
    if (!token.value) return
    autoRefreshCount.value--
    if (autoRefreshCount.value <= 0) {
      refreshInbox()
    }
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
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

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #cbd5e1;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
