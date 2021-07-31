// 导入axios
import axios from 'axios'
// 导入提示弹框
import { Message } from 'element-ui'
// 导入仓库
import store from '../store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 添加token 本地有token就加上去 没有就不加
    if (store.getters.token) {
      // 发送请求带上token
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  function(response) {
    const { success, data, message } = response.data
    if (success === true) {
      // 请求成功
      return data
    } else {
      // 请求失败
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default service
