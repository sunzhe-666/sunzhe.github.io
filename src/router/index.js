import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
// 导入整合的路由的信息
import approvals from './modules/approvals'
import attendances from './modules/attendances'
import salarys from './modules/salarys'
import social from './modules/social'
import user from './modules/user'
// 动态路由信息
export const asyncRoutes = [
  {
    path: '/departments',
    component: Layout,
    children: [
      {
        path: '',
        name: 'departments',
        component: () => import('@/views/departments/index'),
        meta: { title: '组织架构', icon: 'tree' }
      }
    ]
  },
  {
    path: '/employees',
    component: Layout,
    children: [
      {
        path: '',
        name: 'employees',
        component: () => import('@/views/employees/index'),
        meta: { title: '员工', icon: 'people' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: '',
        name: 'setting',
        component: () => import('@/views/setting/index'),
        meta: { title: '公司设置', icon: 'el-icon-setting' }
      }
    ]
  },
  salarys,
  social,
  attendances,
  approvals,
  user,
  {
    path: '/permission',
    component: Layout,
    children: [
      {
        path: '',
        name: 'permission',
        component: () => import('@/views/permission/index'),
        meta: { title: '权限管理', icon: 'el-icon-setting' }
      }
    ]
  },
  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        name: 'import',
        component: () => import('@/views/import/index')
      }
    ]
  },
  {
    path: '/detail/:id',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        name: 'detail',
        component: () => import('@/views/detail/index')
      }
    ]
  }
]
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 默认路由信息
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
