<template>
  <el-dialog title="分配角色" :visible.sync="visible">
    <el-checkbox-group v-model="roles">
      <!-- 选项 -->
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="submitRole"
        >确定</el-button>
        <el-button size="small" @click="visible = false">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 导入接口
import { getRoles } from '../../../api/setting'
import { getMoreInfo } from '../../../api/user'
import { assignRoles } from '../../../api/employees'
export default {
  props: {},
  data() {
    return {
      roleList: [], // 角色列表
      roles: [], // 选中的角色id
      userInfo: {}, // 用户信息
      visible: false // 是否显示
    }
  },
  methods: {
    //   提交数据
    async submitRole() {
      await assignRoles({
        id: this.userInfo.id,
        roleIds: this.roles
      })
      this.$message.success('角色分配成功')
      //   关闭弹框
      this.visible = false
    },
    async getInfoAndShow(userId) {
      // 获取角色列表
      const roleRes = await getRoles({ page: 1, pagesize: 999 })
      this.roleList = roleRes.rows
      this.userInfo = await getMoreInfo({ id: userId })
      //   设置选中
      this.roles = this.userInfo.roleIds
      this.visible = true
    }
  }
}
</script>
