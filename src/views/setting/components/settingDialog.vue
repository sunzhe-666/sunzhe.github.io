<template>
  <el-dialog :title="title" :visible.sync="visible" @closed="offForm">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="name" label="角色名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item
        prop="description"
        label="描述"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRole, editRoleById } from '../../../api/setting'
export default {
  data() {
    return {
      // 弹框显示
      visible: false,
      //   左侧的距离
      formLabelWidth: '120px',
      form: {
        name: '',
        description: ''
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: '角色名不能为空', trigger: 'blur' }],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.form.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    //   关闭弹框
    offForm() {
      this.form = {
        name: '',
        description: ''
      }
    },
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          //   校验成功
          // 判断新增还是编辑 根据id
          if (this.form.id) {
            // 编辑
            editRoleById(this.form)
            this.$message.success('编辑成功！')
          } else {
            // 新增
            addRole(this.form)
            this.$message.success('新增成功！')
          }
          // 关闭弹框
          this.visible = false
          //   清空数据
          this.form = {
            name: '',
            description: ''
          }
          //   刷新数据
          this.$parent.getData()
        } else {
          // 校验失败
          this.$message.error('输入格式有误，请检查并重新提交')
          return false
        }
      })
    }
  }
}
</script>

<style></style>
