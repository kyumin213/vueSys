// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import axios from 'axios'
import vuex from 'vuex'
import 'babel-polyfill'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import 'default-passive-events'
import global_ from '@/components/global'
import './assets/css/mystyle.css'
import vali from '@/components/common/validate'
// import request from '@/request/https'
Vue.config.productionTip = false
Vue.use(ElementUI, VueResource, vuex, vali)
axios.defaults.headers.post['Content-Type'] = 'application/json'
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.common['SID'] = sessionStorage.getItem('sessionid')
//axios.defaults.headers.common['SessionId'] = sessionStorage.getItem('sessionid')
//axios.defaults.headers.common['fileext'] = sessionStorage.getItem('fileext')
Vue.prototype.axios = axios
Vue.prototype.GLOBAL = global_
// if (process.env.NODE_ENV === 'production') {
//   Vue.prototype.GLOBAL.BASE_URL = 'http://47.115.37.202:8090/' // 测试接口
// } else {
//   // Vue.prototype.GLOBAL.BASE_URL = '开发测试地址'
//   Vue.prototype.GLOBAL.BASE_URL = '/api'
// }
/* eslint-disable no-new */
// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = sessionStorage.getItem('userId')
  if (!role && to.path !== '/index') {
   next({
        path: '/index',
        params: {indexShow:true}
      })
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      })
    } else {
      next()
    }
  }
})
/* eslint-disable no-new */
new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
