<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- 顶部标题 -->
      <div class="title-container">
        <h3 class="title">
          <!-- @等同于从src开始 -->
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <!-- prop 规则的名字 -->
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!-- 绑定的数据替换为 mobile -->
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="mobile"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button
        class="login-btn"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>

      <div class="tips">
        <!-- <span></span> -->
        <a href="#">还没有账号? 立即注册</a>
      </div>
    </el-form>
  </div>
</template>

<script>
// 导入map辅助函数
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        // 手机号
        mobile: '13800000002',
        // 密码
        password: '123456'
      },
      loginRules: {
        // 规则是数组
        mobile: [
          // 每一套规则是一个对象
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            trigger: 'blur',
            message: '手机号格式有误'
          }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { min: 6, trigger: 'blur', message: '密码长度必须大于等于6' }
        ]
      },
      // 加载状态
      // loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 合并actions
    ...mapActions('user', ['login']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 点击登录
    handleLogin() {
      // 调用了 el-form的表单检验逻辑
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 调用action
          await this.login(this.loginForm)
          // 执行到这里 说明 登录接口调用成功
          // 获取url中的返回地址
          const _redirect = this.$route.query.redirect
          // 判断是否有值
          if (_redirect) {
            // 有值
            this.$router.push({ path: _redirect })
          } else {
            // 没有
            this.$router.push({ path: '/' })
          }
          this.$message.success('登录成功！')
        } else {
          // 校验失败的弹框提示
          this.$message.error('手机号或密码格式有误,请检查!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #d2e4ff;
// 文字颜色
$light_gray: #68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #d2e4ff;
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    color: white;
  }
  .login-btn {
    background-color: #407ffe;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  background-image: url('../../assets/common/bjt.jpg');
  background-size: cover;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 16px;
    color: #fff;
    margin-bottom: 10px;
    text-align: center;
    span {
      &:first-of-type {
        margin-right: 5px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
