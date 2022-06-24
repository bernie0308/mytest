import request from '@/utils/request'

// 供应商管理列表
export const getSupplierList = (data: Record<string, unknown> = {}): Promise<any> => {
  return request({
    url: '/supplier/get-application-list',
    method: 'post',
    data
  })
}

// 编辑供应商信息
export const editSupplierInfo = (data: Record<string, unknown> = {}): Promise<any> => {
  return request({
    url: '/supplier/edit-application',
    method: 'post',
    data
  })
}

// 获取年度供应商列表
export const getSupplierYearList = (data: Record<string, unknown> = {}): Promise<any> => {
  return request({
    url: '/supplier/get-year-list',
    method: 'post',
    data
  })
}

// 添加年度供应商列表
export const addSupplierYear = (data: Record<string, unknown> = {}): Promise<any> => {
  return request({
    url: '/supplier/add-year-supplier',
    method: 'post',
    data
  })
}

// 删除年度供应商列表
export const deleteSupplierYear = (data: Record<string, unknown> = {}): Promise<any> => {
  return request({
    url: '/supplier/del-year-supplier',
    method: 'post',
    data
  })
}

// 可选年度供应商(下拉)
export const supplierPassList = (data: Record<string, unknown> = {}): Promise<any> => {
  return request({
    url: '/supplier/get-pass-selector',
    method: 'post',
    data
  })
}

// 添加年度供应商(超管)
export const addYearSupplier = (data: Record<string, unknown> = {}): Promise<any> => {
  return request({
    url: '/supplier/add-year-supplier',
    method: 'post',
    data
  })
}


export const reviewApplication = (data: Record<string, unknown> = {}): Promise<any> => {
  return request({
    url: '/supplier/review-application',
    method: 'post',
    data
  })
}