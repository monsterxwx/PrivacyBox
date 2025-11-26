<template>
  <div class="w-100% h-100vh">
    <RouterView />
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'

</script>
<style>
* {
  box-sizing: border-box;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
