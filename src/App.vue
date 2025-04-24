<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LooginVue from './components/layout/loogin.vue'
import SingUpVue from './components/layout/SingUp.vue'
</script>

<template>
  <NavHeaderBar></NavHeaderBar>
  <RouterView />
</template>

<style scoped></style>
