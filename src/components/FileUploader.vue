<template>
  <div
    class="border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer"
    :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="triggerInput"
  >
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="handleFileChange"
    >
    <div class="flex flex-col items-center gap-3">
      <div class="p-3 bg-blue-100 rounded-full text-blue-600">
        <!-- 这里可以用 iconify 图标 -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line
          x1="12"
          y1="3"
          x2="12"
          y2="15"
        /></svg>
      </div>
      <div class="text-gray-600 font-medium">
        <span class="text-blue-600 hover:underline">点击上传</span> 或将文件拖拽至此
      </div>
      <p class="text-xs text-gray-400">
        {{ multiple ? '支持多文件' : '仅支持单文件' }} • {{ hint }}
      </p>
      <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded border border-green-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        ><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        <span>隐私保护：文件仅在浏览器本地处理</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  accept: { type: String, default: '*' },
  multiple: { type: Boolean, default: false },
  hint: { type: String, default: '' }
})

const emit = defineEmits(['files-selected'])
const isDragging = ref(false)
const fileInput = ref(null)

const triggerInput = () => fileInput.value.click()

const handleFileChange = (e) => {
  if (e.target.files.length) emit('files-selected', Array.from(e.target.files))
}

const handleDrop = (e) => {
  isDragging.value = false
  if (e.dataTransfer.files.length) emit('files-selected', Array.from(e.dataTransfer.files))
}
</script>
