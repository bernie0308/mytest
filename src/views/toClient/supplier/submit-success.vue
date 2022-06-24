<template>
  <div class="container">
    <div class="main-container">
      <div class="form-header">
        <a-typography-title :level="4">元气森林项目供应商入库申请表</a-typography-title>
      </div>
      <a-divider style="height: 2px; background-color: #409eff;margin-top: 0;" />
      <a-result status="success" title="申请提交成功">
      </a-result>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.container {
  background-color: #F2F2F2;
  min-height: 100vh;
  padding: 60px 0;

  .main-container {
    max-width: 1200px;
    background-color: #fff;
    margin: 16px auto 0;
    padding: 24px;

    .form-header {
      text-align: center;
    }
  }
}
</style>