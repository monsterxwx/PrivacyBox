<template>
  <div class="flex flex-col border-b border-slate-100 pb-2">
    <span class="text-xs font-bold text-slate-400 uppercase mb-1">{{ label }}</span>
    <div class="flex justify-between items-center group">
      <span class="font-mono text-slate-800 font-medium truncate select-all">{{ value }}</span>
      <button @click="copy" class="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 hover:text-indigo-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        ><rect
          width="14"
          height="14"
          x="8"
          y="8"
          rx="2"
          ry="2"
        /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['label', 'value'])
const copy = () => navigator.clipboard.writeText(props.value)
</script>
