<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-cyan-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-cyan-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600">Cron 表达式可视化</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          不再为 `* * * * *` 头秃。可视化生成定时任务规则，支持实时中文语义翻译。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：可视化生成器 -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden flex flex-col min-h-[500px]">
            <!-- 顶部 Tabs -->
            <div class="flex overflow-x-auto border-b border-slate-200 bg-white/50 px-4 py-3 md:px-6 md:py-4 scrollbar-thin">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-4 py-3 md:px-5 md:py-3 text-xs md:text-sm font-bold transition-all relative whitespace-nowrap flex-shrink-0 hover:bg-slate-50 rounded-t-lg mx-0.5"
                :class="activeTab === tab.id ? 'text-cyan-600 bg-white border-t-2 border-cyan-500' : 'text-slate-500 hover:text-slate-700'"
              >
                {{ tab.label }}
                <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 md:hidden" />
              </button>
            </div>

            <!-- 配置面板 -->
            <div class="p-6 md:p-8 flex-1 bg-slate-50/30">
              <!-- 分钟配置 -->
              <div v-if="activeTab === 'minute'" class="space-y-4 animate-fade-in">
                <RadioGroup v-model="state.minute.type" :options="['every', 'cycle', 'specific']" label-map="{every: '每分钟', cycle: '周期触发', specific: '指定分钟'}" />

                <div v-if="state.minute.type === 'cycle'" class="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                  <span class="text-slate-600">从第</span>
                  <input
                    type="number"
                    v-model="state.minute.start"
                    min="0"
                    max="59"
                    class="input-mini"
                  >
                  <span class="text-slate-600">分钟开始，每隔</span>
                  <input
                    type="number"
                    v-model="state.minute.step"
                    min="1"
                    max="59"
                    class="input-mini"
                  >
                  <span class="text-slate-600">分钟执行一次</span>
                </div>

                <div v-if="state.minute.type === 'specific'" class="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div class="grid grid-cols-6 md:grid-cols-10 gap-1.5 md:gap-2">
                    <button
                      v-for="i in 60"
                      :key="i-1"
                      @click="toggleList('minute', i-1)"
                      class="w-7 h-7 md:w-8 md:h-8 rounded text-xs font-mono transition-colors border"
                      :class="state.minute.list.includes(i-1) ? 'bg-cyan-500 text-white border-cyan-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-cyan-300'"
                    >
                      {{ i-1 }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 小时配置 -->
              <div v-if="activeTab === 'hour'" class="space-y-4 animate-fade-in">
                <RadioGroup v-model="state.hour.type" :options="['every', 'cycle', 'specific']" label-map="{every: '每小时', cycle: '周期触发', specific: '指定小时'}" />

                <div v-if="state.hour.type === 'cycle'" class="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                  <span class="text-slate-600">从第</span>
                  <input
                    type="number"
                    v-model="state.hour.start"
                    min="0"
                    max="23"
                    class="input-mini"
                  >
                  <span class="text-slate-600">小时开始，每隔</span>
                  <input
                    type="number"
                    v-model="state.hour.step"
                    min="1"
                    max="23"
                    class="input-mini"
                  >
                  <span class="text-slate-600">小时执行一次</span>
                </div>

                <div v-if="state.hour.type === 'specific'" class="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div class="grid grid-cols-6 md:grid-cols-8 gap-1.5 md:gap-2">
                    <button
                      v-for="i in 24"
                      :key="i-1"
                      @click="toggleList('hour', i-1)"
                      class="w-7 h-7 md:w-8 md:h-8 rounded text-xs font-mono transition-colors border"
                      :class="state.hour.list.includes(i-1) ? 'bg-cyan-500 text-white border-cyan-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-cyan-300'"
                    >
                      {{ i-1 }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 日期配置 -->
              <div v-if="activeTab === 'day'" class="space-y-4 animate-fade-in">
                <RadioGroup v-model="state.day.type" :options="['every', 'cycle', 'specific', 'last']" label-map="{every: '每天', cycle: '周期触发', specific: '指定日期', last: '本月最后一天'}" />

                <div v-if="state.day.type === 'cycle'" class="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                  <span class="text-slate-600">从第</span>
                  <input
                    type="number"
                    v-model="state.day.start"
                    min="1"
                    max="31"
                    class="input-mini"
                  >
                  <span class="text-slate-600">日开始，每隔</span>
                  <input
                    type="number"
                    v-model="state.day.step"
                    min="1"
                    max="31"
                    class="input-mini"
                  >
                  <span class="text-slate-600">天执行一次</span>
                </div>

                <div v-if="state.day.type === 'specific'" class="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div class="grid grid-cols-7 md:grid-cols-10 gap-1.5 md:gap-2">
                    <button
                      v-for="i in 31"
                      :key="i"
                      @click="toggleList('day', i)"
                      class="w-7 h-7 md:w-8 md:h-8 rounded text-xs font-mono transition-colors border"
                      :class="state.day.list.includes(i) ? 'bg-cyan-500 text-white border-cyan-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-cyan-300'"
                    >
                      {{ i }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 月份配置 -->
              <div v-if="activeTab === 'month'" class="space-y-4 animate-fade-in">
                <RadioGroup v-model="state.month.type" :options="['every', 'cycle', 'specific']" label-map="{every: '每月', cycle: '周期触发', specific: '指定月份'}" />

                <div v-if="state.month.type === 'cycle'" class="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                  <span class="text-slate-600">从第</span>
                  <input
                    type="number"
                    v-model="state.month.start"
                    min="1"
                    max="12"
                    class="input-mini"
                  >
                  <span class="text-slate-600">月开始，每隔</span>
                  <input
                    type="number"
                    v-model="state.month.step"
                    min="1"
                    max="12"
                    class="input-mini"
                  >
                  <span class="text-slate-600">月执行一次</span>
                </div>

                <div v-if="state.month.type === 'specific'" class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <button
                      v-for="i in 12"
                      :key="i"
                      @click="toggleList('month', i)"
                      class="px-3 py-2 rounded text-xs font-medium transition-colors border"
                      :class="state.month.list.includes(i) ? 'bg-cyan-500 text-white border-cyan-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-cyan-300'"
                    >
                      {{ i }}月
                    </button>
                  </div>
                </div>
              </div>

              <!-- 星期配置 -->
              <div v-if="activeTab === 'week'" class="space-y-4 animate-fade-in">
                <div class="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm border border-blue-100 flex items-center gap-2 mb-2">
                  <div class="i-tabler-info-circle" />
                  提示：日期模式和星期模式通常不能同时指定，建议其中一项设为 "不指定 (?)" 或 "每天 (*)"
                </div>

                <RadioGroup v-model="state.week.type" :options="['every', 'specific']" label-map="{every: '每天 (星期)', specific: '指定星期'}" />

                <div v-if="state.week.type === 'specific'" class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      v-for="(label, idx) in weekDays"
                      :key="idx"
                      @click="toggleList('week', idx)"
                      class="px-3 py-2 rounded text-xs font-medium transition-colors border"
                      :class="state.week.list.includes(idx) ? 'bg-cyan-500 text-white border-cyan-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-cyan-300'"
                    >
                      {{ label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：结果预览与反解析 -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 flex flex-col sticky top-6">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <span class="w-1.5 h-6 bg-emerald-500 rounded-full" />
              Cron 表达式
            </h2>

            <!-- 结果展示框 -->
            <div class="relative group mb-6">
              <input
                type="text"
                v-model="finalCron"
                @input="handleManualInput"
                class="w-full bg-slate-900 text-cyan-400 font-mono text-xl sm:text-2xl py-4 px-6 rounded-2xl border-2 border-transparent focus:border-cyan-500 focus:outline-none transition-all shadow-inner text-center tracking-widest"
              >
              <button
                @click="copyCron"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/20 transition-colors"
                title="复制"
              >
                <div class="i-tabler-copy text-xl" />
              </button>
            </div>

            <!-- 中文语义翻译 -->
            <div class="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-2xl p-5 border border-cyan-100 mb-6">
              <h3 class="text-xs font-bold text-cyan-600/70 uppercase tracking-wider mb-2">
                Human Readable
              </h3>
              <p class="text-slate-700 font-medium leading-relaxed">
                <span class="text-2xl mr-2">💡</span>
                {{ humanText }}
              </p>
            </div>

            <!-- 常用预设 -->
            <div>
              <h3 class="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
                常用模板
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="preset in presets"
                  :key="preset.val"
                  @click="applyPreset(preset.val)"
                  class="text-left px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all text-xs text-slate-600 hover:text-cyan-700 truncate"
                >
                  {{ preset.label }}
                </button>
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

// --- 简单的 RadioGroup 组件 (内联) ---
const RadioGroup = {
  props: ['modelValue', 'options', 'labelMap'],
  emits: ['update:modelValue'],
  template: `
    <div class="flex flex-wrap gap-2">
      <label 
        v-for="opt in options" 
        :key="opt"
        class="flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all select-none"
        :class="modelValue === opt ? 'bg-cyan-50 border-cyan-200 text-cyan-700 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
      >
        <input type="radio" :value="opt" :checked="modelValue === opt" @change="$emit('update:modelValue', opt)" class="hidden">
        <span class="w-4 h-4 rounded-full border border-current flex items-center justify-center">
          <span v-if="modelValue === opt" class="w-2 h-2 rounded-full bg-cyan-500"></span>
        </span>
        {{ parsedLabelMap[opt] || opt }}
      </label>
    </div>
  `,
  computed: {
    parsedLabelMap () {
      try { return eval('(' + this.labelMap + ')') } catch (e) { return {} }
    }
  }
}

// ---------------- State ----------------
const activeTab = ref('minute')
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const presets = [
  { label: '每分钟', val: '* * * * *' },
  { label: '每小时', val: '0 * * * *' },
  { label: '每天 00:00', val: '0 0 * * *' },
  { label: '每周一 8:00', val: '0 8 * * 1' },
  { label: '每月1号 12:00', val: '0 12 1 * *' },
  { label: '工作日 9:30', val: '30 9 * * 1-5' }
]

const state = reactive({
  minute: { type: 'every', start: 0, step: 5, list: [] },
  hour: { type: 'every', start: 0, step: 1, list: [] },
  day: { type: 'every', start: 1, step: 1, list: [] },
  month: { type: 'every', start: 1, step: 1, list: [] },
  week: { type: 'every', list: [] }
})

// ---------------- Logic ----------------
const generateField = (fieldState, min, max) => {
  const { type, start, step, list } = fieldState
  if (type === 'every') return '*'
  if (type === 'last') return 'L'
  if (type === 'cycle') return `${start}/${step}`
  if (type === 'specific') {
    if (list.length === 0) return '*'
    return list.sort((a, b) => a - b).join(',')
  }
  return '*'
}

const finalCron = computed({
  get: () => {
    const m = generateField(state.minute, 0, 59)
    const h = generateField(state.hour, 0, 23)
    let d = generateField(state.day, 1, 31)
    const mo = generateField(state.month, 1, 12)
    let w = state.week.type === 'specific' && state.week.list.length > 0
      ? state.week.list.sort((a, b) => a - b).join(',')
      : '?'

    if (state.week.type === 'specific') {
      d = '?'
    } else {
      w = '?'
      if (d === '?') d = '*'
    }

    return `${m} ${h} ${d} ${mo} ${w}`.trim()
  },
  set: (val) => {
    const parts = val.trim().split(/\s+/)
    if (parts.length >= 5) {
      parseToState(parts[0], state.minute)
      parseToState(parts[1], state.hour)
      parseToState(parts[2], state.day)
      parseToState(parts[3], state.month)
      parseToState(parts[4], state.week)
    }
  }
})

const parseToState = (str, fieldState) => {
  if (str === '*' || str === '?') {
    fieldState.type = 'every'
    fieldState.list = []
  } else if (str.includes('/')) {
    fieldState.type = 'cycle'
    const [start, step] = str.split('/')
    fieldState.start = parseInt(start) || 0
    fieldState.step = parseInt(step) || 1
  } else if (str.includes(',') || !isNaN(str)) {
    fieldState.type = 'specific'
    fieldState.list = str.split(',').map(Number).filter(n => !isNaN(n))
  } else if (str === 'L') {
    fieldState.type = 'last'
  }
}

const translateField = (val, unit, map = null) => {
  if (val === '*' || val === '?') return ''
  if (val.includes('/')) {
    const [start, step] = val.split('/')
    return `从第 ${start}${unit}开始，每隔 ${step}${unit}`
  }
  if (val.includes(',') || !isNaN(val)) {
    const arr = val.split(',')
    const text = map ? arr.map(i => map[i]).join(',') : val
    return `在第 ${text} ${unit}`
  }
  return val
}

const humanText = computed(() => {
  const parts = finalCron.value.split(' ')
  if (parts.length < 5) return '表达式格式错误'
  const [m, h, d, mo, w] = parts

  if (m === '*' && h === '*' && d === '*') return '每分钟执行一次'

  let text = ''
  if (mo !== '*' && mo !== '?') text += translateField(mo, '月') + ' '
  if (w !== '*' && w !== '?') text += '每周' + (w.split(',').map(i => weekDays[i]).join('、')) + ' '
  if (d !== '*' && d !== '?') {
    if (d === 'L') text += '本月最后一天 '
    else text += translateField(d, '号') + ' '
  } else if (w === '*' || w === '?') {
    if (mo === '*' || mo === '?') text += '每天 '
  }

  if (h === '*' && m === '*') text += '每分钟'
  else if (h !== '*' && m === '*') text += `${translateField(h, '点')} 的每分钟`
  else if (h === '*' && m !== '*') text += `每小时的 ${translateField(m, '分')}`
  else {
    if (!h.includes('/') && !h.includes(',')) text += `${h}:${m.padStart(2, '0')}`
    else text += `${translateField(h, '点')} ${translateField(m, '分')}`
  }

  text += ' 执行'
  return text
})

// ---------------- Actions ----------------
const toggleList = (field, val) => {
  const list = state[field].list
  const idx = list.indexOf(val)
  if (idx > -1) list.splice(idx, 1)
  else list.push(val)
}

const applyPreset = (val) => finalCron.value = val

const handleManualInput = (e) => finalCron.value = e.target.value

const copyCron = async () => {
  await navigator.clipboard.writeText(finalCron.value)
  alert('已复制到剪贴板')
}

const tabs = [
  { id: 'minute', label: '分钟' },
  { id: 'hour', label: '小时' },
  { id: 'day', label: '日期' },
  { id: 'month', label: '月份' },
  { id: 'week', label: '星期' }
]
</script>

<style scoped lang="scss">
/* 规范：使用标准 CSS/SCSS 替代复杂样式的 @apply */
.input-mini {
  padding: 0.25rem;
  width: 4rem;
  border: 1px solid #cbd5e1; /* slate-300 */
  border-radius: 0.25rem;
  text-align: center;
  outline: none;
  transition: all 0.2s;
  &:focus {
    border-color: #06b6d4; /* cyan-500 */
    box-shadow: 0 0 0 1px #06b6d4; /* ring-1 ring-cyan-500 */
  }
}

/* 自定义滚动条样式 */
.scrollbar-thin {
  scrollbar-width: thin;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #cbd5e1; /* slate-300 */
    &:hover {
      background: #94a3b8; /* slate-400 */
    }
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
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
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
