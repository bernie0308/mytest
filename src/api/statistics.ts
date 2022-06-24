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