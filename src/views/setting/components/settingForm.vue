<template>
  <!-- form -->
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="企业名称">
      <el-input v-model="form.name" disabled />
    </el-form-item>
    <el-form-item label="公司地址">
      <el-input v-model="form.companyAddress" disabled />
    </el-form-item>
    <el-form-item label="公司电话">
      <el-input v-model="form.companyPhone" disabled />
    </el-form-item>
    <el-form-item label="公司邮箱">
      <el-input v-model="form.mailbox" disabled />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remarks" disabled />
    </el-form-item>
  </el-form>
</template>

<script>
// 导入接口
import { getCompanyById } from '../../../api/setting'
// 导入map辅助函数
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 表单
      form: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  //  生命周期钩子函数
  async created() {
    const res = await getCompanyById(this.userInfo.companyId)
    this.form = res
  }
}
</script>

<style lang="scss">
.el-form {
  width: 600px;
  margin-top: 30px;
}
</style>
