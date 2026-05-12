<template>
  <div class="bg-gray-100 min-h-screen text-gray-800 font-sans p-6">
    <div class="max-w-7xl mx-auto flex flex-col gap-6">
      <header class="bg-white p-6 rounded-xl shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900 m-0">
          洛克王国世界：开发测试工具箱 <span class="text-indigo-600">V6.2 终极修复版</span>
        </h1>
        <p class="text-gray-500 mt-2 text-sm">
          已彻底修复解析器步长错位 Bug，精准对齐 9 分段底层结构。包含 00000 压缩法则与 JSON 跨设备导入导出功能。
        </p>
      </header>

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
            placeholder="请在此粘贴带有 # 号注释的官方阵容复制串..."
          />
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
                  📥 导出 JSON 文件
                </button>
                <button @click="triggerFileInput" class="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-green-200">
                  📤 导入 JSON 文件
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

            <div class="bg-gray-900 rounded-lg p-4 overflow-auto relative h-[400px] custom-scrollbar">
              <pre class="text-green-400 font-mono text-sm m-0">{{ JSON.stringify(fullDictionary, null, 2) }}</pre>
            </div>
          </div>

          <div class="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-sm border-2 border-dashed border-indigo-100">
            <div class="flex flex-col gap-1">
              <h2 class="text-lg font-semibold text-indigo-900">
                3. 测试生成游戏阵容代码
              </h2>
            </div>
            <textarea v-model="localDataInput" class="w-full border-2 border-gray-200 rounded-lg p-3 h-32 resize-none focus:outline-none focus:border-indigo-500 font-mono text-xs transition-colors custom-scrollbar" placeholder="粘贴小程序 JSON..." />
            <button @click="generateCode" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none shadow-sm">
              ↓ 生成代码 ↓
            </button>
            <div v-if="generatedCode" class="mt-2 flex flex-col gap-2 p-4 bg-indigo-50 rounded-lg">
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-indigo-800">生成结果：</span>
                <button @click="copyGenerated" class="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 px-3 py-1 rounded text-xs cursor-pointer shadow-sm transition-colors">
                  一键复制
                </button>
              </div>
              <textarea readonly :value="generatedCode" class="w-full bg-white border border-indigo-100 rounded-md p-3 h-48 text-xs font-mono text-gray-700 resize-none outline-none custom-scrollbar" />
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

const inputText = ref('')
const alertMsg = ref('')
const dictionary = ref({ pets: {}, skills: {}, magic: {}, bloodline: {} })
const localDataInput = ref('')
const generatedCode = ref('')
const fileInput = ref(null)

const NATURE_MAP = {
  勇敢: 'E',
  逞强: 'F',
  开朗: 'V',
  胆小: 'X',
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
  localDataInput.value = localStorage.getItem('roco_local_test') || ''
})

watch(dictionary, (newVal) => localStorage.setItem('roco_dict_v6', JSON.stringify(newVal)), { deep: true })
watch(localDataInput, (newVal) => localStorage.setItem('roco_local_test', newVal))

const showAlert = (msg) => {
  alertMsg.value = msg
  setTimeout(() => { alertMsg.value = '' }, 3000)
}

// =============== 导出 / 导入 JSON 文件 ===============
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
const parseData = () => {
  if (!inputText.value.trim()) return alert('请先粘贴官方阵容代码！')
  const lines = inputText.value.trim().split('\n')
  let magicName = ''; let payloadStr = ''
  const petNames = []; const bloodlineNames = []; const skillNamesList = []

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

    if (petNames[i]) dictionary.value.pets[petCode] = petNames[i]

    if (bloodlineNames[i] && bloodCode && bloodCode !== 'none') {
      dictionary.value.bloodline[bloodCode] = bloodlineNames[i]
    }

    const skills = skillNamesList[i] || []
    if (skills[0] && s1Code) dictionary.value.skills[s1Code] = skills[0]
    if (skills[1] && s2Code) dictionary.value.skills[s2Code] = skills[1]
    if (skills[2] && s3Code) dictionary.value.skills[s3Code] = skills[2]
    if (skills[3] && s4Code) dictionary.value.skills[s4Code] = skills[3]
  }
  inputText.value = ''
  showAlert('解析成功！已合并至本地字典。')
}

// =============== 核心功能：测试生成游戏代码 ===============
const generateCode = () => {
  try {
    const localDataArray = JSON.parse(localDataInput.value)
    const team = localDataArray[0]
    const dict = fullDictionary.value
    const petNameToId = Object.fromEntries(Object.entries(dict.pets).map(([k, v]) => [v, k]))
    const skillNameToId = Object.fromEntries(Object.entries(dict.skills).map(([k, v]) => [v, k]))
    const magicNameToId = Object.fromEntries(Object.entries(dict.magic).map(([k, v]) => [v, k]))
    const bloodlineToId = Object.fromEntries(Object.entries(dict.bloodline).map(([k, v]) => [v, k]))

    const getSkillSafe = (code) => (!code || code === '???' || code === '????') ? '00000' : code + '~'
    const validPets = team.pets.filter(p => !!petNameToId[p.pet.name.replace(/（.*?）|\(.*?\)/g, '').trim()])
    if (validPets.length === 0) return alert('图鉴缺失')

    let textOutput = `### ${team.name}\n# 魔法：${team.power}\n#\n`
    let payloadStr = 'B~'
    const teamSizeLetter = String.fromCharCode(65 + validPets.length)

    validPets.forEach((petItem, index) => {
      const skills = petItem.skills || []
      let parsedBloodline = ''
      if (petItem.pet?.attributes?.length > 0) {
        const lastAttr = petItem.pet.attributes[petItem.pet.attributes.length - 1]
        parsedBloodline = (lastAttr === '首领' || lastAttr === '奇异') ? lastAttr + '血脉' : (lastAttr.endsWith('血脉') ? lastAttr : lastAttr + '系血脉')
      }
      textOutput += `# ${petItem.pet.name}：${parsedBloodline || '默认血脉'}、{${skills.join('、')}}\n`

      let petCode = petNameToId[petItem.pet.name.replace(/（.*?）|\(.*?\)/g, '').trim()]
      if (index === 0) petCode = teamSizeLetter + petCode

      const evsArray = petItem.evs.split(/\s+/).filter(Boolean)
      const evsCode = (EV_MAP[evsArray[0]] || 'BP') + (EV_MAP[evsArray[1]] || 'BR') + (EV_MAP[evsArray[2]] || 'BU')

      payloadStr += `${petCode}~~~${bloodlineToId[parsedBloodline] || 'T'}~${NATURE_MAP[petItem.nature] || 'V'}~${evsCode}`
      payloadStr += getSkillSafe(skillNameToId[skills[0]]) + getSkillSafe(skillNameToId[skills[1]]) + getSkillSafe(skillNameToId[skills[2]]) + getSkillSafe(skillNameToId[skills[3]])
    })

    generatedCode.value = textOutput + '#\n' + (magicNameToId[team.power] || 'ZZH') + '~FA~' + 'A~'.repeat(validPets.length * 2 - 1)
  } catch (e) { alert('生成失败') }
}

const clearDict = () => { if (confirm('确定清空？')) { dictionary.value = { pets: {}, skills: {}, magic: {}, bloodline: {} }; showAlert('已清空') } }
const copyJson = async () => { try { await navigator.clipboard.writeText(JSON.stringify(fullDictionary.value, null, 2)); showAlert('全量字典已复制！') } catch (err) { alert('失败') } }
const copyGenerated = async () => { try { await navigator.clipboard.writeText(generatedCode.value); alert('成功') } catch (err) { alert('失败') } }
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 4px; background: #cbd5e1; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>
