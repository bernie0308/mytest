<template>
  <div class="flex navbar">
    <div class="menu flex">
      <div class="logo-area" @click="toIndex">
        <!-- <img class="logo" src="https://yuanqi-1259411933.cos.ap-guangzhou.myqcloud.com/meta/genki-logo-light.png" alt="logo"> -->
        <div class="title">Genki Forest</div>
      </div>
      <!-- <div class="col-line" /> -->
      <div class="menu-list">
        <a-menu v-model:selectedKeys="activeMenu" mode="horizontal" @click="menuClickHandler">
          <template v-for="(item, index) in navbarList" :key="item.path">
            <a-sub-menu v-if="Array.isArray(item.children) && item.children.length > 0" :key="item.path">
              <template #title>{{ item.title }}</template>
              <a-menu-item v-for="(subItem, index) in item.children" :key="subItem.id">{{ subItem.title }}</a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :key="item.path">
              {{ item.title }}
            </a-menu-item>
          </template>
          <!-- <a-menu-item v-for="(item, index) in navbarList" :key="item.path">
            {{ item.title }}
          </a-menu-item> -->
        </a-menu>
      </div>
    </div>

    <div class="navbar-dropdown">
      <a-dropdown>
        <div class="ant-dropdown-link" @click.prevent>
          <a-avatar :src="avatar" size="small">
            <template v-if="!avatar" #icon>
              <User-outlined />
            </template>
          </a-avatar>
          {{ username }}
          <Down-outlined />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <template #icon>
                <Appstore-add-outlined />
              </template>
              <a href="javascript:;" @click="handleSelect('auth')">权限申请</a>
            </a-menu-item>
            <a-menu-item>
              <template #icon>
                <Logout-outlined />
              </template>
              <a href="javascript:;" @click="handleSelect('logout')">注销登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogoutOutlined, DownOutlined, UserOutlined, AppstoreAddOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'Navabar',
   components: {
    LogoutOutlined,
    DownOutlined,
    UserOutlined,
    AppstoreAddOutlined
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    userinfo: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, ctx?: any) {
    const route = useRoute()
    const router = useRouter()
    const currentPath = window.location.pathname
    const routes = JSON.parse(JSON.stringify(router.options.routes))
    const firstPath = currentPath.split('/')[1]
    const activeMenu = ref<string[]>([firstPath ? `/${firstPath}` : '/'])
    const navbarList = routes.filter(item => item.name && !item.hidden).map(route => { return { ...route, children: [] } })
    const username = ref<string>(props.userinfo.name)
    const avatar = ref<string>(props.userinfo.avatar)

    watchEffect(() => {
      username.value = props.userinfo.name
      avatar.value = props.userinfo.avatar
    })
    
    return {
      activeMenu,
      navbarList,
      username,
      avatar,
      menuClickHandler ({ item, key, keyPath }) {
        router.push({ path: key })
      },
      handleSelect (key) {
        if (key === 'logout') {
          ctx.emit('logout', key)
        }
      },
      toIndex() {
        router.push('/')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.navbar {
  box-shadow: 0 2px 10px rgba(211,211,211,.9);
  justify-content: space-between;
  height: 60px;
  position: fixed;
  top: 0;
  z-index: 1000;
  background-color: white;
  width: 100%;
  display: flex;
  align-items: center;
  min-width: 1100px;
  .menu {
    margin-left: 50px;
    height: 100%;
  }
  .col-line {
    width: 1px;
    background: #eee;
    margin: 10px 60px;
  }
  :deep(.logo-area) {
    display: flex;
    align-items: center;
    cursor: pointer;
    .logo {
      width: 130px;
      margin: 15px 0;
    }
    .title {
      font-family: Poppins;
      font-size: 18px;
      font-weight: 600;
      margin: 15px 0 2px 0;
      color: #000;
    }
  }
  :deep(.menu-list) {
    margin-left: 100px;
    padding-top: 5px;
    .ant-menu-horizontal {
      border-bottom: none;
    }
  }
  .navbar-dropdown {
    padding: 0 20px;
    margin-right: 5%;
    .ant-dropdown-link {
      cursor: pointer;
    }
  }
  .down {
    margin-left: 5px;
  }
}
</style>
