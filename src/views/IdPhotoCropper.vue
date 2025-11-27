<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-teal-100">
    <!-- ================= 背景特效 (蓝绿主题) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#ccfbf1 1px, transparent 1px); background-size: 32px 32px;" />
    <!-- 蓝绿色光斑 -->
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-teal-600 mb-4 inline-flex items-center gap-1 transition-colors">
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">智能证件照裁剪</span>
        </h1>
        <p class="text-slate-600">
          标准尺寸模板，保持比例锁定。生成 300DPI 高清打印级证件照。
        </p>
      </div>

      <!-- 主体 Grid -->
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- 左侧：工作台 (8列) -->
        <div class="lg:col-span-8">
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 min-h-[500px] flex flex-col h-full transition-all">
            <!-- 未上传状态 -->
            <div v-if="!imageUrl" class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors p-10">
              <div class="w-20 h-20 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              </div>
              <h3 class="text-lg font-bold text-slate-700 mb-2">
                上传生活照
              </h3>
              <p class="text-sm text-slate-500 mb-6 text-center max-w-xs">
                支持 JPG/PNG。建议使用背景干净、光线充足的正面照片。
              </p>
              <label class="cursor-pointer px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95">
                选择照片
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="onFileChange"
                >
              </label>
            </div>

            <!-- 裁剪工作区 -->
            <div v-else class="relative flex-1 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
              <!-- CropperJS 挂载点 -->
              <img
                ref="imageRef"
                :src="imageUrl"
                class="max-w-full max-h-full block"
                alt="Source Image"
              >
            </div>

            <!-- 底部工具栏 (旋转/重置) -->
            <div v-if="imageUrl" class="mt-4 flex justify-between items-center">
              <div class="flex gap-2">
                <button @click="rotate(-90)" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg tooltip" title="向左旋转">
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
                  ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                </button>
                <button @click="rotate(90)" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg tooltip" title="向右旋转">
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
                  ><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                </button>
                <button @click="reset" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg tooltip" title="重置裁剪框">
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
                  ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                </button>
              </div>
              <button @click="imageUrl = null" class="text-sm text-red-500 hover:text-red-600 hover:underline">
                重新上传
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：设置区 (4列) -->
        <div class="lg:col-span-4 space-y-6">
          <!-- 尺寸选择 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-teal-500 rounded-full" />
              尺寸模板
            </h2>

            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="size in sizePresets"
                :key="size.name"
                @click="applySize(size)"
                class="relative p-3 rounded-xl text-left border transition-all hover:shadow-md"
                :class="currentSize.name === size.name ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-teal-300'"
              >
                <div class="font-bold text-slate-800 text-sm">
                  {{ size.name }}
                </div>
                <div class="text-xs text-slate-500 mt-1">
                  {{ size.mm }}
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5">
                  {{ size.desc }}
                </div>
                <!-- 选中标记 -->
                <div v-if="currentSize.name === size.name" class="absolute top-2 right-2 text-teal-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              </button>
            </div>

            <!-- 当前参数显示 -->
            <div class="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
              <span>打印分辨率: 300 DPI</span>
              <span>输出尺寸: {{ currentSize.width }} x {{ currentSize.height }} px</span>
            </div>
          </div>

          <!-- 导出设置 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-emerald-500 rounded-full" />
              导出预览
            </h2>

            <div class="flex items-center justify-between mb-6">
              <label class="text-sm text-slate-700 font-medium">自动填充白底</label>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400" v-if="fillWhite">适用于JPG</span>
                <input type="checkbox" v-model="fillWhite" class="accent-teal-600 w-5 h-5 cursor-pointer">
              </div>
            </div>

            <button
              @click="downloadImage"
              :disabled="!imageUrl"
              class="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
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
              ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line
                x1="12"
                y1="15"
                x2="12"
                y2="3"
              /></svg>
              下载证件照
            </button>
          </div>

          <!-- 提示 -->
          <div class="bg-amber-50/80 backdrop-blur rounded-2xl p-4 border border-amber-100 text-xs text-amber-800 leading-relaxed">
            <strong>⚠️ 注意事项：</strong><br>
            此工具仅进行裁剪。如果您的原图背景杂乱，请先使用专门的工具去除背景，或确保原图就是在白墙前拍摄的。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { saveAs } from 'file-saver'

// --- Data & Config ---

// 300 DPI 下的像素计算: mm / 25.4 * 300
const sizePresets = [
  { name: '一寸 (1寸)', mm: '25mm × 35mm', width: 295, height: 413, desc: '驾照 / 简历 / 证件' },
  { name: '小二寸 (护照)', mm: '33mm × 48mm', width: 390, height: 567, desc: '中国护照 / 签证' },
  { name: '二寸 (2寸)', mm: '35mm × 49mm', width: 413, height: 579, desc: '标准二寸照片' },
  { name: '大一寸', mm: '33mm × 48mm', width: 390, height: 567, desc: '部分职业资格证' }, // 实际上大一寸和护照很接近，这里取常用值
  { name: '五寸 (生活照)', mm: '89mm × 127mm', width: 1051, height: 1500, desc: '普通相纸打印' }
]

const currentSize = ref(sizePresets[0])
const imageUrl = ref(null)
const imageRef = ref(null)
const fillWhite = ref(true) // 是否填充白底
let cropper = null

// --- Actions ---

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    // 如果之前有url，释放掉
    if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)

    imageUrl.value = URL.createObjectURL(file)

    // 等待 DOM 更新后初始化/重置 Cropper
    nextTick(() => {
      initCropper()
    })
  }
}

const initCropper = () => {
  if (cropper) {
    cropper.destroy()
  }

  if (!imageRef.value) return

  cropper = new Cropper(imageRef.value, {
    aspectRatio: currentSize.value.width / currentSize.value.height,
    viewMode: 1, // 限制裁剪框不超过画布
    dragMode: 'move', // 可以拖动图片
    autoCropArea: 0.8, // 默认选中80%区域
    restore: false,
    guides: true,
    center: true,
    highlight: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
    background: false // 不显示默认网格，我们自己有背景
  })
}

const applySize = (size) => {
  currentSize.value = size
  if (cropper) {
    cropper.setAspectRatio(size.width / size.height)
  }
}

const rotate = (deg) => {
  if (cropper) cropper.rotate(deg)
}

const reset = () => {
  if (cropper) cropper.reset()
}

const downloadImage = () => {
  if (!cropper) return

  // 获取裁剪后的 Canvas
  // 设置输出的宽高为标准像素值，cropper会自动缩放
  const canvas = cropper.getCroppedCanvas({
    width: currentSize.value.width,
    height: currentSize.value.height,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
    fillColor: fillWhite.value ? '#ffffff' : 'transparent'
  })

  if (canvas) {
    canvas.toBlob((blob) => {
      saveAs(blob, `ID_Photo_${currentSize.value.name}_${Date.now()}.jpg`)
    }, fillWhite.value ? 'image/jpeg' : 'image/png', 0.95)
  }
}

onUnmounted(() => {
  if (cropper) cropper.destroy()
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})
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

/* Override CropperJS default styles to match theme if needed */
:deep(.cropper-view-box) {
  outline: 2px solid #14b8a6; /* teal-500 */
  outline-color: rgb(20 184 166 / 75%);
}
:deep(.cropper-point) {
  background-color: #0d9488; /* teal-600 */
}
:deep(.cropper-line) {
  background-color: #14b8a6;
}
</style>
