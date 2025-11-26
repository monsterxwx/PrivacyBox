<template>
  <div class="h-100% w-100%  bg-slate-50 relative overflow-hidden   font-sans selection:bg-indigo-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[96px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6  flex flex-col h-100%">
      <!-- 头部 -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 shrink-0 gap-4">
        <div class="flex items-center gap-4">
          <RouterLink to="/" class="w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white transition-all shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            ><path d="m15 18-6-6 6-6" /></svg>
          </RouterLink>
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">JSON 格式化</span>
              <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold tracking-wide">DEV</span>
            </h1>
            <p class="text-xs text-slate-500">
              语法高亮 • 错误校验 • 压缩混淆
            </p>
          </div>
        </div>

        <!-- 顶部工具栏 -->
        <div class="flex items-center gap-2 bg-white/60 backdrop-blur p-1.5 rounded-xl shadow-sm border border-white/50 overflow-x-auto max-w-full">
          <!-- 使用通用样式变量 btnClass -->
          <button @click="loadSample" :class="btnClass">
            <span class="text-lg">🎲</span> <span class="hidden sm:inline">示例</span>
          </button>

          <div class="w-px h-6 bg-slate-300 mx-1" />

          <button @click="compressJson" :class="btnClass" title="压缩为一行">
            <span class="text-lg">📦</span> <span class="hidden sm:inline">压缩</span>
          </button>

          <!-- 特殊颜色的按钮单独写 class -->
          <button @click="formatJson" class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100" title="美化格式">
            <span class="text-lg">✨</span> <span class="hidden sm:inline">美化</span>
          </button>

          <div class="w-px h-6 bg-slate-300 mx-1" />

          <button @click="copyResult" :class="btnClass">
            <span class="text-lg">📋</span> <span class="hidden sm:inline">复制</span>
          </button>
          <button @click="downloadJson" :class="btnClass">
            <span class="text-lg">💾</span> <span class="hidden sm:inline">保存</span>
          </button>

          <button @click="clearAll" :class="btnClass + ' text-red-500 hover:!bg-red-50 hover:!text-red-600'">
            <span class="text-lg">🗑️</span>
          </button>
        </div>
      </div>

      <!-- 编辑器主体 -->
      <div class="flex-[1_0] min-h-0 overflow-auto grid md:grid-cols-2 gap-4 pb-4 hide-scrollbar">
        <!-- 左侧：输入区 -->
        <div class="flex flex-col h-full relative group">
          <div class="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50" />
          <div class="relative z-10 flex flex-col h-full p-4">
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-slate-400" /> 输入 (Raw)
              </label>
              <div class="text-xs text-slate-400 font-mono">
                {{ inputMeta }}
              </div>
            </div>
            <textarea
              v-model="rawInput"
              placeholder="请在此粘贴 JSON 代码..."
              class="flex-1 w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-700 leading-relaxed custom-scrollbar hide-scrollbar"
              spellcheck="false"
            />
          </div>
        </div>

        <!-- 右侧：输出区 -->
        <div class="flex flex-col h-full relative group">
          <div class="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50" />
          <div class="relative z-10 flex flex-col h-full p-4">
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="hasError ? 'bg-red-500 animate-pulse' : 'bg-green-500'" />
                {{ hasError ? '格式错误' : '预览 (Preview)' }}
              </label>
              <select v-model="indentSpace" class="text-xs bg-slate-100 border-none rounded py-0.5 pl-2 pr-6 text-slate-600 focus:ring-0 cursor-pointer outline-none">
                <option :value="2">
                  2 空格缩进
                </option>
                <option :value="4">
                  4 空格缩进
                </option>
              </select>
            </div>

            <div class="flex-1 relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
              <!-- 错误提示 -->
              <div v-if="hasError" class="absolute inset-0 bg-red-900/10 backdrop-blur-[2px] z-20 flex items-center justify-center p-6">
                <div class="bg-red-50 text-red-600 p-4 rounded-xl shadow-xl max-w-md border border-red-200">
                  <div class="font-bold mb-1 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    ><circle cx="12" cy="12" r="10" /><line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                    /><line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                    /></svg>
                    JSON 解析失败
                  </div>
                  <div class="text-sm font-mono break-all opacity-90">
                    {{ errorMessage }}
                  </div>
                </div>
              </div>

              <!-- 代码预览 -->
              <pre
                class="w-full h-full p-4 overflow-auto font-mono text-sm text-slate-300 leading-relaxed custom-scrollbar hide-scrollbar selection:bg-indigo-500/30"
                v-html="highlightedCode"
              />

              <!-- 复制提示 -->
              <div v-if="showCopyTip" class="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg animate-fade-in-down flex items-center gap-1 z-30">
                已复制
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
import { saveAs } from 'file-saver'

// ---------------- 样式常量 ----------------
// 为了不写重复的 class，我们在 JS 里定义通用按钮样式
const btnClass = 'px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 whitespace-nowrap border border-transparent'

// ---------------- 状态管理 ----------------
const rawInput = ref('')
const indentSpace = ref(2)
const hasError = ref(false)
const errorMessage = ref('')
const showCopyTip = ref(false)

// ---------------- 逻辑部分 (保持不变) ----------------
const inputMeta = computed(() => {
  const len = rawInput.value.length
  if (len === 0) return '0 字符'
  return len > 1024 ? `${(len / 1024).toFixed(2)} KB` : `${len} 字符`
})

const syntaxHighlight = (json) => {
  if (!json) return ''
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'text-orange-400'
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-indigo-300 font-bold'
      } else {
        cls = 'text-emerald-300'
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-blue-400 font-bold'
    } else if (/null/.test(match)) {
      cls = 'text-pink-400 font-bold'
    }
    return '<span class="' + cls + '">' + match + '</span>'
  })
}

const highlightedCode = computed(() => {
  if (!rawInput.value.trim()) return ''
  try {
    const obj = JSON.parse(rawInput.value)
    hasError.value = false
    errorMessage.value = ''
    const formatted = JSON.stringify(obj, null, indentSpace.value)
    return syntaxHighlight(formatted)
  } catch (e) {
    hasError.value = true
    errorMessage.value = e.message
    return rawInput.value
  }
})

const loadSample = () => {
  const sample = { project: 'PrivacyBox', version: 1.0, isSecure: true, tags: ['json', 'tool'] }
  rawInput.value = JSON.stringify(sample, null, 2)
}

const formatJson = () => {
  try {
    const obj = JSON.parse(rawInput.value)
    rawInput.value = JSON.stringify(obj, null, indentSpace.value)
  } catch (e) {}
}

const compressJson = () => {
  try {
    const obj = JSON.parse(rawInput.value)
    rawInput.value = JSON.stringify(obj)
  } catch (e) {}
}

const copyResult = () => {
  if (hasError.value || !rawInput.value) return
  try {
    const obj = JSON.parse(rawInput.value)
    const text = JSON.stringify(obj, null, indentSpace.value)
    navigator.clipboard.writeText(text).then(() => {
      showCopyTip.value = true
      setTimeout(() => showCopyTip.value = false, 2000)
    })
  } catch (e) {}
}

const downloadJson = () => {
  if (hasError.value || !rawInput.value) return
  const blob = new Blob([JSON.stringify(JSON.parse(rawInput.value), null, indentSpace.value)], { type: 'application/json;charset=utf-8' })
  saveAs(blob, `data_${Date.now()}.json`)
}

const clearAll = () => {
  rawInput.value = ''
  hasError.value = false
}
</script>

<style lang="scss" scoped>
/*
  改为标准 SCSS 写法，不使用 @apply
*/

/* 滚动条美化 */
.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgb(148 163 184 / 30%); // slate-400 + opacity
    &:hover {
      background: rgb(148 163 184 / 50%);
    }
  }
}

/* 隐藏滚动条 */
.hide-scrollbar {
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }

  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* 动画 - 纯 CSS Keyframes */
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

@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
  animation: fade-in-down 0.3s ease-out;
}
</style>
