<template>
  <div class="search-area">
    <Search v-model:params="params" :formData="formData" :advanceData="advanceData" @search="getList" @reset="getList" />
  </div>
  <div class="tool-area">
    <a-button type="primary" @click="goApply">
      <template #icon><plus-outlined /></template>
      添加供应商
    </a-button>
  </div>
  <div class="table-area">
    <a-table :columns="columns" :data-source="tableData" :scroll="{ x: tableScrollX, y: tableScrollY }" :loading="loading" :pagination="pagination">
      <template #headerCell="{title, column}">
        <template v-if="column.key === 'approval'">
          {{ title }}
          <a-popover title="审批状态说明" placement="bottom">
            <template #content>
              <div>待审核：供应商提交申请表后，该供应商数据为“待审核”</div>
              <div>待修改资料：驳回供应商申请后，该供应商申请数据变为“待修改资料”</div>
              <div>审核通过：通过供应商的申请后，该供应商申请数据变为“审核通过”</div>
              <div>不通过：不通过供应商的申请后，该供应商申请数据变为“不通过”</div>
            </template>
            <a-button size="small" shape="circle">
              <template #icon>
                <question-outlined />
              </template>
            </a-button>
          </a-popover>
        </template>
      </template>

      <template #bodyCell="{ text, record, index, column }">
        <template v-if="column.key === 'basic'">
          <a @click="handleDetailVisible(record, true)">{{ record.company_name }}</a>
          <!-- <div class="table-mix-area-1">
            <div class="table-mix-row first-row">
              <a @click="handleDetailVisible(record, true)">{{ record.company_name }}</a>
            </div>
            <div class="table-mix-row second-row">
              <div class="left">{{ record.contacts }}</div>
              <div class="right">{{ record.phonenum }}</div>
            </div>
          </div> -->
        </template>
        <template v-if="column.key === 'account'">
          {{ record.business_type_map }}
          <!-- <div class="table-mix-area-2">
            <div class="table-mix-row">
              <div class="label" style="min-width: 65px;">合同账期：</div>
              <div class="value">{{ filterSchemes('PAYMENT_DAYS', record.payment_days) }}</div>
            </div>
            <div class="table-mix-row">
              <div class="label" style="min-width: 65px;">入库级别：</div>
              <div class="value">{{ filterSchemes('LEVEL', record.level) }}</div>
            </div>
          </div> -->
        </template>
        <template v-if="column.key === 'supplier'">
          {{ filterSchemes('LEVEL', record.level) }}
          <!-- <div class="table-mix-area-2">
            <div class="table-mix-row">
              <div class="label" style="min-width: 65px;">入库来源：</div>
              <div class="value">{{ filterSchemes('PUT_TYPE', record.put_type) }}</div>
            </div>
            <div class="table-mix-row">
              <div class="label" style="min-width: 65px;">业务类型：</div>
              <div class="value">{{ record.business_type_map }}</div>
            </div>
          </div> -->
        </template>
        <template v-if="column.key === 'approval'">
          <a-tag v-if="record.status === 2" color="red">{{ filterSchemes('STATUS', record.status) }}</a-tag>
          <a-tag v-else-if="record.status === 3" color="green">{{ filterSchemes('STATUS', record.status) }}</a-tag>
          <a-tag v-else color="blue">{{ filterSchemes('STATUS', record.status) }}</a-tag>
          <!-- <div class="table-mix-area-1">
            <div class="table-mix-row first-row">
              {{ record.approval_time }}
            </div>
            <div class="table-mix-row second-row">
              <div v-if="record.status === 2" class="left" style="color: red">{{ filterSchemes('STATUS', record.status) }}</div>
              <div v-else-if="record.status === 3" class="left" style="color: #87d068">{{ filterSchemes('STATUS', record.status) }}</div>
              <div v-else class="left" style="color: #1b92ff">{{ filterSchemes('STATUS', record.status) }}</div>
              <div class="right">{{ record.approver }}</div>
            </div>
          </div> -->
        </template>
        <template v-if="column.key === 'time'">
          <div class="table-mix-area-2">
            <div class="table-mix-row">
              <div class="label">申请时间：</div>
              <div class="value">{{ record.create_time }}</div>
            </div>
            <div class="table-mix-row">
              <div class="label">更新时间：</div>
              <div class="value">{{ record.update_time }}</div>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'opr'">
          <a v-if="[0].includes(Number(record.status))" @click="handleDetailVisible(record, true)">审核</a>
        </template>
      </template>
    </a-table>
  </div>
  <Verify v-if="showModal" :showModal="showModal" :data="currentData" @submit="handleSubmit" @cancle="handleCancle" />
  <a-drawer
    v-model:visible="detailVisible"
    class="detail-area"
    title="供应商详情"
    placement="right"
    width="800"
    destroyOnClose
  >
    <template #extra>
      <a-space v-if="isEditing">
        <a-button v-if="!editLoading" type="primary" ghost @click="goCancelEdit">取消</a-button>
        <a-button type="primary" @click="goSaveEdit" :loading="editLoading">保存</a-button>
      </a-space>
      <a-space v-else>
        <a-button v-if="[0].includes(Number(currentData.status))" type="primary" @click="goApproval">审核</a-button>
        <a-button type="primary" ghost @click="goEdit">编辑</a-button>
      </a-space>
    </template>
    <div style="position: absolute; top: 21px; right: 560px">
      <a-tag color="processing">{{ filterSchemes('STATUS', currentData.status) }}</a-tag>
    </div>
    <a-form
      ref="formEdit"
      :model="formState"
      :label-col="{ span: 4, offset: 1 }"
      :wrapper-col="{ span: 18, offset: 1 }"
      :loading="editLoading"
      autocomplete="off"
      labelAlign="left"
    >
      <!-- 展示时 -->
      <template v-if="!isEditing">
        <template v-if="[1,2,3].includes(Number(currentData.status))">
          <div class="section-header">业务类型</div>
          <a-form-item label="业务类型"><span>{{ currentData.business_type_map }}</span></a-form-item>

          <div class="section-header">审核信息</div>
          <a-form-item label="审核人"><span>{{ currentData.approver }}</span></a-form-item>
          <a-form-item label="审核时间"><span>{{ currentData.approval_time }}</span></a-form-item>
          <a-form-item label="入库级别"><span>{{ filterSchemes('LEVEL', currentData.level) }}</span></a-form-item>
          <a-form-item label="审核备注"><span>{{ currentData.approval_remark }}</span></a-form-item>
        </template>

        <div class="section-header">基本信息</div>
        <a-form-item label="公司名称"><span>{{ currentData.company_name }}</span></a-form-item>
        <a-form-item label="公司地址"><span>{{ currentData.address }}</span></a-form-item>
        <a-form-item label="成立时间"><span>{{ currentData.build_time }}</span></a-form-item>
        <a-form-item label="业务范围"><span>{{ currentData.business_scope }}</span></a-form-item>
        <a-form-item label="营收规模(万)"><span>{{ currentData.revenue_scale }}</span></a-form-item>
        <a-form-item label="公司简介"><a @click="openWebFile(currentData.description)">查看</a></a-form-item>

        <div class="section-header">经营资质</div>
        <a-form-item label="企业性质"><span>{{ filterSchemes('COMPANY_NATURE', currentData.company_nature) }}</span></a-form-item>
        <a-form-item label="注册资本(万)"><span>{{ currentData.registered_capital }}</span></a-form-item>
        <a-form-item label="营业执照"><a @click="openWebFile(currentData.business_license)">查看</a></a-form-item>
        <a-form-item label="一般纳税人资格证"><a @click="openWebFile(currentData.general_taxpayer_certificate)">查看</a></a-form-item>

        <div class="section-header">发票信息</div>
        <a-form-item label="纳税人识别号"><span>{{ currentData.tax_num }}</span></a-form-item>
        <a-form-item label="发票抬头"><span>{{ currentData.invoice_title }}</span></a-form-item>
        <a-form-item label="开户行"><span>{{ currentData.bank_name }}</span></a-form-item>
        <a-form-item label="账号"><span>{{ currentData.account_number }}</span></a-form-item>
        <a-form-item label="注册地址"><span>{{ currentData.register_address }}</span></a-form-item>
        <a-form-item label="电话"><span>{{ currentData.tel }}</span></a-form-item>

        <div class="section-header">联系方式</div>
        <a-form-item label="联系人"><span>{{ currentData.contacts }}</span></a-form-item>
        <a-form-item label="联系电话"><span>{{ currentData.phonenum }}</span></a-form-item>
        <a-form-item label="联系邮箱"><span>{{ currentData.email }}</span></a-form-item>

        <div class="section-header">其他信息</div>
        <a-form-item label="账期"><span>{{ filterSchemes('PAYMENT_DAYS', currentData.payment_days) }}</span></a-form-item>
        <a-form-item label="入库来源"><span>{{ filterSchemes('PUT_TYPE', currentData.put_type) }}</span></a-form-item>
        <a-form-item v-if="formState.put_type === 1" label="推荐人"><span>{{ currentData.referee }}</span></a-form-item>
        <a-form-item label="服务案例"><span>{{ currentData.email }}</span></a-form-item>
        <a-form-item label="备注"><span>{{ currentData.remark }}</span></a-form-item>

        <div class="section-header">变更信息</div>
        <a-form-item label="添加时间"><span>{{ currentData.create_time }}</span></a-form-item>
        <a-form-item label="更改时间"><span>{{ currentData.update_time }}</span></a-form-item>
        <a-form-item label="操作人"><span>{{ currentData.update_by }}</span></a-form-item>
      </template>

      <!-- 编辑时 -->
      <template v-if="isEditing">
        <div class="section-header">{{ currentData.company_name }}</div>
        <template v-if="[3].includes(Number(currentData.status))">
          <a-form-item label="业务类型" name="business_type_ids" :rules="[{ required: true, message: '请选择业务类型, 可多选' }]">
            <a-tree-select
              v-model:value="formState.business_type_ids"
              placeholder="请选择业务类型"
              multiple
              :fieldNames="treeFields"
              :tree-line="true"
              :tree-data="treeData"
            ></a-tree-select>
          </a-form-item>
          <a-form-item label="入库级别" name="level" :rules="[{ required: true, message: '请选择入库级别' }]">
            <a-select v-model:value="formState.level" :options="schemes.LEVEL"></a-select>
          </a-form-item>
        </template>
        <a-form-item label="联系人" name="contacts" :rules="[{ required: true, message: '请填写联系人' }]">
          <a-input v-model:value="formState.contacts" :max="50" />
        </a-form-item>
        <a-form-item label="联系电话" name="phonenum" :rules="[{ required: true, message: '请填写联系电话' }]">
          <a-input v-model:value="formState.phonenum" :max="50" />
        </a-form-item>
        <a-form-item label="联系邮箱" name="email" :rules="[{ required: true, message: '请填写联系邮箱' }]">
          <a-input v-model:value="formState.email" :max="50" />
        </a-form-item>
        <a-form-item label="账期" name="payment_days" :rules="[{ required: true, message: '请选择账期' }]">
          <a-select v-model:value="formState.payment_days" :options="schemes.PAYMENT_DAYS"></a-select>
        </a-form-item>
        <a-form-item label="入库来源" name="put_type" :rules="[{ required: true, message: '请选择入库来源' }]">
          <a-radio-group v-model:value="formState.put_type" :options="schemes.PUT_TYPE" />
        </a-form-item>
        <a-form-item v-if="formState.put_type === 1" label="推荐人" name="referee" :rules="[{ required: true, message: '请填写推荐人' }]">
          <a-input v-model:value="formState.referee" :max="50" />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formState.remark" :max="500" />
        </a-form-item>
      </template>
    </a-form>
  </a-drawer>
</template>

<script lang="ts">
import type { SupplierData } from '@/utils/interface/supplier.ts'
import { defineComponent, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { formData, advanceData, columns, filterSchemes, treeFields } from './config.ts'
import { getSupplierList, editSupplierInfo, reviewApplication } from '@/api/supplier.ts'
import { getBusinessList } from '@/api/config.ts' 
import { useRouter } from 'vue-router'
import schemes from '@/utils/schemes/supplier'

import type { Ref } from 'vue'
import type { AxiosResponse } from 'axios'
import type { SupplierData } from '@/utils/types/supplier'
import type { PaginationProps } from 'ant-design-vue'

import Search from '@/components/genki/Search.vue'
import Verify from '@/components/genki/Verify.vue'

export default defineComponent ({
  name: 'supplierList',
  components: {
    Search,
    Verify
  },
  setup(props, ctx) {
    const w = window as any
    const router = useRouter()
    const loading: Ref<boolean> = ref(false)
    const editLoading: Ref<boolean> = ref(false)
    const params: Ref<SupplierData> = ref({})
    const tableData: Ref<SupplierData[]> = ref([])
    const detailVisible: Ref<boolean> = ref(false)
    const currentData: Ref<SupplierData> = ref({})
    const isEditing: Ref<boolean> = ref(false)
    const formEdit: Ref<any> = ref(null)
    const treeData: Ref<Record<string, any>[]> = ref([])
    const showModal: Ref<boolean> = ref(false)
    const pagination: Ref<PaginationProps> = ref({
      total: 0,
      current: 1,
      pageSize: 10,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      showTotal:(total:number) => `共${total}条记录`,
      onChange: (page:any, pageSize:any) => {
        pagination.value.current = page 
        pagination.value.pageSize = pageSize
        getList(false)
      }
    })
    const formState = reactive<SupplierData>({
      contacts: null,
      phonenum: null,
      email: null,
      payment_days: null,
      referee: null,
      put_type: null,
      level: null,
      remark: null,
      business_type_ids: []
    });
    // 获取列表数据
    const getList = (data?: SupplierData) => {
      loading.value = true
      getSupplierList({ 
        ...data,
        page_num: pagination.value.current,
        page_size: pagination.value.pageSize
      }).then(res => {
        if (Array.isArray(res.data)) {
          tableData.value = res.data
          pagination.value.total = res.total || 0
          console.log(pagination.value)
          if (currentData.value.id && detailVisible.value) {
            const current = tableData.value.find(item => item.id === currentData.value.id) || {}
            handleDetailVisible(current, detailVisible.value)
          }
        }
      }).finally(() => {
        loading.value = false
      })
    }
    // 获取业务类型数据
    const getBusinessType = () => {
      loading.value = true
      getBusinessList().then((res: AxiosResponse<any>) => {
        console.log('res', res)
        if (Array.isArray(res)) {
          // console.log('transTreeData', transTreeData(res))
          treeData.value = res
        }
      }).finally(() => {
        loading.value = false
      })
    }
    // 前往申请
    const goApply = () => {
      router.push({ path: '/to-client/supplier/apply' })
    }
    // 展开收起详情
    const handleDetailVisible = (record: Record<string, any>, value: boolean) => {
      const id = record.id
      currentData.value = tableData.value.find(item => item.id === id) || {}
      for(let key in formState) {
        if (currentData.value[key] !== undefined) {
          formState[key] = currentData.value[key]
        }
      }
      detailVisible.value = value
    }
    // 前往审批
    const goApproval = () => {
      showModal.value = true
    }
    // 审核弹框确认事件
    const handleSubmit = (form:Record<string, any> = {}) => {
      editLoading.value = true
      const verifyParmas = Object.assign({}, form, { supplier_id: currentData.value.id })
      handleReviewApplication(verifyParmas).then(() => {
        getList(params)
        showModal.value = false
        detailVisible.value = false
      }).finally(() => {
        editLoading.value = false
      })
    }
    const handleCancle = () => {
      showModal.value = false
    }
    const handleReviewApplication = (params:Record<string, any> = {}) => {
      return reviewApplication(params).then((res: Ref<Record<string, any>[]>) => {
         w.$message.success('审核成功！')
      })
    }
    // 前往编辑
    const goEdit = () => {
      // detailVisible.value = false
      isEditing.value = true
    }
    // 保存编辑
    const goSaveEdit = () => {
      formEdit.value.validate().then(() => {
        const data = {
          id: currentData.value.id,
          ...formState
        }
        // 审批通过才会有这几个字段
        if (currentData.value.status !== 3) {
          delete data.level
          delete data.business_type_ids
        }
        // 入库来源是推荐才有推荐人
        if (data.put_type !== 1) {
          delete data.referee
        }
        editSupplierInfo(data)
          .then(res => {
            w.$message.success('编辑成功')
            getList(params)
            isEditing.value = false
          })
          .finally(() => {
            editLoading.value = false
          })
      })
      .catch((err: string) => {
        console.log('error', err)
      })
    }
    const goCancelEdit = () => {
      isEditing.value = false
    }
    const openWebFile = (url: string | null | undefined) => {
      if (url) {
        w.open(url)
      }
    }
    // const transTreeData: <T extends Array<any>>(data: T) => T = <T extends Array<any>>(data: T): T=> {
    //   let result = []
    //   data.map(item => {
    //     if (Array.isArray(item.children) && item.children.length > 0) {
    //       item.selectable = false
    //       item.children = transTreeData(item.children)
    //     }
    //     result.push(item)
    //   })
    //   return data
    // }
    // 初始化
    getBusinessType()
    getList()
    return {
      tableScrollX: document.body.clientWidth * 0.7,
      tableScrollY: document.body.clientHeight * 0.7,
      schemes,
      pagination,
      loading,
      editLoading,
      params,
      tableData,
      columns,
      formData,
      advanceData,
      filterSchemes,
      detailVisible,
      currentData,
      formState,
      isEditing,
      formEdit,
      treeData,
      treeFields,
      getList,
      goApply,
      goApproval,
      goEdit,
      goSaveEdit,
      goCancelEdit,
      openWebFile,
      handleDetailVisible,
      showModal,
      handleSubmit,
      handleCancle,
      handleReviewApplication
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/table.scss';
.search-area {

}
.table-area {
  margin-top: 10px;
}
</style>