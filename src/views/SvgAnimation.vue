<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue'

// --- 状态管理 ---

// UI 配置与绑定
const config = reactive({
  strokeColor: '#ff0044',
  strokeWidth: 4,
  animMode: 'sequential', // sequential | simultaneous
  loopMode: 'once', // once | infinite
  timingMode: 'duration', // duration | speed
  animValue: 10,
  easingMode: 'ease-in-out',
  bgMode: 'dark' // dark | light | grid
})

const currentMode = ref('draw') // draw | line | poly | pan
const fileName = ref('点击或拖拽 SVG')
const isDragOver = ref(false)
const statusBarText = ref('缩放: 100% | 模式: 自由画笔')
const isSpacePressed = ref(false)
const isPanning = ref(false)

// DOM 引用
const fileInputRef = ref(null)
const mainSvgRef = ref(null)
const viewportRef = ref(null)
const bgLayerRef = ref(null)
const drawLayerRef = ref(null)
const tempLayerRef = ref(null)
const workspaceRef = ref(null)

// 绘图核心变量
const svgMeta = { viewBox: null, width: null, height: null, hasViewBox: false }
const transform = reactive({ x: 0, y: 0, k: 1 })
let startPan = { x: 0, y: 0 }
let isDrawing = false
let currentPath = null
let points = []
let startPoint = null
let animationController = null

// 连线模式专用
let polyPoints = []
let activePolyPath = null

// 光标相关
const cursorStyle = reactive({
  display: 'none',
  left: '0px',
  top: '0px',
  width: '4px',
  height: '4px',
  backgroundColor: '#ff0044'
})

// --- 计算属性 ---
const currentCursor = computed(() => {
  if (isSpacePressed.value || currentMode.value === 'pan') return isPanning.value ? 'grabbing' : 'grab'
  return 'none' // 使用自定义光标
})

const animValueLabel = computed(() => config.timingMode === 'duration' ? '单笔时长(秒):' : '速度(像素/秒):')
const animValueStep = computed(() => config.timingMode === 'duration' ? 0.1 : 50)
const animValueMin = computed(() => 0.1)

// --- 方法：背景设置 ---
const setBgMode = (mode) => {
  config.bgMode = mode
}

// --- 方法：文件处理 ---
const triggerFileUpload = () => fileInputRef.value.click()

const handleFileChange = (e) => {
  if (e.target.files.length) processFile(e.target.files[0])
}

const handleDrop = (e) => {
  isDragOver.value = false
  if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0])
}

const processFile = (file) => {
  if (!file || (!file.type.includes('svg') && !file.name.endsWith('.svg'))) {
    alert('请上传 SVG 文件')
    return
  }
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(ev.target.result, 'image/svg+xml')
      if (doc.documentElement.nodeName === 'parsererror') throw new Error()

      const root = doc.documentElement
      svgMeta.hasViewBox = root.hasAttribute('viewBox')
      svgMeta.viewBox = root.getAttribute('viewBox')
      svgMeta.width = root.getAttribute('width')
      svgMeta.height = root.getAttribute('height')

      // 清空背景层并注入新内容
      bgLayerRef.value.innerHTML = root.innerHTML

      // 迁移根属性
      const rootAttrs = ['fill', 'stroke', 'stroke-width', 'fill-rule', 'style', 'class']
      rootAttrs.forEach(attr => {
        if (root.hasAttribute(attr)) {
          bgLayerRef.value.setAttribute(attr, root.getAttribute(attr))
        }
      })
      if (!bgLayerRef.value.getAttribute('fill')) bgLayerRef.value.setAttribute('fill', 'none')

      // 自动适配视图
      let w = 600; let h = 400
      if (svgMeta.viewBox) {
        const v = svgMeta.viewBox.split(/[\s,]+/).map(parseFloat)
        if (v.length === 4) { w = v[2]; h = v[3] }
      } else {
        w = parseFloat(svgMeta.width) || 600
        h = parseFloat(svgMeta.height) || 400
      }

      const pad = 60
      const r = workspaceRef.value.getBoundingClientRect()
      const scale = Math.min((r.width - pad) / w, (r.height - pad) / h)
      transform.k = scale > 0 ? scale : 1
      transform.x = (r.width - w * transform.k) / 2
      transform.y = (r.height - h * transform.k) / 2
      updateTransform()
    } catch (e) {
      console.error(e)
      alert('SVG 解析失败')
    }
  }
  reader.readAsText(file)
}

const fixBlackColors = () => {
  let count = 0
  if (!bgLayerRef.value) return
  bgLayerRef.value.querySelectorAll('*').forEach(el => {
    if (el.tagName === 'g' || el.tagName === 'defs') return
    const style = window.getComputedStyle(el)
    const fill = style.fill
    const attrFill = el.getAttribute('fill')
    if (fill === 'rgb(0, 0, 0)' || attrFill === '#000000' || attrFill === 'black' || !attrFill) {
      el.setAttribute('fill', 'none')
      el.style.fill = 'none'
      count++
    }
  })
  alert(`已尝试清除 ${count} 个疑似黑色区域。`)
}

// --- 方法：交互与绘图 ---
const switchMode = (mode) => {
  if (currentMode.value === 'poly' && activePolyPath) {
    finishPolyline()
  }
  currentMode.value = mode
  updateTransform()
}

const updateTransform = () => {
  if (!viewportRef.value) return
  viewportRef.value.setAttribute('transform', `translate(${transform.x}, ${transform.y}) scale(${transform.k})`)

  const modeName = { draw: '自由画笔', line: '简单直线', poly: '连续折线', pan: '移动视图' }
  const zoomPct = Math.round(transform.k * 100)
  statusBarText.value = `缩放: ${zoomPct}% | 模式: ${modeName[currentMode.value]}`

  // 更新光标大小
  const s = config.strokeWidth * transform.k
  cursorStyle.width = s + 'px'
  cursorStyle.height = s + 'px'
}

const updateBrushCursor = (e) => {
  if (currentMode.value === 'pan' || isSpacePressed.value) {
    cursorStyle.display = 'none'
    return
  }
  cursorStyle.display = 'block'
  cursorStyle.backgroundColor = config.strokeColor
  // 尺寸已经在 updateTransform 中基于缩放更新了，这里只更新位置
  const s = config.strokeWidth * transform.k
  cursorStyle.width = s + 'px'
  cursorStyle.height = s + 'px'

  if (e) {
    cursorStyle.left = e.clientX + 'px'
    cursorStyle.top = e.clientY + 'px'
  }
}

const getLocalPoint = (cx, cy) => {
  const pt = mainSvgRef.value.createSVGPoint()
  pt.x = cx
  pt.y = cy
  const gp = pt.matrixTransform(mainSvgRef.value.getScreenCTM().inverse())
  return { x: (gp.x - transform.x) / transform.k, y: (gp.y - transform.y) / transform.k }
}

const createPathEl = () => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('stroke', config.strokeColor)
  path.setAttribute('stroke-width', config.strokeWidth)
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke-linecap', 'round')
  path.setAttribute('stroke-linejoin', 'round')
  return path
}

// 鼠标事件处理
const handleMouseDown = (e) => {
  // 移动视图相关
  if (isSpacePressed.value || currentMode.value === 'pan' || e.button === 1) {
    isPanning.value = true
    startPan = { x: e.clientX, y: e.clientY }
    return
  }

  // 右键结束连线
  if (e.button === 2) {
    if (currentMode.value === 'poly' && activePolyPath) {
      finishPolyline()
    }
    return
  }

  if (e.button === 0) {
    const p = getLocalPoint(e.clientX, e.clientY)

    // 1. 连线模式
    if (currentMode.value === 'poly') {
      if (!activePolyPath) {
        const path = createPathEl()
        activePolyPath = path
        polyPoints = [p]
        path.setAttribute('d', `M ${p.x} ${p.y}`)
        tempLayerRef.value.appendChild(path)
      } else {
        polyPoints.push(p)
        updatePolylineD(p, false)
      }
      return
    }

    // 2. 拖拽绘画 (自由画笔 / 直线)
    isDrawing = true
    const path = createPathEl()
    if (currentMode.value === 'draw') {
      points = [p]
      currentPath = path
      currentPath.setAttribute('d', `M ${p.x} ${p.y}`)
      drawLayerRef.value.appendChild(path)
    } else if (currentMode.value === 'line') {
      startPoint = p
      currentPath = path
      currentPath.setAttribute('d', `M ${p.x} ${p.y} L ${p.x} ${p.y}`)
      tempLayerRef.value.appendChild(path)
    }
  }
}

const handleMouseMove = (e) => {
  updateBrushCursor(e)

  if (isPanning.value) {
    transform.x += e.clientX - startPan.x
    transform.y += e.clientY - startPan.y
    startPan = { x: e.clientX, y: e.clientY }
    updateTransform()
  } else if (currentMode.value === 'poly' && activePolyPath) {
    const p = getLocalPoint(e.clientX, e.clientY)
    updatePolylineD(p, true)
  } else if (isDrawing && currentPath) {
    const p = getLocalPoint(e.clientX, e.clientY)
    if (currentMode.value === 'draw') {
      points.push(p)
      currentPath.setAttribute('d', points.map((pt, i) => (i === 0 ? 'M' : 'L') + ` ${pt.x} ${pt.y}`).join(' '))
    } else if (currentMode.value === 'line') {
      currentPath.setAttribute('d', `M ${startPoint.x} ${startPoint.y} L ${p.x} ${p.y}`)
    }
  }
}

// 绑定在 Window 上的 MouseUp，防止拖出画布丢失状态
const handleWindowMouseUp = () => {
  if (currentMode.value === 'poly') return

  if (isDrawing && currentMode.value === 'line' && currentPath) {
    tempLayerRef.value.removeChild(currentPath)
    drawLayerRef.value.appendChild(currentPath)
  }
  isPanning.value = false
  isDrawing = false
  currentPath = null
  points = []
}

// 滚轮缩放
const handleWheel = (e) => {
  e.preventDefault()
  const d = -e.deltaY * 0.001
  const old = transform.k
  const next = Math.max(0.05, Math.min(old * (1 + d), 50))
  const rect = mainSvgRef.value.getBoundingClientRect()
  const rx = (e.clientX - rect.left - transform.x) / old
  const ry = (e.clientY - rect.top - transform.y) / old
  transform.x = e.clientX - rect.left - rx * next
  transform.y = e.clientY - rect.top - ry * next
  transform.k = next
  updateTransform()
}

// 连线逻辑
const updatePolylineD = (currentMousePos, isPreview) => {
  let d = `M ${polyPoints[0].x} ${polyPoints[0].y}`
  for (let i = 1; i < polyPoints.length; i++) {
    d += ` L ${polyPoints[i].x} ${polyPoints[i].y}`
  }
  if (isPreview) {
    d += ` L ${currentMousePos.x} ${currentMousePos.y}`
  }
  activePolyPath.setAttribute('d', d)
}

const finishPolyline = () => {
  if (!activePolyPath) return
  if (polyPoints.length < 2) {
    tempLayerRef.value.removeChild(activePolyPath)
  } else {
    let d = `M ${polyPoints[0].x} ${polyPoints[0].y}`
    for (let i = 1; i < polyPoints.length; i++) {
      d += ` L ${polyPoints[i].x} ${polyPoints[i].y}`
    }
    activePolyPath.setAttribute('d', d)
    tempLayerRef.value.removeChild(activePolyPath)
    drawLayerRef.value.appendChild(activePolyPath)
  }
  activePolyPath = null
  polyPoints = []
}

// 工具按钮
const undo = () => {
  if (currentMode.value === 'poly' && activePolyPath) {
    if (polyPoints.length > 1) {
      polyPoints.pop()
      let d = `M ${polyPoints[0].x} ${polyPoints[0].y}`
      for (let i = 1; i < polyPoints.length; i++) {
        d += ` L ${polyPoints[i].x} ${polyPoints[i].y}`
      }
      activePolyPath.setAttribute('d', d)
    } else {
      tempLayerRef.value.removeChild(activePolyPath)
      activePolyPath = null
      polyPoints = []
    }
  } else {
    if (drawLayerRef.value.lastChild) drawLayerRef.value.removeChild(drawLayerRef.value.lastChild)
  }
}

const clearCanvas = () => {
  if (confirm('清空画布?')) {
    drawLayerRef.value.innerHTML = ''
    if (activePolyPath) {
      tempLayerRef.value.removeChild(activePolyPath)
      activePolyPath = null
    }
  }
}

// --- 方法：动画 ---
const getDuration = (pathLength) => {
  if (config.timingMode === 'duration') return config.animValue * 1000
  return (pathLength / config.animValue) * 1000
}

const previewAnimation = async () => {
  if (currentMode.value === 'poly' && activePolyPath) finishPolyline()

  const paths = Array.from(drawLayerRef.value.querySelectorAll('path'))
  if (paths.length === 0) return alert('请先绘图')

  if (animationController) animationController.abort()
  animationController = new AbortController()
  const signal = animationController.signal

  const resetAllPaths = () => {
    paths.forEach(p => {
      p.getAnimations().forEach(a => a.cancel())
      const len = p.getTotalLength()
      p.style.strokeDasharray = len
      p.style.strokeDashoffset = len
      p.style.transition = 'none'
      void p.offsetWidth
    })
  }

  const animatePath = (path, duration) => {
    return new Promise((resolve) => {
      const len = path.getTotalLength()
      const anim = path.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration, easing: config.easingMode, fill: 'forwards' }
      )
      anim.onfinish = resolve
    })
  }

  try {
    do {
      resetAllPaths()
      await new Promise(r => requestAnimationFrame(r))
      if (signal.aborted) break

      if (config.animMode === 'simultaneous') {
        await Promise.all(paths.map(p => animatePath(p, getDuration(p.getTotalLength()))))
      } else {
        for (const p of paths) {
          if (signal.aborted) break
          await animatePath(p, getDuration(p.getTotalLength()))
        }
      }
      if (signal.aborted) break
      if (config.loopMode === 'infinite') await new Promise(r => setTimeout(r, 800))
    } while (config.loopMode === 'infinite' && !signal.aborted)
  } catch (e) { console.log('Animation stopped') }
}

// --- 方法：导出 ---
const getPathXml = (p, className) => {
  return `<path d="${p.getAttribute('d')}" 
            stroke="${p.getAttribute('stroke')}" 
            stroke-width="${p.getAttribute('stroke-width')}" 
            fill="none" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="${className}" />\n`
}

const downloadSvg = () => {
  if (currentMode.value === 'poly' && activePolyPath) finishPolyline()

  let headerAttrs = ''
  if (svgMeta.hasViewBox && svgMeta.viewBox) {
    headerAttrs = `viewBox="${svgMeta.viewBox}"`
    if (svgMeta.width) headerAttrs += ` width="${svgMeta.width}"`
    if (svgMeta.height) headerAttrs += ` height="${svgMeta.height}"`
  } else if (svgMeta.width && svgMeta.height) {
    headerAttrs = `width="${svgMeta.width}" height="${svgMeta.height}" viewBox="0 0 ${svgMeta.width} ${svgMeta.height}"`
  } else {
    let bbox = bgLayerRef.value.getBBox()
    if (bbox.width === 0) bbox = drawLayerRef.value.getBBox()
    if (bbox.width === 0) bbox = { x: 0, y: 0, width: 800, height: 600 }
    headerAttrs = `viewBox="${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}" width="${bbox.width}" height="${bbox.height}"`
  }

  const cleanBg = bgLayerRef.value.cloneNode(true)
  cleanBg.querySelectorAll('*').forEach(el => {
    if (el.tagName === 'g' || el.tagName === 'defs') return
    if (!el.getAttribute('fill')) el.setAttribute('fill', 'none')
  })
  cleanBg.setAttribute('fill', 'none')

  const paths = Array.from(drawLayerRef.value.querySelectorAll('path'))
  let css = '<style>'
  let pathsXml = ''

  const pathData = paths.map((p, i) => {
    const len = Math.ceil(p.getTotalLength())
    let dur = 0
    if (config.timingMode === 'duration') dur = config.animValue
    else dur = parseFloat((len / config.animValue).toFixed(3))
    if (dur < 0.01) dur = 0.01
    return { id: i, len, dur, el: p }
  })

  const { animMode, loopMode, easingMode } = config

  if (animMode === 'simultaneous') {
    const iter = loopMode === 'infinite' ? 'infinite' : '1'
    pathData.forEach(d => {
      const animName = `draw-${d.id}`
      css += `
        @keyframes ${animName} { to { stroke-dashoffset: 0; } }
        .p${d.id} {
            stroke-dasharray: ${d.len};
            stroke-dashoffset: ${d.len};
            animation: ${animName} ${d.dur}s ${easingMode} ${iter} forwards;
        }
      `
      pathsXml += getPathXml(d.el, `p${d.id}`)
    })
  } else {
    if (loopMode === 'once') {
      let cumulativeDelay = 0
      pathData.forEach(d => {
        const animName = `draw-${d.id}`
        css += `
            @keyframes ${animName} { to { stroke-dashoffset: 0; } }
            .p${d.id} {
                stroke-dasharray: ${d.len};
                stroke-dashoffset: ${d.len};
                animation: ${animName} ${d.dur}s ${easingMode} forwards;
                animation-delay: ${cumulativeDelay.toFixed(3)}s;
            }
        `
        pathsXml += getPathXml(d.el, `p${d.id}`)
        cumulativeDelay += d.dur
      })
    } else {
      const totalPathTime = pathData.reduce((acc, cur) => acc + cur.dur, 0)
      const pauseTime = 1.0
      const totalCycle = totalPathTime + pauseTime
      let currentTime = 0
      pathData.forEach(d => {
        const animName = `draw-inf-${d.id}`
        const startPct = (currentTime / totalCycle * 100).toFixed(2)
        const endPct = ((currentTime + d.dur) / totalCycle * 100).toFixed(2)
        css += `
            @keyframes ${animName} {
                0%, ${startPct}% { stroke-dashoffset: ${d.len}; }
                ${endPct}%, 100% { stroke-dashoffset: 0; }
            }
            .p${d.id} {
                stroke-dasharray: ${d.len};
                stroke-dashoffset: ${d.len};
                animation: ${animName} ${totalCycle.toFixed(3)}s ${easingMode} infinite;
            }
        `
        pathsXml += getPathXml(d.el, `p${d.id}`)
        currentTime += d.dur
      })
    }
  }
  css += '</style>'

  const finalSvg = `
<svg xmlns="http://www.w3.org/2000/svg" ${headerAttrs} fill="none">
${css}
<g id="bg" fill="none">${cleanBg.innerHTML}</g>
<g id="draw">${pathsXml}</g>
</svg>`

  const blob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `svg-anim-pro-${Date.now()}.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// --- 生命周期与全局事件 ---
const handleKeydown = (e) => {
  if (e.code === 'Space') {
    isSpacePressed.value = true
  }
  if (e.code === 'Escape' || e.code === 'Enter') {
    if (currentMode.value === 'poly' && activePolyPath) finishPolyline()
  }
}

const handleKeyup = (e) => {
  if (e.code === 'Space') {
    isSpacePressed.value = false
  }
}

const handleResize = () => {
  if (workspaceRef.value && mainSvgRef.value) {
    const r = workspaceRef.value.getBoundingClientRect()
    mainSvgRef.value.setAttribute('width', r.width)
    mainSvgRef.value.setAttribute('height', r.height)
    mainSvgRef.value.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`)
  }
}

onMounted(() => {
  window.addEventListener('mouseup', handleWindowMouseUp)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('keyup', handleKeyup)
  window.addEventListener('resize', handleResize)
  // 初始化 resize
  nextTick(() => handleResize())
})

onUnmounted(() => {
  window.removeEventListener('mouseup', handleWindowMouseUp)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('keyup', handleKeyup)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="font-sans m-0 flex h-screen bg-[#121212] text-[#e0e0e0] overflow-hidden select-none">
    <!-- 笔触光标 -->
    <div
      class="fixed pointer-events-none rounded-full border border-white/90 shadow-sm z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-100 ease-linear"
      :style="cursorStyle"
    />

    <!-- 左侧控制栏 -->
    <aside class="w-[320px] bg-[#1e1e1e] border-r border-[#333] p-5 flex flex-col gap-[15px] z-10 overflow-y-auto">
      <h2 class="m-0 mb-[5px] text-[1.2rem] text-white flex items-center gap-2">
        SVG Animation<span class="text-[0.7rem] bg-[#10b981] text-black px-1.5 py-0.5 rounded font-bold">SVG动画生成器</span>
      </h2>

      <!-- 1. 底图设置 -->
      <div class="flex flex-col gap-2 pb-[15px] border-b border-[#333]">
        <label class="text-[0.85rem] text-[#a0a0a0] font-medium flex justify-between">1. 底图设置</label>
        <input
          type="file"
          ref="fileInputRef"
          accept=".svg"
          class="hidden"
          @change="handleFileChange"
        >

        <div
          class="border-2 border-dashed border-[#444] rounded-lg p-5 text-center cursor-pointer transition-all bg-[#252525] relative hover:border-blue-500 hover:bg-[#2a2a2a]"
          :class="{ 'border-[#10b981] bg-[rgba(16,185,129,0.1)] scale-98': isDragOver }"
          @click="triggerFileUpload"
          @dragenter.prevent="isDragOver = true"
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop.prevent="handleDrop"
        >
          <span class="text-2xl block mb-1">📂</span>
          <span class="text-[0.8rem] text-[#888] break-all pointer-events-none">{{ fileName }}</span>
        </div>

        <div class="flex gap-[5px] mt-2">
          <button @click="fixBlackColors" class="flex-1 text-[0.8rem] bg-[#f59e0b] text-black hover:bg-[#d97706] btn-base">
            预览去黑
          </button>
        </div>
        <div class="flex gap-[5px] mt-[5px]">
          <button @click="setBgMode('dark')" :class="['flex-1 text-[0.8rem] btn-tool', config.bgMode === 'dark' ? 'active' : '']">
            🌑 深色
          </button>
          <button @click="setBgMode('light')" :class="['flex-1 text-[0.8rem] btn-tool', config.bgMode === 'light' ? 'active' : '']">
            ☀️ 浅色
          </button>
          <button @click="setBgMode('grid')" :class="['flex-1 text-[0.8rem] btn-tool', config.bgMode === 'grid' ? 'active' : '']">
            🏁 透明
          </button>
        </div>
      </div>

      <!-- 2. 绘图工具 -->
      <div class="flex flex-col gap-2 pb-[15px] border-b border-[#333]">
        <label class="text-[0.85rem] text-[#a0a0a0] font-medium">2. 绘图工具</label>
        <div class="grid grid-cols-2 gap-2">
          <button @click="switchMode('draw')" :class="['btn-tool', currentMode === 'draw' ? 'active' : '']">
            ✏️ 自由画笔
          </button>
          <button @click="switchMode('line')" :class="['btn-tool', currentMode === 'line' ? 'active' : '']">
            📏 简单直线
          </button>
          <button @click="switchMode('poly')" :class="['btn-tool', currentMode === 'poly' ? 'active' : '']">
            🔗 连续折线
          </button>
          <button @click="switchMode('pan')" :class="['btn-tool', currentMode === 'pan' ? 'active' : '']">
            ✋ 移动视图
          </button>
        </div>
        <div class="text-[0.75rem] text-[#666] mt-1 px-1">
          * 连线模式：点击定点，右键结束
        </div>
      </div>

      <!-- 画笔样式 -->
      <div class="flex flex-col gap-2 pb-[15px] border-b border-[#333]">
        <label class="text-[0.85rem] text-[#a0a0a0] font-medium">画笔样式</label>
        <div class="flex items-center gap-2 mb-2">
          <input type="color" v-model="config.strokeColor" class="bg-[#333] border border-[#444] rounded h-[30px] w-[50px] cursor-pointer p-0.5">
          <div class="flex-1">
            <input
              type="range"
              v-model.number="config.strokeWidth"
              min="1"
              max="80"
              class="w-full h-2 bg-[#444] rounded-lg appearance-none cursor-pointer"
            >
          </div>
          <span class="text-[0.8rem] w-[25px] text-right">{{ config.strokeWidth }}</span>
        </div>
        <div class="flex gap-[5px]">
          <button @click="undo" class="flex-1 bg-[#4b5563] hover:bg-[#374151] btn-base">
            ↩️ 撤销
          </button>
          <button @click="clearCanvas" class="flex-1 bg-[#4b5563] hover:bg-[#374151] btn-base">
            🗑️ 清空
          </button>
        </div>
      </div>

      <!-- 3. 动画配置 -->
      <div class="flex flex-col gap-2 pb-[15px] border-b border-[#333]">
        <label class="text-[0.85rem] text-[#a0a0a0] font-medium">3. 动画配置</label>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="text-[0.7rem] text-[#a0a0a0] block mb-1">播放顺序</label>
            <select v-model="config.animMode" class="w-full bg-[#333] border border-[#444] text-white p-1.5 rounded text-[0.8rem] outline-none">
              <option value="sequential">
                顺序播放
              </option>
              <option value="simultaneous">
                同时播放
              </option>
            </select>
          </div>
          <div>
            <label class="text-[0.7rem] text-[#a0a0a0] block mb-1">循环模式</label>
            <select v-model="config.loopMode" class="w-full bg-[#333] border border-[#444] text-white p-1.5 rounded text-[0.8rem] outline-none">
              <option value="once">
                播放一次
              </option>
              <option value="infinite">
                整体循环
              </option>
            </select>
          </div>
        </div>

        <div class="mb-2">
          <label class="text-[0.7rem] text-[#a0a0a0] block mb-1">时间控制模式</label>
          <select v-model="config.timingMode" class="w-full bg-[#333] border border-[#444] text-white p-1.5 rounded text-[0.8rem] outline-none">
            <option value="duration">
              固定时长 (每笔固定秒数)
            </option>
            <option value="speed">
              固定速度 (匀速书写)
            </option>
          </select>
        </div>

        <div class="flex items-center gap-[5px] mb-2">
          <label class="text-[0.7rem] text-[#a0a0a0]">{{ animValueLabel }}</label>
          <input
            type="number"
            v-model.number="config.animValue"
            :step="animValueStep"
            :min="animValueMin"
            class="w-[60px] bg-[#333] border border-[#444] text-white p-1 rounded text-[0.8rem] outline-none"
          >
        </div>

        <div class="mb-2">
          <label class="text-[0.7rem] text-[#a0a0a0] block mb-1">速度曲线 (Easing)</label>
          <select v-model="config.easingMode" class="w-full bg-[#333] border border-[#444] text-white p-1.5 rounded text-[0.8rem] outline-none">
            <option value="ease-in-out">
              平滑 (Ease-In-Out)
            </option>
            <option value="linear">
              匀速 (Linear)
            </option>
            <option value="ease-in">
              先慢后快 (Ease-In)
            </option>
            <option value="ease-out">
              先快后慢 (Ease-Out)
            </option>
          </select>
        </div>

        <button @click="previewAnimation" class="mt-[5px] bg-[#10b981] text-black font-bold hover:bg-[#059669] btn-base">
          ▶️ 预览动画
        </button>
      </div>

      <!-- 导出 -->
      <div class="flex flex-col border-none">
        <button @click="downloadSvg" class="bg-blue-500 hover:bg-blue-600 btn-base">
          💾 导出
        </button>
      </div>
    </aside>

    <!-- 画布区域 -->
    <div
      ref="workspaceRef"
      class="flex-1 relative overflow-hidden"
      :style="{ cursor: currentCursor }"
      :class="[
        config.bgMode === 'dark' ? 'bg-dark-pattern' : '',
        config.bgMode === 'light' ? 'bg-light-pattern' : '',
        config.bgMode === 'grid' ? 'bg-grid-pattern' : ''
      ]"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @wheel="handleWheel"
      @contextmenu.prevent
      @dblclick="finishPolyline"
    >
      <svg
        id="mainSvg"
        ref="mainSvgRef"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full block"
      >
        <g id="viewport" ref="viewportRef">
          <g id="bg-layer" ref="bgLayerRef" />
          <g id="draw-layer" ref="drawLayerRef" />
          <g id="temp-layer" ref="tempLayerRef" />
        </g>
      </svg>

      <!-- 状态栏 -->
      <div class="absolute bottom-2.5 right-5 bg-black/70 px-3 py-1.5 rounded-full text-xs text-[#ccc] pointer-events-none backdrop-blur-sm z-50">
        {{ statusBarText }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 复杂背景纹理使用 CSS 类定义，UnoCSS 虽然强大但在这种复杂渐变上写起来太长 */
.bg-dark-pattern {
  background-size: 20px 20px;
  background-color: #121212;
  background-image: radial-gradient(#333333 1px, transparent 1px);
}
.bg-light-pattern {
  background-size: 20px 20px;
  background-color: #f0f0f0;
  background-image: radial-gradient(#cccccc 1px, transparent 1px);
}
.bg-grid-pattern {
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
  background-size: 20px 20px;
  background-color: #eeeeee;
  background-image:
    linear-gradient(45deg, #cccccc 25%, transparent 25%),
    linear-gradient(-45deg, #cccccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #cccccc 75%),
    linear-gradient(-45deg, transparent 75%, #cccccc 75%);
}

/* 按钮通用样式 */
.btn-base {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  color: white;
  transition: 0.2s;
  cursor: pointer;
  gap: 5px;
}
.btn-base:hover { transform: translateY(-1px); }
.btn-base:active { transform: translateY(0); }
.btn-tool {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem; /* 对应 p-2 */
  font-size: 0.75rem; /* 对应 text-xs */
  border: none;
  border-radius: 0.25rem; /* 对应 rounded */
  color: #cccccc;
  background-color: #333333;
  transition: background-color 0.15s, color 0.15s; /* 对应 transition-colors */
  line-height: 1rem;
  cursor: pointer;
  gap: 0.25rem; /* 对应 gap-1 */
}
.btn-tool:hover {
  background-color: #444444;
}
.btn-tool.active {
  color: white;
  background-color: #3b82f6; /* 对应 bg-blue-500 */
}
::-webkit-scrollbar {
  width: 10px;  /* 纵向滚动条宽度 */
  height: 10px; /* 横向滚动条高度 */
}

/* 2. 滚动条轨道 (背景透明，显得更干净) */
::-webkit-scrollbar-track {
  background: transparent;
}

/* 3. 滚动条滑块 (核心样式) */
::-webkit-scrollbar-thumb {
  /* 关键：利用边框和背景裁剪实现“内部悬浮”效果 */
  border: 2px solid transparent;
  border-radius: 10px;    /* 完全圆角 */
  background-color: #444444; /* 默认深灰，比背景稍亮 */
  background-clip: content-box;
}

/* 4. 鼠标悬停在滑块上 */
::-webkit-scrollbar-thumb:hover {
  border: 2px solid transparent;
  background-color: #666666; /* 悬停变亮 */
}

/* 5. 激活/拖拽时的状态 (可选，增加交互感) */
::-webkit-scrollbar-thumb:active {
  background-color: #3b82f6; /* 拖拽时变成你的主题蓝 */
}

/* --- 适配 Firefox (Firefox 使用标准属性) --- */
* {
  scrollbar-width: thin;       /* 细滚动条 */
  scrollbar-color: #444444 transparent; /* 滑块颜色 轨道颜色 */
}
</style>
