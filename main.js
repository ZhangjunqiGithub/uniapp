
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

// 将http挂载到uni这个顶级对象上作为一个自定义属性而存在
uni.$http = $http

//设置请求根路径
$http.baseUrl = 'http://116.205.165.29'

//请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})
}

//响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}

//封装弹出框的方法
uni.$showMsg = function(title = '数据请求失败！',duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif