<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavHeaderBarVue from './components/layout/NavHeaderBar.vue'
import NavSideBarVue from './components/layout/NavSideBar.vue'
import FooterBarVue from './components/layout/FooterBar.vue'
import LooginVue from './components/layout/loogin.vue'
import SingUpVue from './components/layout/SingUp.vue'
</script>

<template>
  <SingUpVue></SingUpVue>
  <RouterView />
</template>

<style scoped></style>
