import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Login from '@/views/frame/login.vue'
import Main from '@/views/frame/main.vue'
import Home from '@/views/frame/home.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home
        },

        {
          path: '/platform/menu',
          name: 'platform_menu',
          component: () => import('@/views/platform/menu.vue')
        },
        {
          path: '/platform/dic',
          name: 'platform_dic',
          component: () => import('@/views/platform/dic.vue')
        },
        {
          path: '/platform/file',
          name: 'platform_file',
          component: () => import('@/views/platform/file.vue')
        },
        {
          path: '/platform/user',
          name: 'platform_user',
          component: () => import('@/views/platform/user.vue')
        },
        {
          path: '/platform/dept',
          name: 'platform_dept',
          component: () => import('@/views/platform/dept.vue')
        },
        {
          path: '/platform/permit',
          name: 'platform_permit',
          component: () => import('@/views/platform/permit.vue')
        },
        {
          path: '/platform/role',
          name: 'platform_role',
          component: () => import('@/views/platform/role.vue')
        },
        {
          path: '/platform/setting',
          name: 'platform_setting',
          component: () => import('@/views/platform/setting.vue')
        },
        {
          path: '/platform/my',
          name: 'platform_my',
          component: () => import('@/views/platform/my.vue')
        },
        /** 设备 */
        {
          path: '/device/list',
          name: 'device_list',
          component: () => import('@/views/frame/device/device.vue')
        },
        {
          path: '/data/datalist',
          name: 'data_datalist',
          component: () => import('@/views/frame/data/datalist.vue')
        },
        {
          path: '/device/version',
          name: 'device_version',
          component: () => import('@/views/frame/device/version.vue')
        },
        /** 数据 */
        {
          path: '/data/datafield',
          name: 'data_datafield',
          component: () => import('@/views/frame/data/datafield.vue')
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/frame/test/test.vue')
    }
  ]
})

var indexPath = false;
router.beforeEach((to, from, next)=>{

  //console.log(indexPath, to);
  if (indexPath) {
    next();
  } else {
    if (to.name == "index") {
      indexPath = true;
      next();
    } else {
      router.replace({name: "index"});
    }
  }
});

export default router
