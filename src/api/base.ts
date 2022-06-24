import request from '@/utils/request'
export const uploadFile = (data: any): Promise<any> => {
  return request({
    url: '/common/file/upload',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
