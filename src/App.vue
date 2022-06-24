<template>
  <a-config-provider :locale="locale">
    <template v-if="!navbarVisible">
      <router-view />
    </template>
    <template v-else>
      <Navbar :data="navbarData" :userinfo="userinfo" @logout="ssoLogout" />
      <div class="main">
        <div class="container">
          <router-view />
        </div>
      </div>
    </template>
  </a-config-provider>
</template>

<script lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import { ssoLogout } from '@/sso'
import store from './store'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

import type { Ref } from 'vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  setup(props, ctx) {
    const userinfo = reactive({
      name: computed(() => store.getters.name),
      avatar: computed(() => store.getters.avatar)
    })
    const currentPath = window.location.pathname
    const navbarData = []
    const navbarVisible: Ref<boolean> = ref(!currentPath.includes('/to-client'))
    watch(() => store.getters.navbarVisible, (value) => {
      navbarVisible.value = value
    })
    return {
      locale: zhCN,
      navbarVisible,
      userinfo,
      navbarData,
      ssoLogout,
      currentPath
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/global.scss';

.main {
  background: rgba(0, 0, 0, 0.015);
  padding-top: 60px;
  .container {
    margin: 0 auto;
    // max-width: 1550px;
    // min-width: 1160px;
    min-height: calc(100vh - 60px);
  }
}
</style>
