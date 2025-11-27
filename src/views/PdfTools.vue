<template>
  <div class="h-100% bg-slate-50 relative overflow-x-hidden overflow-y-auto font-sans selection:bg-red-100">
    <!-- ================= 背景特效 (红色/琥珀色主题) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-orange-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <!-- 头部 -->
      <div class="text-center mb-12">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-red-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">PDF 极速工具箱</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          基于 WebAssembly 技术，无需上传服务器，保护您的文档隐私。
        </p>
      </div>

      <!-- 主操作区 -->
      <div class="grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：工具选择菜单 -->
        <div class="lg:col-span-4 flex flex-col gap-3">
          <div
            v-for="tool in tools"
            :key="tool.id"
            @click="selectTool(tool)"
            class="group cursor-pointer relative p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4"
            :class="activeTool.id === tool.id
              ? 'bg-white border-red-200 shadow-xl shadow-red-500/10 ring-1 ring-red-500 transform scale-105 z-10'
              : 'bg-white/60 border-white/50 hover:bg-white hover:shadow-md'"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors shrink-0"
              :class="activeTool.id === tool.id ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-500'"
            >
              {{ tool.icon }}
            </div>
            <div>
              <div class="font-bold text-slate-800 text-base mb-0.5">
                {{ tool.name }}
              </div>
              <div class="text-xs text-slate-500">
                {{ tool.desc }}
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：工作台 -->
        <div class="lg:col-span-8">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 min-h-[500px] flex flex-col relative overflow-hidden transition-all">
            <!-- 顶部状态栏 -->
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/40">
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ activeTool.icon }}</span>
                <span class="font-bold text-slate-800">{{ activeTool.name }}</span>
              </div>
              <div class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500" /> 本地运行
              </div>
            </div>

            <!-- 操作区域 -->
            <div class="flex-1 p-6 md:p-8 flex flex-col">
              <!-- 1. 上传区 (空状态) -->
              <div
                v-if="files.length === 0"
                class="flex-1 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-red-50/30 hover:border-red-300 transition-all flex flex-col items-center justify-center cursor-pointer group"
                @click="triggerUpload"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-red-500">
                  ☁️
                </div>
                <p class="text-slate-600 font-medium group-hover:text-red-600">
                  点击或拖拽文件到这里
                </p>
                <p class="text-xs text-slate-400 mt-2">
                  支持 {{ activeTool.accept }} 格式
                </p>
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  :accept="activeTool.accept"
                  multiple
                  @change="handleFileSelect"
                >
              </div>

              <!-- 2. 文件列表 (有数据) -->
              <div v-else class="flex flex-col h-full">
                <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4 space-y-2">
                  <div v-for="(file, index) in files" :key="index" class="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between shadow-sm group hover:border-red-200 transition-colors">
                    <div class="flex items-center gap-3 overflow-hidden">
                      <div class="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                        {{ file.name.split('.').pop() }}
                      </div>
                      <div class="min-w-0">
                        <div class="text-sm font-bold text-slate-800 truncate">
                          {{ file.name }}
                        </div>
                        <div class="text-xs text-slate-400">
                          {{ (file.size / 1024).toFixed(1) }} KB
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <!-- 简单的排序按钮 (仅在合并模式显示) -->
                      <div v-if="activeTool.id === 'merge' || activeTool.id === 'img2pdf'" class="flex gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button @click="moveFile(index, -1)" :disabled="index === 0" class="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 disabled:opacity-20">
                          ↑
                        </button>
                        <button @click="moveFile(index, 1)" :disabled="index === files.length - 1" class="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 disabled:opacity-20">
                          ↓
                        </button>
                      </div>
                      <button @click="removeFile(index)" class="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        ><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                      </button>
                    </div>
                  </div>

                  <!-- 继续添加按钮 -->
                  <div class="text-center mt-4">
                    <button @click="triggerUpload" class="text-xs text-slate-500 hover:text-red-600 hover:underline flex items-center justify-center gap-1 mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      ><line
                        x1="12"
                        y1="5"
                        x2="12"
                        y2="19"
                      /><line
                        x1="5"
                        y1="12"
                        x2="19"
                        y2="12"
                      /></svg>
                      继续添加文件
                    </button>
                  </div>
                </div>

                <!-- 底部操作栏 -->
                <div class="pt-6 border-t border-slate-100 flex justify-between items-center bg-white/50 -mx-6 -mb-6 px-6 py-4 mt-auto">
                  <div class="text-xs text-slate-500">
                    共 {{ files.length }} 个文件
                  </div>
                  <div class="flex gap-3">
                    <button @click="files = []" class="px-4 py-2 text-sm text-slate-500 hover:text-red-600 font-medium transition-colors">
                      清空
                    </button>
                    <button
                      @click="processAction"
                      :disabled="isProcessing"
                      class="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      <span v-if="isProcessing" class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      {{ isProcessing ? '处理中...' : activeTool.actionName }}
                    </button>
                  </div>
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
import { ref } from 'vue'
import jsPDF from 'jspdf'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

// ---------------- 定义纯前端可用工具 ----------------
const tools = [
  {
    id: 'img2pdf',
    name: '图片转 PDF',
    desc: '将 JPG/PNG 图片合并为 PDF 文档',
    icon: '🖼️',
    accept: 'image/jpeg, image/png',
    actionName: '生成 PDF'
  },
  {
    id: 'merge',
    name: 'PDF 合并',
    desc: '将多个 PDF 文件按顺序合并为一个',
    icon: '📑',
    accept: '.pdf',
    actionName: '合并 PDF'
  },
  {
    id: 'split',
    name: 'PDF 拆分',
    desc: '将 PDF 的每一页拆分为单独文件',
    icon: '✂️',
    accept: '.pdf',
    actionName: '拆分并下载 ZIP'
  }
]

// ---------------- 状态管理 ----------------
const activeTool = ref(tools[0])
const files = ref([])
const isProcessing = ref(false)
const fileInput = ref(null)

// ---------------- 交互逻辑 ----------------
const selectTool = (tool) => {
  activeTool.value = tool
  files.value = [] // 切换工具时清空列表
}

const triggerUpload = () => fileInput.value.click()

const handleFileSelect = (e) => {
  if (e.target.files.length) {
    files.value = [...files.value, ...Array.from(e.target.files)]
  }
  e.target.value = '' // reset input
}

const handleDrop = (e) => {
  if (e.dataTransfer.files.length) {
    // 简单的文件类型过滤
    const allowed = Array.from(e.dataTransfer.files).filter(f => {
      if (activeTool.value.id === 'img2pdf') return f.type.startsWith('image/')
      return f.type === 'application/pdf' || f.name.endsWith('.pdf')
    })
    files.value = [...files.value, ...allowed]
  }
}

const removeFile = (index) => files.value.splice(index, 1)

const moveFile = (index, direction) => {
  const item = files.value[index]
  files.value.splice(index, 1)
  files.value.splice(index + direction, 0, item)
}

// ---------------- 核心处理入口 ----------------
const processAction = async () => {
  if (files.value.length === 0) return

  isProcessing.value = true
  try {
    // 给一点 UI 反应时间
    await new Promise(r => setTimeout(r, 500))

    switch (activeTool.value.id) {
      case 'img2pdf':
        await handleImg2Pdf()
        break
      case 'merge':
        await handleMergePdf()
        break
      case 'split':
        await handleSplitPdf()
        break
    }
  } catch (error) {
    console.error(error)
    alert('处理失败，请检查文件是否损坏或加密。')
  } finally {
    isProcessing.value = false
  }
}

// ---------------- 功能实现 1: 图片转 PDF ----------------
const handleImg2Pdf = async () => {
  const doc = new jsPDF()

  for (let i = 0; i < files.value.length; i++) {
    const file = files.value[i]
    const imgData = await readFileAsDataURL(file)
    const { width, height } = await getImageProperties(imgData)

    // A4 尺寸 (mm)
    const pageWidth = 210
    const pageHeight = 297

    // 计算缩放比例 (保持图片比例，适应页面)
    const ratio = Math.min(pageWidth / width, pageHeight / height)
    const imgWidth = width * ratio
    const imgHeight = height * ratio

    // 居中
    const x = (pageWidth - imgWidth) / 2
    const y = (pageHeight - imgHeight) / 2

    if (i > 0) doc.addPage()
    doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight)
  }

  doc.save(`images_merged_${Date.now()}.pdf`)
}

// ---------------- 功能实现 2: PDF 合并 ----------------
const handleMergePdf = async () => {
  const mergedPdf = await PDFDocument.create()

  for (const file of files.value) {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => mergedPdf.addPage(page))
  }

  const pdfBytes = await mergedPdf.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  saveAs(blob, `merged_${Date.now()}.pdf`)
}

// ---------------- 功能实现 3: PDF 拆分 ----------------
const handleSplitPdf = async () => {
  const zip = new JSZip()
  const folder = zip.folder('split_pages')

  for (const file of files.value) {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pageCount = pdfDoc.getPageCount()

    // 遍历每一页
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create()
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i])
      newPdf.addPage(copiedPage)

      const pdfBytes = await newPdf.save()
      const fileName = `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`
      folder.file(fileName, pdfBytes)
    }
  }

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `split_pages_${Date.now()}.zip`)
}

// ---------------- 辅助函数 ----------------
const readFileAsDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

const getImageProperties = (url) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.src = url
  })
}

</script>

<style scoped>
/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 3px; background: #cbd5e1; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* 动画 */
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
