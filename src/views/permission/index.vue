<template>
  <div class="permission-container">
    <el-card>
      <!-- 顶部布局 -->
      <el-row type="flex" justify="space-between">
        <el-col :span="4" />
        <el-col class="right-col" :span="6">
          <el-button
            type="primary"
            @click="addPermission('0', 1)"
          >添加权限</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="bottom-card">
      <!-- 底部 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" prop="name" label="名称" />
        <el-table-column align="center" prop="code" label="标识" />
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" label="操作">
          <!-- 作用域插槽 结构获取 row -->
          <template slot-scope="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(row.id, 2)"
            >添加</el-button>
            <el-button
              type="text"
              @click="editPermission(row.id)"
            >编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">
              删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog
      :title="`${title}权限点`"
      :visible="showDialog"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="perForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 导入接口
import {
  getPermissionList,
  addPermission,
  delPermission,
  getPermissionDetail,
  updatePermission
} from '../../api/permission'
import { formatData } from '../../utils/index'
export default {
  name: 'Permission',

  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型
        pid: '', // 父节点
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData() {
      const res = await getPermissionList()
      this.list = formatData(res, '0')
    },
    // 删除操作
    async delPermission(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delPermission(id)
          this.$message.success('权限删除成功')
          this.getData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    btnOK() {
      this.$refs.perForm.validate(async valid => {
        if (valid) {
          if (this.formData.id) {
            // 编辑
            await updatePermission(this.formData)
          } else {
            // 新增
            await addPermission(this.formData)
          }
          this.$message.success(
            this.formData.id ? '权限编辑成功' : '权限添加成功'
          )
          this.getData()
          // 关闭弹框
          this.showDialog = false
        } else {
          this.$message.error('数据格式有误请检查')
          return false
        }
      })
    },
    // 点击取消
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    // 参数1 pid为0 顶级的权限(页面级别)  pid有值,页面中的操作(增删改查)
    // 参数2: type为1页面级别 type为2 操作级别
    // 只有 type为1的才可以添加 子权限
    addPermission(pid, type) {
      // 保存父节点id
      this.formData.pid = pid
      // 保存权限类型
      this.formData.type = type
      this.showDialog = true
    },
    async editPermission(id) {
      const res = await getPermissionDetail(id)
      this.formData = res
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss">
.permission-container {
  padding: 20px;
  .bottom-card {
    margin-top: 20px;
  }
  .right-col {
    text-align: right;
  }
}
</style>
