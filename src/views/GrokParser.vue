<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-purple-100">
    <!-- ================= 背景特效 (保持一致) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-purple-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Grok 链接修复</span>
        </h1>
        <p class="text-slate-600">
          剔除乱码和表情，提取核心 UUID，生成可用的 Grok 生成的视频跳转链接。
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- 左侧：输入与结果区 (占 8 列) -->
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 min-h-[400px] flex flex-col transition-all">
            <!-- 输入区域 -->
            <div class="mb-6">
              <label class="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                <span>原始文本</span>
                <span class="text-xs font-normal text-slate-400">支持粘贴任意包含 UUID 的乱码</span>
              </label>
              <textarea
                v-model="inputText"
                placeholder="粘贴你的内容，例如：看下我的8a3ae7bc-faaa...?source=..."
                class="w-full h-32 p-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <!-- 转换按钮 (虽然自动转换，但提供按钮更有仪式感，也可用于清空) -->
            <div class="flex justify-end mb-6">
              <button
                v-if="inputText"
                @click="inputText = ''"
                class="text-sm text-slate-400 hover:text-slate-600 mr-4"
              >
                清空内容
              </button>
            </div>

            <!-- 结果区域 -->
            <div class="flex-1">
              <label class="block text-sm font-bold text-slate-700 mb-2">解析结果</label>

              <div v-if="resultUrl" class="relative group">
                <!-- 结果显示框 -->
                <div class="w-full p-4 pr-24 rounded-xl bg-purple-50 border border-purple-100 text-purple-900 break-all font-mono text-sm leading-relaxed">
                  {{ resultUrl }}
                </div>

                <!-- 悬浮/固定操作栏 -->
                <div class="absolute right-2 top-2 bottom-2 flex flex-col justify-center gap-2">
                  <!-- 复制按钮 -->
                  <button
                    @click="copyResult"
                    class="flex items-center justify-center px-3 py-1.5 bg-white border border-purple-200 shadow-sm rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all active:scale-95"
                  >
                    <span v-if="!copied">复制</span>
                    <span v-else class="flex items-center gap-1">
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      /></svg>
                      已复制
                    </span>
                  </button>

                  <!-- 跳转按钮 -->
                  <button
                    @click="openUrl"
                    class="flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 rounded-lg text-xs font-medium text-white hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all"
                  >
                    跳转
                    <svg
                      class="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h4m10 0h-4a2 2 0 00-2-2V8a2 2 0 002-2h4M6 6m0 0h12v12H6V6z"
                    /></svg>
                  </button>
                </div>
              </div>

              <!-- 空状态/错误提示 -->
              <div v-else class="h-full min-h-[100px] flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                <span v-if="!inputText">等待输入...</span>
                <span v-else class="text-red-400 flex items-center gap-1">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  /></svg>
                  未检测到有效的 UUID 格式
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：说明区 (占 4 列) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sticky top-8">
            <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span class="w-1 h-6 bg-purple-500 rounded-full" />
              工具说明
            </h2>

            <div class="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                本工具用于修复多余内容的 Grok 链接。
              </p>

              <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p class="font-bold text-blue-800 mb-2">
                  识别规则：
                </p>
                <p>我们会扫描文本中符合 <code class="bg-white px-1 py-0.5 rounded border border-blue-200 text-blue-600 text-xs">8-4-4-4-12</code> 格式的 UUID 字符串。</p>
              </div>

              <div>
                <p class="font-medium text-slate-800 mb-2">
                  示例输入：
                </p>
                <div class="bg-slate-100 p-2 rounded text-xs text-slate-500 break-all">
                  看下我的8a3ae7bc-faaa-4100-aa82-13939d7ef2b8?source=copy_link
                </div>
              </div>

              <div class="flex justify-center pt-2">
                <svg
                  class="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                /></svg>
              </div>

              <div>
                <p class="font-medium text-slate-800 mb-2">
                  标准输出：
                </p>
                <div class="bg-purple-50 p-2 rounded text-xs text-purple-600 break-all border border-purple-100">
                  https://grok.com/imagine/post/8a3ae7bc-faaa-4100-aa82-13939d7ef2b8...
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
import { ref, computed, watch } from 'vue'

const inputText = ref('')
const copied = ref(false)

// 监听输入，重置复制状态
watch(inputText, () => {
  copied.value = false
})

// 核心解析逻辑
const resultUrl = computed(() => {
  if (!inputText.value) return ''

  // 1. 正则匹配 UUID (例如: 917ad264-4c0e-40ac-b600-850e9d225ce2)
  // 不区分大小写
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  const match = inputText.value.match(uuidRegex)

  if (match) {
    const uuid = match[0]
    // 2. 强制拼接标准前缀和后缀，不管输入里原来的参数有多乱
    const baseUrl = 'https://grok.com/imagine/post/'
    const queryParams = '?source=copy_link&platform=android'

    return `${baseUrl}${uuid}${queryParams}`
  }

  return ''
})

// 复制功能
const copyResult = async () => {
  if (!resultUrl.value) return
  try {
    await navigator.clipboard.writeText(resultUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failed', err)
  }
}

// 跳转功能
const openUrl = () => {
  if (resultUrl.value) {
    window.open(resultUrl.value, '_blank')
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
</style>
