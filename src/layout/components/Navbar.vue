<template>
  <div class="navbar">
    <!-- 汉堡包 -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- 面包屑 -->
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="title-box">
      <h2>滴滴打人集团股份有限公司</h2>
      <span class="tag">PRO版</span>
    </div>
    <div class="right-menu">
      <search class="right-menu-item" />
      <lang class="right-menu-item" />
      <ScreenFull class="right-menu-item" />
      <ThemePicker class="right-menu-item" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <!-- <img src="../../assets/common/123.jpg" class="user-avatar"> -->
          <img
            v-err="userIcon"
            :src="userInfo.staffPhoto"
            class="user-avatar"
          >
          <!-- 名字 -->
          <!-- <span class="name">吴彦祖</span> -->
          <span class="name">{{ userInfo.username }}</span>
          <!-- 图标 -->
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="Logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// 导入图片
import userIcon from '@/assets/common/123.jpg'
import { mapGetters, mapActions } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// 导入全屏组件
import ScreenFull from '../../components/ScreenFull/index.vue'
// 导入动态主题插件
import ThemePicker from '../../components/ThemePicker/index.vue'
// 导入多语言组件
import lang from '../../components/lang/index.vue'
// 导入搜索组件
import search from '../../components/search/index.vue'
export default {
  components: {
    Hamburger,
    ScreenFull,
    ThemePicker,
    lang,
    search
  },
  data() {
    return {
      userIcon
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'userInfo'])
  },
  methods: {
    ...mapActions('user', ['logout']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    Logout() {
      this.$confirm('你确定要退出登录吗?', '温馨提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      })
        .then(() => {
          // 确认
          this.logout()
          // 跳转到登录页
          this.$router.push('/login')
        })
        .catch(() => {
          // 取消
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(to right, #30a0ef, #838de2, #e041a1);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .title-box {
    float: left;
    height: 100%;
    display: flex;
    align-items: center;
    h2 {
      margin: 0;
      font-size: 20px;
      color: #fff;
      font-weight: normal;
    }
    .tag {
      padding: 5px;
      margin-left: 6px;
      border: 1px solid #fff;
      color: #fff;
      border-radius: 10px;
      font-size: 12px;
    }
  }
  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 15px;
      font-size: 20px;
      vertical-align: text-bottom;
      cursor: pointer;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          margin-right: 6px;
        }
        .name {
          color: #fff;
          margin-right: 5px;
        }

        .el-icon-arrow-down {
          cursor: pointer;
          font-size: 16px;
          color: #fff;
        }
      }
    }
  }
}
</style>
