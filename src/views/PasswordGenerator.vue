<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-violet-100">
    <!-- ================= 背景特效 (改为紫色系) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角紫色 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角粉紫 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间靛蓝 -->
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-violet-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">强密码生成器</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          基于浏览器本地加密算法生成的随机密码，安全不联网，杜绝云端泄露风险。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：参数配置 -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <div class="flex items-center gap-2 mb-6">
              <span class="w-1.5 h-6 bg-violet-500 rounded-full" />
              <h2 class="text-lg font-bold text-slate-800">
                定制规则
              </h2>
            </div>

            <div class="space-y-8">
              <!-- 长度滑块 -->
              <div>
                <div class="flex justify-between mb-2">
                  <label class="font-medium text-slate-700">密码长度</label>
                  <span class="bg-violet-100 text-violet-700 font-mono font-bold px-2 py-0.5 rounded text-sm">{{ length }}</span>
                </div>
                <input
                  type="range"
                  v-model.number="length"
                  min="6"
                  max="64"
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                >
                <div class="flex justify-between text-xs text-slate-400 mt-1">
                  <span>6位</span>
                  <span>64位</span>
                </div>
              </div>

              <!-- 选项开关 -->
              <div class="grid grid-cols-1 gap-3">
                <label class="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-violet-200 transition-all cursor-pointer group">
                  <span class="flex items-center gap-2 text-slate-700 font-medium">
                    <span class="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">A</span>
                    大写字母 (A-Z)
                  </span>
                  <input type="checkbox" v-model="options.uppercase" class="w-5 h-5 text-violet-600 rounded focus:ring-violet-500 border-gray-300">
                </label>

                <label class="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-violet-200 transition-all cursor-pointer group">
                  <span class="flex items-center gap-2 text-slate-700 font-medium">
                    <span class="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">a</span>
                    小写字母 (a-z)
                  </span>
                  <input type="checkbox" v-model="options.lowercase" class="w-5 h-5 text-violet-600 rounded focus:ring-violet-500 border-gray-300">
                </label>

                <label class="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-violet-200 transition-all cursor-pointer group">
                  <span class="flex items-center gap-2 text-slate-700 font-medium">
                    <span class="w-6 h-6 rounded bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">1</span>
                    数字 (0-9)
                  </span>
                  <input type="checkbox" v-model="options.numbers" class="w-5 h-5 text-violet-600 rounded focus:ring-violet-500 border-gray-300">
                </label>

                <label class="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-violet-200 transition-all cursor-pointer group">
                  <span class="flex items-center gap-2 text-slate-700 font-medium">
                    <span class="w-6 h-6 rounded bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">#</span>
                    特殊符号 (@$!%)
                  </span>
                  <input type="checkbox" v-model="options.symbols" class="w-5 h-5 text-violet-600 rounded focus:ring-violet-500 border-gray-300">
                </label>

                <div class="my-2 border-t border-slate-200" />

                <label class="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-violet-200 transition-all cursor-pointer group">
                  <div class="flex flex-col">
                    <span class="text-slate-700 font-medium">易读模式</span>
                    <span class="text-xs text-slate-400">移除 l, 1, O, 0 等易混淆字符</span>
                  </div>
                  <input type="checkbox" v-model="options.easyRead" class="w-5 h-5 text-violet-600 rounded focus:ring-violet-500 border-gray-300">
                </label>
              </div>
            </div>

            <div class="mt-6">
              <button
                @click="generate"
                class="w-full py-3 bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  :class="{'animate-spin': isAnimating}"
                ><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
                重新生成
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：生成结果 -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 min-h-[400px] flex flex-col">
            <!-- 强度仪表盘 -->
            <div class="flex items-center justify-between mb-2">
              <span class="text-slate-500 text-sm font-medium uppercase tracking-wider">Password Strength</span>
              <span
                class="text-xs font-bold px-2 py-1 rounded border transition-colors duration-300"
                :class="strengthClass"
              >
                {{ strengthLabel }}
              </span>
            </div>

            <!-- 进度条 -->
            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-8">
              <div class="h-full transition-all duration-500 ease-out" :style="{ width: `${strengthScore}%`, backgroundColor: strengthColor }" />
            </div>

            <!-- 密码显示区 -->
            <div class="relative group bg-slate-900 rounded-2xl p-6 md:p-8 flex items-center justify-center min-h-[160px] shadow-inner mb-6 transition-transform hover:scale-[1.01]">
              <!-- 装饰光效 -->
              <div class="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl pointer-events-none" />

              <div class="break-all font-mono text-3xl md:text-4xl text-center text-white tracking-wider leading-relaxed selection:bg-violet-500 selection:text-white">
                {{ password }}
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-4">
              <button
                @click="copyPassword"
                class="flex-1 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span v-if="copied">✅ 已复制</span>
                <span v-else class="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  ><path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" /><path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" /></svg>
                  复制密码
                </span>
              </button>
            </div>

            <!-- 历史记录区域 -->
            <div class="mt-8 flex-1">
              <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                本次会话历史
              </h3>
              <div class="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                <div v-if="history.length === 0" class="text-center text-slate-400 text-sm py-4">
                  暂无历史记录
                </div>
                <div
                  v-for="(item, idx) in history"
                  :key="idx"
                  @click="copyHistory(item)"
                  class="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors border border-transparent hover:border-slate-200"
                >
                  <span class="font-mono text-slate-600 text-sm truncate pr-4">{{ item }}</span>
                  <span class="text-xs text-violet-500 opacity-0 group-hover:opacity-100 font-bold transition-opacity">
                    点击复制
                  </span>
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
import { ref, reactive, computed, watch, onMounted } from 'vue'

// ---------------- 状态管理 ----------------
const length = ref(16)
const password = ref('')
const copied = ref(false)
const isAnimating = ref(false)
const history = ref([])

const options = reactive({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  easyRead: false
})

// ---------------- 常量定义 ----------------
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
}
const AMBIGUOUS = 'Il1O0'

// ---------------- 核心逻辑：生成密码 ----------------
const generate = () => {
  // 1. 构建字符池
  let pool = ''
  if (options.uppercase) pool += CHAR_SETS.uppercase
  if (options.lowercase) pool += CHAR_SETS.lowercase
  if (options.numbers) pool += CHAR_SETS.numbers
  if (options.symbols) pool += CHAR_SETS.symbols

  // 2. 处理易读模式
  if (options.easyRead) {
    for (const char of AMBIGUOUS) {
      pool = pool.split(char).join('')
    }
  }

  // 3. 空池处理
  if (pool === '') {
    password.value = '请至少选择一种字符'
    return
  }

  // 4. Crypto API 生成随机数 (本地真随机)
  let result = ''
  const poolLength = pool.length
  const randomValues = new Uint32Array(length.value)
  window.crypto.getRandomValues(randomValues)

  for (let i = 0; i < length.value; i++) {
    result += pool[randomValues[i] % poolLength]
  }

  password.value = result

  // 动画效果
  isAnimating.value = true
  setTimeout(() => isAnimating.value = false, 500)

  // 添加到历史
  addToHistory(result)
}

const addToHistory = (pwd) => {
  // 简单的去重与队列管理
  const newHistory = [pwd, ...history.value.filter(h => h !== pwd)]
  history.value = newHistory.slice(0, 10)
}

// ---------------- 核心逻辑：强度计算 ----------------
const strengthScore = computed(() => {
  if (!password.value || password.value.includes('请至少')) return 0

  let poolSize = 0
  if (options.uppercase) poolSize += 26
  if (options.lowercase) poolSize += 26
  if (options.numbers) poolSize += 10
  if (options.symbols) poolSize += 30
  if (options.easyRead) poolSize -= 5

  if (poolSize <= 0) return 0

  // 熵计算公式: E = Length * log2(PoolSize)
  const entropy = password.value.length * Math.log2(poolSize)

  // 映射到 0-100 (100 bits 熵视为非常安全)
  return Math.min((entropy / 100) * 100, 100)
})

const strengthLabel = computed(() => {
  const s = strengthScore.value
  if (s < 40) return '弱'
  if (s < 60) return '一般'
  if (s < 80) return '强'
  return '非常强'
})

const strengthColor = computed(() => {
  const s = strengthScore.value
  if (s < 40) return '#f43f5e' // rose-500
  if (s < 60) return '#f59e0b' // amber-500
  if (s < 80) return '#3b82f6' // blue-500
  return '#8b5cf6' // violet-500
})

const strengthClass = computed(() => {
  const s = strengthScore.value
  if (s < 40) return 'bg-rose-50 text-rose-600 border-rose-200'
  if (s < 60) return 'bg-amber-50 text-amber-600 border-amber-200'
  if (s < 80) return 'bg-blue-50 text-blue-600 border-blue-200'
  return 'bg-violet-50 text-violet-600 border-violet-200'
})

// ---------------- 交互操作 ----------------
const copyPassword = async () => {
  if (!password.value) return
  try {
    await navigator.clipboard.writeText(password.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Copy failed', err)
  }
}

const copyHistory = async (pwd) => {
  await navigator.clipboard.writeText(pwd)
  // 这里可以加一个小的 toast 提示，此处省略
}

// 监听配置变化自动生成
watch([length, options], () => {
  generate()
})

onMounted(() => {
  generate()
})
</script>

<style scoped>
/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 3px; background: #e2e8f0; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

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
