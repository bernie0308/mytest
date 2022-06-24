<template>
  <div class="home-container">
    <img class="banner" src="https://yuanqi-1259411933.cos.ap-guangzhou.myqcloud.com/meta/images/index-bg.png" />
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {useStore} from "vuex"
export default defineComponent({
   setup() {
    const router = useRouter();
    let {state, commit} = useStore();
    onMounted(() => {
      // 打印
      const store = router.currentRoute.value.query?.store
      if (['au' ,'us', 'umys','dev'].includes(store)) {
        commit('user/setStore', router.currentRoute.value.query?.store)
      } else {
        commit('user/setStore', 'us')
      }
      
    })
   }
})
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  min-height: calc(100vh - 60px);
  .banner {
    width: 100%;
  }
}
</style>