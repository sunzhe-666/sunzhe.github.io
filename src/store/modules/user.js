// 导入token工具函数
import { resetRouter } from '@/router'
import { getToken, removeToken, setToken } from '@/utils/auth'
// 导入登录接口
import { getInfo, login, getMoreInfo } from '../../api/user'
// 状态
const state = () => {
  return {
    token: getToken(),
    // 用户信息 设置一个空对象 避免访问不存在报错
    userInfo: {}
  }
}
// mutations
const mutations = {
  // 修改token的mutations
  setToken(state, newToken) {
    state.token = newToken
  },
  // 修改userInfo的mutations
  setUserInfo(state, newUserInfo) {
    state.userInfo = newUserInfo
  }
}
// actions
const actions = {
  async login(context, data) {
    // 调用接口的login
    const token = await login(data)
    // 保存本地
    setToken(token)
    // 保存到仓库
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    // 调用接口 getInfo
    const res = await getInfo()
    // 调用接口获取额外信息
    const moreRes = await getMoreInfo({ id: res.userId })
    // 两个值合并保存到仓库
    context.commit('setUserInfo', { ...res, ...moreRes })
  },
  logout(context) {
    // 删除token
    removeToken()
    // 删除仓库token
    context.commit('setToken', undefined)
    // 清空用户信息
    context.commit('setUserInfo', {})
    // 清空路由
    resetRouter()
    // 修改permission模块里面的router
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
