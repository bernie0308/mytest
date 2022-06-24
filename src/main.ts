import { createApp } from 'vue'
import { createSso } from './sso'
import App from './App.vue'
import router from './router/index' // 引入vue-router
import store from './store/index'
import plugins from './plugins/index'

import AntDesign from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { Modal } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// 导入所有图标库
import * as Icons from "@ant-design/icons-vue"

import './styles/index.css'
import 'animate.css';

const sso = createSso({
  api: '/api/sso/login',
  loginUrl: '/api/sso/redirect',
  logoutUrl: '/api/sso/logout-redirect'
})

const app = createApp(App)
// 挂载到app上
app.use(router)
app.use(store)
app.use(plugins)
app.use(AntDesign)
app.use(sso)

const _window = window as any
_window.$message = message
_window.$modal = Modal

// 全局使用图标
const icons: any = Icons
for(const i in icons) {
  const aicon: any = icons[i]
  app.component(i, aicon)
}

app.mount('#app')

export default app