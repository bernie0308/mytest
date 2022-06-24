import { setTokenSourceMapRange } from 'typescript'
import request from '../../utils/request'

export interface User {
  [key: string]: string
}

export default {
  namespaced: true,
  state: {
    userID: null,
    name: null,
    avatar: null,
    email: null,
    store: localStorage.getItem('store') || 'us'
  },
  mutations: {
    setUserinfo(state: User, payload: User = {}) {
      state.userID = payload.userID
      state.name = payload.full_name
      state.avatar = payload.avatar
      state.email = payload.email
    },
    setStore(state:User, store: string) {
      state.store  = store
      localStorage.setItem('store', store)
    }
  },
  actions: {
    getUser({ commit }: { commit: any }) {
      // 获取用户信息
      return request({
        url: '/sso/auth',
        method: 'get'
      }).then(res => {
        console.log(123123)
        commit('setUserinfo', res)
      }).catch(err => {
        console.error('ERROR getUser:', err)
      })
    }
  }
}