const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 简化获取token
  token: state => state.user.token,
  // 简化获取userInfo
  userInfo: state => state.user.userInfo,
  // 简化登录状态标记
  isLogin: state => !!state.user.userInfo.userId
}
export default getters
