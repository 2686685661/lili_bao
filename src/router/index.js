import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 声明路由 */
let all_router = {
  routes:[
    {
      path: '/',
      component: resolve =>void(require(['../view/HelloWorld'], resolve))
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
