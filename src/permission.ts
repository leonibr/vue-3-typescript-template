import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import i18n from '@/lang' // Internationalization
import settings from './settings'
import { type RouteLocationNormalized } from 'vue-router'
import { useUserStore } from './stores/user-store'
import { usePermissionStore } from './stores/permission'
import { ElMessage } from 'element-plus'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

const getPageTitle = (key: string) => {
  const hasKey = i18n.global.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.global.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

router.beforeEach(async (to: RouteLocationNormalized, _: RouteLocationNormalized, next: any) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  // Start progress bar
  NProgress.start()

  // Determine whether the user has logged in
  if (userStore.token) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // Check whether the user has obtained his permission roles
      if (userStore.roles.length === 0) {
        try {
          // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
          await userStore.GetUserInfo()
          const roles = userStore.roles
          // Generate accessible routes map based on role
          permissionStore.generateRoutes(roles)
          // Dynamically add accessible routes
          permissionStore.dynamicRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // Hack: ensure addRoutes is complete
          // Set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (err) {
          // Remove token and redirect to login page
          userStore.resetToken()
          ElMessage.error(err || 'Has Error')
          console.error({ err })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: RouteLocationNormalized) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title as string)
})
