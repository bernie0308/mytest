import request from '@/utils/request'
import { exportFile } from '@/utils'
// 导出referral邀请信息
export function exportreFerrals(store: string, params: any) {
  const api = `${store}/referral/export/referrals?`
  exportFile(api, params)
  // return request({
  //   url: `/admin/${store}/referral/export/referrals`,
  //   method: 'get',
  //   params
  // })
}

// 导出friend邀请信息
export function exportreFriends(store: string, params: any) {
  const api = `${store}/referral/export/friends?`
  exportFile(api, params)
  // return request({
  //   url: `/admin/${store}/referral/export/friends`,
  //   method: 'get',
  //   params
  // })
}

// 导出order邀请信息
export function exportreOrders(store: string, params: any) {
  const api = `${store}/cross-sell/export/orders?`
  exportFile(api, params)
  // return request({
  //   url: `/admin/${store}/cross-sell/export/orders`,
  //   method: 'get',
  //   params
  // })
}

// 编辑推荐人配置
export function editMerchant(store: string, data: Record<string, any> = {}) {
  return request({
    url: `${store}/edit_merchant`,
    method: 'post',
    data
  })
}

// 回显推荐人配置信息
export function getMerchant(store: string) {
  return request({
    url: `${store}/merchant`,
    method: 'get'
  })
}

// 管理端-CrossSell折扣产品列表
export function getProductList(store: string) {
  return request({
    url: `/admin/cross-sell/${store}/get-x-product-list`,
    method: 'get'
  })
}

// 管理端-Shopify产品列表 (头部新增的按钮 )
  export function getProductAddList(store: string) {
    return request({
      url: `/admin/cross-sell/${store}/get-product-list`,
      method: 'get'
    })
  }

  // // 管理端-设置X产品折扣商品 (新增的接口) 
  //  export function getProductAddDiscountX(store: string, data: Record<string, any> = {}) {
  //   return request({
  //     url: `/admin/cross-sell/${store}/set-x-discount-product`,
  //     method: 'POST',
  //     data
  //   })
  // }

  // 管理端-设置X产品折扣商品 (新增的接口) 
  export function createXDiscountProduct(store: string, data: Record<string, any> = {}) {
    return request({
      url: `/admin/cross-sell/${store}/create-x-discount-product`,
      method: 'POST',
      data
    })
  }

  // 管理端-设置X产品折扣商品 (编辑的接口) 
  export function editXDiscountProduct(store: string, data: Record<string, any> = {}) {
    return request({
      url: `/admin/cross-sell/${store}/edit-x-discount-product`,
      method: 'POST',
      data
    })
  }

  // 删除商品
  export function ProductDelDisableProductX(store: string, data: Record<string, any> = {}) {
    return request({
      url: `/admin/cross-sell/${store}/disable-x-product`,
      method: 'POST',
      data
    })
  }


