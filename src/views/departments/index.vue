<template>
  <div class="departments-container">
    <!-- 卡片 -->
    <el-card>
      <!-- tabs -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="组织结构" name="first">
          <!-- 顶部 -->
          <el-row type="flex" justify="space-between">
            <el-col :span="6">深圳传智播客教育科技股份有限公司</el-col>
            <el-col :span="4" class="right-col">
              <span class="leader">负责人</span>
              <el-dropdown>
                <!-- 用户默认看到的部分 -->
                <span class="el-dropdown-link">
                  操作
                  <!-- 图标 -->
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 展开的部分 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button
                      type="text"
                      @click="showDialog('')"
                    >添加子部门</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>

          <el-divider />
          <!-- 底部 -->
          <el-tree v-loading="loading" :data="departs">
            <template #default="{ data }">
              <!-- 和顶部一样的结构 -->
              <el-row type="flex" justify="space-between" class="tree-row">
                <el-col :span="6">{{ data.name }}</el-col>
                <el-col :span="4" class="right-col">
                  <span class="leader">{{ data.manager }}</span>
                  <el-dropdown>
                    <!-- 用户默认看到的部分 -->
                    <span class="el-dropdown-link">
                      操作
                      <!-- 图标 -->
                      <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <!-- 展开的部分 -->
                    <el-dropdown-menu slot="dropdown">
                      <!-- 展开项 -->
                      <el-dropdown-item>
                        <!-- 把这一行对应的id 传递到方法中 -->
                        <el-button
                          type="text"
                          @click="showDialog(data.id)"
                        >添加子部门</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          type="text"
                          @click="enterEdit(data.id)"
                        >查看部门</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          type="text"
                          @click="removeDep(data.id)"
                        >删除部门</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </template>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
      <!-- 下拉菜单 -->
      <!-- 文字按钮 -->
    </el-card>
    <!-- dialog 弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      @closed="closedHandler"
    >
      <el-form ref="depForm" :rules="rules" :model="form">
        <el-form-item
          prop="name"
          label="部门名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          prop="code"
          label="部门编码"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.code" autocomplete="off" />
        </el-form-item>
        <el-form-item
          prop="manager"
          label="部门负责人"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="form.manager"
            placeholder="请选择"
            @focus="getManagers"
          >
            <el-option
              v-for="item in managerList"
              :key="item.id"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="introduce"
          label="部门介绍"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.introduce" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelHandler">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入接口
import {
  getDepartments,
  addDepartments,
  getDepartmentById,
  editDepartment,
  delDepartmentById
} from '../../api/departments'
// 导入用户相关接口
import { getEmployeeSimple } from '../../api/employees'

export default {
  name: 'Departments',
  data() {
    return {
      // 是否loading
      loading: false,
      // 是否显示弹框
      dialogFormVisible: false,
      // 表单数据
      form: {
        code: '', // 编码
        introduce: '', // 介绍
        manager: '', // 管理员
        name: '', // 名字
        pid: '' // 父节点的id
      },
      // 左侧的宽度
      formLabelWidth: '120px',
      // tabs的高亮绑定
      activeName: 'first',
      // tree插件
      departs: [
        {
          name: '总裁办',
          manager: '曹操',
          children: [{ name: '董事会', manager: '曹丕' }]
        },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }
      ],
      // 管理员列表
      managerList: [],
      // 校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1-50个字符', trigger: 'blur' },
          {
            validator: async(rule, value, callback) => {
              console.log(this.form)
              // 获取数据
              const res = await getDepartments()
              // 如果是编辑状态 this.form.id 有值的
              // 如果 输入的value值 在服务器返回的数据中存在 (新增时,报错)
              // 如果 输入的value值 在服务器返回的数据中存在,同时和当前编辑的id不相同(编辑时,报错)
              const checkRes = res.depts.some(v => {
                if (this.form.id) {
                  // 编辑 id不相等,但是 value相等
                  if (value === v.name && this.form.id !== v.id) {
                    return true
                  }
                } else {
                  // 新增
                  if (value === v.name) {
                    // 存在
                    return true
                  }
                }
              })
              // console.log('checkRes:', checkRes)
              checkRes === true
                ? callback(new Error('部门名称不能重复'))
                : callback()
            },
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1-50个字符', trigger: 'blur' },
          {
            validator: async(rule, value, callback) => {
              // 获取数据
              const res = await getDepartments()
              const checkRes = res.depts.some(v => {
                if (this.form.id) {
                  // 编辑 id不相等,但是 value相等
                  if (value === v.code && this.form.id !== v.id) {
                    return true
                  }
                } else {
                  // 新增
                  if (value === v.code) {
                    // 存在
                    return true
                  }
                }
              })
              // console.log('checkRes:', checkRes)
              checkRes === true
                ? callback(new Error('部门编码不能重复'))
                : callback()
              // 之前没有考虑 编辑的校验
              // const filterRes = res.depts.filter(v => {
              //   if (value === v.code) {
              //     return true
              //   } else {
              //     return false
              //   }
              // })
              // if (filterRes.length === 0) {
              //   // 不重复
              //   callback()
              // } else {
              //   // 有重复的
              //   callback(new Error('有重复的编码,请重新输入!'))
              // }
              // 判断
            },
            trigger: 'blur'
          }
        ],
        manager: [
          // 选择器 用change会合适一些
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '长度为1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // 计算属性
  computed: {
    title() {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  // created生命周期钩子
  created() {
    this.getData()
  },
  // 方法
  methods: {
    // 删除逻辑
    removeDep(id) {
      // console.log('id:', id)
      this.$confirm('此操作将删除该部门, 你再想想?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const delRes = await delDepartmentById(id)
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
    // 弹框关闭的回调函数
    closedHandler() {
      console.log('关闭啦!')
      // 上一次是编辑 清空
      if (this.form.id) {
        this.form = {
          code: '', // 编码
          introduce: '', // 介绍
          manager: '', // 管理员
          name: '', // 名字
          pid: '' // 父节点的id
        }
      } else {
        // 上一次是新增 不清空
      }
      // 清空表单的校验结果
      // console.log(this.$refs.depForm)
      this.$nextTick(() => {
        this.$refs.depForm.clearValidate()
      })
    },
    // 进入编辑状态
    async enterEdit(id) {
      // 获取数据
      const res = await getDepartmentById(id)
      // 设置数据
      this.form = res
      // 弹框
      this.dialogFormVisible = true
    },
    // 抽取递归处理数据的逻辑
    // 递归 必须有个函数 基于给定的 pid 返回满足条件的数组
    formatData(list, pid) {
      return list.filter(v => {
        if (v.pid === pid) {
          // 筛选子节点的条件是 循环数组的 每一项的 pid 和 当前这一项的 id 相等
          // this 组件对象
          v.children = this.formatData(list, v.id)
          return true // 要这个元素
        } else {
          return false // 不要这个元素
        }
      })
    },
    // 点击取消
    cancelHandler() {
      // 关闭弹框
      this.dialogFormVisible = false
      // 清空表单
      this.$refs.depForm.resetFields()
      // 手动情况
      this.form = {
        code: '', // 编码
        introduce: '', // 介绍
        manager: '', // 管理员
        name: '', // 名字
        pid: '' // 父节点的id
      }
    },
    // 获取组织架构数据
    async getData() {
      // 开启loading
      this.loading = true
      const res = await getDepartments()
      // 第一次筛选 pid 是 ''
      const treeRes = this.formatData(res.depts, '')
      // 直接赋值即可
      this.departs = treeRes
      // 关闭loading
      setTimeout(() => {
        this.loading = false
      }, 300)

      // 下面是 冗余的写法
      // console.log('treeRes:', treeRes)

      // // 筛选出 pid 为'' 顶级节点
      // const rootTree = res.depts.filter(v => {
      //   if (v.pid === '') {
      //     return true
      //   } else {
      //     return false
      //   }
      // })
      // // 筛选出 children 子节点
      // rootTree.forEach(rV => {
      //   const children = res.depts.filter(v => {
      //     if (v.pid === rV.id) {
      //       return true
      //     } else {
      //       return false
      //     }
      //   })
      //   rV.children = children
      // })

      // // 替换数据
      // this.departs = rootTree
    },
    // 显示新增框
    showDialog(pid) {
      console.log('pid:', pid)
      // 设置给表单 pid 直接存到表单中 ,不让用户输入
      this.form.pid = pid
      // 弹框
      this.dialogFormVisible = true
    },
    // 提交表单
    submitForm() {
      this.$refs.depForm.validate(async valid => {
        if (valid) {
          // 判断新增 还是 编辑
          if (this.form.id) {
            // 编辑 form包含了id
            const editRes = await editDepartment(this.form)
            this.$message.success('编辑成功')
          } else {
            // 新增
            // 校验通过 提交数据
            const addRes = await addDepartments(this.form)
            this.$message.success('新增成功')
          }
          // 关闭
          this.dialogFormVisible = false
          // 刷新数据
          this.getData()
          // 清空表单 也许请的掉
          this.$refs.depForm.resetFields()
          // 一定清的掉
          this.form = {
            code: '', // 编码
            introduce: '', // 介绍
            manager: '', // 管理员
            name: '', // 名字
            pid: '' // 父节点的id
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取管理员信息
    async getManagers() {
      const res = await getEmployeeSimple()
      //  console.log('res:',res)
      this.managerList = res
    }
  }
}
</script>

<style lang="scss">
.departments-container {
  padding: 20px;
  // background-color: #f0f2f5;
  font-size: 14px;
  .leader {
    margin-right: 10px;
  }
  .el-tabs__content {
    padding: 20px 90px;
  }
  .el-divider {
    margin-top: 10px;
  }
  .tree-row {
    width: 100%;
  }
  .right-col {
    text-align: right;
  }
}
</style>
