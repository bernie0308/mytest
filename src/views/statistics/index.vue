<template>
  <div class="module-container">
    <div class="sidebar-area">
      <Sidebar :menu="menu" />
    </div>
    <div class="content-area">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

export default {
  components: { Sidebar },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const allRouters = router.getRoutes()
    const currentPathName = route.path.split('/')[1]
    const targetRoutes = allRouters.find(item => item.name === currentPathName)
    return {
      menu: targetRoutes ? targetRoutes.children : []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>