<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-amber-100">
    <!-- ================= 背景特效 (黄色/琥珀色系) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#d4d4d8 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-amber-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-amber-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">批量文件重命名</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          照片、文档一键整理。支持序列编号、字符替换、大小写转换，实时预览，打包下载。
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- 左侧：文件列表与预览 (占 8 列) -->
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 min-h-[600px] flex flex-col transition-all relative overflow-hidden">
            <!-- 空状态 / 拖拽区域 -->
            <div v-if="fileList.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-slate-300 rounded-2xl hover:border-amber-400 hover:bg-amber-50/30 transition-all group">
              <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line
                  x1="12"
                  x2="12"
                  y1="3"
                  y2="15"
                /></svg>
              </div>
              <h3 class="text-lg font-bold text-slate-700 mb-2">
                拖入文件 或 点击上传
              </h3>
              <p class="text-sm text-slate-500 mb-6">
                支持图片、文档、视频等任意格式，批量处理无上限
              </p>
              <!-- 模拟 FileUploader 组件 -->
              <label class="cursor-pointer bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-amber-500/30 transition-all active:scale-95">
                选择文件
                <input
                  type="file"
                  multiple
                  class="hidden"
                  @change="handleFileSelect"
                >
              </label>
            </div>

            <!-- 文件列表 -->
            <div v-else class="flex flex-col h-full">
              <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <div class="flex items-center gap-3">
                  <span class="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-md">
                    {{ fileList.length }} 个文件
                  </span>
                  <button @click="fileList = []" class="text-xs text-red-500 hover:text-red-600 hover:underline">
                    清空列表
                  </button>
                </div>
                <label class="cursor-pointer text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1">
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
                  ><path d="M12 5v14M5 12h14" /></svg>
                  追加文件
                  <input
                    type="file"
                    multiple
                    class="hidden"
                    @change="handleFileSelect"
                  >
                </label>
              </div>

              <!-- 列表头部 -->
              <div class="grid grid-cols-12 text-xs font-bold text-slate-400 px-4 pb-2 uppercase tracking-wider">
                <div class="col-span-5">
                  原文件名
                </div>
                <div class="col-span-1 text-center">
                  →
                </div>
                <div class="col-span-6 text-amber-600">
                  新文件名 (预览)
                </div>
              </div>

              <!-- 滚动列表 -->
              <div class="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div
                  v-for="(item, index) in processedList"
                  :key="index"
                  class="grid grid-cols-12 items-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all group"
                >
                  <!-- 原名 -->
                  <div class="col-span-5 text-sm text-slate-600 truncate pr-2" :title="item.originalName">
                    {{ item.originalName }}
                  </div>

                  <!-- 箭头 -->
                  <div class="col-span-1 flex justify-center text-slate-300 group-hover:text-amber-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    ><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>

                  <!-- 新名 -->
                  <div class="col-span-6 text-sm font-mono text-slate-800 truncate pl-2 flex items-center gap-2" :class="{'text-amber-600 font-bold': item.hasChanged}">
                    {{ item.newName }}
                    <span v-if="item.hasChanged" class="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：设置区 (占 4 列) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sticky top-8">
            <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span class="w-1 h-6 bg-amber-500 rounded-full shadow-sm shadow-amber-500/50" />
              规则设置
            </h2>

            <!-- 模式切换 Tab -->
            <div class="flex p-1 bg-slate-100 rounded-xl mb-6">
              <button
                v-for="m in modes"
                :key="m.key"
                @click="currentMode = m.key"
                class="flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200"
                :class="currentMode === m.key ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
              >
                {{ m.label }}
              </button>
            </div>

            <div class="space-y-5">
              <!-- 1. 序列模式配置 -->
              <div v-if="currentMode === 'sequence'" class="space-y-4 animate-fade-in">
                <div>
                  <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">文件名前缀</label>
                  <input
                    v-model="config.prefix"
                    type="text"
                    placeholder="例如：Photo_"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all"
                  >
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">起始序号</label>
                    <input v-model.number="config.startNum" type="number" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all">
                  </div>
                  <div>
                    <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">位数补零</label>
                    <select v-model.number="config.padding" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all">
                      <option :value="1">
                        无 (1, 2)
                      </option>
                      <option :value="2">
                        2位 (01, 02)
                      </option>
                      <option :value="3">
                        3位 (001, 002)
                      </option>
                      <option :value="4">
                        4位 (0001...)
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">后缀 (可选)</label>
                  <input
                    v-model="config.suffix"
                    type="text"
                    placeholder="例如：_backup"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all"
                  >
                </div>
              </div>

              <!-- 2. 替换模式配置 -->
              <div v-if="currentMode === 'replace'" class="space-y-4 animate-fade-in">
                <div>
                  <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">查找内容</label>
                  <input
                    v-model="config.findStr"
                    type="text"
                    placeholder="要被替换的文字"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all"
                  >
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">替换为</label>
                  <input
                    v-model="config.replaceStr"
                    type="text"
                    placeholder="留空则为删除"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all"
                  >
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="config.useRegex"
                    id="useRegex"
                    class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  >
                  <label for="useRegex" class="text-sm text-slate-600 select-none">使用正则表达式</label>
                </div>
              </div>

              <!-- 3. 添加模式配置 -->
              <div v-if="currentMode === 'insert'" class="space-y-4 animate-fade-in">
                <div>
                  <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">添加到开头</label>
                  <input
                    v-model="config.insertPrefix"
                    type="text"
                    placeholder="例如：[机密]"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all"
                  >
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">添加到结尾</label>
                  <input
                    v-model="config.insertSuffix"
                    type="text"
                    placeholder="例如：_v1"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all"
                  >
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">添加时间戳</label>
                  <select v-model="config.timestampFormat" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all">
                    <option value="">
                      不添加
                    </option>
                    <option value="YYYYMMDD">
                      日期 (20231025)
                    </option>
                    <option value="YYYY-MM-DD">
                      日期 (2023-10-25)
                    </option>
                    <option value="timestamp">
                      毫秒时间戳
                    </option>
                  </select>
                </div>
              </div>

              <!-- 4. 格式转换配置 -->
              <div v-if="currentMode === 'case'" class="space-y-4 animate-fade-in">
                <div class="grid grid-cols-1 gap-2">
                  <label class="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      value="upper"
                      v-model="config.caseType"
                      class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                    >
                    <span class="ml-3 text-sm text-slate-700">全部大写 (FILENAME)</span>
                  </label>
                  <label class="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      value="lower"
                      v-model="config.caseType"
                      class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                    >
                    <span class="ml-3 text-sm text-slate-700">全部小写 (filename)</span>
                  </label>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="pt-4 border-t border-slate-100">
                <button
                  @click="handleDownload"
                  :disabled="fileList.length === 0 || isProcessing"
                  class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  <span v-if="isProcessing" class="animate-spin">⏳</span>
                  <span v-if="!isProcessing">下载处理后的文件 (ZIP)</span>
                  <span v-else>正在处理...</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 小贴士卡片 -->
          <div class="bg-yellow-50/80 backdrop-blur rounded-2xl p-5 border border-yellow-100 text-sm text-yellow-800 leading-relaxed">
            <strong>💡 隐私承诺：</strong><br>
            所有文件重命名操作均在您的浏览器本地完成，文件不会上传到任何服务器。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import dayjs from 'dayjs'

// 状态
const fileList = ref([])
const isProcessing = ref(false)

// 模式定义
const modes = [
  { key: 'sequence', label: '序列编号' },
  { key: 'replace', label: '字符替换' },
  { key: 'insert', label: '添加文本' },
  { key: 'case', label: '大小写' }
]
const currentMode = ref('sequence')

// 配置项
const config = reactive({
  // Sequence
  prefix: 'Image_',
  startNum: 1,
  padding: 3,
  suffix: '',
  // Replace
  findStr: '',
  replaceStr: '',
  useRegex: false,
  // Insert
  insertPrefix: '',
  insertSuffix: '',
  timestampFormat: '',
  // Case
  caseType: 'lower'
})

// 处理文件选择
const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  if (files.length > 0) {
    // 追加模式
    fileList.value = [...fileList.value, ...files]
  }
  // 清空 input value 防止重复选择不触发
  e.target.value = ''
}

// 核心逻辑：计算预览列表
const processedList = computed(() => {
  return fileList.value.map((file, index) => {
    // 1. 分离文件名和后缀
    const lastDotIndex = file.name.lastIndexOf('.')
    const nameNoExt = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name
    const ext = lastDotIndex !== -1 ? file.name.substring(lastDotIndex) : ''

    let newNameBase = nameNoExt

    // 2. 根据模式处理文件名 (不含后缀)
    switch (currentMode.value) {
      case 'sequence':
        const numStr = (config.startNum + index).toString().padStart(config.padding, '0')
        newNameBase = `$${config.prefix}$${numStr}${config.suffix}`
        break

      case 'replace':
        if (config.findStr) {
          try {
            if (config.useRegex) {
              const regex = new RegExp(config.findStr, 'g')
              newNameBase = nameNoExt.replace(regex, config.replaceStr)
            } else {
              newNameBase = nameNoExt.split(config.findStr).join(config.replaceStr)
            }
          } catch (e) {
            // 正则错误时保持原名
            newNameBase = nameNoExt
          }
        }
        break

      case 'insert':
        let ts = ''
        if (config.timestampFormat) {
          if (config.timestampFormat === 'timestamp') ts = Date.now().toString()
          else ts = dayjs().format(config.timestampFormat)
        }
        // 插入逻辑：前缀 + 原名 + 后缀 + 时间戳(如果有)
        // 注意：这里简单地把时间戳加在最后，可以根据需求调整位置
        newNameBase = `$${config.insertPrefix}$${nameNoExt}$${config.insertSuffix}$${ts ? '_' + ts : ''}`
        break

      case 'case':
        if (config.caseType === 'upper') newNameBase = nameNoExt.toUpperCase()
        if (config.caseType === 'lower') newNameBase = nameNoExt.toLowerCase()
        break
    }

    const finalName = newNameBase + ext

    return {
      originalName: file.name,
      newName: finalName,
      file,
      hasChanged: finalName !== file.name
    }
  })
})

// 导出 ZIP
const handleDownload = async () => {
  if (fileList.value.length === 0) return
  isProcessing.value = true

  try {
    const zip = new JSZip()
    const usedNames = new Set()

    processedList.value.forEach(item => {
      let finalName = item.newName

      // 简单去重处理：如果文件名冲突，追加 (1), (2)
      let counter = 1
      while (usedNames.has(finalName)) {
        const lastDot = finalName.lastIndexOf('.')
        const name = lastDot > -1 ? finalName.substring(0, lastDot) : finalName
        const ext = lastDot > -1 ? finalName.substring(lastDot) : ''
        finalName = `$${name} ($${counter})${ext}`
        counter++
      }

      usedNames.add(finalName)
      zip.file(finalName, item.file)
    })

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `Renamed_Files_${Date.now()}.zip`)
  } catch (err) {
    console.error('Zip Error:', err)
    alert('打包失败，请重试')
  } finally {
    isProcessing.value = false
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
.animation-delay-4000 { animation-delay: 4s; }
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
