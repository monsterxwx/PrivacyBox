<template>
  <div class="history-manager bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
    <!-- 组件标题 -->
    <div class="flex justify-between items-center mb-1">
      <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <span class="w-1 h-6 bg-purple-500 rounded-full" />
        历史记录
      </h2>
      <div class="flex gap-2">
        <!-- 编辑模式切换按钮 -->
        <div
          @click="isManaging = !isManaging"
          class="cursor-pointer"
          :class="[
            'p-1.5 rounded-lg transition-colors',
            isManaging ? 'text-purple-600' : 'text-slate-400'
          ]"
          title="管理文件夹"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <!-- 新建文件夹按钮 -->
        <button
          @click="showCreateFolderModal = true"
          class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-1"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          新建文件夹
        </button>
      </div>
    </div>

    <!-- 文件夹树 -->
    <div class="mb-4">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="folder in folders"
          :key="folder.id"
          @click="selectFolder(folder.id)"
          :class="[
            'flex items-center px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer',
            selectedFolderId === folder.id
              ? 'bg-purple-100 text-purple-700 border border-purple-200 font-medium'
              : 'bg-white text-slate-600 border border-slate-200 shadow-sm hover:border-purple-300 hover:text-purple-600'
          ]"
        >
          <div
            class="flex-1 text-left truncate"
          >
            <svg
              class="w-3 h-3 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            {{ folder.name }}
          </div>
          <div
            v-if="isManaging"
            class="pl-2 border-l border-slate-200/50"
            @click.stop="showDeleteConfirm('folder', folder.id)"
            title="删除文件夹"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史记录列表 -->
    <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      <!-- 文件夹内链接 -->
      <div v-if="selectedFolderLinks.length === 0" class="text-center py-8 text-slate-400 text-sm">
        该文件夹为空
      </div>

      <!-- 链接列表项 -->
      <div
        v-for="link in displayLinks"
        :key="link.id"
        class="group relative p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
      >
        <div class="flex items-center gap-3">
          <!-- 图标容器 -->
          <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>

          <!-- 内容区域 -->
          <div class="flex-1 min-w-0 w-0">
            <div class="mb-0.5">
              <!-- 标题/编辑框 -->
              <input
                v-if="editingId === link.id"
                v-model="editName"
                class="w-full text-sm font-bold text-slate-700 bg-white border border-purple-200 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                @blur="saveEdit(link.id)"
                @keyup.enter="saveEdit(link.id)"
                @keyup.esc="cancelEdit"
                ref="editInput"
                @click.stop
              >
              <span
                v-else
                class="block text-sm font-bold text-slate-700 truncate cursor-pointer hover:text-purple-600 transition-colors"
                @click="startEdit(link)"
              >
                {{ link.name }}
              </span>
            </div>

            <!-- URL -->
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs text-slate-400 hover:text-purple-500 hover:underline truncate block transition-colors"
            >
              {{ link.url }}
            </a>

            <!-- 时间 -->
            <div class="text-[10px] text-slate-300 mt-0.5">
              {{ formatDate(link.createdAt) }}
            </div>
          </div>

          <!-- 操作按钮 (悬停显示，移动端常显) -->
          <div class="flex gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="showMoveMenu(link.id)"
              class="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="移动到文件夹"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
            <button
              @click.stop="showDeleteConfirm('link', link.id)"
              class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="删除"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建文件夹弹窗 -->
    <!-- 新建文件夹弹窗 -->
    <Teleport to="body">
      <div v-if="showCreateFolderModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 transition-opacity">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl scale-100 transition-transform">
          <h3 class="text-lg font-bold text-slate-800 mb-4">
            新建文件夹
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">文件夹名称</label>
              <input
                v-model="newFolderName"
                class="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="输入文件夹名称"
                @keyup.enter="createFolder"
              >
            </div>
            <div class="flex justify-end gap-3">
              <button
                @click="showCreateFolderModal = false; newFolderName = ''"
                class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                @click="createFolder"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                :disabled="!newFolderName.trim()"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 删除确认弹窗 -->
    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <div v-if="deleteConfirmVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 transition-opacity">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl scale-100 transition-transform">
          <h3 class="text-lg font-bold text-slate-800 mb-4">
            <span v-if="cannotDeleteFolder" class="text-red-500 flex items-center gap-2">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              无法删除
            </span>
            <span v-else>
              {{ deleteConfirmType === 'link' ? '删除链接' : '删除文件夹' }}
            </span>
          </h3>
          <div class="space-y-4">
            <div>
              <p v-if="cannotDeleteFolder" class="text-slate-600">
                该文件夹内包含链接，请先清空或移动链接后再尝试删除。
              </p>
              <p v-else class="text-slate-600">
                {{ deleteConfirmType === 'link' ? '确定要删除这个链接吗？' : '确定要删除这个文件夹吗？' }}
              </p>
            </div>
            <div class="flex justify-end gap-3">
              <template v-if="cannotDeleteFolder">
                <button
                  @click="cancelDelete"
                  class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  知道了
                </button>
              </template>
              <template v-else>
                <button
                  @click="cancelDelete"
                  class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  取消
                </button>
                <button
                  @click="confirmDelete"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  删除
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 移动链接弹窗 -->
    <!-- 移动链接弹窗 -->
    <Teleport to="body">
      <div v-if="showMoveModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 transition-opacity">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl scale-100 transition-transform">
          <h3 class="text-lg font-bold text-slate-800 mb-4">
            移动到文件夹
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">选择目标文件夹</label>
              <div class="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                <button
                  v-for="folder in folders"
                  :key="folder.id"
                  class="px-4 py-2 border border-slate-300 rounded-lg hover:bg-purple-500 hover:text-white transition-colors text-sm truncate"
                  @click="moveToFolder(movingLinkId, folder.id)"
                >
                  {{ folder.name }}
                </button>
              </div>
            </div>
            <div class="flex justify-end">
              <button
                @click="cancelMove"
                class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 文件夹拖拽提示 -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  // 从父组件传入的新链接
  newLink: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['link-added'])

// 响应式数据
const links = ref([])
const folders = ref([])
const selectedFolderId = ref('root')
const editingId = ref(null)
const editName = ref('')
const showCreateFolderModal = ref(false)
const newFolderName = ref('')
const editInput = ref(null)
const movingLinkId = ref(null)
const showMoveModal = ref(false)
const isManaging = ref(false)
const deleteConfirmVisible = ref(false)
const deleteConfirmType = ref('link') // 'link' 或 'folder'
const deleteConfirmId = ref(null)
const cannotDeleteFolder = ref(false)

// 计算属性
const selectedFolderLinks = computed(() => {
  return links.value.filter(link => link.folderId === selectedFolderId.value)
})

const displayLinks = computed(() => {
  return selectedFolderLinks.value
})

// 方法
const loadFromStorage = () => {
  const savedLinks = localStorage.getItem('grokHistoryLinks')
  const savedFolders = localStorage.getItem('grokHistoryFolders')

  if (savedLinks) {
    links.value = JSON.parse(savedLinks)
  }

  if (savedFolders) {
    folders.value = JSON.parse(savedFolders)
  } else {
    // 默认创建一个文件夹
    folders.value = [
      { id: 'default', name: '默认文件夹', createdAt: new Date().toISOString() }
    ]
    saveToStorage()
  }
}

const saveToStorage = () => {
  localStorage.setItem('grokHistoryLinks', JSON.stringify(links.value))
  localStorage.setItem('grokHistoryFolders', JSON.stringify(folders.value))
}

const addLink = (url, name = '未命名') => {
  // 检查是否已存在相同的URL
  const existingLink = links.value.find(link => link.url === url)
  if (existingLink) {
    return
  }

  // 默认添加到第一个文件夹（默认文件夹）
  const defaultFolderId = folders.value.length > 0 ? folders.value[0].id : 'default'

  const newLink = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name,
    url,
    folderId: defaultFolderId,
    createdAt: new Date().toISOString()
  }

  links.value.unshift(newLink) // 最新的放在前面
  saveToStorage()
  emit('link-added', newLink)
}

const startEdit = (link) => {
  editingId.value = link.id
  editName.value = link.name
  nextTick(() => {
    editInput.value?.focus()
    editInput.value?.select()
  })
}

const saveEdit = (id) => {
  const link = links.value.find(l => l.id === id)
  if (link && editName.value.trim()) {
    link.name = editName.value.trim()
    saveToStorage()
  }
  editingId.value = null
  editName.value = ''
}

const cancelEdit = () => {
  editingId.value = null
  editName.value = ''
}

// 删除确认函数
const showDeleteConfirm = (type, id) => {
  deleteConfirmType.value = type
  deleteConfirmId.value = id

  if (type === 'folder') {
    const hasLinks = links.value.some(link => link.folderId === id)
    cannotDeleteFolder.value = hasLinks
  } else {
    cannotDeleteFolder.value = false
  }

  deleteConfirmVisible.value = true
}

const confirmDelete = () => {
  if (deleteConfirmType.value === 'link') {
    links.value = links.value.filter(link => link.id !== deleteConfirmId.value)
  } else if (deleteConfirmType.value === 'folder') {
    folders.value = folders.value.filter(folder => folder.id !== deleteConfirmId.value)
    // 如果删除的是当前选中的文件夹，切换到第一个文件夹
    if (selectedFolderId.value === deleteConfirmId.value && folders.value.length > 0) {
      selectedFolderId.value = folders.value[0].id
    }
  }
  saveToStorage()
  deleteConfirmVisible.value = false
  deleteConfirmId.value = null
  cannotDeleteFolder.value = false
}

const cancelDelete = () => {
  deleteConfirmVisible.value = false
  deleteConfirmId.value = null
}

const createFolder = () => {
  if (!newFolderName.value.trim()) return

  const folder = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: newFolderName.value.trim(),
    createdAt: new Date().toISOString()
  }

  folders.value.push(folder)
  saveToStorage()
  showCreateFolderModal.value = false
  newFolderName.value = ''
}

const selectFolder = (folderId) => {
  selectedFolderId.value = folderId
}

const showMoveMenu = (linkId) => {
  movingLinkId.value = linkId
  showMoveModal.value = true
}

const moveToFolder = (linkId, folderId) => {
  const link = links.value.find(l => l.id === linkId)
  if (link) {
    link.folderId = folderId
    saveToStorage()
    showMoveModal.value = false
    movingLinkId.value = null
  }
}

const cancelMove = () => {
  showMoveModal.value = false
  movingLinkId.value = null
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

// 生命周期
onMounted(() => {
  loadFromStorage()
  // 默认选择第一个文件夹
  if (folders.value.length > 0) {
    selectedFolderId.value = folders.value[0].id
  }
})

// 监听新链接
watch(() => props.newLink, (newVal, oldVal) => {
  // 只有当newVal不为空且与oldVal不同时才添加
  if (newVal && newVal !== oldVal) {
    addLink(newVal)
  }
})

// 暴露方法
defineExpose({
  addLink
})
</script>

<style scoped>
/* 滚动条样式 */
.space-y-3::-webkit-scrollbar {
  width: 6px;
}
.space-y-3::-webkit-scrollbar-track {
  border-radius: 3px;
  background: #f1f1f1;
}
.space-y-3::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #c1c1c1;
}
.space-y-3::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
