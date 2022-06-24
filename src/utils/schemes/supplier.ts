
// 账期
export const PAYMENT_DAYS: Record<string, string|number>[]  = [
  { label: 'T+90', value: 1 },
  { label: 'T+60', value: 2 },
  { label: 'T+30', value: 3 },
  { label: '月结', value: 4 },
  { label: '预付30%', value: 5 }
]

// 级别
export const LEVEL: Record<string, string|number>[]  = [
  { label: '暂未定级', value: 0 },
  { label: '中标入围(一级)', value: 1 },
  { label: '参与招标(二级)', value: 2 },
  { label: '入库资质(三级)', value: 3 },
  { label: '仅录入(四级)', value: 4 },
  { label: '暂停合作(五级)', value: 5 }
]

// 入库类型
export const PUT_TYPE: Record<string, string|number>[]  = [
  { label: '推荐', value: 1 },
  { label: '投递', value: 2 },
  { label: '收集', value: 3 }
]

// 审核状态
export const STATUS: Record<string, string|number>[] = [
  { label: '待审核', value: 0 },
  { label: '待修改资料', value: 1 },
  { label: '不通过', value: 2 },
  { label: '审核通过', value: 3 }
]

// 招标状态
export const INVITE_STATUS: Record<string, string|number>[] = [
  { label: '招标中', value: 0 },
  { label: '通过', value: 1 },
  { label: '不通过', value: 2 }
]

// 企业性质
export const COMPANY_NATURE: Record<string, string|number>[]  = [
  { label: '一般纳税人', value: 1 },
  { label: '小规模纳税人', value: 2 }
]


const schemes: Record<string, Record<string, string|number>[]> = {
  PAYMENT_DAYS,
  LEVEL,
  PUT_TYPE,
  STATUS,
  INVITE_STATUS,
  COMPANY_NATURE
}

export default schemes