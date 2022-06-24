import { reactive } from 'vue'
import schemes from '@/utils/schemes/supplier'
import type { TableColumnsType } from 'ant-design-vue'

export const treeFields: Record<string, string> = {
  children:'children',
  label: 'name',
  value: 'id'
}

export const formData: Record<string|number, any> = reactive({
  company_name: {
    type: 'input',
    label: '公司名称',
    placeholder: '请填写公司名称'
  },
  level: {
    type: 'select',
    label: '入库级别',
    placeholder: '请选择入库级别',
    options: schemes.LEVEL
  },
  status: {
    type: 'select',
    label: '审核状态',
    placeholder: '请选择审核状态',
    options: schemes.STATUS
  }
})

export const advanceData: Record<string|number, any> = reactive({
  // payment_days: {
  //   type: 'select',
  //   label: '账期',
  //   placeholder: '请选择账期',
  //   advance: true,
  //   options: schemes.PAYMENT_DAYS
  // },
  // create_time: {
  //   type: 'daterange',
  //   showTime: true,
  //   advance: true,
  //   label: '创建时间',
  //   placeholder: '请选择创建时间'
  // }
})

export const columns: TableColumnsType = [
  { title: '公司名称', dataIndex: 'basic', key: 'basic', fixed: 'left', width: 280 },
  { title: '业务类型', dataIndex: 'account', key: 'account', width: 260 },
  { title: '入库级别', dataIndex: 'supplier', key: 'supplier', minWidth: 160 },
  { title: '审核状态', dataIndex: 'approval', key: 'approval', minWidth: 160 },
  // { title: '时间信息', dataIndex: 'time', key: 'time', width: 260 },
  { title: '操作', key: 'opr', fixed: 'right', width: 120 }
]

export function filterSchemes (type: string, value: string|number|null|undefined) {
  const target: Record<string, string|number>[] = schemes[type]
  if (target) {
    const enumTarget = target.find((item: Record<string, string|number>) => item.value === value)
    return enumTarget ? enumTarget.label : value
  }
  return value
}