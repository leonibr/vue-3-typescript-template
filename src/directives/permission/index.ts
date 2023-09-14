import { useUserStore } from '@/stores/user-store'
import { type Directive } from 'vue'

export const permission: Directive<any, any> = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const { value } = binding
    const roles = userStore.roles
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some((role) => {
        return permissionRoles.includes(role)
      })
      if (!hasPermission) {
        el.style.display = 'none'
      }
    } else {
      throw new Error("need roles! Like v-permission=\"['admin','editor']\"")
    }
  }
}
