<template>
  <div class="flex navbar">
    <div class="menu flex">
      <div class="logo-area">
        <img class="logo" src="@/assets/logo.jpg" alt="logo">
        <div class="title">Genki Meta</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}

.navbar {
  box-shadow: 0 2px 10px rgba(211, 211, 211, .9);
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
    margin-left: 100px;
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
      width: 40px;
      margin: 15px 0;
      margin-right: 15px;
    }

    .title {
      font-family: Poppins;
      font-size: 22px;
      font-weight: 600;
      margin: 15px 0;
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
