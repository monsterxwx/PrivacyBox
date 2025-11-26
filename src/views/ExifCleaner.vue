<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-emerald-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 左上角翠绿 -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <!-- 右下角青色 -->
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <!-- 中间蓝绿 -->
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-screen">
      <!-- 头部 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-emerald-600 mb-4 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">照片隐私抹除</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          一键查看并移除照片中的 GPS 位置、拍摄设备、时间等敏感元数据 (EXIF)。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：图片预览与上传 -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col items-center">
            <!-- 上传区域 / 图片展示 -->
            <div
              class="w-full relative group rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 min-h-[300px] flex items-center justify-center transition-all"
              :class="{'border-emerald-400 bg-emerald-50': isDragging}"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <div v-if="!imageUrl" class="text-center p-8 cursor-pointer" @click="triggerUpload">
                <div class="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl mx-auto mb-4 text-slate-300 group-hover:text-emerald-500 transition-colors">
                  📸
                </div>
                <h3 class="font-bold text-slate-700 text-lg mb-1">
                  点击或拖拽照片
                </h3>
                <p class="text-slate-500 text-sm">
                  支持 JPG/JPEG 格式
                </p>
              </div>

              <img v-else :src="imageUrl" class="max-w-full max-h-[500px] object-contain shadow-sm">

              <!-- 更换按钮 -->
              <div v-if="imageUrl" class="absolute top-4 right-4 z-10">
                <button @click="triggerUpload" class="bg-white/90 backdrop-blur text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:text-emerald-600 transition-colors">
                  更换图片
                </button>
              </div>
            </div>

            <input
              type="file"
              ref="fileInput"
              accept="image/jpeg, image/jpg"
              class="hidden"
              @change="handleFileChange"
            >

            <!-- 状态提示 -->
            <div v-if="imageUrl" class="w-full mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
              <div class="text-2xl">
                🛡️
              </div>
              <div>
                <h4 class="font-bold text-emerald-800 text-sm">
                  隐私分析完成
                </h4>
                <p class="text-xs text-emerald-600 mt-1" v-if="hasExif">
                  检测到该图片包含 <span class="font-bold">{{ exifTags.length }}</span> 项元数据，建议清除。
                </p>
                <p class="text-xs text-emerald-600 mt-1" v-else>
                  未检测到 EXIF 数据，该图片是安全的。
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：数据详情与操作 -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <!-- 数据面板 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 flex-1 flex flex-col min-h-[400px]">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-cyan-500 rounded-full" />
                元数据详情
              </h2>
              <div v-if="gpsInfo" class="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 font-medium flex items-center gap-1">
                📍 包含 GPS 定位
              </div>
            </div>

            <!-- 数据列表容器 -->
            <div class="flex-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative">
              <!-- 空状态 -->
              <div v-if="!imageUrl" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <div class="text-3xl mb-2 opacity-30">
                  📊
                </div>
                <p class="text-sm">
                  请先上传图片以分析数据
                </p>
              </div>

              <div v-else-if="exifTags.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <div class="text-3xl mb-2 opacity-30">
                  🍃
                </div>
                <p class="text-sm">
                  很干净，没有发现敏感信息
                </p>
              </div>

              <!-- 列表 -->
              <div v-else class="h-full overflow-y-auto custom-scrollbar p-2">
                <table class="w-full text-sm text-left">
                  <thead class="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0">
                    <tr>
                      <th class="px-4 py-3 rounded-l-lg">
                        属性名
                      </th>
                      <th class="px-4 py-3 rounded-r-lg">
                        值
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    <tr v-for="(tag, index) in exifTags" :key="index" class="hover:bg-white transition-colors">
                      <td class="px-4 py-3 font-medium text-slate-600 w-1/3">
                        {{ tag.name }}
                      </td>
                      <td class="px-4 py-3 text-slate-500 font-mono break-all">
                        {{ tag.value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <div class="mt-6 flex justify-end gap-3">
              <button
                @click="downloadOriginal"
                :disabled="!imageUrl"
                class="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下载原图
              </button>
              <button
                @click="cleanAndDownload"
                :disabled="!imageUrl"
                class="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line
                  x1="12"
                  y1="15"
                  x2="12"
                  y2="3"
                /></svg>
                抹除隐私并保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as piexif from 'piexifjs'
import { saveAs } from 'file-saver'

// ---------------- 状态管理 ----------------
const imageUrl = ref('')
const fileInput = ref(null)
const isDragging = ref(false)
const exifTags = ref([])
const gpsInfo = ref(false)
const hasExif = ref(false)
let currentFile = null

// ---------------- 交互逻辑 ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  processFile(e.target.files[0])
  e.target.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  processFile(e.dataTransfer.files[0])
}

// ---------------- 核心逻辑：读取 EXIF ----------------
const processFile = (file) => {
  if (!file) return
  if (!file.type.match('image/jpeg')) {
    alert('EXIF 编辑目前仅支持 JPG/JPEG 格式图片')
    return
  }

  currentFile = file
  const reader = new FileReader()

  reader.onload = (e) => {
    const dataUrl = e.target.result
    imageUrl.value = dataUrl

    try {
      // 1. 读取 EXIF 对象
      const exifObj = piexif.load(dataUrl)

      // 2. 解析展示数据
      const tags = []
      let hasGps = false

      // 遍历主要的 IFD (Image File Directory)
      // "0th", "Exif", "GPS" 是最常用的
      const dict = {
        '0th': exifObj['0th'],
        Exif: exifObj.Exif,
        GPS: exifObj.GPS
      }

      for (const ifd in dict) {
        if (!dict[ifd]) continue
        for (const tag in dict[ifd]) {
          const value = dict[ifd][tag]
          const tagName = piexif.TAGS[ifd][tag]?.name || tag

          // 过滤掉太长的二进制数据 (比如缩略图)
          if (typeof value === 'string' && value.length > 50) continue

          tags.push({
            name: tagName,
            value: formatExifValue(value)
          })

          // 检测 GPS
          if (ifd === 'GPS') hasGps = true
        }
      }

      exifTags.value = tags
      gpsInfo.value = hasGps
      hasExif.value = tags.length > 0
    } catch (err) {
      console.log('No EXIF data found or parse error', err)
      exifTags.value = []
      gpsInfo.value = false
      hasExif.value = false
    }
  }

  reader.readAsDataURL(file)
}

// 简单的值格式化，把数组转成字符串
const formatExifValue = (val) => {
  if (Array.isArray(val)) {
    // 处理分数形式 [num, denom]
    if (val.length === 2 && typeof val[0] === 'number' && val[1] > 1) {
      return `${val[0]}/${val[1]}`
    }
    return `Array(${val.length})`
  }
  return val
}

// ---------------- 核心逻辑：清除 EXIF ----------------
const cleanAndDownload = () => {
  if (!imageUrl.value) return

  try {
    // piexif.remove 移除所有元数据，返回纯净的 Base64
    const cleanDataUrl = piexif.remove(imageUrl.value)

    // 转回 Blob 下载
    const byteString = atob(cleanDataUrl.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: 'image/jpeg' })

    saveAs(blob, `clean_${currentFile.name}`)
  } catch (err) {
    alert('清除失败，图片格式可能不兼容')
    console.error(err)
  }
}

const downloadOriginal = () => {
  if (currentFile) saveAs(currentFile, currentFile.name)
}

</script>

<style scoped>
/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 3px; background: #cbd5e1; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

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
