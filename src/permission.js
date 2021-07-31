// 导入提示信息
import { Message } from 'element-ui'
// 导入路由
import router from './router'
// 导入仓库
import store from './store'
import { removeToken } from './utils/auth'
// 声明白名单 不需要登录
const whiteList = ['/login', '/404']
// 注册导航守卫
router.beforeEach(async(to, from, next) => {
  // 获取token
  const _token = store.getters.token
  // token判断
  if (_token) {
    // 用户信息判断
    if (store.getters.isLogin && to.path === '/login') {
      // 有token 有用户信息 直接去首页
      return next('/')
    }
    // 去的不是登录页 有用户信息
    if (store.getters.isLogin) {
      // 直接放行
      return next()
    }
    //  用户信息存在 token不存在
    try {
      // 尝试获取一下token
      await store.dispatch('user/getUserInfo')
      // 信息获取到了
      await store.dispatch('permission/filterRoutes')
      // 到这里说明token没有问题
      // if (to.path === '/login') {
      //   // 如果去的是登录页 直接跳转去首页
      //   return next('/')
      // }
      // 到这说明不是去登录页
      // 正常放行
      return next(to)
    } catch (error) {
      removeToken()
      store.commit('setToken', undefined)
      // 提示用户重新登录
      Message.error('登录异常，请重新登录！')
      // 去的是登录
      if (to.path === '/login') {
        // 直接放行
        return next()
      }
      // 不是登录 打回登录页
      return next('/login?redirect' + to.fullPath)
    }
  }
  // 判断白名单
  if (whiteList.includes(to.path)) {
    // 在白名单 直接放行
    return next()
  }
  // 不在白名单 打回登录页
  next('/login')
})
