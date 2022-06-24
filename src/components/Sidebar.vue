<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    style="width: 256px"
    mode="inline"
    @click="handleClick"
  >
    <a-menu-item v-for="(item, index) in menu" :key="item.path">
      <template v-if="item.icon" #icon>
        <component :is="item.icon" /> 
      </template>
      {{ item.title }}
    </a-menu-item>
  </a-menu>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const selectedKeys = ref([route.path])
    const handleClick = menuInfo => {
      console.log('menuInfo', menuInfo)
      router.push(menuInfo.key)
    }
    return {
      selectedKeys,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.ant-menu-sub.ant-menu-inline) {
  background: #fff;
}
.ant-menu-inline {
  border-right: none;
}
</style> 