export default {
  methods: {
    checkPointPermission(point) {
      if (!this.$store.state.user.userInfo.roles) {
        return
      }
      const _points = this.$store.state.user.userInfo.roles.points
      return _points.includes(point)
    },
    // 判断是否可以显示某个页面级别的按钮级别的按钮
    checkMenuPermission(menu) {
      if (!this.$store.state.user.userInfo.roles) {
        return
      }
      const _menus = this.$store.state.user.userInfo.roles.menus
      return _menus.includes(menu)
    }
  }
}
