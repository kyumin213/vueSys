import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'
import * as types from './store/types'
import loginHome from './page/loginHome.vue'
// import Repository from './page/404.vue'
import Login from './page/register.vue'
import forget from './page/forgetPassword.vue'
import index from './page/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '/',
    component: loginHome
  },
  {
    path: '/register',
    name: 'register',
    component: Login
  },
  {
  	path: '/forgetPassword',
  	name: '/forgetPassword',
  	component: forget
  },
  {
  	path: '/index',
  	name: 'index',
  	component: index
  }
]

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/index',
//      query: {redirect: to.fullPath},
        params: {indexShow: true}
      })
    }
  } else {
    next()
  }
})

export default router
