<template>
  <div class="h-100% bg-slate-50 relative overflow-hidden overflow-y-auto! font-sans selection:bg-slate-200">
    <!-- ================= 背景特效 (极简灰主题) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 灰色系光斑 -->
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-slate-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gray-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-15px text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-slate-800 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-zinc-600">文本多功能清洗机</span>
        </h1>
        <p class="text-slate-600 max-w-2xl">
          正则化繁为简。支持去重、提取邮箱/URL、全半角转换及自定义分隔。
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-6 h-[calc(100%-240px)] min-h-[600px]">
        <!-- 左侧：输入区 (4列) -->
        <div class="lg:col-span-4 flex flex-col h-full">
          <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 flex flex-col h-full overflow-hidden transition-all hover:shadow-2xl hover:border-slate-300/50">
            <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <span class="font-bold text-slate-700 flex items-center gap-2">
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
                  class="text-slate-500"
                ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line
                  x1="16"
                  y1="13"
                  x2="8"
                  y2="13"
                /><line
                  x1="16"
                  y1="17"
                  x2="8"
                  y2="17"
                /><polyline points="10 9 9 9 8 9" /></svg>
                原始文本
              </span>
              <div class="flex gap-2">
                <button @click="pasteText" class="text-xs bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-2 py-1 rounded shadow-sm transition-colors">
                  粘贴
                </button>
                <button @click="rawText = ''" class="text-xs bg-white hover:text-red-500 text-slate-400 border border-slate-200 px-2 py-1 rounded shadow-sm transition-colors">
                  清空
                </button>
              </div>
            </div>
            <textarea
              v-model="rawText"
              class="border-none! custom-scrollbar flex-1 w-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm text-slate-700 leading-relaxed placeholder:text-slate-400"
              placeholder="在此粘贴乱七八糟的文本..."
            />
            <div class="px-4 py-2 bg-slate-50 text-xs text-slate-400 border-t border-slate-100 flex justify-between">
              <span>行数: {{ inputStats.lines }}</span>
              <span>字符: {{ inputStats.chars }}</span>
            </div>
          </div>
        </div>

        <!-- 中间：控制台 (3列) -->
        <div class="lg:col-span-3 flex flex-col h-full  custom-scrollbar pr-1">
          <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border  p-5 space-y-6">
            <!-- 分组1: 预处理与分割 -->
            <div>
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                1. 分割与预处理
              </h3>
              <div class="space-y-3">
                <!-- 分割字符 -->
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <label class="text-sm font-medium text-slate-700 block mb-2">文本分割符</label>
                  <select v-model="splitMode" class="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1.5 focus:ring-2 focus:ring-slate-200 outline-none">
                    <option value="newline">
                      按换行符 (默认)
                    </option>
                    <option value="comma">
                      按逗号 ( , )
                    </option>
                    <option value="space">
                      按空格 ( space )
                    </option>
                    <option value="pipe">
                      按竖线 ( | )
                    </option>
                    <option value="custom">
                      自定义字符
                    </option>
                  </select>
                  <input
                    v-if="splitMode === 'custom'"
                    v-model="customSplitChar"
                    type="text"
                    placeholder="输入分隔符"
                    class="mt-2 w-full text-sm bg-white border border-slate-200 rounded px-2 py-1.5 focus:ring-2 focus:ring-slate-200 outline-none"
                  >
                </div>

                <!-- 开关 -->
                <label class="flex items-center justify-between cursor-pointer group">
                  <span class="text-sm text-slate-600 group-hover:text-slate-900">全角转半角</span>
                  <input type="checkbox" v-model="options.halfWidth" class="sr-only peer">
                  <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-600" />
                </label>
              </div>
            </div>

            <!-- 分组2: 提取与过滤 -->
            <div>
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                2. 提取与清洗
              </h3>
              <div class="space-y-2">
                <!-- 提取模式 -->
                <div class="grid grid-cols-3 gap-1 mb-3 bg-slate-100 p-1 rounded-lg">
                  <button
                    v-for="mode in ['none', 'email', 'url']"
                    :key="mode"
                    @click="extractionMode = mode"
                    class="text-xs py-1.5 rounded-md transition-all font-medium"
                    :class="extractionMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                  >
                    {{ mode === 'none' ? '全文' : (mode === 'email' ? '邮箱' : '网址') }}
                  </button>
                </div>

                <label class="flex items-center justify-between cursor-pointer group">
                  <span class="text-sm text-slate-600 group-hover:text-slate-900">去除空行</span>
                  <input type="checkbox" v-model="options.removeEmpty" class="sr-only peer">
                  <div class="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-600 relative" />
                </label>

                <label class="flex items-center justify-between cursor-pointer group">
                  <span class="text-sm text-slate-600 group-hover:text-slate-900">去除首尾空格</span>
                  <input type="checkbox" v-model="options.trim" class="sr-only peer">
                  <div class="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-600 relative" />
                </label>

                <label class="flex items-center justify-between cursor-pointer group">
                  <span class="text-sm text-slate-600 group-hover:text-slate-900 font-bold">去除重复行</span>
                  <input type="checkbox" v-model="options.deduplicate" class="sr-only peer">
                  <div class="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-600 relative" />
                </label>
              </div>
            </div>

            <!-- 分组3: 格式与排序 -->
            <div>
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                3. 格式化
              </h3>

              <!-- 大小写 -->
              <div class="mb-3">
                <label class="text-xs text-slate-500 mb-1 block">大小写转换</label>
                <div class="flex border border-slate-200 rounded-lg overflow-hidden divide-x divide-slate-200">
                  <button
                    v-for="c in caseModes"
                    :key="c.val"
                    @click="caseMode = c.val"
                    class="flex-1 py-1.5 text-xs hover:bg-slate-50 transition-colors"
                    :class="caseMode === c.val ? 'bg-slate-100 text-slate-800 font-bold' : 'bg-white text-slate-500'"
                  >
                    {{ c.label }}
                  </button>
                </div>
              </div>

              <!-- 排序 -->
              <div>
                <label class="text-xs text-slate-500 mb-1 block">排序方式</label>
                <div class="flex border border-slate-200 rounded-lg overflow-hidden divide-x divide-slate-200">
                  <button
                    v-for="s in sortModes"
                    :key="s.val"
                    @click="sortMode = s.val"
                    class="flex-1 py-1.5 text-xs hover:bg-slate-50 transition-colors"
                    :class="sortMode === s.val ? 'bg-slate-100 text-slate-800 font-bold' : 'bg-white text-slate-500'"
                  >
                    {{ s.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 样例数据按钮 -->
            <div class=" border-t border-slate-100">
              <button @click="loadSample" class="w-full py-2 text-xs text-slate-500 hover:text-slate-700 underline decoration-dashed">
                试一试：加载混乱数据
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：结果区 (5列) -->
        <div class="lg:col-span-5 flex flex-col h-full">
          <div class="bg-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 flex flex-col h-full overflow-hidden transition-all relative group">
            <!-- 结果标识 -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 z-20" />

            <div class="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
              <span class="font-bold text-slate-200 flex items-center gap-2">
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
                  class="text-emerald-400"
                ><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                清洗结果
              </span>
              <div class="flex gap-2">
                <button
                  @click="copyResult"
                  class="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 px-3 py-1.5 rounded shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
                >
                  <span v-if="copied">已复制!</span>
                  <span v-else>复制结果</span>
                </button>
              </div>
            </div>

            <textarea
              readonly
              :value="processedText"
              class="flex-1 w-full p-4 bg-slate-800 text-emerald-50 font-mono text-sm leading-relaxed resize-none focus:outline-none selection:bg-emerald-500/30"
            />

            <div class="px-4 py-2 bg-slate-900 text-xs text-slate-500 border-t border-slate-700 flex justify-between">
              <span>行数: {{ outputStats.lines }}</span>
              <span>字符: {{ outputStats.chars }}</span>
              <span v-if="outputStats.lines < inputStats.lines" class="text-emerald-400">
                已精简 {{ inputStats.lines - outputStats.lines }} 行
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// --- State ---
const rawText = ref('')
const copied = ref(false)

// 选项配置
const options = reactive({
  removeEmpty: true,
  deduplicate: false,
  trim: true,
  halfWidth: false
})

const splitMode = ref('newline') // newline, comma, space, pipe, custom
const customSplitChar = ref(',')
const extractionMode = ref('none') // none, email, url
const caseMode = ref('none') // none, upper, lower
const sortMode = ref('none') // none, asc, desc, length-asc, length-desc

// 常量配置
const caseModes = [
  { label: '保持', val: 'none' },
  { label: '大写', val: 'upper' },
  { label: '小写', val: 'lower' }
]

const sortModes = [
  { label: '不排序', val: 'none' },
  { label: 'A-Z', val: 'asc' },
  { label: 'Z-A', val: 'desc' },
  { label: '长度', val: 'len' }
]

// --- Logic ---

// 全角转半角
const toHalfWidthStr = (str) => {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) == 12288) {
      result += String.fromCharCode(str.charCodeAt(i) - 12256)
      continue
    }
    if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) { result += String.fromCharCode(str.charCodeAt(i) - 65248) } else result += String.fromCharCode(str.charCodeAt(i))
  }
  return result
}

// 核心处理逻辑
const processedText = computed(() => {
  let text = rawText.value
  if (!text) return ''

  // 1. 全局预处理
  if (options.halfWidth) {
    text = toHalfWidthStr(text)
  }

  // 2. 分割文本 (标准化为数组)
  let lines = []

  if (splitMode.value === 'newline') {
    lines = text.split(/\r?\n/)
  } else {
    let separator = ''
    switch (splitMode.value) {
      case 'comma': separator = /,|，/; break // 支持中英文逗号
      case 'space': separator = /\s+/; break
      case 'pipe': separator = /\|/; break
      case 'custom': separator = customSplitChar.value; break
      default: separator = /\n/
    }
    // 如果不是换行符，先split再按换行可能存在的再split
    // 简单处理：先替换所有分隔符为换行，再按换行分割
    if (separator) {
      text = text.split(separator).join('\n')
      lines = text.split(/\r?\n/)
    }
  }

  // 3. 提取模式 (Extraction) - 如果开启，会完全重置 lines
  if (extractionMode.value === 'email') {
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g
    const matches = text.match(emailRegex) || []
    lines = matches // 提取后直接变成新列表
  } else if (extractionMode.value === 'url') {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    const matches = text.match(urlRegex) || []
    lines = matches
  }

  // 4. 行级处理 (Map)
  lines = lines.map(line => {
    let l = line
    if (options.trim) l = l.trim()
    if (caseMode.value === 'upper') l = l.toUpperCase()
    if (caseMode.value === 'lower') l = l.toLowerCase()
    return l
  })

  // 5. 过滤 (Filter)
  if (options.removeEmpty) {
    lines = lines.filter(l => l !== '')
  }

  // 6. 去重 (Set)
  if (options.deduplicate) {
    lines = [...new Set(lines)]
  }

  // 7. 排序 (Sort)
  if (sortMode.value !== 'none') {
    if (sortMode.value === 'asc') lines.sort((a, b) => a.localeCompare(b, 'zh'))
    if (sortMode.value === 'desc') lines.sort((a, b) => b.localeCompare(a, 'zh'))
    if (sortMode.value === 'len') lines.sort((a, b) => a.length - b.length)
  }

  return lines.join('\n')
})

// --- Stats ---
const inputStats = computed(() => ({
  lines: rawText.value ? rawText.value.split(/\r?\n/).length : 0,
  chars: rawText.value.length
}))

const outputStats = computed(() => ({
  lines: processedText.value ? processedText.value.split('\n').length : 0,
  chars: processedText.value.length
}))

// --- Actions ---
const copyResult = async () => {
  if (!processedText.value) return
  try {
    await navigator.clipboard.writeText(processedText.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const pasteText = async () => {
  try {
    const text = await navigator.clipboard.readText()
    rawText.value = text
  } catch (err) {
    // Fallback or permission error
    alert('请手动粘贴')
  }
}

const loadSample = () => {
  rawText.value = `
    User1,  TEST@Example.com, 
  User2, admin@Test.com
  User1, test@example.com
  
  这是一个杂乱的文本，http://google.com
  https://vuejs.org 是个好框架
  
  需要去重，并且提取邮箱。
  USER3, contact@privacybox.io
  `
  // 自动设置一些开关以展示效果
  splitMode.value = 'comma'
  options.deduplicate = true
  options.trim = true
  caseMode.value = 'lower'
}
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }

/* Custom Scrollbar for the control panel */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #cbd5e1;
}
</style>
