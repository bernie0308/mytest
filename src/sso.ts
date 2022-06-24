import { App } from 'vue'

// interface
interface Option {
  api: string,
  loginUrl: string,
  logoutUrl: string
}

interface SsoInstance {
  install: (app: App<Element>) => void,
  ssoLogin: () => void,
  ssoLogout: () => void,
  hasLoginToken: () => boolean,
  handleLogin: (option: Option) => void
}

// static
const URL_CAHCE_KEY = '__lastUrlCache'
const NOT_INIT_ERR = '请先初始化SSO'
const TOKEN_NAME = 'code'

let instance: SsoInstance // 创建的实例

class Sso {
  public ssoLogin: () => void
  public ssoLogout: () => void
  public hasLoginToken: () => boolean
  constructor(option: Option) {
    // 初始化属性
    this.ssoLogin = () => {
      toLogin(option.loginUrl)
    }
    this.ssoLogout = () => {
      toLogout(option.logoutUrl)
    }
    this.hasLoginToken = () => {
      return hasToken()
    }
  }

  install(app: App<Element>): void {
    // 挂载到app实例上
    app.config.globalProperties.$sso = instance
  }

  handleLogin(option: Option) {
    return new Promise((resolve, reject) => {
      // 处理登录方法
      const token = getParamByName(TOKEN_NAME)
      if (!token) return
      const baseURL = location.origin
      const url = baseURL + option.api
      const body = { token }
      fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'user-agent': 'Mozilla/4.0 MDN Example',
          'content-type': 'application/json'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(json => {
          if (Number(json.code) === 200) {
            resolve(json)
            window.localStorage.setItem('fn_userinfo', JSON.stringify(json.data))
            const originTarget = localStorage.getItem(URL_CAHCE_KEY) || location.origin
            if (originTarget) {
              window.location.href = originTarget
            }
          } else {
            reject(json)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    })
  }
}

// 获取URL中的参数，匹配最后一个
export function getParamByName(paramName: string): string | undefined {
  const url = location.toString()
  const splitArr = url.split('?')
  if (splitArr.length > 1) {
    const paramStr = splitArr[1]
    const paramItems = paramStr.split('&')
    let res
    paramItems.forEach(p => {
      const set = p.split('=')
      const key = set.length > 1 ? set[0] : ''
      const value = set[1]
      // 会匹配到最后一个符合的
      if (key && key === paramName) {
        res = value
      }
    })
    return res
  } else {
    return ''
  }
}

// URL中是否包含tokenName的参数
function hasToken() {
  const token = getParamByName(TOKEN_NAME)
  return Boolean(token && token !== '')
}

// 登录跳转
function toLogin(url: string) {
  // localStorage.setItem(URL_CAHCE_KEY, delParam(location.href, TOKEN_NAME))
  localStorage.setItem(URL_CAHCE_KEY, `//${location.host}`)
  const baseURL = location.origin
  window.location.href = baseURL + url
}

// 登出跳转
function toLogout(url: string) {
  const baseURL = window.origin
  window.localStorage.removeItem('fn_userinfo')
  window.location.href = baseURL + url
}

/**
 * 获取对应名称的cookie
 * @param name cookie的名称
 * @returns {null} 不存在时，返回null
 */
function getCookie(name: string) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  const arr = document.cookie.match(reg)
  if (Array.isArray(arr) && arr.length > 0) {
    return unescape(arr[2])
  } else {
    return null
  }
}

export function isLogin() {
  return Boolean(getCookie('forevernine'))
}

/*
option: {
  loginUrl: string
  logoutUrl: string
  api: string
}
 */
export function createSso(option: Option) {
  instance = new Sso(option)
  instance.handleLogin(option)
  return instance
}

export function hasLoginToken() {
  return instance.hasLoginToken()
}

export const ssoLogin = () => {
  if (!instance) {
    return console.error(NOT_INIT_ERR)
  }
  instance.ssoLogin()
}
export const ssoLogout = () => {
  if (!instance) {
    return console.error(NOT_INIT_ERR)
  }
  instance.ssoLogout()
}
