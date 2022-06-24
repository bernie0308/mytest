import request from '@/utils/request'
export const submitApplication = (data: any): Promise<any> => {
  return request({
    url: '/supplier/submit-application',
    method: 'post',
    data
  })
}
export const applicationDetail = (params: any): Promise<any> => {
  return request({
    url: '/supplier/get-application-detail',
    method: 'get',
    params
  })
}
export const reSubmitApplication = (data: any): Promise<any> => {
  return request({
    url: '/supplier/re-submit-application',
    method: 'post',
    data
  })
}

