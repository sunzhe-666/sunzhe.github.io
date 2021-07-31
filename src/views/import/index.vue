<template>
  <div class="import-contenner">
    <el-card>
      <h2>员工导入</h2>
      <el-alert
        title="每次导入最多1000名员工，姓名、手机、入职时间、聘用形式为必填项"
        type="warning"
        show-icon
      />
      <UploadExcel :on-success="successHandler" />
    </el-card>
  </div>
</template>

<script>
// 导入接口
import { importEmployees } from '../../api/employees'
// 导入上传组件
import UploadExcel from '../../components/UploadExcel'
// 导入工具函数
import { formatExcelDate } from '../../utils/index'
export default {
  name: 'Import',
  components: {
    UploadExcel
  },
  methods: {
    async successHandler(data) {
      // 基于现有数组 生成一个新的数组
      const newArr = data.results.map(v => {
        // return要返回的每一项
        v.correctionTime = formatExcelDate(v.correctionTime, '/')
        v.timeOfEntry = formatExcelDate(v.timeOfEntry, '/')
        // 修改源对象
        return {
          ...v
        }
      })
      // 本地导入成功
      await importEmployees(newArr)
      this.$message.success('批量导入成功！')
      this.$router.push({ path: '/employees' })
    }
  }
}
</script>

<style lang="scss">
.import-contenner {
  padding: 20px;
  .el-card {
    text-align: center;
    .el-alert {
      margin-bottom: 20px;
    }
  }
}
</style>
