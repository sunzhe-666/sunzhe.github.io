<template>
  <div class="employees-container">
    <!-- 头部 -->
    <el-card class="head-card">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <div class="info-box">
            <i class="el-icon-info" />
            <span>共{{ total }}条记录</span>
          </div>
        </el-col>
        <el-col class="right-col" :span="6">
          <el-button type="warning" @click="toImport">导入</el-button>
          <el-button type="danger" @click="outImport">导出</el-button>
          <el-button type="primary" @click="showDialog">新增员工</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 底部 -->
    <el-card class="bottom-card">
      <!-- table -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="150" />
        <el-table-column prop="username" sortable label="姓名" width="150" />
        <el-table-column prop="workNumber" sortable label="工号" width="150" />
        <el-table-column
          prop="formOfEmployment"
          sortable
          label="聘用形式"
          width="150"
          :formatter="formatter"
        />
        <el-table-column
          prop="departmentName"
          sortable
          label="部门"
          width="150"
        />
        <el-table-column
          prop="timeOfEntry"
          sortable
          label="入职时间"
          width="150"
        >
          <template #default="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>

        <el-table-column sortable label="账户状态" width="150" />
        <el-table-column sortable label="是否在职" width="150" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{row}">
            <el-button
              v-if="checkMenuPermission('detail')"
              type="text"
              size="small"
              @click="todetail(row.id)"
            >查看</el-button>
            <el-button
              type="text"
              size="small"
              @click="fullEmployee(row.id)"
            >转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button
              type="text"
              size="small"
              @click="showRole(row.id)"
            >角色</el-button>
            <el-button
              v-if="checkPointPermission('employees-delete')"
              type="text"
              size="small"
              @click="removeForm(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :current-page.sync="page"
        :page-size.sync="pagesize"
        layout="prev, pager, next"
        :total="total"
      />
    </el-card>
    <!-- 弹框组件 -->
    <employeeDialog ref="dialog" />
    <roleDialog ref="roleDialog" />
  </div>
</template>

<script>
// 导入枚举
import EmpliyeesNum from '../../api/constant/employees'
// 导入弹框组件
import employeeDialog from './components/employeeDialog.vue'
import roleDialog from './components/roleDialog.vue'
// 导入接口
import {
  getEmployees,
  delEmployeeById,
  fullEmployeeById
} from '../../api/employees'
// 导入混入
import mixins from '../../mixins/index'
export default {
  name: 'Employees',
  components: {
    employeeDialog,
    roleDialog
  },
  mixins: [mixins],
  data() {
    return {
      tableData: [], // table的数据
      total: 0, // 总条数
      page: 1, // 页码
      pagesize: 5 // 页容量
    }
  },
  watch: {
    page(val) {
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 角色弹框
    showRole(id) {
      this.$refs.roleDialog.getInfoAndShow(id)
    },
    // 查看
    todetail(id) {
      this.$router.push({ name: 'detail', params: { id }})
    },
    // 导出文件
    outImport() {
      import('@/vendor/Export2Excel').then(excel => {
        // 表头 任意对象的所有key
        const tHeader = Object.keys(this.tableData[0])
        // 二维数组
        const data = []
        this.tableData.forEach(item => {
          // 保存每一个对象数据的数组
          const _arr = []
          Object.keys(item).forEach(key => {
            _arr.push(item[key])
          })
          // 处理完毕
          data.push(_arr)
        })

        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 导入文件
    toImport() {
      this.$router.push({ path: '/import' })
    },
    // 删除
    removeForm(id) {
      this.$confirm('此操作将删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delEmployeeById(id)
          if (this.tableData.length === 1 && this.page > 1) {
            this.page--
          }
          // 刷新数据
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 新增
    showDialog() {
      this.$refs.dialog.visible = true
    },
    // 自定义tableData数据渲染
    formatter(row) {
      const res = EmpliyeesNum.hireType.find(v => {
        return v.id === +row.formOfEmployment
      })
      return res.value
    },
    async getData() {
      const res = await getEmployees({ page: this.page, size: this.pagesize })
      this.tableData = res.rows
      this.total = res.total
    }
  }
}
</script>

<style lang="scss">
.employees-container {
  padding: 20px;
  // 头部
  .head-card {
    .right-col {
      text-align: right;
    }
    .info-box {
      display: inline-block;
      height: 100%;
      border: 1px solid #91d5ff;
      border-radius: 4px;
      line-height: 40px;
      padding: 2px 10px;
      background-color: #e6f7ff;
      i {
        margin-right: 5px;
        color: #409eff;
        font-size: 20px;
      }
      span {
        font-size: 18px;
      }
    }
  }
  // 底部
  .bottom-card {
    margin-top: 20px;
    .el-pagination {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
