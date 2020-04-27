import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 声明路由 */
let all_router = {
	routes:[
		{
			path: '/',
			component: resolve =>void(require(['../view/HelloWorld'], resolve))
		},
		{
			path: '/login',
			component: resolve =>void(require(['../view/login/login'], resolve))
		},
		{
			path: '/register',
			component: resolve => void(require(['@/view/login/register'], resolve))
		},
		{
			path: '/registersms',
			component: resolve => void(require(['@/view/login/registerSms'], resolve))
		},
		{
			path: '/registerpass',
			component: resolve => void(require(['@/view/login/registerPass'], resolve))
		},
		{
			path: '/user',
			component: resolve => void(require(['@/view/user/user'], resolve))
		},
		{
			path: '/detailed',
			component: resolve => void(require(['@/view/detailed/detailed'], resolve))
		},
		{
			path: '/recordbill',
			component: resolve => void(require(['@/view/detailed/recordBill'], resolve))
		},
		{
			path: '/recordbillmsg',
			component: resolve => void(require(['@/view/detailed/recordbillMsg'], resolve))
		},
		{
			path: '/yearbill',
			component: resolve => void(require(['@/view/user/yearbill'], resolve))
		}

	]
}

all_router.routes.push(
  {
    path: '*',
    component: resolve =>void(require(['../view/404'], resolve))
  }
)


export default new Router(all_router)
