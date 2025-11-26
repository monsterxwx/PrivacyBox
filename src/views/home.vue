<template>
  <div class="min-h-screen w-full relative overflow-hidden font-sans selection:bg-blue-100 bg-slate-50">
    <!-- ================= 装饰背景层 (保持不变) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[96px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 主要内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12">
      <!-- 1. Hero Header (稍微紧凑一点，给下面留空间) -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-blue-100 text-blue-600 text-3xl font-700 mb-6 shadow-sm backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          PrivacyBox 工具箱
        </div>

        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          发现实用的
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">本地化工具</span>
        </h1>

        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          无需服务器，无需上传，所有操作均在您的浏览器中完成。
        </p>
      </div>

      <!-- ================= 2. 搜索与筛选区 (新增核心) ================= -->
      <div class="max-w-4xl mx-auto mb-12 space-y-8">
        <!-- 搜索框 -->
        <div class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div class="relative bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 flex items-center p-2">
            <span class="pl-4 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索工具 (例如：PDF, 压缩, 格式转换...)"
              class="w-full bg-transparent border-none outline-none px-4 py-3 text-slate-700 placeholder-slate-400"
            >
            <div v-if="searchQuery" @click="searchQuery = ''" class="cursor-pointer p-2 text-slate-400 hover:text-slate-600">
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
            </div>
          </div>
        </div>

        <!-- 分类 Tab 栏 -->
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border"
            :class="activeCategory === cat.id
              ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
              : 'bg-white/50 text-slate-600 border-slate-200 hover:bg-white hover:border-blue-300'"
          >
            {{ cat.label }}
            <span class="ml-1 text-xs opacity-60 bg-white/20 px-1.5 rounded-full">{{ getCategoryCount(cat.id) }}</span>
          </button>
        </div>
      </div>

      <!-- ================= 3. 工具卡片网格 ================= -->

      <!-- 有结果显示网格 -->
      <TransitionGroup
        tag="div"
        name="list"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        v-if="filteredList.length > 0"
      >
        <div
          v-for="item in filteredList"
          :key="item.name"
          @click="handleClick(item)"
          class="cursor-pointer relative group h-full"
        >
          <!-- 悬浮光晕 -->
          <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500" />

          <!-- 卡片主体 -->
          <div class="relative h-full bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-start justify-between mb-4">
              <!-- Icon 容器 -->
              <div class="w-12 h-12 bg-gradient-to-br from-slate-100 to-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                {{ item.icon }}
              </div>
              <!-- 分类标签 (右上角小字) -->
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {{ getCategoryLabel(item.category) }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
              {{ item.name }}
              <!-- 如果是新功能可以加个 Badge -->
              <span v-if="item.isNew" class="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">NEW</span>
            </h3>

            <p class="text-sm text-slate-500 leading-relaxed line-clamp-2">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </TransitionGroup>

      <!-- 无结果空状态 -->
      <div v-else class="text-center py-20 bg-white/30 rounded-3xl border border-dashed border-slate-300">
        <div class="text-4xl mb-4">
          🔍
        </div>
        <h3 class="text-lg font-bold text-slate-700">
          未找到相关工具
        </h3>
        <p class="text-slate-500 text-sm mt-2">
          换个关键词试试，或者联系开发者添加功能。
        </p>
        <button @click="resetFilter" class="mt-6 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm hover:bg-slate-50 text-slate-600 shadow-sm transition">
          查看所有工具
        </button>
      </div>

      <!-- Footer -->
      <footer class="mt-20 text-center border-t border-slate-200/60 pt-8">
        <p class="text-slate-500 text-sm">
          Built with <span class="text-red-400">❤</span> by Independent Developer.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. 状态管理
const searchQuery = ref('')
const activeCategory = ref('all')

// 2. 分类定义 (id 要对应 list 中的 category 字段)
const categories = [
  { id: 'all', label: '全部' },
  { id: 'pdf', label: 'PDF 工具' },
  { id: 'image', label: '图片处理' },
  { id: 'dev', label: '开发辅助' }, // 预留
  { id: 'life', label: '生活娱乐' } // 预留
]

// 3. 工具数据源 (增加 category 字段)
const list = [
  {
    name: 'PDF 工具',
    desc: '合并、拆分、图片转 PDF 文件，支持批量操作。',
    icon: '📑',
    path: '/pdf-tools',
    category: 'pdf',
    isNew: false
  },
  {
    name: '图片格式转换',
    desc: 'WebP, PNG, JPEG 互转，自定义压缩质量，支持批量处理。',
    icon: '🖼️',
    path: '/image-convert',
    category: 'image',
    isNew: false
  },
  {
    name: '图片智能压缩',
    desc: '肉眼无损的极致压缩。支持 JPG/PNG，一键瘦身 80%，节省带宽。',
    icon: '📉',
    path: '/image-compress',
    category: 'image',
    isNew: false
  },
  {
    name: 'JSON 格式化',
    desc: '美化 JSON 数据，校验语法，一键转换 TypeScript 接口。',
    icon: '🔧',
    path: '/json-formatter',
    category: 'dev',
    isNew: false
  },
  {
    name: '条形码生成',
    desc: '在线生成 Code128, EAN, UPC 等矢量条形码，支持导出 PNG/SVG。',
    icon: '📏', // 或者 '|||'
    path: '/barcode-generator',
    category: 'image', // 或 'life' / 'store'
    isNew: false
  },
  {
    name: '隐私水印卫士',
    desc: '身份证/证件照安全加水印，全屏防盗，纯本地处理无上传。',
    icon: '🛡️',
    path: '/watermark',
    category: 'image', // 或者 'life'
    isNew: false
  },
  {
    name: '文本对比 Diff',
    desc: '快速比对代码或文本差异，支持行级/字符级检测，自动高亮变更。',
    icon: '⚖️',
    path: '/diff',
    category: 'dev',
    isNew: false
  },
  {
    name: '二维码美化',
    desc: '生成个性化二维码，支持自定义颜色、嵌入 Logo 图标，高清导出。',
    icon: '🔳',
    path: '/qrcode',
    category: 'image', // 或 'life'
    isNew: false
  },
  {
    name: '极简屏幕录制',
    desc: '无需安装软件，支持系统声音+麦克风混录，画中画预览，本地导出。',
    icon: '📹',
    path: '/screen-recorder',
    category: 'life', // 或 'tool'
    isNew: false
  },
  {
    name: 'EXIF 隐私抹除',
    desc: '一键查看并移除照片中的 GPS 位置、设备信息等敏感元数据。',
    icon: '📷',
    path: '/exif',
    category: 'image', // 或 'tool'
    isNew: true
  },
  {
    name: '文件加密保险箱',
    desc: '银行级 AES 加密。在本地给文件上锁，密码不泄露，神仙也打不开。',
    icon: '🔐',
    path: '/encrypt',
    category: 'life', // 或 'tool'
    isNew: true
  },
  {
    name: '长图拼接手',
    desc: '将多张图片无缝拼接成一张长图。支持聊天记录、电影台词拼接。',
    icon: '🎞️',
    path: '/stitch',
    category: 'image',
    isNew: true
  },
  {
    name: '视频转 GIF',
    desc: 'WebAssembly 硬核驱动。在线剪辑视频片段，生成高质量 GIF 动图。',
    icon: '🎞️',
    path: '/video-gif',
    category: 'image', // 或 'video'
    isNew: true
  },
  {
    name: '强密码生成器',
    desc: '本地生成高强度随机密码，支持易读模式与强度检测，绝不联网。',
    icon: '🔑',
    path: '/password-generator',
    category: 'dev', // 或者 'life'
    isNew: true
  }
]

// 4. 计算属性：筛选逻辑
const filteredList = computed(() => {
  return list.filter(item => {
    // 关键词匹配 (不区分大小写)
    const matchQuery = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                       item.desc.toLowerCase().includes(searchQuery.value.toLowerCase())

    // 分类匹配
    const matchCategory = activeCategory.value === 'all' || item.category === activeCategory.value

    return matchQuery && matchCategory
  })
})

// 5. 辅助方法
const handleClick = (item) => {
  if (item.path === '#') {
    alert('该功能开发中...')
    return
  }
  router.push(item.path)
}

const getCategoryLabel = (id) => {
  return categories.find(c => c.id === id)?.label || '工具'
}

const getCategoryCount = (id) => {
  if (id === 'all') return list.length
  return list.filter(item => item.category === id).length
}

const resetFilter = () => {
  searchQuery.value = ''
  activeCategory.value = 'all'
}
</script>

<style lang="scss" scoped>
// 列表过渡动画
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

// 确保离开的元素脱离布局流，让移动动画平滑
.list-leave-active {
  position: absolute;
}

// 背景动画保持不变
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
