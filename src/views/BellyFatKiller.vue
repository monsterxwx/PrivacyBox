<template>
  <div class="min-h-screen bg-gray-50 pb-24 font-sans text-gray-700 select-none">
    <!-- 顶部状态栏 -->
    <header v-if="activeTab === 'history'" class="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-b-3xl shadow-xl relative overflow-hidden">
      <div class="relative z-10">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-2xl font-extrabold tracking-tight">
              腹肌撕裂计划
            </h1>
            <div class="flex items-center gap-2 mt-1">
              <span class="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">科学减脂</span>
              <p class="text-blue-100 text-xs">
                每天40分钟，击碎内脏脂肪
              </p>
            </div>
          </div>
          <button @click="resetData" class="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition backdrop-blur-md border border-white/10">
            重置
          </button>
        </div>

        <!-- 未开始状态 -->
        <div v-if="!store.startDate" class="text-center py-4">
          <button @click="startPlan" class="w-full bg-white text-blue-600 font-bold py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            🚀 点击开启计划
          </button>
          <p class="text-xs text-blue-200 mt-3 opacity-80">
            点击后将开始记录你的蜕变之旅
          </p>
        </div>

        <!-- 进行中状态 -->
        <div v-else class="grid grid-cols-3 gap-2 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
          <div class="text-center">
            <div class="text-[10px] text-blue-200 uppercase tracking-wider mb-1">
              当前阶段
            </div>
            <div class="font-bold text-sm leading-tight">
              {{ currentStage.name }}
            </div>
          </div>
          <div class="text-center border-l border-white/10 border-r">
            <div class="text-[10px] text-blue-200 uppercase tracking-wider mb-1">
              已坚持
            </div>
            <div class="font-bold text-xl">
              {{ daysSinceStart }} <span class="text-xs font-normal">天</span>
            </div>
          </div>
          <div class="text-center">
            <div class="text-[10px] text-blue-200 uppercase tracking-wider mb-1">
              今日进度
            </div>
            <div class="font-bold text-xl">
              {{ todayProgress }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 装饰背景球 -->
      <div class="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl" />
    </header>

    <!-- 主内容区 -->
    <main class="p-5 max-w-md mx-auto">
      <!-- Tab 1: 今日任务 -->
      <transition name="fade" mode="out-in">
        <section v-if="activeTab === 'daily'" key="daily">
          <div class="flex justify-between items-center mb-5">
            <h2 class="font-bold text-xl text-gray-800 flex items-center gap-2">
              📅 今日打卡
              <span class="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ currentDateStr }}</span>
            </h2>
          </div>

          <div class="space-y-4">
            <!-- 跑步任务 -->
            <div
              @click="toggleTask('cardio')"
              :class="['relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden group',
                       isTaskDone('cardio') ? 'bg-orange-50 border-orange-200' : 'bg-white border-transparent shadow-sm hover:shadow-md']"
            >
              <div class="flex items-start gap-4 relative z-10">
                <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors', isTaskDone('cardio') ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-400']">
                  🏃
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800 text-lg">
                    有氧：慢跑+快走
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    3km慢跑 (约25min) <br> + 15min 快走
                  </p>
                  <div class="text-xs text-orange-600 mt-2 font-medium" v-if="!isTaskDone('cardio')">
                    🔥 目标：心率微喘，出汗
                  </div>
                </div>
                <div class="text-2xl transition-transform duration-300" :class="isTaskDone('cardio') ? 'scale-100 text-orange-500' : 'scale-0'">
                  <i class="fas fa-check-circle" /> ✓
                </div>
              </div>
            </div>

            <!-- 力量任务 (这里我加了直接跳转按钮) -->
            <div
              :class="['relative p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden',
                       isTaskDone('strength') ? 'bg-blue-50 border-blue-200' : 'bg-white border-transparent shadow-sm hover:shadow-md']"
            >
              <div class="flex items-start gap-4 relative z-10" @click="toggleTask('strength')">
                <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors', isTaskDone('strength') ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-400']">
                  🧘
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800 text-lg">
                    核心：垫上四部曲
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    平板 / 死虫 / 臀桥 / 卷腹
                  </p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    每项3组，组间休息30秒
                  </p>
                </div>
                <div class="text-2xl transition-transform duration-300" :class="isTaskDone('strength') ? 'scale-100 text-blue-500' : 'scale-0'">
                  ✓
                </div>
              </div>

              <!-- 快捷入口：如果不知道怎么做，直接点这里 -->
              <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center" v-if="!isTaskDone('strength')">
                <span class="text-xs text-gray-400">不知道动作怎么做？</span>
                <button @click.stop="activeTab = 'train'" class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">
                  📺 去跟练模式 (含演示)
                </button>
              </div>
            </div>

            <!-- 饮食任务 -->
            <div
              @click="toggleTask('diet')"
              :class="['relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden group',
                       isTaskDone('diet') ? 'bg-green-50 border-green-200' : 'bg-white border-transparent shadow-sm hover:shadow-md']"
            >
              <div class="flex items-start gap-4 relative z-10">
                <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors', isTaskDone('diet') ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400']">
                  🥗
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800 text-lg">
                    饮食：三不一控
                  </h3>
                  <ul class="text-sm text-gray-500 mt-2 space-y-1 list-disc list-inside">
                    <li>不喝甜饮料</li>
                    <li>不吃精细夜宵</li>
                    <li>不吃假蔬菜(土豆等)</li>
                    <li><b class="text-green-700">晚餐主食减半</b></li>
                  </ul>
                </div>
                <div class="text-2xl transition-transform duration-300" :class="isTaskDone('diet') ? 'scale-100 text-green-500' : 'scale-0'">
                  ✓
                </div>
              </div>
            </div>
          </div>

          <!-- 阶段说明卡片 -->
          <div class="mt-6 p-5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 shadow-sm">
            <h3 class="font-bold text-indigo-800 mb-2 text-sm flex items-center gap-2">
              ℹ️ {{ currentStage.name }} 重点提示
            </h3>
            <p class="text-sm text-indigo-900/70 leading-relaxed">
              {{ currentStage.desc }}
            </p>
          </div>
        </section>
      </transition>

      <!-- Tab 2: 训练指导 (包含搜索跳转) -->
      <transition name="fade" mode="out-in">
        <section v-if="activeTab === 'train'" key="train" class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="font-bold text-xl text-gray-800">
              🏋️‍♂️ 动作跟练模式
            </h2>
            <span class="text-xs text-gray-400 bg-white px-2 py-1 rounded border">做完记得回首页打勾</span>
          </div>

          <div v-for="(exercise, index) in exercises" :key="index" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-md">
            <!-- 标题栏 -->
            <div class="bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <span class="text-xs font-bold text-gray-400 block mb-0.5">动作 {{ index + 1 }}</span>
                <h3 class="font-bold text-gray-800 text-lg">
                  {{ exercise.name }}
                </h3>
              </div>
              <span class="text-xs font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full">{{ exercise.sets }}</span>
            </div>

            <div class="p-5">
              <!-- 要点提示 -->
              <div class="text-sm text-gray-600 mb-5 space-y-2 bg-gray-50/50 p-3 rounded-xl">
                <p v-for="(tip, tIdx) in exercise.tips" :key="tIdx" class="flex items-start gap-2">
                  <span class="text-green-500 mt-1">●</span>
                  <span>{{ tip }}</span>
                </p>
              </div>

              <!-- 操作区：计时器 + 搜索按钮 -->
              <div class="flex gap-3">
                <!-- 计时器按钮 (如果有时间要求) -->
                <button
                  v-if="exercise.timerSeconds"
                  @click="toggleTimer(index, exercise.timerSeconds)"
                  :class="['flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex justify-center items-center gap-2 active:scale-95',
                           timers[index].running ? 'bg-red-500 text-white shadow-red-200' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700']"
                >
                  <span v-if="timers[index].running" class="animate-pulse">⏳ {{ timers[index].timeLeft }}s (停止)</span>
                  <span v-else>⏱ 计时 {{ exercise.timerSeconds }}s</span>
                </button>
                <div v-else class="flex-1 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center text-sm font-medium">
                  无需计时，数次数
                </div>

                <!-- 关键：搜索跳转按钮 -->
                <a
                  :href="`https://www.google.com/search?q=${exercise.searchQuery}&tbm=isch`"
                  target="_blank"
                  class="px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm active:scale-95"
                >
                  <span>📺</span>
                  <span>看示范</span>
                </a>
              </div>
            </div>
          </div>

          <!-- 底部提示 -->
          <div class="text-center text-xs text-gray-400 py-4">
            所有动作建议在瑜伽垫上完成，保护关节
          </div>
        </section>
      </transition>

      <!-- Tab 3: 历史数据 -->
      <transition name="fade" mode="out-in">
        <section v-if="activeTab === 'history'" key="history">
          <h2 class="font-bold text-xl text-gray-800 mb-6">
            📈 你的坚持足迹
          </h2>

          <div v-if="Object.keys(store.logs).length === 0" class="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <div class="text-4xl mb-3">
              🕸️
            </div>
            <p>暂无数据，今天开始第一天打卡吧！</p>
            <button @click="activeTab='daily'" class="mt-4 text-blue-600 text-sm font-bold">
              去打卡
            </button>
          </div>

          <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div v-for="(log, date) in sortedLogs" :key="date" class="border-b border-gray-50 last:border-0 p-4 flex justify-between items-center hover:bg-gray-50 transition">
              <div>
                <div class="font-bold text-gray-700 text-base">
                  {{ formatDate(date) }}
                </div>
                <div class="text-xs text-gray-400 mt-0.5">
                  {{ getDayOfWeek(date) }}
                </div>
              </div>
              <div class="flex gap-2">
                <div class="flex flex-col items-center gap-1">
                  <span :class="['w-3 h-3 rounded-full shadow-sm', log.cardio ? 'bg-orange-500' : 'bg-gray-200']" />
                  <span class="text-[8px] text-gray-300">跑</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <span :class="['w-3 h-3 rounded-full shadow-sm', log.strength ? 'bg-blue-500' : 'bg-gray-200']" />
                  <span class="text-[8px] text-gray-300">练</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <span :class="['w-3 h-3 rounded-full shadow-sm', log.diet ? 'bg-green-500' : 'bg-gray-200']" />
                  <span class="text-[8px] text-gray-300">吃</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </transition>
    </main>

    <!-- 底部导航栏 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 grid grid-cols-3  z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
      <button
        @click="activeTab = 'daily'"
        class="flex flex-col items-center justify-center py-2 transition-colors duration-200 active:bg-gray-50"
      >
        <!-- 选中状态图标 (实心/深色) -->
        <div v-if="activeTab === 'daily'" class="text-2xl mb-0.5 transform transition-transform duration-200">
          📋
        </div>
        <!-- 未选中状态图标 (浅色/透明度) -->
        <div v-else class="text-2xl mb-0.5 opacity-40 grayscale filter">
          📋
        </div>

        <span :class="['text-[10px] font-bold', activeTab === 'daily' ? 'text-blue-600' : 'text-gray-400']">
          今日
        </span>
      </button>

      <button
        @click="activeTab = 'train'"
        class="flex flex-col items-center justify-center py-2 transition-colors duration-200 active:bg-gray-50"
      >
        <div v-if="activeTab === 'train'" class="text-2xl mb-0.5 transform transition-transform duration-200">
          💪
        </div>
        <div v-else class="text-2xl mb-0.5 opacity-40 grayscale filter">
          💪
        </div>

        <span :class="['text-[10px] font-bold', activeTab === 'train' ? 'text-blue-600' : 'text-gray-400']">
          跟练
        </span>
      </button>

      <button
        @click="activeTab = 'history'"
        class="flex flex-col items-center justify-center py-2 transition-colors duration-200 active:bg-gray-50"
      >
        <div v-if="activeTab === 'history'" class="text-2xl mb-0.5 transform transition-transform duration-200">
          📊
        </div>
        <div v-else class="text-2xl mb-0.5 opacity-40 grayscale filter">
          📊
        </div>

        <span :class="['text-[10px] font-bold', activeTab === 'history' ? 'text-blue-600' : 'text-gray-400']">
          数据
        </span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'

// --- 常量配置 ---
const STORAGE_KEY = 'belly_fat_killer_v2' // 升级版本号，防止旧数据冲突
const exercises = [
  {
    name: '平板支撑 (Plank)',
    sets: '3组 x 力竭',
    timerSeconds: 45,
    searchQuery: '平板支撑标准动作', // 优化搜索词
    tips: ['身体成一条直线，像一块木板', '不要撅屁股，也不要塌腰', '肚子用力收紧，呼吸不要停']
  },
  {
    name: '死虫式 (Dead Bug)',
    sets: '3组 x 20次',
    timerSeconds: null,
    searchQuery: '死虫式动作教学',
    tips: ['核心动作：后背完全贴死地面', '手脚对侧伸展，不要着地', '如果你觉得腰酸，腿就不要伸太低']
  },
  {
    name: '臀桥 (Glute Bridge)',
    sets: '3组 x 15次',
    timerSeconds: null,
    searchQuery: '臀桥标准动作',
    tips: ['脚后跟踩地，屁股用力往上顶', '大腿和上半身成一条直线', '不要用腰拱起来，要用屁股夹紧']
  },
  {
    name: '摸膝卷腹',
    sets: '3组 x 15次',
    timerSeconds: null,
    searchQuery: '摸膝卷腹动作',
    tips: ['不用像仰卧起坐那样坐起来！', '只要肩膀离地，手指摸到膝盖就行', '脖子不要用力，用肚子的力量']
  }
]

// --- 状态管理 ---
const activeTab = ref('daily')
const store = ref({
  startDate: null,
  logs: {}
})
const timers = reactive(exercises.map(() => ({ running: false, timeLeft: 0, interval: null })))

// --- 计算逻辑 ---
const todayStr = new Date().toLocaleDateString('en-CA')
const currentDateStr = computed(() => {
  const d = new Date()
  return `${d.getMonth() + 1}月${d.getDate()}日`
})

const daysSinceStart = computed(() => {
  if (!store.value.startDate) return 0
  const start = new Date(store.value.startDate)
  const now = new Date()
  const diffTime = Math.abs(now - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const currentStage = computed(() => {
  const day = daysSinceStart.value
  if (day <= 14) {
    return { name: '适应期 (第1-2周)', desc: '身体正在适应。体重可能微增（水肿），是正常现象。请重点关注完成度，而不是体重。' }
  } else if (day <= 30) {
    return { name: '燃脂期 (第3-4周)', desc: '关键时期！内脏脂肪开始燃烧。你会发现裤腰变松了，早上空腹最明显。坚持住！' }
  } else {
    return { name: '塑形期 (1个月后)', desc: '肚子应该明显变小了。现在可以尝试缩短休息时间，或者做动作时更慢一点，增加强度。' }
  }
})

const todayProgress = computed(() => {
  const log = store.value.logs[todayStr] || {}
  let done = 0
  if (log.cardio) done++
  if (log.strength) done++
  if (log.diet) done++
  return Math.round((done / 3) * 100)
})

const sortedLogs = computed(() => {
  return Object.keys(store.value.logs)
    .sort((a, b) => new Date(b) - new Date(a))
    .reduce((acc, key) => {
      acc[key] = store.value.logs[key]
      return acc
    }, {})
})

// --- 核心方法 ---
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      store.value = JSON.parse(saved)
    } catch (e) {
      console.error('存储数据解析失败', e)
    }
  }
})

watch(store, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

const startPlan = () => {
  store.value.startDate = new Date().toISOString()
  // 初始化当天的
  if (!store.value.logs[todayStr]) {
    store.value.logs[todayStr] = { cardio: false, strength: false, diet: false }
  }
}

const resetData = () => {
  if (confirm('⚠️ 确定要清空所有记录重新开始吗？这无法撤销。')) {
    store.value = { startDate: null, logs: {} }
    localStorage.removeItem(STORAGE_KEY)
    activeTab.value = 'daily'
  }
}

const toggleTask = (taskName) => {
  if (!store.value.startDate) {
    alert('请先点击顶部的“开启计划”按钮，仪式感很重要！')
    return
  }
  if (!store.value.logs[todayStr]) {
    store.value.logs[todayStr] = { cardio: false, strength: false, diet: false }
  }
  store.value.logs[todayStr][taskName] = !store.value.logs[todayStr][taskName]

  // 震动反馈
  if (store.value.logs[todayStr][taskName] && navigator.vibrate) {
    navigator.vibrate(50)
  }
}

const isTaskDone = (taskName) => {
  return store.value.logs[todayStr] && store.value.logs[todayStr][taskName]
}

const toggleTimer = (index, seconds) => {
  const timer = timers[index]
  if (timer.running) {
    clearInterval(timer.interval)
    timer.running = false
    timer.timeLeft = 0
  } else {
    timer.timeLeft = seconds
    timer.running = true
    timer.interval = setInterval(() => {
      timer.timeLeft--
      if (timer.timeLeft <= 0) {
        clearInterval(timer.interval)
        timer.running = false
        if (navigator.vibrate) navigator.vibrate([200, 100, 200])
        alert('⏰ 时间到！做得很棒！')
      }
    }, 1000)
  }
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const getDayOfWeek = (dateStr) => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[new Date(dateStr).getDay()]
}
</script>

<style>
/* 简单的过度动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
