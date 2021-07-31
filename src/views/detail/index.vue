<template>
  <div class="detail-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录账户设置" name="first">
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="姓名">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">更新</el-button>
              <el-button @click="clear">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <Info />
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <Job />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 导入接口
import { getMoreInfo } from '../../api/user'
import { saveUserDetailById } from '../../api/employees'
// 导入组件
import Info from './components/Info.vue'
import Job from './components/Job.vue'
export default {
  name: 'Detail',
  components: {
    Info,
    Job
  },
  data() {
    return {
      activeName: 'first',
      form: {
        username: '',
        password: ''
      },
      //   用户信息
      userInfo: {},
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度为6到9', trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
    const res = await getMoreInfo({ id: this.$route.params.id })
    // 保存用户信息
    this.userInfo = res
    // 修改表单的值
    this.form.username = res.username
    this.form.password = res.password
  },
  methods: {
    clear() {
      this.$router.back()
    },
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 校验成功
          await saveUserDetailById({ ...this.userInfo, ...this.form })
          this.$message.success('更新成功！')
          // 历史路由
          this.$router.back()
        } else {
          // 校验失败
          this.$message.error('输入格式有误')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-container {
  padding: 20px;
  .el-form {
    width: 30%;
    margin-left: 30%;
  }
}
</style>
