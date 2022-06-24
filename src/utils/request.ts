/*
 * @Author: your name
 * @Date: 2021-01-13 16:10:53
 * @LastEditTime: 2021-01-14 15:59:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \frontend-cli\src\utils\request.js
 */
import axios from 'axios'
import { ssoLogin } from '../sso'
import { message } from 'ant-design-vue'
import qs from 'qs'
// create an axios instance
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log('response', response.data)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      if (res.code === 401) {
        ssoLogin()
      } else if (res.code === 403) {
        window.location.href = '//' + window.location.host + '/error'
      } else {
        message.error(res.msg || '抱歉, 出现未知错误, 请稍后再试')
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    message.error('抱歉, 出现未知错误, 请稍后再试')
    return Promise.reject(error)
  }
)

export default service