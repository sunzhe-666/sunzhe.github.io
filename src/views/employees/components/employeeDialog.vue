<template>
  <el-dialog title="新增员工" :visible.sync="visible">
    <!-- 表单 -->
    <el-form :model="form" label-width="120px">
      <el-form-item label="姓名">
        <el-input
          v-model="form.username"
          style="width:50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机">
        <el-input
          v-model="form.mobile"
          style="width:50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          v-model="form.timeOfEntry"
          style="width:50%"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式">
        <el-select
          v-model="form.formOfEmployment"
          style="width:50%"
          placeholder="请选择"
        >
          <!-- value 选中的值 label 用户看到的值 -->
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :value="item.id"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号">
        <el-input
          v-model="form.workNumber"
          style="width:50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门">
        <el-input
          v-model="form.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @focus="getTree"
        />
        <el-tree
          v-show="showTree"
          class="my-tree"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </el-form-item>
      <el-form-item label="转正时间">
        <el-date-picker
          v-model="form.correctionTime"
          style="width:50%"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitForm"
          >确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
// 导入获取部门的接口
import { getDepartments } from '../../../api/departments'
// 导入添加员工发接口
import { addEmployee } from '../../../api/employees'
// 导入对应关系
import EmployeeEnum from '../../../api/constant/employees'
// 导入数组转tree的方法
import { formatData } from '../../../utils/index'
export default {
  name: 'EmployeeDialog',

  data() {
    return {
      visible: false, // 是否显示
      form: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }, // 表单的数据
      formLabelWidth: '120px', // 左侧的宽度
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [], // 树的数据
      showTree: false,
      // 聘用形式的对应关系
      hireType: EmployeeEnum.hireType
    }
  },
  methods: {
    // 提交表单
    async submitForm() {
      const res = await addEmployee(this.form)
      // 关闭弹框
      this.visible = false
      // 提示消息
      this.$message.success('新增成功！')
      // 刷新数据
      this.$parent.getData()
      // 清空表单
      this.form = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
    },
    // 获取tree的数据
    async getTree() {
      // 调用接口获取部门信息
      const res = await getDepartments()
      // 调用函数数组转tree
      this.treeData = formatData(res.depts, '')
      // 显示tree
      this.showTree = true
    },
    // 点击节点触发事件
    handleNodeClick(data) {
      // 渲染点击的数据到输入框
      this.form.departmentName = data.name
      // 隐藏tree
      this.showTree = false
    }
  }
}
</script>

<style>
.my-tree {
  width: 50%;
  border: 1px solid #c0c4cc;
  margin-top: 5px;
  border-radius: 5px;
  position: absolute;
  z-index: 999;
}
</style>
