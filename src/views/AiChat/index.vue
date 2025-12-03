<template>
  <div class="flex flex-col h-100% bg-[#f9f9f9] text-slate-800 font-sans overflow-hidden relative">
    <main
      ref="scrollContainer"
      @scroll="handleScroll"
      class="flex-[1_0] min-h-0 overflow-y-auto px-4 sm:px-0 pb-56 scroll-smooth custom-scrollbar"
    >
      <div class="max-w-3xl mx-auto space-y-8 pt-6">
        <!-- 欢迎语 (空状态) -->
        <div v-if="messages.length === 0" class="mt-20 px-6">
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">
              你好，我是 AI 助手
            </h1>
            <p class="text-gray-500 leading-relaxed">
              我可以帮你写代码、分析数据、或者只是聊聊天。试着在下方输入框提问吧。
            </p>
          </div>
          <!-- 快捷提示词 -->
          <div class="grid grid-cols-2 gap-3">
            <div
              @click="quarkClick(item)"
              v-for="item in quarkQuery"
              :key="item"
              class="p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-300 cursor-pointer transition-colors text-sm text-gray-600"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <!-- 消息流 -->
        <div v-for="(msg, index) in messages" :key="index" class="px-4 sm:px-0 group fade-in">
          <div class="flex gap-4" :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
            <!-- 头像 -->
            <div
              class="flex-none w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              :class="msg.role === 'user' ? 'bg-gray-200' : ''"
            >
              <span v-if="msg.role === 'user'" class="text-xs text-gray-500">U</span>
              <img
                v-else
                :src="modelLabel(msg.modelName).url"
                class="w-8 h-8 rounded-full"
              >
            </div>

            <!-- 内容 -->
            <div class="max-w-[85%] space-y-1">
              <!-- AI 模型标识 -->
              <div v-if="msg.role === 'assistant'" class="text-[14px] my-8px  text-gray-400 flex items-center gap-2 h-4">
                <span>{{ modelLabel(msg.modelName).name }}</span>
              </div>
              <!-- 思考内容 - 可折叠展开 -->
              <div v-if="msg.think" class="bg-white select-none p-3 rounded-lg text-gray-600 text-sm leading-6 mb-2 border border-gray-200 shadow-sm">
                <div class="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors" @click="msg.isThinkExpanded = !msg.isThinkExpanded">
                  <span class="font-medium text-gray-700">思考过程</span>
                  <svg
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': msg.isThinkExpanded }"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                <div v-show="msg.isThinkExpanded" class="mt-2 pt-2 border-t border-gray-100 text-#00000099">
                  {{ msg.think }}
                </div>
              </div>

              <!-- 气泡 -->
              <div
                class="prose prose-slate prose-sm max-w-none  leading-7 text-[15px]"
                :class="msg.role === 'user' ? 'bg-[#e7e7e7] px-4  rounded-2xl rounded-tr-sm text-gray-800' : 'bg-transparent text-gray-800'"
              >
                <MarkdownRender :content="msg.content" />
              </div>
              <!-- 引用信息 -->
              <div
                class="flex flex-col gap-5px mb-10px  max-w-90%  text-14px  color-#00000099"
                v-if="msg.citations && msg.citations.length > 0 && msg.isDone"
              >
                <div class="font-bold text-16px color-#000000 py-5px">
                  来源
                </div>
                <div
                  @click="clickCita(ci)"
                  class="flex text-14px"
                  v-for="(ci, cix) in msg.citations"
                  :key="cix"
                >
                  <div> {{ cix + 1 }}.</div>
                  <div class="flex-[1_0] min-w-0 truncate cursor-pointer">
                    {{ ci.title }}
                  </div>
                  <div v-if="ci.date">
                    [{{ ci.date }}]
                  </div>
                </div>
              </div>
              <div v-if="msg.role !== 'user' && !msg.isDone && !msg.content && !msg.think" class="thinking-indicator">
                <span class="dot" />
                <span class="dot" />
                <span class="dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 3. 悬浮回底按钮 (调整位置，避免遮挡) -->
    <!-- bottom-48 确保它位于输入框上方 -->
    <transition name="fade">
      <button
        v-show="showScrollButton"
        @click="forceScrollToBottom"
        class="absolute bottom-48 left-1/2 -translate-x-1/2 bg-white text-gray-600 border border-gray-200 shadow-lg rounded-full px-4 py-2 z-20 flex items-center gap-2 hover:bg-gray-50 hover:text-black transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        ><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
      </button>
    </transition>

    <div class="fixed bottom-0 left-0 w-full px-4 pb-20px z-30 pointer-events-none bg-#f9f9f9">
      <div class="max-w-3xl mx-auto pointer-events-auto">
        <!-- 输入框卡片容器 -->
        <div class="bg-white rounded-[32px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-2 transition-shadow duration-300 focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.08)] focus-within:border-gray-300 relative">
          <!-- 文本区域 -->
          <textarea
            v-model="inputContent"
            @keydown.enter.prevent="handleEnter"
            placeholder="尽管问..."
            rows="1"
            ref="textareaRef"
            class="w-full custom-scrollbar border-none! bg-transparent text-gray-800 placeholder:text-gray-400 px-4 py-3 min-h-[56px] max-h-[200px] outline-none resize-none text-base"
            style="field-sizing: content;"
          />

          <div class="flex items-center justify-between px-5 pb-1 mt-1">
            <div class="relative flex items-center gap-15px">
              <button @click="showModelMenu = !showModelMenu" class="flex items-center gap-1 text-gray-500 hover:text-black font-medium text-sm px-4 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  :src="modelLabel(currentModel).url"
                  alt="模型图标"
                  class="w-4 h-4 rounded-full mr-2"
                >
                <div>{{ modelLabel(currentModel).name }}</div>
                <svg
                  class="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <div
                @click="changeThinkStatus"
                :class="[isDeepThinking?'border-color-#1677ff! text-#1677ff':'']"
                class="flex items-center gap-5px select-none cursor-pointer border-color-#e4e4e4 border-1px border-solid color-#00000099 p-[5px_8px] text-14px font-700 border-rd-999px"
              >
                <svg
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5003"
                  width="18"
                  height="18"
                  fill="currentColor"
                ><path d="M168.618667 168.618667c94.776889-94.833778 325.461333-17.92 515.072 171.690666 189.667556 189.667556 266.581333 420.238222 171.747555 515.128889-94.890667 94.833778-325.404444 17.92-515.128889-171.747555C150.641778 494.08 73.784889 263.395556 168.618667 168.618667z m469.845333 216.974222C470.641778 217.770667 275.171556 152.576 213.902222 213.902222c-61.326222 61.269333 3.811556 256.682667 171.690667 424.561778 167.879111 167.822222 363.292444 232.96 424.561778 171.690667 61.326222-61.269333-3.811556-256.682667-171.690667-424.561778z" p-id="5004" /><path d="M340.309333 340.252444c189.667556-189.610667 420.295111-266.467556 515.128889-171.633777 94.833778 94.776889 17.92 325.404444-171.747555 515.072-189.610667 189.667556-420.295111 266.581333-515.072 171.747555-94.833778-94.890667-17.92-325.518222 171.690666-515.185778z m469.902223-126.350222c-61.326222-61.326222-256.739556 3.811556-424.618667 171.690667-167.822222 167.822222-233.016889 363.178667-171.690667 424.561778 61.269333 61.326222 256.682667-3.811556 424.561778-171.690667 167.822222-167.879111 232.96-363.292444 171.690667-424.561778z" p-id="5005" /><path d="M442.595556 512a69.404444 69.404444 0 1 0 138.808888 0 69.404444 69.404444 0 0 0-138.808888 0z" p-id="5006" /></svg>
                <div>深度思考</div>
              </div>
              <!-- 简单的弹出菜单 -->
              <div v-if="showModelMenu" class="absolute bottom-full mb-2 right-0 w-40 bg-white border border-gray-100 rounded-lg shadow-xl py-1 overflow-hidden z-50">
                <div
                  v-for="(m,index) in modelList"
                  :key="index"
                  @click="selectModel(m)"
                  class="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer flex items-center gap-5px"
                >
                  <img
                    :src="m.url"
                    alt="模型图标"
                    class="w-4 h-4 rounded-full mr-2"
                  >
                  <div>{{ m.name }}</div>
                </div>
              </div>
            </div>

            <!-- 右侧：模型/附件/发送 -->
            <div class="flex items-center gap-3">
              <!-- 发送按钮 (黑色圆形) -->
              <button
                @click="sendMessage"
                :disabled="!inputContent.trim() || isStreaming"
                class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ml-1"
                :class="(!inputContent.trim() || isStreaming)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:opacity-80 active:scale-95 shadow-md'"
              >
                <svg
                  v-if="isStreaming"
                  class="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><line
                  x1="12"
                  x2="12"
                  y1="19"
                  y2="5"
                /><polyline points="5 12 12 5 19 12" /></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 底部免责声明 -->
        <div class="text-center mt-3 text-[11px] text-gray-400">
          内容由 AI 生成，请仔细甄别
        </div>
      </div>

      <!-- 全局遮罩 (关闭下拉) -->
      <div v-if="showModelMenu" @click="showModelMenu = false" class="fixed inset-0 z-40 bg-transparent" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import MarkdownRender from 'markstream-vue'
import 'markstream-vue/index.css'
import 'katex/dist/katex.min.css'
import { streamRequest } from './chatUtils'

const scrollContainer = ref(null)
const textareaRef = ref(null)
const messages = ref([])
const inputContent = ref('')
const isStreaming = ref(false)
const showScrollButton = ref(false)
const currentModel = ref('mita')
const showModelMenu = ref(false)
const isDeepThinking = ref(false)

const changeThinkStatus = () => {
  isDeepThinking.value = !isDeepThinking.value
}

const quarkQuery = ref(['写一个 Vue3 的 ToDo List 组件', '解释一下量子纠缠'])

const quarkClick = (item) => {
  inputContent.value = item
  sendMessage()
}

const clickCita = (ci) => {
  if (ci.link) {
    window.open(ci.link, '_blank')
  }
}

const modelList = ref([
  {
    name: '秘塔',
    value: 'mita',
    url: 'https://ai-bot.cn/wp-content/uploads/2024/06/metaso-ai-search-icon.png'
  },
  {
    name: '混元',
    value: 'hunyuan-turbo',
    url: 'https://ai-bot.cn/wp-content/uploads/2023/09/hunyuan-tencent-icon.png'
  },
  {
    name: 'Kimi',
    value: 'kimi',
    url: 'https://ai-bot.cn/wp-content/uploads/2024/05/kimi-ai-logo.png'
  },
  {
    name: '千问',
    value: 'qwen',
    url: 'https://ai-bot.cn/wp-content/uploads/2025/09/tongyi-icon.png'
  },
  {
    name: '豆包',
    value: 'doubao',
    url: 'https://ai-bot.cn/wp-content/uploads/2023/08/doubao-icon.png'
  },
  {
    name: 'DeepSeek-R1',
    value: 'deepseek-r1',
    url: 'https://ai-bot.cn/wp-content/uploads/2023/11/deepseek-chat-icon.png'
  },
  {
    name: 'GLM-4.6',
    value: 'GLM',
    url: 'https://ai-bot.cn/wp-content/uploads/2023/08/zhipu-ai-chatglm-icon.png'
  }
])

const modelLabel = (currentModel) => {
  const findItem = modelList.value.find(item => item.value === currentModel)
  return findItem || ''
}

let autoScrollEnabled = true

const selectModel = (m) => {
  currentModel.value = m.value
  showModelMenu.value = false
}

const handleEnter = (e) => {
  if (!e.shiftKey) {
    sendMessage()
  }
}

const handleScroll = () => {
  const el = scrollContainer.value
  if (!el) return

  // 阈值：离底部多少像素
  const threshold = 100
  const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight

  if (distanceToBottom > threshold) {
    // 用户上划
    autoScrollEnabled = false
    if (messages.value.length > 0) showScrollButton.value = true
  } else {
    // 用户触底
    autoScrollEnabled = true
    showScrollButton.value = false
  }
}

const forceScrollToBottom = async () => {
  autoScrollEnabled = true
  showScrollButton.value = false
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: 'smooth' })
  }
}

const tryAutoScroll = () => {
  if (autoScrollEnabled && scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  const content = inputContent.value.trim()
  if (!content || isStreaming.value) return

  messages.value.push({ role: 'user', content })
  inputContent.value = ''
  // 重置高度
  if (textareaRef.value) textareaRef.value.style.height = 'auto'

  messages.value.push({
    role: 'assistant',
    modelName: currentModel.value,
    content: '',
    think: '',
    isDone: false,
    isThinkExpanded: true
  })

  await forceScrollToBottom()

  isStreaming.value = true
  await streamRequest(content, messages, {
    deepThink: isDeepThinking.value,
    modelType: currentModel.value,
    scrollFunc: tryAutoScroll
  })
  isStreaming.value = false
  nextTick(() => tryAutoScroll())
}

</script>

<style lang="scss" scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: rgb(0 0 0 / 10%);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgb(0 0 0 / 20%);
}
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
.thinking-indicator {
  display: flex;
  align-items: center;
  padding-left: 10px;
  gap: 4px;
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #9ca3af;
    animation: thinking 1.4s infinite ease-in-out;
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

// 思考内容折叠展开动画
.rotate-180 {
  transform: rotate(180deg);
}
</style>
