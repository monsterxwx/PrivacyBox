<template>
  <div class="bg-gray-100 min-h-screen text-gray-800 font-sans p-6">
    <div class="max-w-7xl mx-auto flex flex-col gap-6">
      <header class="bg-white p-6 rounded-xl shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900 m-0">
          洛克王国世界：开发测试工具箱 <span class="text-indigo-600">V5.1 属性适配版</span>
        </h1>
        <p class="text-gray-500 mt-2 text-sm">
          已支持解析 pet.attributes 数组，自动提取最后一个属性并拼接为底层血脉代码。
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
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold flex items-center gap-2">
                <span>2. 本地映射字典库</span>
                <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">全量数据预览</span>
              </h2>
              <div class="flex gap-2">
                <button @click="clearDict" class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-red-200">
                  清空图鉴
                </button>
                <button @click="copyJson" class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none">
                  复制 JSON
                </button>
              </div>
            </div>
            <div class="bg-gray-900 rounded-lg p-4 overflow-auto relative h-[450px] custom-scrollbar">
              <pre class="text-green-400 font-mono text-sm m-0">{{ JSON.stringify(fullDictionary, null, 2) }}</pre>
            </div>
          </div>

          <div class="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-sm border-2 border-dashed border-indigo-100">
            <div class="flex flex-col gap-1">
              <h2 class="text-lg font-semibold text-indigo-900">
                3. 测试生成游戏阵容代码
              </h2>
              <p class="text-xs text-gray-500 m-0">
                小程序 JSON 结构已适配 pet.attributes 数组取最后一个元素的逻辑：
              </p>
            </div>

            <textarea
              v-model="localDataInput"
              class="w-full border-2 border-gray-200 rounded-lg p-3 h-32 resize-none focus:outline-none focus:border-indigo-500 font-mono text-xs transition-colors custom-scrollbar"
              placeholder="[{&quot;id&quot;:&quot;1778461071630&quot;,&quot;name&quot;:&quot;测试队&quot;,&quot;power&quot;:&quot;愿力强化&quot;,&quot;pets&quot;: [{&quot;pet&quot;:{&quot;attributes&quot;:[&quot;光&quot;],&quot;id&quot;:1,&quot;name&quot;:&quot;迪莫&quot;},&quot;nature&quot;:&quot;胆小&quot;,&quot;evs&quot;:&quot;魔攻 生命 速度&quot;,&quot;skills&quot;:[&quot;棘突&quot;,&quot;炎打&quot;,&quot;过曝&quot;,&quot;折射&quot;]}]}]"
            />

            <button @click="generateCode" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none shadow-sm">
              ↓ 基于字典与动态资质转换生成游戏代码 ↓
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

// 状态声明
const inputText = ref('')
const alertMsg = ref('')
const dictionary = ref({ pets: {}, skills: {}, magic: {}, bloodline: {} })
const localDataInput = ref('')
const generatedCode = ref('')

// 静态映射表
const NATURE_MAP = {
  胆小: 'V',
  大胆: 'b',
  开朗: 'X',
  固执: 'C',
  淘气: 'a',
  悠闲: 'a',
  保守: 'L'
}

const EV_MAP = {
  生命: 'BP',
  物攻: 'BQ',
  魔攻: 'BR',
  物防: 'BS',
  魔防: 'BT',
  速度: 'BU'
}

// 计算全量字典
const fullDictionary = computed(() => {
  return {
    nature: NATURE_MAP,
    evs: EV_MAP,
    bloodline: dictionary.value.bloodline,
    magic: dictionary.value.magic,
    pets: dictionary.value.pets,
    skills: dictionary.value.skills
  }
})

// 生命周期：读取本地缓存
onMounted(() => {
  const savedDict = localStorage.getItem('roco_dict_v5')
  if (savedDict) {
    try {
      dictionary.value = JSON.parse(savedDict)
    } catch (e) {
      console.error(e)
    }
  }
  const savedLocalData = localStorage.getItem('roco_local_test')
  if (savedLocalData) {
    localDataInput.value = savedLocalData
  }
})

// 监听并保存到本地
watch(dictionary, (newVal) => localStorage.setItem('roco_dict_v5', JSON.stringify(newVal)), { deep: true })
watch(localDataInput, (newVal) => localStorage.setItem('roco_local_test', newVal))

// 消息提示
const showAlert = (msg) => {
  alertMsg.value = msg
  setTimeout(() => { alertMsg.value = '' }, 3000)
}

// =============== 核心功能：解析官方代码 ===============
const parseData = () => {
  if (!inputText.value.trim()) return alert('请先粘贴官方阵容代码！')

  const lines = inputText.value.trim().split('\n')
  let magicName = ''
  const petNames = []
  const bloodlineNames = []
  const skillNamesList = []
  let payloadStr = ''

  lines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('### ')) {
      // Ignore
    } else if (trimmed.startsWith('# 魔法：')) {
      magicName = trimmed.replace('# 魔法：', '').trim()
    } else if (trimmed.startsWith('# ') && trimmed.includes('{') && trimmed.includes('}')) {
      const match = trimmed.match(/#\s*(.*?)：(.*?)、\s*\{(.*?)\}/)
      if (match) {
        petNames.push(match[1].trim())
        bloodlineNames.push(match[2].trim())
        const rawSkills = match[3].split(/[、,，]/)
        const cleanSkills = rawSkills.map(s => s.replace(/\(.*?\)/g, '').replace(/（.*?）/g, '').trim())
        skillNamesList.push(cleanSkills)
      }
    } else if (!trimmed.startsWith('#') && trimmed.includes('~')) {
      // 容错拼接
      payloadStr += trimmed.replace(/\s+/g, '')
    }
  })

  if (!payloadStr) return alert('未检测到底层代码行！')

  const codes = payloadStr.split('~')
  const magicCode = codes[codes.length - 14] || codes[codes.length - 13]
  if (magicCode && magicName && magicCode.startsWith('ZZ')) {
    dictionary.value.magic[magicCode] = magicName
  }

  const startIndex = codes[0] === 'B' ? 1 : (codes[0].startsWith('G') ? 0 : 1)

  for (let i = 0; i < 6; i++) {
    let petCode = codes[startIndex + i * 9]
    if (petCode === undefined) break
    if (petCode.startsWith('G')) petCode = petCode.substring(1)
    if (!petCode) continue

    const bloodCode = codes[startIndex + 4 + i * 9] // 提取第4段的血脉代码
    const s1Raw = codes[startIndex + 6 + i * 9]
    const s1Code = s1Raw ? s1Raw.slice(-4) : ''
    const s2Code = codes[startIndex + 7 + i * 9] || ''
    const s3Code = codes[startIndex + 8 + i * 9] || ''
    const s4Code = codes[startIndex + 9 + i * 9] || ''

    if (petNames[i]) dictionary.value.pets[petCode] = petNames[i]

    if (bloodlineNames[i] && bloodCode) {
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
    if (!localDataInput.value.trim()) return alert('请先粘贴小程序 JSON 数据！')

    const localDataArray = JSON.parse(localDataInput.value)
    if (!Array.isArray(localDataArray) || localDataArray.length === 0) return alert('数据格式有误')

    const team = localDataArray[0]
    const dict = fullDictionary.value

    // 字典反转
    const petNameToId = Object.fromEntries(Object.entries(dict.pets).map(([k, v]) => [v, k]))
    const skillNameToId = Object.fromEntries(Object.entries(dict.skills).map(([k, v]) => [v, k]))
    const magicNameToId = Object.fromEntries(Object.entries(dict.magic).map(([k, v]) => [v, k]))
    const bloodlineToId = Object.fromEntries(Object.entries(dict.bloodline).map(([k, v]) => [v, k]))

    let textOutput = `### ${team.name || '未命名队伍'}\n# 魔法：${team.power || '未知魔法'}\n#\n`
    let payloadStr = 'B~'

    if (!team.pets || !Array.isArray(team.pets)) return alert('队伍中未找到 pets 数组！')

    team.pets.forEach((petItem, index) => {
      const rawName = petItem.pet?.name || '未知宠物'
      const skills = petItem.skills || []
      const skillNames = skills.join('、')

      // 提取血脉
      let parsedBloodline = petItem.bloodline
      if (!parsedBloodline && petItem.pet?.attributes && Array.isArray(petItem.pet.attributes) && petItem.pet.attributes.length > 0) {
        const attrs = petItem.pet.attributes
        const lastAttr = attrs[attrs.length - 1]

        if (lastAttr === '首领' || lastAttr === '奇异') {
          parsedBloodline = lastAttr + '血脉'
        } else {
          parsedBloodline = lastAttr.endsWith('血脉') ? lastAttr : lastAttr + '系血脉'
        }
      }

      const displayBloodline = parsedBloodline || '默认血脉'
      textOutput += `# ${rawName}：${displayBloodline}、{${skillNames}}\n`

      const cleanPetName = rawName.replace(/（.*?）|\(.*?\)/g, '').trim()
      let petCode = petNameToId[cleanPetName] || '???'
      if (index === 0 && petCode !== '???') petCode = 'G' + petCode

      // 兼容技能槽未满的情况
      const s1Code = skills[0] ? (skillNameToId[skills[0]] || '????') : ''
      const s2Code = skills[1] ? (skillNameToId[skills[1]] || '????') : ''
      const s3Code = skills[2] ? (skillNameToId[skills[2]] || '????') : ''
      const s4Code = skills[3] ? (skillNameToId[skills[3]] || '????') : ''

      let evsCode = 'BPBRBU'
      if (petItem.evs) {
        const evsArray = petItem.evs.split(/\s+/).filter(Boolean)
        if (evsArray.length === 3) {
          const c1 = EV_MAP[evsArray[0]] || 'BP'
          const c2 = EV_MAP[evsArray[1]] || 'BR'
          const c3 = EV_MAP[evsArray[2]] || 'BU'
          evsCode = c1 + c2 + c3
        }
      }

      const natureCode = NATURE_MAP[petItem.nature] || 'V'
      const bloodlineCode = bloodlineToId[parsedBloodline] || 'T'

      payloadStr += `${petCode}~~~${bloodlineCode}~${natureCode}~${evsCode}${s1Code}~${s2Code}~${s3Code}~${s4Code}~`
    })

    textOutput += '#\n'

    const magicCode = magicNameToId[team.power] || 'ZZH'
    const tailTemplate = `${magicCode}~FA~A~A~A~A~A~A~A~A~A~A~A~`
    payloadStr += tailTemplate

    generatedCode.value = textOutput + payloadStr
  } catch (e) {
    console.error(e)
    alert('JSON 格式解析失败，请检查数据。')
  }
}

// =============== 辅助操作 ===============
const clearDict = () => {
  if (confirm('确定要清空动态图鉴数据吗？')) {
    dictionary.value = { pets: {}, skills: {}, magic: {}, bloodline: {} }
    showAlert('图鉴数据已清空')
  }
}

const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(fullDictionary.value, null, 2))
    showAlert('全量字典已复制！')
  } catch (err) { alert('复制失败，请手动复制。') }
}

const copyGenerated = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    alert('生成结果已复制，快去游戏里粘贴试试吧！')
  } catch (err) { alert('复制失败，请手动框选复制。') }
}
</script>

<style scoped>
/* 替换掉了 v-cloak，因为在 SFC 里不需要 */

/* 滚动条样式加上了 scoped，并且改为对特定类名生效，防止污染全局 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #cbd5e1;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
