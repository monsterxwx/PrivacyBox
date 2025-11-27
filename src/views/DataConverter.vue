<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-emerald-100">
    <!-- ================= 背景特效 (翠绿/数据流) ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div class="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-green-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />

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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">万能数据转换</span>
        </h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          Excel/CSV 互转 JSON, XML, SQL。纯前端解析，数据绝不出网，安全处理敏感报表。
        </p>
      </div>

      <!-- 主界面 -->
      <div class="flex-1 grid lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧：上传与配置 -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col h-full">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <span class="w-1.5 h-6 bg-emerald-500 rounded-full" />
              导入数据
            </h2>

            <!-- 上传区 -->
            <div
              class="w-full relative group rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 min-h-[200px] flex flex-col items-center justify-center transition-all cursor-pointer mb-6"
              :class="{'border-emerald-400 bg-emerald-50/30': isDragging}"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerUpload"
            >
              <div v-if="!fileInfo" class="text-center p-6">
                <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl mx-auto mb-4 text-slate-300 group-hover:text-emerald-500 transition-colors group-hover:scale-110 duration-300">
                  📊
                </div>
                <h3 class="font-bold text-slate-700 text-base mb-1">
                  Excel 或 CSV
                </h3>
                <p class="text-slate-500 text-xs mt-1">
                  支持 .xlsx, .xls, .csv
                </p>
              </div>

              <div v-else class="flex flex-col items-center">
                <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-3">
                  📄
                </div>
                <div class="font-bold text-slate-700 text-sm max-w-[200px] truncate">
                  {{ fileInfo.name }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ fileInfo.size }}
                </div>
                <button
                  @click.stop="reset"
                  class="mt-3 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  更换文件
                </button>
              </div>
            </div>
            <input
              type="file"
              ref="fileInput"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              class="hidden"
              @change="handleFileChange"
            >

            <!-- 导出设置 -->
            <div v-if="jsonData.length > 0" class="flex-1 space-y-4 animate-fade-in">
              <div class="w-full h-px bg-slate-100" />

              <div class="space-y-3">
                <label class="block text-xs font-bold text-slate-500 uppercase">导出格式</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="fmt in ['json', 'sql', 'xml']"
                    :key="fmt"
                    @click="exportFormat = fmt"
                    class="py-2 rounded-lg text-sm font-bold border transition-all"
                    :class="exportFormat === fmt ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'"
                  >
                    {{ fmt.toUpperCase() }}
                  </button>
                </div>
              </div>

              <!-- SQL 特有设置 -->
              <div v-if="exportFormat === 'sql'" class="space-y-2">
                <label class="block text-xs font-bold text-slate-500 uppercase">表名 (Table Name)</label>
                <input type="text" v-model="tableName" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none transition-colors">
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：预览与导出 -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 flex-1 flex flex-col min-h-[600px] overflow-hidden">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-teal-500 rounded-full" />
                <span v-if="viewMode === 'table'">数据预览 (前 50 行)</span>
                <span v-else>代码预览</span>
              </h2>

              <div v-if="jsonData.length > 0" class="flex bg-slate-100 p-1 rounded-lg">
                <button
                  @click="viewMode = 'table'"
                  class="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                  :class="viewMode === 'table' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'"
                >
                  表格
                </button>
                <button
                  @click="viewMode = 'code'"
                  class="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                  :class="viewMode === 'code' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'"
                >
                  源码
                </button>
              </div>
            </div>

            <!-- 内容区域 -->
            <div class="flex-1 relative rounded-xl border border-slate-200 bg-white overflow-hidden">
              <!-- 空状态 -->
              <div v-if="jsonData.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                <div class="text-4xl mb-2 opacity-30">
                  📑
                </div>
                <p class="text-sm">
                  请先在左侧上传文件
                </p>
              </div>

              <!-- 表格模式 -->
              <div v-else-if="viewMode === 'table'" class="absolute inset-0 overflow-auto custom-scrollbar">
                <table class="w-full text-left text-sm border-collapse">
                  <thead class="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th v-for="key in tableKeys" :key="key" class="px-4 py-3 font-bold text-slate-600 border-b border-slate-200 whitespace-nowrap">
                        {{ key }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="(row, idx) in previewRows" :key="idx" class="hover:bg-slate-50 transition-colors">
                      <td v-for="key in tableKeys" :key="key" class="px-4 py-2 text-slate-600 whitespace-nowrap max-w-[200px] truncate border-r border-transparent last:border-r-0">
                        {{ row[key] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="jsonData.length > 50" class="p-3 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-200">
                  仅展示前 50 条数据，共 {{ jsonData.length }} 条
                </div>
              </div>

              <!-- 代码模式 -->
              <div v-else class="absolute inset-0 bg-slate-900 overflow-hidden flex flex-col">
                <textarea
                  readonly
                  :value="outputCode"
                  class="w-full h-full bg-transparent p-4 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none custom-scrollbar"
                />
              </div>
            </div>

            <!-- 底部操作栏 -->
            <div class="mt-4 flex justify-between items-center">
              <div class="text-xs text-slate-500">
                <span v-if="jsonData.length > 0">共 {{ jsonData.length }} 行数据</span>
              </div>
              <div class="flex gap-3">
                <button
                  v-if="jsonData.length > 0"
                  @click="copyCode"
                  class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-sm transition-colors"
                >
                  <span v-if="copied">✅ 已复制</span>
                  <span v-else>复制内容</span>
                </button>
                <button
                  v-if="jsonData.length > 0"
                  @click="downloadFile"
                  class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-lg shadow-emerald-500/20 transition-colors flex items-center gap-2"
                >
                  <div class="i-tabler-download" />
                  下载 {{ exportFormat.toUpperCase() }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

// ---------------- State ----------------
const fileInput = ref(null)
const isDragging = ref(false)
const fileInfo = ref(null)
const jsonData = ref([])
const tableKeys = ref([])

const viewMode = ref('table') // 'table' | 'code'
const exportFormat = ref('json') // 'json' | 'sql' | 'xml'
const tableName = ref('my_table')
const copied = ref(false)

// ---------------- Logic: File Handling ----------------
const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => processFile(e.target.files[0])

const handleDrop = (e) => {
  isDragging.value = false
  processFile(e.dataTransfer.files[0])
}

const reset = () => {
  fileInfo.value = null
  jsonData.value = []
  tableKeys.value = []
  fileInput.value.value = ''
}

const processFile = (file) => {
  if (!file) return

  // 简单格式化文件大小
  const size = file.size > 1024 * 1024
    ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    : (file.size / 1024).toFixed(2) + ' KB'

  fileInfo.value = {
    name: file.name,
    size
  }

  // 默认表名
  const nameWithoutExt = file.name.split('.').slice(0, -1).join('.') || 'table'
  tableName.value = nameWithoutExt.replace(/[^a-zA-Z0-9_]/g, '_') // 简单的 SQL 安全处理

  const reader = new FileReader()

  // CSV 处理
  if (file.name.endsWith('.csv')) {
    reader.onload = (e) => {
      const csvData = e.target.result
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setData(results.data)
        }
      })
    }
    reader.readAsText(file)
  }
  // Excel 处理
  else {
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)
      setData(json)
    }
    reader.readAsArrayBuffer(file)
  }
}

const setData = (data) => {
  if (!data || data.length === 0) {
    alert('未解析到有效数据')
    return
  }
  jsonData.value = data
  // 获取所有可能的 key (防止某些行缺字段)
  const keys = new Set()
  data.forEach(row => Object.keys(row).forEach(k => keys.add(k)))
  tableKeys.value = Array.from(keys)
}

// ---------------- Logic: Formatting ----------------
const previewRows = computed(() => jsonData.value.slice(0, 50))

const outputCode = computed(() => {
  if (jsonData.value.length === 0) return ''

  if (exportFormat.value === 'json') {
    return JSON.stringify(jsonData.value, null, 2)
  }

  if (exportFormat.value === 'sql') {
    if (jsonData.value.length === 0) return ''
    const keys = tableKeys.value
    const headers = keys.map(k => `\`${k}\``).join(', ')

    const sql = `INSERT INTO \`${tableName.value}\` (${headers}) VALUES\n`

    const values = jsonData.value.map(row => {
      const vals = keys.map(k => {
        const v = row[k]
        if (v === null || v === undefined) return 'NULL'
        if (typeof v === 'number') return v
        // 简单转义单引号
        return `'${String(v).replace(/'/g, "''")}'`
      }).join(', ')
      return `(${vals})`
    }).join(',\n')

    return sql + ';'
  }

  if (exportFormat.value === 'xml') {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n'
    jsonData.value.forEach(row => {
      xml += '  <row>\n'
      tableKeys.value.forEach(key => {
        // 简单转义 XML 特殊字符
        const val = String(row[key] ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        xml += `    <${key}>${val}</${key}>\n`
      })
      xml += '  </row>\n'
    })
    xml += '</rows>'
    return xml
  }

  return ''
})

// ---------------- Logic: Export ----------------
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(outputCode.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) { console.error(err) }
}

const downloadFile = () => {
  const blob = new Blob([outputCode.value], { type: 'text/plain;charset=utf-8' })
  const ext = exportFormat.value
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${tableName.value}.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

// 切换导出格式时自动切到代码视图
watch(exportFormat, () => {
  viewMode.value = 'code'
})

</script>

<style scoped>
/* 简单的表格样式 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 3px; background: #cbd5e1; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

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
