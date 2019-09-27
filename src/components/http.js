import axios from 'axios'
import store from './store/store'
import * as types from './store/types'
import router from './router'

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://119.23.78.0'
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['Authentication-Token'] = store.state.token
// http request 拦截器
axios.interceptors.request.use(
  config => {
       if (store.state.SessionId) {
         config.headers.Authorization = `SessionId ${store.state.SessionId}`
       }
    if (config.data.errCode === 2) {
      router.push({
        path: '/register',
        querry: {redirect: router.currentRoute.fullPath} // 从哪个页面跳转
      })
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT)

          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'register' &&
          router.replace({
            path: 'register',
            query: { redirect: router.currentRoute.path }
          })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }
)

export default axios
