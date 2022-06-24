import { createStore } from 'vuex'
import user, { User } from './modules/user'
import base, { Base } from './modules/base'

interface State {
  user: User,
  base: Base
}

// Create a new store instance.
const store = createStore({
  modules: {
    user,
    base
  },
  getters: {
    name: (state: State): string => state.user.name,
    userID: (state: State): string => state.user.userID,
    avatar: (state: State): string => state.user.avatar,
    email: (state: State): string => state.user.email,
    navbarVisible: (state: State): boolean => state.base.navbarVisible,
    store: (state: State): string => state.user.store
  }
})
export default store