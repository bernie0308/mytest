<template>
  <a-form
    ref="searchForm"
    class="search-form"
    layout="inline"
    :model="formState"
  >
    <a-form-item v-for="(field, key) in formData" :key="key">
      <a-input 
        v-if="field.type === 'input'"
        v-model:value="formState[key]"
        :placeholder="field.placeholder || '请填写'"
        :style="{ width: field.width || '200px' }"
        allowClear
        @blur="handleInputBlur"
      >
      </a-input>
      <a-select
        v-if="field.type === 'select'"
        v-model:value="formState[key]"
        allowClear
        :placeholder="field.placeholder || '请选择'"
        :style="{ width: field.width || '200px' }"
        :mode="field.mode || undefined"
        @change="handleSelectChange"
      >
        <template v-if="Array.isArray(field.options)">
          <a-select-option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option.value" :disabled="option.disabled">{{ option.label }}</a-select-option>
        </template>
      </a-select>
      <a-range-picker
        v-if="field.type === 'daterange'"
        v-model:value="formState[key]"
        :show-time="field.showTime"
        :placeholder="Array.isArray(field.placeholder) ? field.placeholder : undefined"
        @change="handleDaterangeChange"
      />
    </a-form-item>

    <div v-show="advanceVisible" class="advance-area">
      <a-form-item v-for="(field, key) in advanceData" :key="key">
        <a-input 
          v-if="field.type === 'input'"
          v-model:value="formState[key]"
          :placeholder="field.placeholder || '请填写'"
          :style="{ width: field.width || '200px' }"
          allowClear
          @blur="handleInputBlur"
        >
        </a-input>
        <a-select
          v-if="field.type === 'select'"
          v-model:value="formState[key]"
          allowClear
          :placeholder="field.placeholder || '请选择'"
          :style="{ width: field.width || '200px' }"
          @change="handleSelectChange"
        >
          <template v-if="Array.isArray(field.options)">
            <a-select-option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option.value" :disabled="option.disabled">{{ option.label }}</a-select-option>
          </template>
        </a-select>
        <a-range-picker
          v-if="field.type === 'daterange'"
          v-model:value="formState[key]"
          :show-time="field.showTime"
          :placeholder="Array.isArray(field.placeholder) ? field.placeholder : undefined"
          @change="handleDaterangeChange"
        />
      </a-form-item>
    </div>

    <a-form-item>
      <a-button size="medium" type="primary" @click="search">
        <template #icon><search-outlined /></template>
        查询
      </a-button>&nbsp;
      <a-button size="medium" type="default" @click="reset">
        <template #icon><reload-outlined /></template>
        重置
      </a-button>&nbsp;
      <a-button v-if="Object.keys(advanceData).length > 0" type="link" @click="handleAdvance">
        <template #icon>
          <up-outlined v-if="advanceVisible" />
          <down-outlined v-else />
        </template>
        高级搜索
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue';
import type { Ref } from 'vue';

export default defineComponent({
  emits: ['search', 'reset'],
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    advanceData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, ctx) {
    const formState: Record<string, any> = reactive({});
    const advanceVisible: Ref<boolean> = ref(false)
    const searchForm: Ref = ref(null)
    const init = () => {
      for(let key in props.formData) {
        const field = props.formData[key]
        if (field.mode === 'multiple') {
          formState[key] = field.defaultValue || []
        } else {
          formState[key] = field.defaultValue || null
        }
      }
    }
    const search = () => {
      ctx.emit('search', formState)
    }
    const reset = () => {
      init()
      ctx.emit('reset', formState)
    }
    const handleAdvance = () => {
      advanceVisible.value = !advanceVisible.value
    }
    const handleSelectChange = value => {
      ctx.emit('search', formState)
    }
    const handleInputBlur = value => {
      ctx.emit('search', formState)
    }
    const handleDaterangeChange = value => {
      ctx.emit('search', formState)
    }

    watch(() => props.formData, (data: Record<string, any>) => {
      console.log('search-watch', data)
    }, { deep: true })

    init()
    return {
      formState,
      advanceVisible,
      searchForm,
      init,
      search,
      reset,
      handleAdvance,
      handleInputBlur,
      handleSelectChange,
      handleDaterangeChange
    };
  },
});
</script>

<style lang="scss" scoped>
.search-form {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  .advance-area {
    display: flex;
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    z-index: 990;
    background: #fff;
    animation: fadeIn;
    animation-duration: 0.2s;
  }
  :deep(.ant-form-item) {
    margin-bottom: 10px;
  }
}
</style>