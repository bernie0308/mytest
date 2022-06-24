<template>
  <div class="business-wrap">
    <div>
      <Search :formData="formData" @search="handleSearch" @reset="handleReset"/>
    </div>
    <a-button type="primary" class="add-btn" @click="handleClick('add')">+ 新建</a-button>
    <a-table :columns="columns" :data-source="refData.mediaData" :pagination="pagination">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span class="operation-btn" @click="handleClick('edit',record)">编辑</span>
            <span class="operation-btn del-btn" @click="handleClick('del',record)">删除</span>
          </div>
        </template>
      </template>
    </a-table>
    <a-modal v-model:visible="visible" :title="modalTitle" ok-text="确定" cancel-text="取消" @ok="handleOk">
      <div v-if="clickType === 'del'">{{ delContent }}</div>
      <div v-else>
        <a-form
          v-if="visible"
          ref="formRef"
          labelAlign="left"
          :model="formState"
          name="basic"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
        >
          <a-form-item
            label="媒体渠道名称"
            name="mediaTitle"
            :rules="[{ required: clickType !== 'del', message: '媒体渠道名称不能为空' }]"
          >
            <a-input v-model:value="formState.mediaTitle" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { getMediaList, addMediaType, editMediaType, delMediaType } from '@/api/config';
import Search from '@/components/genki/Search.vue'
const columns = [
  {
    title: '媒体名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    sorter: (a: DataItem, b: DataItem) => new Date(a.create_time).getTime() - new Date(b.create_time).getTime(),
  },
  {
    title: '更改时间',
    dataIndex: 'update_time',
    key: 'update_time',
    sorter: (a: DataItem, b: DataItem) => new Date(a.update_time).getTime() - new Date(b.update_time).getTime(),
  },
   {
    title: '操作者',
    dataIndex: 'update_by',
    key: 'update_by',
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
];
interface DataItem {
  id: number;
  name: string;
  create_time: string;
  update_time: string;
  update_by: string,
}
interface FormState {
  mediaTitle: string;
}
export default defineComponent({
  components: {
    Search
  },
  setup() {
    const refData = reactive({
      mediaData: [],
      updateTime: []
    })
    const formData = reactive({
      media_name: {
        type: 'input',
        label: '媒体名称',
        placeholder: '请输入媒体名称'
      },
      update_time: {
        type: 'daterange',
        showTime: true,
        label: '更改时间',
        placeholder: ['请选择更改起始时间', '请选择更改截至时间']
      }
    })
    const modalTitle = ref<String>('新建媒体渠道')
    const visible = ref<boolean>(false)
    const clickType = ref<String>('add')
    const formRef = ref<FormInstance>();
    const mediaName = ref<String>('')
    const updateTime:Record<string, any> = reactive([])
    const id = ref<Number>(0)
    const paginationReactive = reactive({
      current: 1,
      defaultPageSize: 10,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      total: 0,
      showTotal: (total:number, current:number, defaultPageSize:number) => `共${total}条记录`,
      onChange: (page:any, pageSize:any) => {
        paginationReactive.current = page 
        paginationReactive.defaultPageSize == pageSize
        getMediaData(false)
      },
    })
    const formState = reactive<FormState>({
      mediaTitle: '',
    });
    const handleReset = () => {
      mediaName.value = ''
      refData.updateTime = []
      getMediaData(true)
    }
    const handleSearch = (formState: Record<string, any>  = {}) => {
      refData.updateTime = []
      mediaName.value = ''
      mediaName.value = formState.media_name
      formState.update_time && formState.update_time.map((i:any) => {
        refData.updateTime.push(i.$d.toLocaleDateString().replace(/\//g, '-') + ' ' + i.$d.toLocaleTimeString())
      })
      getMediaData(true)
    }
    const handleClick = async (val:string, record?:any) => {
      console.log(record)
      clickType.value = val
      formState.mediaTitle = ''
      switch (val) {
        case 'add':
          id.value = 0
          modalTitle.value = '新建媒体渠道'
          break;
        case 'edit':
          id.value = record.id
          formState.mediaTitle = record.name
          modalTitle.value = '编辑媒体渠道'
          break;
        case 'del':
          id.value = record.id
          modalTitle.value = '确定删除媒体渠道'
          break;
        default:
          break;
      }
      visible.value = true
    }
    const handleOk = async () => {
      if (clickType.value === 'del') {
         delMediaData()
      } else {
        const valid = await formRef.value.validateFields()
        if (valid) {
          switch (clickType.value) {
            case 'add':
              addMediaData()
              break;
            case 'edit':
              editMediaData()
              break;
            default:
              break;
          }
        }
      }
      visible.value = false
    }
    // 获取媒体类型列表
    const getMediaData = (isReset: Boolean) => {
      if (isReset) {
        paginationReactive.current = 1
      }
      const params = {
        page_num: paginationReactive.current,
        page_size: paginationReactive.defaultPageSize,
        name: mediaName.value,
        update_time: refData.updateTime
      }
      console.log(params.update_time)
      getMediaList(params).then((res:any) => {
        paginationReactive.total = res.total
        refData.mediaData = res.data
      })
    }
    getMediaData(true)
    // 新建媒体类型
    const addMediaData = () => {
      addMediaType({ name: formState.mediaTitle }).then(() => {
        getMediaData(true)
      })
    }
    // 编辑媒体类型
    const editMediaData = () => {
      editMediaType({ id: id.value, name: formState.mediaTitle }).then(() => {
        getMediaData(false)
      })
    }
    // 删除媒体类型
    const delMediaData = () => {
      delMediaType({ id: id.value }).then(() => {
        getMediaData(true)
      })
    }
    return {
      refData,
      columns,
      formRef,
      id,
      pagination: paginationReactive,
      visible,
      modalTitle,
      formState,
      clickType,
      handleClick,
      handleReset,
      handleOk,
      delContent: '媒体渠道删除后不可恢复，确定删除媒体渠道？',
      formData,
      getMediaData,
      handleSearch,
      mediaName
    };
  },
})
</script>

<style lang="scss" scoped>
.business-wrap {
  .operation-btn {
    display: inline-block;
    padding: 10px 10px;
    margin-right: 20px;
    color: rgb(24, 144, 255);
    cursor: pointer;
  }
 .add-btn {
    margin-bottom: 20px;
  }
  .del-btn {
    color:rgba(255, 0, 0, 0.647);
  }
}
.ant-table-thead > tr > th {
  font-weight: bold !important;
}
</style>