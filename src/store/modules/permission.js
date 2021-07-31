import router, { constantRoutes, asyncRoutes } from '../../router/index'
// 状态、数据
const state = () => {
  return {
    allRoutes: constantRoutes
  }
}
// mutations 同步修改
const mutations = {
  setRoutes(state, newRoutes) {
    state.allRoutes = newRoutes
  }
}
// actions 异步修改
const actions = {
  filterRoutes(context) {
    // 获取用户可以访问的menus
    const _menus = context.rootState.user.userInfo.roles.menus
    // 拿去和动态路由进行比较
    const _newRoutes = asyncRoutes.filter(v => {
      // 筛选children 并副职
      // 这里之前修赋值改过引用数据
      const _length = v.children.filter(child => {
        // 是否存在 返回true false
        return _menus.includes(child.name)
      }).length
      // 筛选完毕 判断children的长度 返回true false
      if (_length > 0) {
        return true
      } else {
        return false
      }
    })
    // addRoutes 动态添加路由
    router.addRoutes(_newRoutes)
    // 合并到vue默认数组中
    // 静态路由和动态路由合并并赋值
    context.commit('setRoutes', [
      ...constantRoutes,
      ..._newRoutes,
      // 404 page must be placed at the end !!!
      { path: '*', redirect: '/404', hidden: true }
    ])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
