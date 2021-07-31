<template>
  <div class="setting-container">
    <!-- 卡片 -->
    <el-card>
      <!-- tabs -->

      <el-tabs v-model="activeName">
        <!-- 角色管理 -->
        <el-tab-pane label="角色管理" name="first">
          <!-- 老写法 -->
          <!-- <span slot="label"> 角色的管理</span> -->
          <!-- 2.6之后推荐的写法 -->
          <template v-slot:label>
            <span> 角色管理</span>
          </template>
          <!-- 按钮 -->
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click="showDialog"
          >新增角色</el-button>
          <!-- table -->
          <el-table border :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" width="180" />
            <el-table-column sortable prop="name" label="角色名" width="180" />
            <el-table-column sortable prop="description" label="描述" />
            <el-table-column width="300" label="操作">
              <template v-slot:default="{ row }">
                <el-button
                  type="text"
                  @click="showpredialog(row.id)"
                >分配权限</el-button>
                <el-button
                  type="text"
                  @click="editForm(row.id)"
                >修改</el-button>
                <el-button type="text" @click="delForm(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            :current-page.sync="currentPage4"
            :page-size.sync="pgeSize"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>
        <!-- 公司信息 -->
        <el-tab-pane label="公司信息" name="second">
          <template v-slot:label>
            <span> 公司信息</span>
          </template>
          <settingForm />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹框 -->
    <settingDialog ref="dialog" />
    <!-- 权限分配弹框 -->
    <preDialog ref="preDialog" />
  </div>
</template>

<script>
// 导入组件
import settingDialog from './components/settingDialog.vue'
import settingForm from './components/settingForm.vue'
import preDialog from './components/preDialog.vue'
// 导入接口
import { getRoles, getRoleById, removeRoleById } from '../../api/setting'
export default {
  name: 'Setting',
  components: {
    settingForm,
    settingDialog,
    preDialog
  },
  data() {
    return {
      currentPage4: 1,
      // 当前的页容量
      pgeSize: 2,
      // 总条数
      total: 21,
      activeName: 'first',
      tableData: []
      // loading效果
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 分配权限
    showpredialog(id) {
      this.$refs.preDialog.show(id)
    },
    // 删除
    async delForm(id) {
      this.$confirm('此操作将删除该角色, 你再想想?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await removeRoleById(id)
          // 提示用户
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 更新数据
          this.getData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改
    async editForm(id) {
      const res = await getRoleById(id)
      this.$refs.dialog.form = res
      this.$refs.dialog.visible = true
    },
    // 新增
    showDialog() {
      this.$refs.dialog.visible = true
    },
    // 获取数据
    async getData() {
      // 开loading
      this.loading = true
      const res = await getRoles({
        page: this.currentPage4,
        pagesize: this.pgeSize
      })
      // 保存数据
      this.tableData = res.rows
      // 保存总条数
      this.total = res.total
      // 关闭loading
      this.loading = false
    },
    // 页码改变
    // val 当前页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getData()
    }
  }
}
</script>

<style lang="scss">
.setting-container {
  padding: 20px;
  .el-tabs__item {
    font-size: 20px;
    span {
      padding: 0 20px;
    }
  }
  .el-table {
    thead {
      th {
        background: #ccc;
      }
    }
  }
  .el-pagination {
    text-align: right;
  }
}
</style>
