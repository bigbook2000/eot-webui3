import './assets/prj.scss'
import './assets/eoui.scss'

import { createApp } from 'vue'

import ElementPlus from 'element-plus'
// env.d.ts declare module 'element-plus/dist/locale/zh-cn.mjs';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import './assets/element.scss'
//import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)

app.mount('#app')
