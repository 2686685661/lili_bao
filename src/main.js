// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import store from './store'

import 'normalize.css'


Vue.use(Vuex)

//import vue-cookie
// import VueCookies from 'vue-cookies'
// Vue.use(VueCookies)

// 引入mint全部组件
import 'mint-ui/lib/style.css'
import Mint from 'mint-ui';
Vue.use(Mint);

// 引入oview
//https://github.com/MrGaoGang/oview
import oView from "oview";
Vue.use(oView);



import Mock from 'mockjs'
window.Mock = Mock
require('@/util/mock/mobile_mock')


//加载公共组件
import components from './components/'
Object.keys(components).forEach((key)=>{
  Vue.component(key,components[key]);
})

//挂靠公共过滤器
import {filters} from './helpers/filters'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

//挂靠公共方法
import {methods} from './helpers/methods'
Object.keys(methods).forEach((key)=>{
  Vue.prototype[key]=methods[key];
})


//引入axios
import service from './config/http-service'
Object.keys(service).forEach((key)=>{
  Vue.prototype[key]=service[key];
})


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
