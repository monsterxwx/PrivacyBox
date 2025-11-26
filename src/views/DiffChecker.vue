<template>
  <div class="h-100% bg-slate-50 relative overflow-hidden font-sans selection:bg-indigo-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-sky-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-[100%]">
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
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">文本/代码对比</span>
              <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold tracking-wide">DIFF</span>
            </h1>
            <p class="text-xs text-slate-500">
              快速比对文本差异，隐私安全，无上传。
            </p>
          </div>
        </div>

        <!-- 顶部工具栏 -->
        <div class="flex items-center gap-3 bg-white/60 backdrop-blur p-1.5 rounded-xl shadow-sm border border-white/50 overflow-x-auto">
          <!-- 模式切换 -->
          <div class="flex bg-slate-200/50 rounded-lg p-1">
            <button
              @click="diffMode = 'lines'"
              class="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
              :class="diffMode === 'lines' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
            >
              行对比
            </button>
            <button
              @click="diffMode = 'chars'"
              class="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
              :class="diffMode === 'chars' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
            >
              字符对比
            </button>
          </div>

          <div class="w-px h-6 bg-slate-300 mx-1" />

          <!-- 选项开关 -->
          <label class="flex items-center gap-2 cursor-pointer px-2">
            <input type="checkbox" v-model="ignoreSpace" class="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300">
            <span class="text-xs font-medium text-slate-600 select-none">忽略空格</span>
          </label>

          <div class="w-px h-6 bg-slate-300 mx-1" />

          <button @click="clearAll" class="px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1">
            <span class="text-lg">🗑️</span> <span class="hidden sm:inline">清空</span>
          </button>
        </div>
      </div>

      <!-- 主体区域：分为上下两部分 -->
      <div class="flex-[1_0] min-h-0 flex flex-col gap-4 pb-4">
        <!-- 上半部分：双栏输入 (高度固定或可拖动，这里设为固定比例以简化) -->
        <div class="h-[40%] grid grid-cols-2 gap-4">
          <!-- 左侧：原始文本 -->
          <div class="flex flex-col h-full relative group">
            <div class="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50" />
            <div class="relative z-10 flex flex-col h-full p-3">
              <div class="flex justify-between items-center mb-2 px-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-red-400" /> 原始文本 (Original)
                </label>
                <button @click="pasteTo('old')" class="text-xs text-indigo-500 hover:underline">
                  粘贴
                </button>
              </div>
              <textarea
                v-model="oldText"
                class="flex-1 w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 font-mono text-xs md:text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-700 custom-scrollbar"
                placeholder="粘贴原始代码/文本..."
                spellcheck="false"
              />
            </div>
          </div>

          <!-- 右侧：修改后文本 -->
          <div class="flex flex-col h-full relative group">
            <div class="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50" />
            <div class="relative z-10 flex flex-col h-full p-3">
              <div class="flex justify-between items-center mb-2 px-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-green-400" /> 修改文本 (Modified)
                </label>
                <button @click="pasteTo('new')" class="text-xs text-indigo-500 hover:underline">
                  粘贴
                </button>
              </div>
              <textarea
                v-model="newText"
                class="flex-1 w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 font-mono text-xs md:text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-700 custom-scrollbar"
                placeholder="粘贴修改后的代码/文本..."
                spellcheck="false"
              />
            </div>
          </div>
        </div>

        <!-- 下半部分：对比结果 -->
        <div class="flex-1 flex flex-col relative min-h-0">
          <div class="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50" />
          <div class="relative z-10 flex flex-col h-full p-4 overflow-hidden">
            <div class="flex justify-between items-center mb-3 shrink-0">
              <h3 class="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span class="text-lg">📊</span> 对比结果
                <span class="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full" v-if="stats">
                  {{ stats.add }} 处新增, {{ stats.del }} 处删除
                </span>
              </h3>
            </div>

            <!-- 结果容器 -->
            <div class="flex-1 bg-white border border-slate-200 rounded-xl overflow-auto custom-scrollbar font-mono text-sm leading-6">
              <!-- 空状态 -->
              <div v-if="!oldText && !newText" class="h-full flex flex-col items-center justify-center text-slate-400">
                <div class="text-4xl mb-2 opacity-50">
                  ⚖️
                </div>
                <p>请在上方粘贴两段文本以开始对比</p>
              </div>

              <!-- 无差异状态 -->
              <div v-else-if="diffResult.length === 1 && !diffResult[0].added && !diffResult[0].removed" class="h-full flex flex-col items-center justify-center text-green-600">
                <div class="text-4xl mb-2">
                  ✅
                </div>
                <p class="font-bold">
                  完美匹配！
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  两段文本内容完全一致
                </p>
              </div>

              <!-- 差异列表 -->
              <div v-else class="min-w-max">
                <div
                  v-for="(part, index) in diffResult"
                  :key="index"
                  class="flex"
                  :class="{
                    'bg-green-50 text-green-900': part.added,
                    'bg-red-50 text-red-900 decoration-red-200': part.removed,
                    'text-slate-600': !part.added && !part.removed
                  }"
                >
                  <!-- 符号列 -->
                  <div class="w-8 shrink-0 text-center select-none opacity-50 border-r border-slate-100 mr-2 bg-slate-50/50">
                    {{ part.added ? '+' : (part.removed ? '-' : '') }}
                  </div>
                  <!-- 内容列 -->
                  <pre class="whitespace-pre-wrap break-all py-0.5 pr-4 font-mono">{{ part.value }}</pre>
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
import { ref, computed } from 'vue'
import * as Diff from 'diff'

// ---------------- 状态管理 ----------------
const oldText = ref('')
const newText = ref('')
const diffMode = ref('lines') // 'lines' | 'chars'
const ignoreSpace = ref(false)

// ---------------- 核心 Diff 逻辑 ----------------
const diffResult = computed(() => {
  if (!oldText.value && !newText.value) return []

  const options = { ignoreWhitespace: ignoreSpace.value }

  // 根据模式选择不同的 diff 算法
  let result
  if (diffMode.value === 'lines') {
    // 按行对比：适合代码、长文本
    // diffLines 默认返回带换行符的块，为了显示美观，我们可能需要后续处理
    // 但这里为了保持简单，直接使用 diffLines 的结果，UI层用 pre 显示
    result = Diff.diffLines(oldText.value, newText.value, options)
  } else {
    // 按字对比：适合找拼写错误
    result = Diff.diffChars(oldText.value, newText.value, options)
  }

  return result
})

// 统计变更数量
const stats = computed(() => {
  if (!diffResult.value.length) return null
  let add = 0; let del = 0
  diffResult.value.forEach(part => {
    if (part.added) add++
    if (part.removed) del++
  })
  return { add, del }
})

// ---------------- 辅助功能 ----------------
const clearAll = () => {
  oldText.value = ''
  newText.value = ''
}

const pasteTo = async (target) => {
  try {
    const text = await navigator.clipboard.readText()
    if (target === 'old') oldText.value = text
    else newText.value = text
  } catch (err) {
    alert('无法读取剪贴板，请手动粘贴')
  }
}
</script>

<style scoped>
/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: rgb(148 163 184 / 30%);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(148 163 184 / 50%);
}

/* 动画 */
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
</style>
