<template>
  <div class="search-area">
    <Search v-model:params="params" :formData="formData" :advanceData="advanceData" @search="getList" @reset="getList" />
  </div>
  <div class="tool-area">
    <a-button type="primary" @click="goAdd">
      <template #icon><plus-outlined /></template>
      添加年度供应商
    </a-button>
  </div>
  <div class="table-area">
    <a-table :columns="columns" :data-source="tableData" :scroll="{ x: tableScrollX, y: tableScrollY }" :loading="loading">
      <template #bodyCell="{ text, record, index, column }">
        <template v-if="column.key === 'basic'">
          <a @click="handleDetailVisible(record, true)">{{ record.company_name }}</a>
        </template>
        <template v-if="column.key === 'account'">
          {{ record.business_type_map }}
        </template>
        <template v-if="column.key === 'media'">
          {{ record.medias }}
        </template>
        <template v-if="column.key === 'supplier'">
          {{ filterSchemes('LEVEL', record.level) }}
        </template>
        <template v-if="column.key === 'approval'">
          <a-tag v-if="record.status === 2" color="red">{{ filterSchemes('INVITE_STATUS', record.status) }}</a-tag>
          <a-tag v-else-if="record.status === 1" color="green">{{ filterSchemes('INVITE_STATUS', record.status) }}</a-tag>
          <a-tag v-else color="blue">{{ filterSchemes('INVITE_STATUS', record.status) }}</a-tag>
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
      </template>
    </a-table>
  </div>
  <!-- 添加 -->
  <a-drawer
    v-model:visible="addVisible"
    class="add-area"
    title="添加年度供应商"
    placement="right"
    width="800"
    destroyOnClose
    @close="handleDrawerClose"
  >
    <template #extra>
      <a-space>
        <a-button v-if="currentStep > 0" type="primary" ghost :disabled="editLoading" @click="goPrevStep">上一步</a-button>
        <a-button v-if="currentStep < 1" type="primary" ghost @click="goNextStep" :disabled="!formState.supplier_id">下一步</a-button>
        <a-button v-if="currentStep === 1" type="primary" @click="goSubmit" :loading="editLoading">提交</a-button>
      </a-space>
    </template>
    <div>
      <a-steps :current="currentStep">
        <a-step title="第一步" description="选择供应商" />
        <a-step title="第二步" description="确认年度框架信息" />
      </a-steps>
    </div>
    <br>
    <a-form
      ref="formAdd"
      :model="formState"
      :label-col="{ span: 4, offset: 1 }"
      :wrapper-col="{ span: 18, offset: 1 }"
      :loading="editLoading"
      autocomplete="off"
      labelAlign="left"
    >
      <!-- 第一步 -->
      <div v-show="currentStep === 0">
        <a-form-item label="选择供应商" name="supplier_id" :rules="[{ required: true, message: '请选择供应商' }]">
          <a-select
            v-model:value="formState.supplier_id"
            style="width: 80%"
            placeholder="请选择供应商"
            :loading="loading"
            @change="handleSupplierChange"
          >
            <a-select-option v-for="(item, index) in allowSupplierOptions" :value="item.id">{{ item.company_name }}</a-select-option>
          </a-select>
        </a-form-item>
        <div 
          v-if="formState.supplier_id" 
          style="height: 100%;overflow-y: auto;border-top: 1px solid #eee;padding-top: 20px;height: calc(100vh - 270px);"
        >
          <div class="section-header">业务类型</div>
          <a-form-item label="业务类型"><span>{{ currentData.business_type_map }}</span></a-form-item>

          <div class="section-header">审核信息</div>
          <a-form-item label="审核人"><span>{{ currentData.approver }}</span></a-form-item>
          <a-form-item label="审核时间"><span>{{ currentData.approval_time }}</span></a-form-item>
          <a-form-item label="入库级别"><span>{{ filterSchemes('LEVEL', currentData.level) }}</span></a-form-item>
          <a-form-item label="审核备注"><span>{{ currentData.approval_remark }}</span></a-form-item>

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

          <div class="section-header">变更信息</div>
          <a-form-item label="添加时间"><span>{{ currentData.create_time }}</span></a-form-item>
          <a-form-item label="更改时间"><span>{{ currentData.update_time }}</span></a-form-item>
          <a-form-item label="操作人"><span>{{ currentData.update_by }}</span></a-form-item>
        </div>
      </div>
      <!-- 第二步 -->
      <div v-show="currentStep === 1">
        <a-form-item label="签约年份" name="year" :rules="[{ required: true, message: '请选择签约年份' }]">
          <a-date-picker v-model:value="formState.year" picker="year" style="width: 80%" valueFormat="YYYY" />
        </a-form-item>
        <a-form-item label="媒体信息" name="media_ids" :rules="[{ required: true, message: '请选择媒体信息' }]">
          <a-select
            v-model:value="formState.media_ids"
            style="width: 80%"
            placeholder="请选择媒体信息"
            mode="multiple"
          >
            <a-select-option v-for="(item, index) in mediaOptions" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="签约人" name="sign_by" :rules="[{ required: true, message: '请填写签约人' }]">
          <a-input v-model:value="formState.sign_by" placeholder="请填写签约人" :max="50" style="width: 80%" />
        </a-form-item>
        <a-form-item label="签约日期" name="sign_date" :rules="[{ required: true, message: '请选择签约日期' }]">
          <a-date-picker v-model:value="formState.sign_date" placeholder="请选择签约日期" style="width: 80%" valueFormat="YYYY-MM-DD" />
        </a-form-item>
        <a-form-item label="年度框架合同信息" name="contract_info" :rules="[{ required: true, message: '请上传年度框架合同信息' }]">
          <a-upload 
            v-model:file-list="formState.contract_info"
            :custom-request="handleUploadRequest"
            :before-upload="(file: any, fileList: Array<any>) => handleBeforeUpload(file, fileList, ['doc', 'docx', 'ppt', 'pdf', 'rar', 'zip', 'xls', 'xlsx', 'png', 'jpg', 'bmp'])"
            :maxCount="10"
            style="width: 80%"
          >
            <a-button type="primary" ghost :loading="uploadLoading">
              <upload-outlined />
              上传文件
            </a-button><br>
            <a-typography-text type="secondary">
              可上传多个文件, 支持.doc .docx .ppt .pdf .rar .zip, xls, xlsx, png, jpg, bmp格式文件，大小不超过20M
            </a-typography-text>
          </a-upload>
        </a-form-item>
      </div>
    </a-form>
  </a-drawer>
  <!-- 详情 -->
  <a-drawer
    v-model:visible="detailVisible"
    class="detail-area"
    title="年度供应商详情"
    placement="right"
    width="800"
    destroyOnClose
  >
    <template #extra>
      <a-space>
        <a-button type="danger" ghost @click="goDelete(currentData)" :loading="deleteLoading">删除</a-button>
      </a-space>
    </template>
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
      <div class="section-header">年度框架信息</div>
      <a-form-item label="签约年份"><span>{{ currentData.year }}</span></a-form-item>
      <a-form-item label="媒体信息"><span>{{ currentData.medias }}</span></a-form-item>
      <a-form-item label="签约人"><span>{{ currentData.sign_date }}</span></a-form-item>
      <a-form-item label="签约时间"><span>{{ currentData.sign_by }}</span></a-form-item>
      <a-form-item label="合同信息">
        <div v-for="(file, index) in currentData.contract_info" :key="index" style="margin-bottom: 5px;">
          <a @click="openWebFile(file?.file_url)">查看附件{{ index + 1 }}</a>
        </div>
      </a-form-item>

      <div class="section-header">业务类型</div>
      <a-form-item label="业务类型"><span>{{ currentData.business_type_map }}</span></a-form-item>

      <div class="section-header">审核信息</div>
      <a-form-item label="审核人"><span>{{ currentData.approver }}</span></a-form-item>
      <a-form-item label="审核时间"><span>{{ currentData.approval_time }}</span></a-form-item>
      <a-form-item label="入库级别"><span>{{ filterSchemes('LEVEL', currentData.level) }}</span></a-form-item>
      <a-form-item label="审核备注"><span>{{ currentData.approval_remark }}</span></a-form-item>

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

      <div class="section-header">变更信息</div>
      <a-form-item label="添加时间"><span>{{ currentData.create_time }}</span></a-form-item>
      <a-form-item label="更改时间"><span>{{ currentData.update_time }}</span></a-form-item>
      <a-form-item label="操作人"><span>{{ currentData.update_by }}</span></a-form-item>
    </a-form>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { formData, advanceData, columns, filterSchemes, treeFields, mediaOptions } from './config'
import { getSupplierYearList, supplierPassList, addYearSupplier, deleteSupplierYear } from '@/api/supplier'
import { getMediaAllList } from '@/api/config'
import { uploadFile } from '@/api/base'
import { fileTypeValidate } from '@/utils/index'
import schemes from '@/utils/schemes/supplier'

import type { Ref } from 'vue'
import type { AxiosResponse } from 'axios'
import type { SupplierYearData } from '@/utils/types/supplier'
import type { PaginationProps } from 'ant-design-vue'

import Search from '@/components/genki/Search.vue'

export default defineComponent ({
  name: 'supplierList',
  components: {
    Search
  },
  setup(props, ctx) {
    const w = window as any
    const currentStep = ref<number>(0)
    const loading: Ref<boolean> = ref(false)
    const editLoading: Ref<boolean> = ref(false)
    const deleteLoading: Ref<boolean> = ref(false)
    const uploadLoading:Ref<boolean> = ref(false)
    const params: Ref<SupplierYearData> = ref({})
    const tableData: Ref<SupplierYearData[]> = ref([])
    // const mediaOptions: Ref<Record<string, any>[]> = ref([])
    const allowSupplierOptions: Ref<Record<string, any>[]> = ref([])
    const detailVisible: Ref<boolean> = ref(false)
    const confirmVisible: Ref<boolean> = ref(false)
    const addVisible: Ref<boolean> = ref(false)
    const formAdd: Ref<any> = ref(null)
    const currentData: Ref<SupplierYearData> = ref({})
    const pagination: Ref<PaginationProps> = ref({
      total: 0,
      current: 1,
      pageSize: 15
    })
    const formState = reactive<SupplierYearData>({
      supplier_id: null,
      year: null,
      media_ids: [],
      contract_info: [],
      sign_date: null,
      sign_by: null
    })
    // 获取列表数据
    const getList = (data?: SupplierYearData) => {
      loading.value = true
      getSupplierYearList({ 
        ...data,
        page_num: pagination.value.current,
        page_size: pagination.value.pageSize
      }).then(res => {
        if (Array.isArray(res.data)) {
          tableData.value = res.data
        }
      }).finally(() => {
        loading.value = false
      })
    }
    // 获取媒体类型数据
    const getMediaList = () => {
      loading.value = true
      getMediaAllList({}).then((res: AxiosResponse) => {
        if (Array.isArray(res)) {
          mediaOptions.value = res
          formData.media_ids.options = res.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        }
      }).finally(() => {
        loading.value = false
      })
    }
    // 获取可选供应商数据
    const getAllowSupplier = () => {
      loading.value = true
      supplierPassList().then((res: Ref<Record<string, any>[]>) => {
        if (Array.isArray(res)) {
          allowSupplierOptions.value = res
        }
      }).finally(() => {
        loading.value = false
      })
    }
    // 展开收起详情
    const handleDetailVisible = (record: Record<string, any> = {}, value: boolean) => {
      const id = record.id
      currentData.value = tableData.value.find(item => item.id === id) || {}
      for(let key in formState) {
        const field = currentData.value[key]
        if (field !== undefined) {
          formState[key] = currentData.value[key]
        }
      }
      detailVisible.value = value
    }
    // 添加
    const goAdd = () => {
      formState.supplier_id = null
      formState.year = null
      formState.media_ids = []
      formState.contract_info = []
      formState.sign_date = null
      formState.sign_by = null
      addVisible.value = true
      getMediaList()
    }
    const closeAdd = () => {
      for(let key in formState) {
        if (Array.isArray(formState[key])) {
          formState[key] = []
        } else {
          formState[key] = null
        }
      }
      addVisible.value = false
    }
    // 删除
    const goDelete = (record: SupplierYearData) => {
      w.$modal.confirm({
        title: '操作提醒',
        content: '是否删除该年度供应商？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          deleteLoading.value = true
          deleteSupplierYear({ id: record.id })
            .then(() => {
              w.$message.success('删除成功')
              getList(params)
              handleDetailVisible(record, false)
            })
            .finally(() => {
              deleteLoading.value = false
            })
        }
      })
    }
    // 打开文件
    const openWebFile = (url: string | null | undefined) => {
      if (url) {
        w.open(url)
      }
    }
    // 上一步
    const goPrevStep = () => {
      currentStep.value > 0 && currentStep.value--
    }

    // 下一步
    const goNextStep = () => {
      currentStep.value++
    }

    // 关闭抽屉
    const handleDrawerClose = () => {
      currentStep.value = 0
    }

    // 提交
    const goSubmit = () => {
      formAdd.value.validate().then(() => {
        editLoading.value = true
        const contract_info: Array<any> = formState?.contract_info || []
        const data = {
          ...formState,
          contract_info: contract_info.map((item: Record<string, any>) => {
            return {
              file_url: item?.response?.cos_url,
              file_name: item?.name
            }
          })
        }
        console.log('goSubmit', data)
        addYearSupplier(data).then(res => {
          w.$message.success('添加成功')
          getList(params)
          closeAdd()
        }).finally(() => {
          editLoading.value = false
        })
      })
    }
    
    // 上传文件
    const handleUploadRequest = (config: any) => {
      console.log('uploadRequest', config)
      uploadLoading.value = true
      const file = config.file
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData).then((res: any) => {
        config.onSuccess(res)
      }).catch(() => {
        config.onError()
      }).finally(() => {
        uploadLoading.value = false
      })
    }

    const handleBeforeUpload = (file: any, fileList: Array<any>, accept: Array<string>) => {
      if (accept && accept.length) {
        const size = file.size
        let valid = true
        console.log('handleBeforeUpload', file)
        if (size / (1024 * 1024 * 20) > 20) {
          w.$message.warning('所选择文件不符合大小')
          valid = false
        }
        valid = fileTypeValidate(file.name, accept)
        console.log('valid', valid, accept)
        if (!valid) {
          w.$message.warning('所选择文件不符合格式')
          file.status = 'error'
        }
        return valid
      }
    }

    // 选择供应商
    const handleSupplierChange = (id: number) => {
      const target = allowSupplierOptions.value.find(item => item.id === id)
      if (target) {
        currentData.value = { ...target }
      }
    }

    // 初始化
    getList()
    getAllowSupplier()
    getMediaList()

    return {
      tableScrollX: document.body.clientWidth * 0.7,
      tableScrollY: document.body.clientHeight * 0.7,
      currentStep,
      schemes,
      loading,
      editLoading,
      deleteLoading,
      uploadLoading,
      params,
      tableData,
      columns,
      formData,
      advanceData,
      filterSchemes,
      addVisible,
      detailVisible,
      confirmVisible,
      currentData,
      formState,
      treeFields,
      mediaOptions,
      allowSupplierOptions,
      formAdd,
      getList,
      goAdd,
      goPrevStep,
      goNextStep,
      goSubmit,
      goDelete,
      openWebFile,
      handleDetailVisible,
      handleSupplierChange,
      handleUploadRequest,
      handleBeforeUpload,
      handleDrawerClose
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