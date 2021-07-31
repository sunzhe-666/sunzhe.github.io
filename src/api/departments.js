// 导入请求对象
import request from '@/utils/request'

// 抽取接口 并暴露出去
// token 已经在 请求拦截器中 统一携带了
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

// 新增部门接口
// 新增组织架构接口
export function addDepartments({ code, introduce, manager, name, pid }) {
  return request({
    url: '/company/department',
    method: 'post',
    data: {
      code,
      introduce,
      manager,
      name,
      pid
    }
  })
}

// 查看部门信息
export function getDepartmentById(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

// 修改部门信息
export function editDepartment({ code, introduce, manager, name, pid, id }) {
  return request({
    url: `/company/department/${id}`,
    method: 'put',
    data: {
      code,
      introduce,
      manager,
      name,
      pid
    }
  })
}

// 删除部门信息
export function delDepartmentById(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
