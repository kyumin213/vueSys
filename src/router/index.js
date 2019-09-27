import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import index from '@/components/index'
Vue.use(Router)

export default new Router({
	// mode: 'history',
	routes: [{
			path: '/',
			redirect: '/loginHome'
		},
		{
			path: '/',
			component: resolve => require(['../components/common/home.vue'], resolve),
			meta: {
				title: '自述文件'
			},
			children: [{
					path: '/loginHome',
					name: 'loginHome',
					component: resolve => require(['../components/page/loginHome.vue'], resolve),
					meta: {
						title: '首页'
					}
				},
				{
					path: '/taskManage',
					name: 'taskManage',
					component: resolve => require(['../components/page/taskManage.vue'], resolve),
					meta: {
						title: '任务管理'
					}
				},
				{
					path: '/accountManage',
					name: 'accountManage',
					component: resolve => require(['../components/page/accountManage.vue'], resolve),
					meta: {
						title: '资金管理'
					}
				},
				{
					path: '/help',
					name: 'help',
					component: resolve => require(['../components/page/help.vue'], resolve),
					meta: {
						title: '帮助中心'
					}
				},
				{
					path: '/helpDetails',
					name: 'helpDetails',
					component: resolve => require(['../components/page/helpDetails.vue'], resolve),
					meta: {
						title: '帮助中心详情'
					}
				},
				{
					path: '/userInfo',
					name: 'userInfo',
					component: resolve => require(['../components/page/userInfo.vue'], resolve),
					meta: {
						title: '基本信息'
					}
				},
				{
					path: '/updatePwd',
					name: 'updatePwd',
					component: resolve => require(['../components/page/updatePwd.vue'], resolve),
					meta: {
						title: '修改密码'
					}
				},
				{
					path: '/securitySet',
					name: 'securitySet',
					component: resolve => require(['../components/page/securitySet.vue'], resolve),
					meta: {
						title: '安全设置'
					}
				},
				{
					path: '/CashWithdrawal',
					name: 'CashWithdrawal',
					component: resolve => require(['../components/page/CashWithdrawal.vue'], resolve),
					meta: {
						title: '提现'
					}
				},
				{
					path: '/FbaTask',
					name: 'FbaTask',
					component: resolve => require(['../components/page/FbaTask.vue'], resolve),
					meta: {
						title: 'FBA任务'
					}
				},
				{
					path: '/wishTask',
					name: 'wishTask',
					component: resolve => require(['../components/page/wishTask.vue'], resolve),
					meta: {
						title: '心愿任务'
					}
				},
				{
					path: '/QaTask',
					name: 'QaTask',
					component: resolve => require(['../components/page/QaTask.vue'], resolve),
					meta: {
						title: 'QA任务'
					}
				},
				{
					path: '/buyCarTask',
					name: 'buyCarTask',
					component: resolve => require(['../components/page/buyCarTask.vue'], resolve),
					meta: {
						title: '购物车任务'
					}
				},
				{
					path: '/likesTask',
					name: 'likesTask',
					component: resolve => require(['../components/page/likesTask.vue'], resolve),
					meta: {
						title: '点赞任务'
					}
				}
			]
		},
		{
			path: '/register',
			name: 'register',
			component: resolve => require(['../components/page/register.vue'], resolve)
		},
		{
			path: '/login',
			name: 'login',
			component: resolve => require(['../components/page/login.vue'], resolve)
		},
		{
			path: '/forgetPassword',
			name: 'forgetPassword',
			component: resolve => require(['../components/page/forgetPassword'], resolve)
		},
		{
			path: '/index',
			name: 'index',
			component: resolve => require(['../components/page/index'], resolve)
		}
	]
})