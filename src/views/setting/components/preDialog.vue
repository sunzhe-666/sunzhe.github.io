<template>
  <el-dialog title="分配权限" :visible.sync="visible" @close="btnPermCancel">
    <!-- 权限是一颗树 -->
    <!-- 将数据绑定到组件上 -->
    <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
    <!-- id作为唯一标识 -->
    <el-tree
      ref="permTree"
      :data="permData"
      :props="defaultProps"
      :show-checkbox="true"
      :check-strictly="true"
      :default-expand-all="true"
      :default-checked-keys="selectCheck"
      node-key="id"
    />
    <!-- 确定 取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="btnPermOK"
        >确定</el-button>
        <el-button size="small" @click="btnPermCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 导入接口
import { getPermissionList } from '../../../api/permission'
import { getRoleById, assignPerm } from '../../../api/setting'
// 导入工具函数
import { formatData } from '../../../utils'
export default {
  data() {
    return {
      visible: false, // 是否显示
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  methods: {
    //  定义显示的方法
    async show(id) {
      const tree = formatData(await getPermissionList(), '0')
      //  赋值
      this.permData = tree
      //   根据id 获取角色信息
      const res = await getRoleById(id)
      //   保存id
      this.roleId = id
      //   赋值默认选中的数据
      this.selectCheck = res.permIds
      //   开启弹窗
      this.visible = tree
    },
    async btnPermOK() {
      await assignPerm({
        id: this.roleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('权限分配成功')
      //  关闭弹框
      this.visible = false
    },
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.visible = false // 关闭弹框
    }
  }
}
</script>

<style></style>
