<template>
  <div class="bg-gray-100 min-h-screen text-gray-800 font-sans p-6">
    <div class="max-w-7xl mx-auto flex flex-col gap-6">
      <main class="flex flex-col md:flex-row gap-6 items-start">
        <section class="w-full md:w-1/2 flex flex-col gap-4 bg-white p-6 rounded-xl shadow-sm sticky top-6">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">
              1. 输入官方阵容代码 (扩充字典)
            </h2>
            <button @click="parseData" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none">
              解析并提取映射
            </button>
          </div>
          <textarea
            v-model="inputText"
            class="w-full border-2 border-gray-200 rounded-lg p-4 h-64 resize-none focus:outline-none focus:border-blue-500 font-mono text-sm transition-colors"
            placeholder="请在此粘贴带有 # 号注释的官方阵容复制串，或纯阵容码..."
          />
          <div v-if="parsedResult" class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap text-gray-700 custom-scrollbar overflow-auto max-h-48">
            <div class="font-bold text-gray-900 mb-2">
              解析结果预览：
            </div>
            {{ parsedResult }}
          </div>
          <div v-if="alertMsg" class="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium text-center">
            {{ alertMsg }}
          </div>
        </section>

        <section class="w-full md:w-1/2 flex flex-col gap-6">
          <div class="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-sm">
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold flex items-center gap-2">
                  <span>2. 本地映射字典库</span>
                </h2>
                <div class="flex gap-2">
                  <button @click="clearDict" class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-red-200">
                    清空
                  </button>
                  <button @click="copyJson" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none">
                    复制 JSON
                  </button>
                </div>
              </div>

              <div class="flex gap-2 border-t border-gray-100 pt-3">
                <button @click="exportJsonFile" class="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-indigo-200">
                  📥 导出
                </button>
                <button @click="triggerFileInput" class="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-green-200">
                  📤 导入
                </button>
                <button @click="toggleEditMode" class="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-yellow-200">
                  {{ isEditingJson ? '💾 保存' : '✏️ 编辑' }}
                </button>
                <button v-if="isEditingJson" @click="cancelEdit" class="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-gray-200">
                  ❌ 取消
                </button>
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  accept=".json"
                  @change="handleFileUpload"
                >
              </div>
            </div>

            <div class="bg-gray-900 rounded-lg p-4 overflow-auto relative h-[400px] custom-scrollbar group">
              <textarea
                v-if="isEditingJson"
                v-model="editingJsonText"
                class="w-full h-full bg-gray-900 text-green-400 font-mono text-sm resize-none focus:outline-none border-none custom-scrollbar"
                spellcheck="false"
              />
              <pre v-else class="text-green-400 font-mono text-sm m-0">{{ JSON.stringify(fullDictionary, null, 2) }}</pre>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- 自定义输入弹窗 -->
    <div v-if="showPromptModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-[450px] shadow-2xl transform transition-all">
        <h3 class="text-lg font-bold text-gray-900 mb-2">
          发现未知精灵
        </h3>
        <p class="text-sm text-gray-500 mb-3">
          系统检测到新精灵编码 <span class="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{{ promptModalData.code }}</span>
          <br>请输入它的对应名称以加入字典：
        </p>

        <!-- 阵容预览辅助区域 -->
        <div class="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div class="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg>
            当前阵容参考 (便于使用排除法)
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="p in promptModalData.teamPreview"
              :key="p.index"
              class="flex items-center justify-between px-2 py-1.5 rounded text-xs border"
              :class="p.code === promptModalData.code
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold ring-1 ring-indigo-200'
                : (p.name ? 'bg-white border-gray-200 text-gray-700' : 'bg-red-50 border-red-200 text-red-600')"
            >
              <span class="opacity-50">#{{ p.index }}</span>
              <span class="truncate ml-2" :title="p.name || p.code">{{ p.name || '??? (未知)' }}</span>
            </div>
          </div>
        </div>

        <input
          v-model="promptModalData.userInput"
          @keyup.enter="submitPrompt"
          type="text"
          autofocus
          class="w-full border-2 border-gray-200 rounded-lg p-3 mb-6 focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="例如：迪莫 (留空则不添加)"
        >
        <div class="flex justify-end gap-3">
          <button @click="cancelPrompt" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer border-none">
            跳过
          </button>
          <button @click="submitPrompt" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer border-none shadow-sm">
            确认添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

const inputText = ref('')
const alertMsg = ref('')
const parsedResult = ref('')
const dictionary = ref({ pets: {}, skills: {}, magic: {}, bloodline: {} })
const fileInput = ref(null)

const isEditingJson = ref(false)
const editingJsonText = ref('')

const showPromptModal = ref(false)
const promptModalData = ref({ code: '', resolve: null, userInput: '', teamPreview: [] })

const promptForPetName = (code, teamPreview) => {
  return new Promise((resolve) => {
    promptModalData.value = { code, resolve, userInput: '', teamPreview }
    showPromptModal.value = true
  })
}

const submitPrompt = () => {
  if (promptModalData.value.resolve) {
    promptModalData.value.resolve(promptModalData.value.userInput)
  }
  showPromptModal.value = false
}

const cancelPrompt = () => {
  if (promptModalData.value.resolve) {
    promptModalData.value.resolve(null)
  }
  showPromptModal.value = false
}

const NATURE_MAP = {
  勇敢: 'E',
  逞强: 'F',
  开朗: 'X',
  胆小: 'V',
  固执: 'C',
  大胆: 'B',
  调皮: 'D',
  聪明: 'L',
  专注: 'M',
  偏执: 'N',
  冷静: 'O',
  理性: 'P',
  天真: 'H',
  懒散: 'I',
  悠闲: 'J',
  稳重: 'G',
  坦率: 'K',
  警惕: 'Q',
  害羞: 'S',
  温顺: 'R',
  慎重: 'T',
  焦虑: 'U',
  急躁: 'W',
  莽撞: 'Y',
  热情: 'Z',
  沉默: 'a',
  忧郁: 'b',
  平和: 'c',
  粗心: 'd',
  踏实: 'e'
}
const EV_MAP = { 生命: 'BP', 物攻: 'BQ', 魔攻: 'BR', 物防: 'BS', 魔防: 'BT', 速度: 'BU' }

const fullDictionary = computed(() => ({
  nature: NATURE_MAP,
  evs: EV_MAP,
  bloodline: dictionary.value.bloodline,
  magic: dictionary.value.magic,
  pets: dictionary.value.pets,
  skills: dictionary.value.skills
}))

onMounted(() => {
  const savedDict = localStorage.getItem('roco_dict_v6')
  if (savedDict) {
    try { dictionary.value = JSON.parse(savedDict) } catch (e) { console.error(e) }
  }
})

watch(dictionary, (newVal) => localStorage.setItem('roco_dict_v6', JSON.stringify(newVal)), { deep: true })

const showAlert = (msg) => {
  alertMsg.value = msg
  setTimeout(() => { alertMsg.value = '' }, 3000)
}

const exportJsonFile = () => {
  const dataStr = JSON.stringify(fullDictionary.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().split('T')[0]
  link.href = url
  link.download = `roco_dict_${date}.json`
  link.click()
  URL.revokeObjectURL(url)
  showAlert('文件导出成功！')
}

const triggerFileInput = () => { fileInput.value.click() }

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result)
      if (importedData.pets || importedData.skills || importedData.bloodline) {
        dictionary.value = {
          pets: importedData.pets || {},
          skills: importedData.skills || {},
          magic: importedData.magic || {},
          bloodline: importedData.bloodline || {}
        }
        showAlert('字典数据已从文件恢复！')
      } else { alert('无效的字典文件格式') }
    } catch (err) { alert('文件读取失败或 JSON 格式错误') }
  }
  reader.readAsText(file)
  event.target.value = ''
}

// =============== 核心功能：解析官方代码 ===============
const toggleEditMode = () => {
  if (isEditingJson.value) {
    try {
      const parsed = JSON.parse(editingJsonText.value)
      if (parsed.pets && parsed.skills) {
        dictionary.value = {
          pets: parsed.pets || {},
          skills: parsed.skills || {},
          magic: parsed.magic || {},
          bloodline: parsed.bloodline || {}
        }
        isEditingJson.value = false
        showAlert('JSON 修改已保存！')
      } else {
        alert('保存失败：JSON 必须包含 pets 和 skills 字段')
      }
    } catch (e) {
      alert('保存失败：JSON 格式错误，请检查语法！')
    }
  } else {
    editingJsonText.value = JSON.stringify(fullDictionary.value, null, 2)
    isEditingJson.value = true
  }
}

const cancelEdit = () => {
  if (confirm('确定要放弃当前修改吗？')) {
    isEditingJson.value = false
    editingJsonText.value = ''
  }
}

const parseData = async () => {
  if (!inputText.value.trim()) return alert('请先粘贴官方阵容代码！')
  const lines = inputText.value.trim().split('\n')
  let magicName = ''; let payloadStr = ''
  const petNames = []; const bloodlineNames = []; const skillNamesList = []
  parsedResult.value = ''

  lines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('### ')) return
    if (trimmed.startsWith('# 魔法：')) magicName = trimmed.replace('# 魔法：', '').trim()
    else if (trimmed.startsWith('# ') && trimmed.includes('{')) {
      const match = trimmed.match(/#\s*(.*?)[：:]\s*(.*?)[、,，\s]*\{(.*?)\}/) || trimmed.match(/#\s*(.*?)[：:]\s*\{(.*?)\}/)
      if (match && match.length >= 4) {
        petNames.push(match[1].trim())
        bloodlineNames.push(match[2].trim())
        skillNamesList.push(match[3].split(/[、,，\s]+/).map(s => s.replace(/[\(（].*?[\)）]/g, '').trim()).filter(Boolean))
      } else if (match && match.length === 3) {
        petNames.push(match[1].trim())
        bloodlineNames.push('')
        skillNamesList.push(match[2].split(/[、,，\s]+/).map(s => s.replace(/[\(（].*?[\)）]/g, '').trim()).filter(Boolean))
      }
    } else if (!trimmed.startsWith('#') && trimmed.includes('~')) {
      payloadStr += trimmed.replace(/\s+/g, '')
    }
  })

  if (!payloadStr) return alert('未检测到底层代码行！')

  // 将 00000 替换为 none~，完美还原被吞掉的分隔符
  payloadStr = payloadStr.replace(/00000/g, 'none~')
  const codes = payloadStr.split('~')

  const magicCode = codes[codes.length - 14] || codes[codes.length - 13]
  if (magicCode && magicName && magicCode.startsWith('ZZ')) dictionary.value.magic[magicCode] = magicName

  const startIndex = (codes[0] === 'B' || codes[0] === '') ? 1 : 0

  // 预先提取整队的精灵编码，用于在弹窗中展示给用户，方便排除法
  const teamPreview = []
  for (let i = 0; i < 6; i++) {
    const petBaseIndex = startIndex + i * 9
    let pCode = codes[petBaseIndex]
    if (pCode === undefined) break
    if (i === 0 && typeof pCode === 'string' && /^[A-Z]/.test(pCode)) {
      pCode = pCode.substring(1)
    }
    if (!pCode || pCode === 'none') continue
    const name = petNames[i] ? petNames[i] : (dictionary.value.pets[pCode] || '')
    teamPreview.push({ code: pCode, name, index: i + 1 })
  }

  let parsedLog = ''

  for (let i = 0; i < 6; i++) {
    // 【终极修复区】：步长改回 9，重新校准各属性偏移量
    const petBaseIndex = startIndex + i * 9
    let petCode = codes[petBaseIndex]

    if (petCode === undefined) break // 读到底了

    if (i === 0 && typeof petCode === 'string' && /^[A-Z]/.test(petCode)) {
      petCode = petCode.substring(1)
    }

    if (!petCode || petCode === 'none') continue

    // 偏移量 +3 才是血脉 (ID是+0, 空装备1是+1, 空装备2是+2)
    const bloodCode = codes[petBaseIndex + 3]
    // 偏移量 +5 才是原生 S1 字符串 (包含了资质EV)
    const s1Raw = codes[petBaseIndex + 5]

    const s1Code = s1Raw && s1Raw !== 'none' ? s1Raw.slice(-4) : ''
    const s2Code = codes[petBaseIndex + 6] === 'none' ? '' : (codes[petBaseIndex + 6] || '')
    const s3Code = codes[petBaseIndex + 7] === 'none' ? '' : (codes[petBaseIndex + 7] || '')
    const s4Code = codes[petBaseIndex + 8] === 'none' ? '' : (codes[petBaseIndex + 8] || '')

    if (petNames[i]) {
      // 避免用不带括号的简写覆盖字典里已有的带括号的完整形态名
      const existing = dictionary.value.pets[petCode]
      if (existing && existing.includes('（') && !petNames[i].includes('（')) {
        // 保留原有的具体形态名
      } else {
        dictionary.value.pets[petCode] = petNames[i]
      }
    } else {
      // 纯阵容码解析：如果字典中没有该精灵，则弹窗让用户输入
      if (!dictionary.value.pets[petCode]) {
        const userInput = await promptForPetName(petCode, teamPreview)
        if (userInput && userInput.trim()) {
          dictionary.value.pets[petCode] = userInput.trim()
          // 更新预览列表中的名字，以便后续弹窗能显示已填写的名字
          const previewItem = teamPreview.find(p => p.code === petCode)
          if (previewItem) previewItem.name = userInput.trim()
        }
      }
    }

    if (bloodlineNames[i] && bloodCode && bloodCode !== 'none') {
      dictionary.value.bloodline[bloodCode] = bloodlineNames[i]
    }

    const skills = skillNamesList[i] || []
    if (skills[0] && s1Code) dictionary.value.skills[s1Code] = skills[0]
    if (skills[1] && s2Code) dictionary.value.skills[s2Code] = skills[1]
    if (skills[2] && s3Code) dictionary.value.skills[s3Code] = skills[2]
    if (skills[3] && s4Code) dictionary.value.skills[s4Code] = skills[3]

    // 记录解析预览日志
    const finalPetName = dictionary.value.pets[petCode] || `未知(${petCode})`
    const skill1Name = dictionary.value.skills[s1Code] || s1Code || '--'
    const skill2Name = dictionary.value.skills[s2Code] || s2Code || '--'
    const skill3Name = dictionary.value.skills[s3Code] || s3Code || '--'
    const skill4Name = dictionary.value.skills[s4Code] || s4Code || '--'
    parsedLog += `[座位 ${i + 1}] ${finalPetName}\n 技能: ${skill1Name} | ${skill2Name} | ${skill3Name} | ${skill4Name}\n`
  }

  parsedResult.value = parsedLog
  inputText.value = ''
  showAlert('解析成功！已合并至本地字典。')
}


const clearDict = () => { if (confirm('确定清空？')) { dictionary.value = { pets: {}, skills: {}, magic: {}, bloodline: {} }; showAlert('已清空') } }
const copyJson = async () => { try { await navigator.clipboard.writeText(JSON.stringify(fullDictionary.value, null, 2)); showAlert('全量字典已复制！') } catch (err) { alert('失败') } }
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 4px; background: #cbd5e1; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>
