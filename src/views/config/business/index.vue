<template>
  <div class="business-wrap">
    <a-button type="primary" @click="handleClick('add')" class="add-btn">+ 新建</a-button>
    <a-table :columns="columns" :data-source="tableData" :pagination="false" v-model:expandedRowKeys="rowKeys" :scroll="{ y: tableHeight }" @expandedRowsChange="handleExpandedRowsChange">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span class="operation-btn" @click="handleClick('edit',record)">编辑</span>
            <span class="operation-btn" @click="handleClick('addChild',record)">添加子业务</span>
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
            label="业务类型名称"
            name="businessTitle"
            :rules="[{ required: clickType !== 'del', message: '业务类型名称不能为空' }]"
          >
            <a-input v-model:value="formState.businessTitle" />
          </a-form-item>
           <a-form-item
            v-if="clickType === 'addChild'"
            label="父业务类型名称"
            name="higherBusinessTitle"
          >
            <span>{{ formState.higherBusinessTitle }}</span>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, nextTick} from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { getBusinessList, addBusinessType, delBusinessType, editBusinessType } from '@/api/config';
import { on } from 'cluster';
import { any } from 'vue-types';
import axios from 'axios';
import { rowProps } from 'ant-design-vue/lib/grid/Row';
const columns = [
  {
    title: '业务类型名称',
    dataIndex: 'name',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    sorter: (a: DataItem, b: DataItem) => new Date(a.create_time).getTime() - new Date(b.create_time).getTime(),
  },
  {
    title: '更改时间',
    dataIndex: 'update_time',
  },
   {
    title: '操作者',
    dataIndex: 'update_by',
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
];
interface DataItem {
  key: number;
  name: string;
  pid: number;
  create_time: string;
  update_time: string;
  update_by: string,
  children?: DataItem[];
}
interface FormState {
  businessTitle: string;
  higherBusinessTitle: String;
}
export default defineComponent({
  setup() {
    const w = window as any
    const visible = ref<boolean>(false)
    const modalTitle = ref<String>('新建一级业务类型')
    const clickType = ref<String>('add')
    const pid = ref<Number>(0)
    const id = ref<Number>(0)
    const formRef = ref<FormInstance>();
    const rowKeys = ref<Number[]>([])
    const tableHeight = ref<Number>(document.documentElement.clientHeight - 240)
    const refData = reactive({
      tableData: [],
    })
    const tableData: Ref<DataItem[]> = ref([])
    onMounted(() => {
      window.addEventListener('resize', getTableHeight)
    })
    const getTableHeight = () => {
      nextTick(() => {
        tableHeight.value = document.documentElement.clientHeight - 240
      })
    }
    const formState = reactive<FormState>({
      businessTitle: '',
      higherBusinessTitle: ''
    });
    const handleClick = async (val:string, record:any) => {
      clickType.value = val
      formState.businessTitle = ''
      switch (clickType.value) {
        case 'add':
          pid.value = 0
          modalTitle.value = '新建一级业务类型'
          break;
        case 'edit':
          id.value = record.key
          formState.businessTitle = record.name
          modalTitle.value = '编辑业务类型'
          break;
        case 'addChild':
          pid.value = record.key
          formState.higherBusinessTitle = record.name
          modalTitle.value = '新建子业务类型'
          break;
        case 'del':
          id.value = record.key
          modalTitle.value = '确定删除业务类型'
          break;
        default:
          break;
      }
      visible.value = true
    }
    const handleOk = async () => {
      if (clickType.value === 'del') {
        delTableData()
      } else {
        const valid = await formRef.value.validateFields()
        if (valid) {
          switch (clickType.value) {
            case 'add':
              addTableData()
              break;
            case 'edit':
              editTableData()
              break;
            case 'addChild':
              addTableData()
              break;
            default:
              break;
          }
        }
      }
      visible.value = false
    }
    const handleExpandedRowsChange = (keys:any) => {
      rowKeys.value = keys
    }
    // 新建
    const addTableData = () => {
      addBusinessType({ pid: pid.value, name: formState.businessTitle}).then((res:any) => {
        w.$message.success('新建成功！')
        !rowKeys.value.includes(pid.value) && rowKeys.value.push(pid.value)
        getTableData()
      })
    }
    // 删除
    const delTableData = () => {
      delBusinessType({ id: id.value }).then(() => {
        w.$message.success('删除成功！')
        getTableData()
      })
    }
    // 编辑
    const editTableData =  () => {
      editBusinessType({ id: id.value, name:formState.businessTitle }).then(() => {
        w.$message.success('编辑成功！')
        getTableData()
      })
    }
    // 获取业务类型树
    const getTableData = ()  => {
      getBusinessList().then((res:any) => {
        tableData.value = formatTable(res)
      })
    }
    const formatTable = (data:any) => {
      return data.map((i:any) => {
        if (i.children) {
          return {
            key: i.id,
            name: i.name,
            pid: i.pid,
            create_time: i.create_time,
            update_time: i.update_time,
            update_by: i.update_by,
            children: formatTable(i.children)
          }
        } else {
           return {
            key: i.id,
            name: i.name,
            pid: i.pid,
            create_time: i.create_time,
            update_time: i.update_time,
            update_by: i.update_by,
          }
        }
      })
    }
    getTableData()
    return {
      refData,
      tableData,
      columns,
      visible,
      clickType,
      formState,
      modalTitle,
      handleClick,
      handleOk,
      formRef,
      pid,
      id,
      delContent: '业务类型删除后不可恢复，确定删除业务类型？',
      tableHeight,
      formatTable,
      handleExpandedRowsChange,
      rowKeys
    };
  }
})
</script>

<style lang="scss" scoped>
.business-wrap {
  height: 100%;
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