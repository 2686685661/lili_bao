// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


// 引入全部组件
import 'mint-ui/lib/style.css'
import Mint from 'mint-ui';
Vue.use(Mint);


//引入&设置axios
import axios from 'axios'
window.axios = axios
window.axios.defaults.withCredentials = true
window.axios.defaults.xsrfCookieName = null
window.axios.defaults.xsrfHeaderName = null
axios.defaults.baseURL = 'http://localhost:8080';

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
import {methods} from './helpers/methods.js'
Object.keys(methods).forEach((key)=>{
  Vue.prototype[key]=methods[key];
})


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
