export interface Base {
  [key: string]: boolean
}

export default {
  namespaced: true,
  state: {
    navbarVisible: true,
  },
  mutations: {
    setNavBarVisible(state: Base, payload: boolean = true) {
      console.log('navbarVisible', payload)
      state.navbarVisible = payload
    }
  }
}