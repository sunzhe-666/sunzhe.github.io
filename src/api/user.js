import request from '@/utils/request'

export function login({ mobile, password }) {
  return request({
    url: '/sys/login',
    method: 'post',
    data: {
      mobile,
      password
    }
  })
}
// 抽取获取用户信息的接口
export function getInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 抽取获取用户头像等信息的接口
export function getMoreInfo({ id }) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
